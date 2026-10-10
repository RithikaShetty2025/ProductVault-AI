-- ProductVault AI — warranty duration text + warranty clauses
-- Adds a free-text warranty duration field to products, and a new
-- document_clauses table to hold structured warranty clauses (coverage,
-- exclusions, claim procedures, etc.) extracted from OCR text by Gemini.
-- Run this in the Supabase SQL Editor after 001_initial_document_flow.sql.

-- =========================================================
-- PRODUCTS: warranty duration as written on the document
-- (e.g. "1 Year", "Lifetime") in addition to the numeric
-- warranty_period_months used for date math.
-- =========================================================
alter table public.products
  add column if not exists warranty_duration_text text;

-- =========================================================
-- DOCUMENT CLAUSES
-- One row per extracted warranty clause (coverage, exclusion,
-- claim procedure, etc.), linked back to the source document,
-- product, and user so RLS can scope access.
-- =========================================================
create table if not exists public.document_clauses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,

  category text not null check (category in (
    'coverage', 'inclusions', 'exclusions', 'claim_procedure',
    'claim_prerequisites', 'repair', 'replacement', 'transportation',
    'limitations', 'conditions', 'service_contacts', 'registration',
    'statutory_guarantee', 'other'
  )),
  title text,
  content text not null,
  confidence numeric check (confidence >= 0 and confidence <= 1),
  evidence text,

  created_at timestamptz not null default now(),

  -- Prevent the exact same clause being stored twice for the same document.
  unique (document_id, category, content)
);

create index if not exists document_clauses_product_id_idx on public.document_clauses(product_id);
create index if not exists document_clauses_document_id_idx on public.document_clauses(document_id);
create index if not exists document_clauses_category_idx on public.document_clauses(category);

alter table public.document_clauses enable row level security;

create policy "Users can view own document clauses"
  on public.document_clauses for select
  using (auth.uid() = user_id);

create policy "Users can insert own document clauses"
  on public.document_clauses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own document clauses"
  on public.document_clauses for update
  using (auth.uid() = user_id);

create policy "Users can delete own document clauses"
  on public.document_clauses for delete
  using (auth.uid() = user_id);
