-- ProductVault AI — Phase 1 real-data flow
-- Tables: products, documents, extracted_fields
-- Run this in the Supabase SQL Editor.

-- =========================================================
-- PRODUCTS
-- =========================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('durable', 'beauty')),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),

  name text,
  brand text,
  category text,
  image text,
  notes text,

  -- Durable-only fields
  model text,
  serial_number text,
  purchase_date date,
  purchase_price numeric,
  seller text,
  warranty_period_months integer,
  warranty_start_date date,
  warranty_expiry_date date,
  warranty_coverage_summary text,

  -- Beauty-only fields
  batch_number text,
  manufacturing_date date,
  expiry_date date,
  pao_months text,
  opened_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_user_id_idx on public.products(user_id);

alter table public.products enable row level security;

create policy "Users can view own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update own products"
  on public.products for update
  using (auth.uid() = user_id);

create policy "Users can delete own products"
  on public.products for delete
  using (auth.uid() = user_id);

-- =========================================================
-- DOCUMENTS
-- =========================================================
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,

  document_type text not null check (document_type in (
    'invoice', 'warranty_card', 'product_label', 'service_receipt',
    'claim_evidence', 'claim_rejection', 'batch_code_sticker',
    'packaging_scan', 'other'
  )),

  file_name text not null,
  storage_path text not null,
  mime_type text not null,
  file_size integer not null,
  page_count integer,

  ocr_text text,
  ocr_confidence numeric,
  extraction_method text check (extraction_method in ('pdf_text_layer', 'ocr', 'mixed')),
  processing_status text not null default 'pending' check (processing_status in (
    'pending', 'uploading', 'reading', 'ocr_complete', 'extracting', 'extracted', 'error'
  )),
  processing_error text,

  created_at timestamptz not null default now()
);

create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_product_id_idx on public.documents(product_id);

alter table public.documents enable row level security;

create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- =========================================================
-- EXTRACTED FIELDS
-- =========================================================
create table if not exists public.extracted_fields (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,

  field_key text not null,
  field_label text not null,
  value text,
  original_extracted_value text,
  confidence numeric check (confidence >= 0 and confidence <= 1),
  status text not null default 'pending' check (status in ('pending', 'verified', 'corrected', 'needs_review')),
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists extracted_fields_product_id_idx on public.extracted_fields(product_id);
create index if not exists extracted_fields_document_id_idx on public.extracted_fields(document_id);

alter table public.extracted_fields enable row level security;

create policy "Users can view own extracted fields"
  on public.extracted_fields for select
  using (auth.uid() = user_id);

create policy "Users can insert own extracted fields"
  on public.extracted_fields for insert
  with check (auth.uid() = user_id);

create policy "Users can update own extracted fields"
  on public.extracted_fields for update
  using (auth.uid() = user_id);

create policy "Users can delete own extracted fields"
  on public.extracted_fields for delete
  using (auth.uid() = user_id);

-- =========================================================
-- updated_at maintenance
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists set_extracted_fields_updated_at on public.extracted_fields;
create trigger set_extracted_fields_updated_at
  before update on public.extracted_fields
  for each row execute function public.set_updated_at();

-- =========================================================
-- STORAGE: private bucket for uploaded documents
-- Path convention: {user_id}/{product_id}/{timestamp}-{sanitized_file_name}
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-documents',
  'product-documents',
  false,
  10485760, -- 10 MB
  array['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can read own documents in storage"
  on storage.objects for select
  using (
    bucket_id = 'product-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload own documents to storage"
  on storage.objects for insert
  with check (
    bucket_id = 'product-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own documents from storage"
  on storage.objects for delete
  using (
    bucket_id = 'product-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
