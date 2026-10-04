import { 
  Product, 
  DurableProduct, 
  BeautyProduct, 
  AttentionItem, 
  ActivityItem,
  ServiceCenter,
  ProductClaim,
  AppNotification,
  PriceComparisonItem
} from '../types';

export const SERVICE_CENTERS: ServiceCenter[] = [
  {
    id: 'sc-1',
    name: 'Apple Regent Street Genius Bar',
    brand: 'Apple',
    address: '235 Regent St., London W1B 2EL',
    distance: '1.4 miles',
    phone: '+44 20 7153 9000',
    rating: 4.8,
    type: 'Flagship Hub',
    turnaroundTime: 'Same-day diagnostics',
    openStatus: 'Open until 8:00 PM',
    supportedServices: ['Screen & Glass Replacement', 'Battery Diagnostics', 'Logic Board Repair', 'AppleCare Attestation']
  },
  {
    id: 'sc-2',
    name: 'Samsung Experience Store & Support',
    brand: 'Samsung',
    address: 'Oxford Street 340, London W1C 1JN',
    distance: '1.9 miles',
    phone: '+44 20 7499 1234',
    rating: 4.6,
    type: 'Flagship Hub',
    turnaroundTime: '24-48 hours',
    openStatus: 'Open until 7:30 PM',
    supportedServices: ['AMOLED Screen Repair', 'S-Pen Digitizer Service', 'Water Ingress Diagnostic', 'Samsung Care+ Exchange']
  },
  {
    id: 'sc-3',
    name: 'Sony Authorized Service Center - Midtown Tech',
    brand: 'Sony',
    address: '78 High Holborn, London WC1V 6DN',
    distance: '2.5 miles',
    phone: '+44 20 7242 8899',
    rating: 4.5,
    type: 'Authorized Partner',
    turnaroundTime: '3-5 business days',
    openStatus: 'Open until 6:00 PM',
    supportedServices: ['Acoustic Driver Calibration', 'ANC Microphone Repair', 'Headband Replacement', 'Official Warranty Replacement']
  },
  {
    id: 'sc-4',
    name: 'LG Electronics Certified Repair Center',
    brand: 'LG Electronics',
    address: '12 Premier Park, Park Royal, London NW10 7NZ',
    distance: '5.2 miles',
    phone: '+44 344 847 5454',
    rating: 4.7,
    type: 'Direct Service Center',
    turnaroundTime: 'In-home technician dispatch',
    openStatus: 'Open until 5:00 PM',
    supportedServices: ['OLED Panel Burn-in Repair', 'Power Supply Board Swap', 'T-Con Logic Board Service', 'VIP In-home Dispatch']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. MacBook Air M3
  {
    id: 'prod-dur-01',
    name: 'MacBook Air M3 (15-inch)',
    brand: 'Apple',
    category: 'Laptops',
    type: 'durable',
    model: 'A3114 / Midnight',
    serialNumber: 'C02GK993MD6R',
    purchaseDate: '2025-10-18',
    purchasePrice: '$1,499.00',
    seller: 'Apple Store Regent St',
    warrantyStatus: 'expiring_soon',
    warrantyStartDate: '2025-10-18',
    warrantyExpiryDate: '2026-10-18',
    warrantyPeriodMonths: 12,
    warrantyCoverageSummary: '1-Year Limited Hardware Guarantee covering logic board, display panel, unified memory, and power delivery.',
    warrantyTerms: {
      coverage: [
        'Hardware component defects in materials and manufacturing workmanship',
        'Built-in battery capacity retention below 80% of original specification',
        'Internal power supply and MagSafe 3 charging port assembly',
        'Liquid Retina display backlight and panel controller malfunctions'
      ],
      exclusions: [
        'Accidental drops, cosmetic scuffs, scratches, or dented aluminum chassis',
        'Liquid ingress and internal corrosion without AppleCare+ coverage',
        'Unauthorized third-party disassembly or third-party logic board micro-soldering'
      ],
      conditions: [
        'Original electronic receipt or Apple ID purchase ledger verification required',
        'Device must be unregistered from Find My prior to technician inspection',
        'Claim must be initiated prior to October 18, 2026 expiration timestamp'
      ]
    },
    documentsCount: 3,
    verifiedFieldsCount: 8,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 95,
    status: 'attention',
    createdAt: '2025-10-18T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    notes: 'Covered under standard Apple Limited Warranty. Standard warranty expires in 18 days.',
    documents: [
      {
        id: 'doc-mba-1',
        productId: 'prod-dur-01',
        name: 'Apple_Store_Invoice_C02GK993MD6R.pdf',
        type: 'Invoice',
        uploadDate: '2025-10-18',
        size: '1.2 MB',
        source: 'Apple Store Online POS',
        status: 'verified',
        previewSnippet: 'Tax Invoice #INV-99201 | Apple Retail UK Ltd | SN: C02GK993MD6R | Total: £1,299.00',
        pageCount: 2
      },
      {
        id: 'doc-mba-2',
        productId: 'prod-dur-01',
        name: 'Apple_1Year_Limited_Warranty_Terms.pdf',
        type: 'Warranty Document',
        uploadDate: '2025-10-18',
        size: '840 KB',
        source: 'Apple Support Portal',
        status: 'verified',
        previewSnippet: 'Standard Hardware Warranty: 12 Months from purchase date October 18, 2025.',
        pageCount: 4
      },
      {
        id: 'doc-mba-3',
        productId: 'prod-dur-01',
        name: 'Chassis_Laser_Serial_Sticker.jpg',
        type: 'Product Label',
        uploadDate: '2025-10-19',
        size: '2.1 MB',
        source: 'High-resolution photo scan',
        status: 'verified',
        previewSnippet: 'Model A3114 EMC 8411 Serial C02GK993MD6R Rated 20V === 3.5A',
        pageCount: 1
      }
    ],
    extractedFields: [
      { id: 'f-1', key: 'productName', label: 'Product Name', value: 'MacBook Air M3 (15-inch)', sourceDoc: 'Apple_Store_Invoice_C02GK993MD6R.pdf', confidence: 'high', status: 'verified' },
      { id: 'f-2', key: 'brand', label: 'Brand', value: 'Apple', sourceDoc: 'Apple_Store_Invoice_C02GK993MD6R.pdf', confidence: 'high', status: 'verified' },
      { id: 'f-3', key: 'model', label: 'Model', value: 'A3114 / Midnight', sourceDoc: 'Chassis_Laser_Serial_Sticker.jpg', confidence: 'high', status: 'verified' },
      { id: 'f-4', key: 'serialNumber', label: 'Serial Number', value: 'C02GK993MD6R', sourceDoc: 'Chassis_Laser_Serial_Sticker.jpg', confidence: 'high', status: 'verified' },
      { id: 'f-5', key: 'purchaseDate', label: 'Purchase Date', value: '2025-10-18', sourceDoc: 'Apple_Store_Invoice_C02GK993MD6R.pdf', confidence: 'high', status: 'verified' },
      { id: 'f-6', key: 'purchasePrice', label: 'Purchase Price', value: '$1,499.00', sourceDoc: 'Apple_Store_Invoice_C02GK993MD6R.pdf', confidence: 'high', status: 'verified' },
      { id: 'f-7', key: 'seller', label: 'Seller', value: 'Apple Store Regent St', sourceDoc: 'Apple_Store_Invoice_C02GK993MD6R.pdf', confidence: 'high', status: 'verified' },
      { id: 'f-8', key: 'warrantyExpiryDate', label: 'Warranty Expiry', value: '2026-10-18', sourceDoc: 'Apple_1Year_Limited_Warranty_Terms.pdf', confidence: 'high', status: 'verified' }
    ],
    conflicts: [],
    issues: [],
    plannerItems: [
      { id: 'pl-1', title: 'Schedule complimentary Genius Bar hardware health check', deadline: '2026-10-12', type: 'urgent', completed: false, actionTab: 'Warranty', actionLabel: 'View Coverage' },
      { id: 'pl-2', title: 'Evaluate AppleCare+ extended annual policy', deadline: '2026-10-15', type: 'recommended', completed: false, actionTab: 'Renewal', actionLabel: 'Review Plans' },
      { id: 'pl-3', title: 'Export verified purchase receipt for personal records', deadline: '2026-10-18', type: 'optional', completed: true, actionTab: 'Documents', actionLabel: 'View Documents' }
    ],
    renewalPlans: [
      { id: 'rp-1', provider: 'Apple Inc.', planName: 'AppleCare+ Annual Extension', coverage: 'Full accidental damage protection ($29 screen fee, $99 other), unlimited incidents & 24/7 priority support', price: '$79.00 / year', startDate: '2026-10-19', endDate: '2027-10-19', status: 'available' },
      { id: 'rp-2', provider: 'SquareTrade / Allstate', planName: 'Complete Laptop Protection', coverage: 'Covers hardware failure, accidental drops and power surge damage with $50 deductible', price: '$89.99 / 2 years', startDate: '2026-10-19', endDate: '2028-10-19', status: 'available' }
    ],
    timeline: [
      { id: 'tl-1', date: 'Oct 18, 2025', title: 'Product Added to Vault', description: 'MacBook Air M3 registered via Apple Store digital invoice receipt.', category: 'product' },
      { id: 'tl-2', date: 'Oct 18, 2025', title: 'Document Uploaded', description: 'Official tax invoice and warranty agreement indexed into vault.', category: 'document' },
      { id: 'tl-3', date: 'Oct 19, 2025', title: 'Information Extracted & Verified', description: 'Serial number C02GK993MD6R and purchase date confirmed with 100% confidence.', category: 'verification' },
      { id: 'tl-4', date: 'Oct 19, 2025', title: 'Warranty Terms Synchronized', description: '12-Month standard hardware guarantee verified expiring October 18, 2026.', category: 'warranty' }
    ]
  },

  // 2. Samsung Galaxy S24 Ultra
  {
    id: 'prod-dur-02',
    name: 'Galaxy S24 Ultra (512GB)',
    brand: 'Samsung',
    category: 'Smartphones',
    type: 'durable',
    model: 'SM-S928B / Titanium Gray',
    serialNumber: 'RF8W301XZ9K',
    purchaseDate: '2026-02-14',
    purchasePrice: '$1,299.99',
    seller: 'Best Buy Midtown',
    warrantyStatus: 'active',
    warrantyStartDate: '2026-02-14',
    warrantyExpiryDate: '2028-02-14',
    warrantyPeriodMonths: 24,
    warrantyCoverageSummary: '24-Month EU/UK Manufacturer Warranty covering internal motherboard, AMOLED display defects, and primary camera sensor.',
    warrantyTerms: {
      coverage: [
        'Internal processor, S-Pen digitizer coil, and internal flash memory hardware',
        'Quad telephoto camera optical image stabilization failure',
        'Dynamic AMOLED 2X panel lines or dead pixel clusters'
      ],
      exclusions: [
        'Shattered Gorilla Armor front/rear glass from drop impact',
        'Deep water submersion beyond IP68 rating parameters'
      ],
      conditions: [
        'Proof of purchase date must correlate with carrier activation'
      ]
    },
    documentsCount: 2,
    verifiedFieldsCount: 6,
    totalFieldsCount: 8,
    hasConflict: true,
    conflictDescription: 'Purchase date on store invoice (2026-02-14) conflicts with warranty registration card (2026-02-10).',
    claimReadinessScore: 72,
    status: 'attention',
    createdAt: '2026-02-15T14:20:00Z',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    notes: 'Manufacturer warranty is 24 months. Discrepancy detected between invoice date and warranty registration slip.',
    documents: [
      {
        id: 'doc-s24-1',
        productId: 'prod-dur-02',
        name: 'BestBuy_Midtown_Register_Invoice.pdf',
        type: 'Invoice',
        uploadDate: '2026-02-15',
        size: '1.4 MB',
        source: 'Best Buy Midtown Register #4',
        status: 'conflict',
        previewSnippet: 'Best Buy Store #1402 | Date: 2026-02-14 | Item: SM-S928B 512GB Gray | IMEI: 359182019281728',
        pageCount: 1
      },
      {
        id: 'doc-s24-2',
        productId: 'prod-dur-02',
        name: 'Samsung_Care_Registration_Slip.pdf',
        type: 'Warranty Document',
        uploadDate: '2026-02-15',
        size: '620 KB',
        source: 'In-box Warranty Card',
        status: 'conflict',
        previewSnippet: 'Samsung Electronics Guarantee Certificate | Retail Date Stamp: 2026-02-10 | Term: 24M',
        pageCount: 2
      }
    ],
    extractedFields: [
      { id: 'sf-1', key: 'productName', label: 'Product Name', value: 'Galaxy S24 Ultra (512GB)', sourceDoc: 'BestBuy_Midtown_Register_Invoice.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-2', key: 'brand', label: 'Brand', value: 'Samsung', sourceDoc: 'BestBuy_Midtown_Register_Invoice.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-3', key: 'model', label: 'Model', value: 'SM-S928B / Titanium Gray', sourceDoc: 'BestBuy_Midtown_Register_Invoice.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-4', key: 'serialNumber', label: 'Serial Number', value: 'RF8W301XZ9K', sourceDoc: 'BestBuy_Midtown_Register_Invoice.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-5', key: 'purchaseDate', label: 'Purchase Date', value: '2026-02-14', sourceDoc: 'BestBuy_Midtown_Register_Invoice.pdf', confidence: 'medium', status: 'needs_review', notes: 'Conflict flagged with warranty slip date (2026-02-10)' },
      { id: 'sf-6', key: 'purchasePrice', label: 'Purchase Price', value: '$1,299.99', sourceDoc: 'BestBuy_Midtown_Register_Invoice.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-7', key: 'seller', label: 'Seller', value: 'Best Buy Midtown', sourceDoc: 'BestBuy_Midtown_Register_Invoice.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-8', key: 'warrantyExpiryDate', label: 'Warranty Expiry', value: '2028-02-14', sourceDoc: 'Samsung_Care_Registration_Slip.pdf', confidence: 'medium', status: 'needs_review' }
    ],
    conflicts: [
      {
        id: 'conf-s24-1',
        fieldKey: 'purchaseDate',
        fieldLabel: 'Purchase Date',
        sourceA: { docName: 'BestBuy_Midtown_Register_Invoice.pdf', value: '2026-02-14' },
        sourceB: { docName: 'Samsung_Care_Registration_Slip.pdf', value: '2026-02-10' },
        status: 'detected'
      }
    ],
    issues: [],
    plannerItems: [
      { id: 'pl-s24-1', title: 'Resolve purchase date conflict between invoice and warranty registration', deadline: '2026-10-20', type: 'urgent', completed: false, actionTab: 'Conflicts', actionLabel: 'Resolve Conflict' },
      { id: 'pl-s24-2', title: 'Verify Knox security hardware attestation', deadline: '2026-11-15', type: 'recommended', completed: false, actionTab: 'Verify', actionLabel: 'Audit Fields' }
    ],
    renewalPlans: [
      { id: 'rp-s24-1', provider: 'Samsung Care+', planName: 'Samsung Care+ 2-Year Theft & Damage', coverage: 'Zero-deductible screen replacement and rapid replacement delivery', price: '$12.99 / month', startDate: '2026-02-14', endDate: '2028-02-14', status: 'available' }
    ],
    timeline: [
      { id: 'tl-s24-1', date: 'Feb 15, 2026', title: 'Product Added to Vault', description: 'Samsung Galaxy S24 Ultra registered via Best Buy invoice scan.', category: 'product' },
      { id: 'tl-s24-2', date: 'Feb 15, 2026', title: 'Conflict Detected', description: 'AI cross-validation discovered date discrepancy (Feb 14 invoice vs Feb 10 card).', category: 'conflict' }
    ]
  },

  // 3. Sony WH-1000XM5
  {
    id: 'prod-dur-03',
    name: 'WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'Audio',
    type: 'durable',
    model: 'WH1000XM5/Silver',
    serialNumber: 'S01-4492819-B',
    purchaseDate: '2025-12-05',
    purchasePrice: '$399.99',
    seller: 'Amazon Retail Europe',
    warrantyStatus: 'active',
    warrantyStartDate: '2025-12-05',
    warrantyExpiryDate: '2027-12-05',
    warrantyPeriodMonths: 24,
    warrantyCoverageSummary: '24-Month Sony Electronics Limited Warranty covering acoustic drivers, ANC microphones, and Bluetooth 5.2 circuitry.',
    warrantyTerms: {
      coverage: ['Driver coil defects', 'Active noise cancellation processor', 'Integrated lithium-ion battery retention'],
      exclusions: ['Headband foam cosmetic tear', 'Exposure to heavy rain'],
      conditions: ['Requires itemized VAT invoice displaying serial number or order confirmation matching serial']
    },
    documentsCount: 1,
    verifiedFieldsCount: 4,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 48,
    status: 'attention',
    createdAt: '2025-12-08T09:15:00Z',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    notes: 'Missing itemized store tax invoice. Only order confirmation email uploaded.',
    documents: [
      {
        id: 'doc-sony-1',
        productId: 'prod-dur-03',
        name: 'Amazon_Order_Confirmation_Email.pdf',
        type: 'Invoice',
        uploadDate: '2025-12-08',
        size: '420 KB',
        source: 'Amazon Digital Order Confirmation',
        status: 'unverified',
        previewSnippet: 'Amazon Order #204-9182910-1829102 | Item: Sony WH-1000XM5 Silver | Shipped: Dec 05, 2025',
        pageCount: 1
      }
    ],
    extractedFields: [
      { id: 'sf-1', key: 'productName', label: 'Product Name', value: 'WH-1000XM5 Wireless Headphones', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-2', key: 'brand', label: 'Brand', value: 'Sony', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-3', key: 'model', label: 'Model', value: 'WH1000XM5/Silver', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'medium', status: 'verified' },
      { id: 'sf-4', key: 'serialNumber', label: 'Serial Number', value: 'S01-4492819-B', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'low', status: 'needs_review', notes: 'Serial missing from order email. Needs invoice or box barcode.' },
      { id: 'sf-5', key: 'purchaseDate', label: 'Purchase Date', value: '2025-12-05', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-6', key: 'purchasePrice', label: 'Purchase Price', value: '$399.99', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-7', key: 'seller', label: 'Seller', value: 'Amazon Retail Europe', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'high', status: 'verified' },
      { id: 'sf-8', key: 'warrantyExpiryDate', label: 'Warranty Expiry', value: '2027-12-05', sourceDoc: 'Amazon_Order_Confirmation_Email.pdf', confidence: 'medium', status: 'needs_review' }
    ],
    conflicts: [],
    issues: [
      {
        id: 'iss-sony-1',
        productId: 'prod-dur-03',
        title: 'Right Ear Cup High-Pitched Acoustic Hiss',
        description: 'Persistent feedback hiss appears in right speaker when ANC mode is engaged in quiet rooms.',
        category: 'Audio / Speaker',
        date: '2026-09-27',
        severity: 'critical',
        status: 'open',
        evidenceDocName: 'Noise_Recording_Audio_Snippet.m4a'
      }
    ],
    plannerItems: [
      { id: 'pl-sony-1', title: 'Download VAT receipt from Amazon Order History to complete claim readiness', deadline: '2026-10-05', type: 'urgent', completed: false, actionTab: 'Documents', actionLabel: 'Upload Document' },
      { id: 'pl-sony-2', title: 'Schedule diagnostic with Sony Authorized Partner', deadline: '2026-10-15', type: 'recommended', completed: false, actionTab: 'Issues', actionLabel: 'View Service Centers' }
    ],
    renewalPlans: [],
    timeline: [
      { id: 'tl-sony-1', date: 'Dec 08, 2025', title: 'Product Added to Vault', description: 'Headphones registered with basic order confirmation.', category: 'product' },
      { id: 'tl-sony-2', date: 'Sep 27, 2026', title: 'Hardware Issue Reported', description: 'User flagged ANC hiss artifact in right ear cup.', category: 'issue' }
    ]
  },

  // 4. LG OLED C3 65" TV
  {
    id: 'prod-dur-04',
    name: 'OLED C3 65" 4K Smart TV',
    brand: 'LG Electronics',
    category: 'Televisions',
    type: 'durable',
    model: 'OLED65C3PUA',
    serialNumber: '311RMKW92817',
    purchaseDate: '2025-06-20',
    purchasePrice: '$1,796.00',
    seller: 'Currys Electronics',
    warrantyStatus: 'active',
    warrantyStartDate: '2025-06-20',
    warrantyExpiryDate: '2030-06-20',
    warrantyPeriodMonths: 60,
    warrantyCoverageSummary: '5-Year Extended Panel Protection Guarantee covering burn-in, dead pixels, and power board repair.',
    warrantyTerms: {
      coverage: ['Self-lit OLED panel burn-in retention', 'Primary motherboard power delivery', 'Internal Wi-Fi module'],
      exclusions: ['Screen impact damage from wall mount dislodging'],
      conditions: ['Serial label on rear casing must remain intact']
    },
    documentsCount: 4,
    verifiedFieldsCount: 8,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 100,
    status: 'active',
    createdAt: '2025-06-22T11:00:00Z',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    notes: '5-year panel warranty fully verified and registered.',
    documents: [
      {
        id: 'doc-lg-1',
        productId: 'prod-dur-04',
        name: 'Currys_Invoice_OLED65C3.pdf',
        type: 'Invoice',
        uploadDate: '2025-06-22',
        size: '1.8 MB',
        source: 'Currys Digital Portal',
        status: 'verified',
        previewSnippet: 'Currys Order #CUR-89210 | LG OLED65C3PUA | Total Paid: £1,499.00',
        pageCount: 2
      },
      {
        id: 'doc-lg-2',
        productId: 'prod-dur-04',
        name: 'LG_5Year_Panel_Guarantee_Certificate.pdf',
        type: 'Warranty Document',
        uploadDate: '2025-06-22',
        size: '2.4 MB',
        source: 'LG VIP Registration Service',
        status: 'verified',
        previewSnippet: 'Extended Panel Protection Plan: Active through June 20, 2030.',
        pageCount: 3
      }
    ],
    extractedFields: [
      { id: 'lgf-1', key: 'productName', label: 'Product Name', value: 'OLED C3 65" 4K Smart TV', sourceDoc: 'Currys_Invoice_OLED65C3.pdf', confidence: 'high', status: 'verified' },
      { id: 'lgf-2', key: 'brand', label: 'Brand', value: 'LG Electronics', sourceDoc: 'Currys_Invoice_OLED65C3.pdf', confidence: 'high', status: 'verified' },
      { id: 'lgf-3', key: 'model', label: 'Model', value: 'OLED65C3PUA', sourceDoc: 'Currys_Invoice_OLED65C3.pdf', confidence: 'high', status: 'verified' },
      { id: 'lgf-4', key: 'serialNumber', label: 'Serial Number', value: '311RMKW92817', sourceDoc: 'Currys_Invoice_OLED65C3.pdf', confidence: 'high', status: 'verified' },
      { id: 'lgf-5', key: 'purchaseDate', label: 'Purchase Date', value: '2025-06-20', sourceDoc: 'Currys_Invoice_OLED65C3.pdf', confidence: 'high', status: 'verified' },
      { id: 'lgf-6', key: 'purchasePrice', label: 'Purchase Price', value: '$1,796.00', sourceDoc: 'Currys_Invoice_OLED65C3.pdf', confidence: 'high', status: 'verified' },
      { id: 'lgf-7', key: 'seller', label: 'Seller', value: 'Currys Electronics', sourceDoc: 'Currys_Invoice_OLED65C3.pdf', confidence: 'high', status: 'verified' },
      { id: 'lgf-8', key: 'warrantyExpiryDate', label: 'Warranty Expiry', value: '2030-06-20', sourceDoc: 'LG_5Year_Panel_Guarantee_Certificate.pdf', confidence: 'high', status: 'verified' }
    ],
    conflicts: [],
    issues: [],
    plannerItems: [
      { id: 'pl-lg-1', title: 'Annual panel pixel refresh cycle check', deadline: '2027-06-20', type: 'recommended', completed: false, actionTab: 'Overview' }
    ],
    renewalPlans: [],
    timeline: [
      { id: 'tl-lg-1', date: 'Jun 22, 2025', title: 'Product Added to Vault', description: 'LG OLED registered with 5-year guarantee certificate.', category: 'product' },
      { id: 'tl-lg-2', date: 'Jun 22, 2025', title: 'Claim Readiness Audit', description: 'All 5 critical evidence documents verified at 100% readiness.', category: 'claim' }
    ]
  },

  // 5. Dyson HP09 Purifier
  {
    id: 'prod-dur-05',
    name: 'Purifier Hot+Cool HP09 Formaldehyde',
    brand: 'Dyson',
    category: 'Appliances',
    type: 'durable',
    model: 'HP09 Nickel/Gold',
    serialNumber: 'DY-839210-UK',
    purchaseDate: '2025-11-01',
    purchasePrice: '$749.99',
    seller: 'Dyson Official Store',
    warrantyStatus: 'active',
    warrantyStartDate: '2025-11-01',
    warrantyExpiryDate: '2027-11-01',
    warrantyPeriodMonths: 24,
    warrantyCoverageSummary: '2-Year Dyson Manufacturer Warranty covering motor oscillation, heating coils, and solid-state sensors.',
    documentsCount: 2,
    verifiedFieldsCount: 7,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 92,
    status: 'active',
    createdAt: '2025-11-02T16:45:00Z',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
    notes: 'Filter replacement tracked in maintenance schedule.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // 6. Apple Watch Ultra 2
  {
    id: 'prod-dur-06',
    name: 'Watch Ultra 2 (49mm Titanium)',
    brand: 'Apple',
    category: 'Wearables',
    type: 'durable',
    model: 'A2986 / Trail Loop',
    serialNumber: 'W88109JK201',
    purchaseDate: '2026-01-05',
    purchasePrice: '$799.00',
    seller: 'Apple Store Online',
    warrantyStatus: 'active',
    warrantyStartDate: '2026-01-05',
    warrantyExpiryDate: '2027-01-05',
    warrantyPeriodMonths: 12,
    documentsCount: 2,
    verifiedFieldsCount: 8,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 98,
    status: 'active',
    createdAt: '2026-01-06T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    notes: 'Includes 12 months hardware coverage.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // 7. Dell XPS 15
  {
    id: 'prod-dur-07',
    name: 'XPS 15 9530 Core i9 32GB',
    brand: 'Dell',
    category: 'Laptops',
    type: 'durable',
    model: 'XPS-9530-2024',
    serialNumber: 'DL-99482103',
    purchaseDate: '2024-04-10',
    purchasePrice: '$2,199.00',
    seller: 'Dell Direct',
    warrantyStatus: 'expired',
    warrantyStartDate: '2024-04-10',
    warrantyExpiryDate: '2025-04-10',
    warrantyPeriodMonths: 12,
    documentsCount: 2,
    verifiedFieldsCount: 8,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 85,
    status: 'archived',
    createdAt: '2024-04-11T12:00:00Z',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    notes: 'Standard 1-year basic hardware warranty expired.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // 8. iPad Pro 12.9
  {
    id: 'prod-dur-08',
    name: 'iPad Pro 12.9" M2 (Wi-Fi 256GB)',
    brand: 'Apple',
    category: 'Tablets',
    type: 'durable',
    model: 'MNXR3B/A Space Gray',
    serialNumber: 'DMQ908129LM',
    purchaseDate: '2025-03-12',
    purchasePrice: '$1,099.00',
    seller: 'John Lewis & Partners',
    warrantyStatus: 'active',
    warrantyStartDate: '2025-03-12',
    warrantyExpiryDate: '2027-03-12',
    warrantyPeriodMonths: 24,
    documentsCount: 3,
    verifiedFieldsCount: 8,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 100,
    status: 'active',
    createdAt: '2025-03-14T11:20:00Z',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    notes: 'Includes John Lewis 2-year complimentary retailer guarantee.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // 9. Bose QC45
  {
    id: 'prod-dur-09',
    name: 'QuietComfort 45 Headphones',
    brand: 'Bose',
    category: 'Audio',
    type: 'durable',
    model: 'QC45 Triple Black',
    serialNumber: '08234199120',
    purchaseDate: '2024-08-15',
    purchasePrice: '$329.00',
    seller: 'Bose Official',
    warrantyStatus: 'active',
    warrantyStartDate: '2024-08-15',
    warrantyExpiryDate: '2026-08-15',
    warrantyPeriodMonths: 24,
    documentsCount: 2,
    verifiedFieldsCount: 8,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 90,
    status: 'active',
    createdAt: '2024-08-16T15:30:00Z',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    notes: 'Warranty active until August 2026.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // 10. Canon EOS R6
  {
    id: 'prod-dur-10',
    name: 'EOS R6 Mark II Mirrorless Camera',
    brand: 'Canon',
    category: 'Cameras',
    type: 'durable',
    model: 'EOS R6 MK II Body',
    serialNumber: 'CN-49021884',
    purchaseDate: '2025-08-30',
    purchasePrice: '$2,499.00',
    seller: 'Wex Photo Video',
    warrantyStatus: 'active',
    warrantyStartDate: '2025-08-30',
    warrantyExpiryDate: '2027-08-30',
    warrantyPeriodMonths: 24,
    documentsCount: 3,
    verifiedFieldsCount: 8,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 95,
    status: 'active',
    createdAt: '2025-09-01T08:00:00Z',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    notes: 'Canon CPS registered with verified serial.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // 11. Breville Barista Touch
  {
    id: 'prod-dur-11',
    name: 'Barista Touch Espresso Machine',
    brand: 'Breville / Sage',
    category: 'Appliances',
    type: 'durable',
    model: 'BES880BSS',
    serialNumber: 'BR-20239182',
    purchaseDate: '2025-05-10',
    purchasePrice: '$999.95',
    seller: 'Sage Appliances',
    warrantyStatus: 'active',
    warrantyStartDate: '2025-05-10',
    warrantyExpiryDate: '2027-05-10',
    warrantyPeriodMonths: 24,
    documentsCount: 2,
    verifiedFieldsCount: 7,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 88,
    status: 'active',
    createdAt: '2025-05-12T13:40:00Z',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    notes: 'Pump warranty active. Water descaling reminder synchronized.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // 12. Nintendo Switch OLED
  {
    id: 'prod-dur-12',
    name: 'Switch OLED Model Mario Red',
    brand: 'Nintendo',
    category: 'Gaming',
    type: 'durable',
    model: 'HEG-001',
    serialNumber: 'XTW10928374',
    purchaseDate: '2025-01-20',
    purchasePrice: '$349.99',
    seller: 'GameStop',
    warrantyStatus: 'active',
    warrantyStartDate: '2025-01-20',
    warrantyExpiryDate: '2027-01-20',
    warrantyPeriodMonths: 24,
    documentsCount: 1,
    verifiedFieldsCount: 6,
    totalFieldsCount: 8,
    hasConflict: false,
    claimReadinessScore: 80,
    status: 'active',
    createdAt: '2025-01-21T18:10:00Z',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=600&q=80',
    notes: 'Joy-Con drift repair policy registered under European consumer terms.',
    documents: [],
    extractedFields: [],
    conflicts: [],
    issues: [],
    plannerItems: [],
    renewalPlans: [],
    timeline: []
  },

  // =========================================================================
  // 6 BEAUTY PRODUCTS
  // =========================================================================

  // 1. The Ordinary Niacinamide
  {
    id: 'prod-bty-01',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'Face Serums',
    type: 'beauty',
    batchNumber: '3H04B',
    manufacturingDate: '2025-02-10',
    expiryDate: '2027-02-10',
    paoMonths: '12M',
    openedDate: '2025-11-15',
    openedStatus: 'fresh',
    usagePeriodDays: 318,
    allergensWarning: ['Nut-free', 'Silicone-free'],
    volumeSize: '60ml',
    purchasePrice: '$11.80',
    seller: 'Deciem Official',
    reminderIntervalDays: 30,
    status: 'active',
    createdAt: '2025-11-15T09:00:00Z',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    notes: 'Good tolerance. Store in cool, dark cabinet below 25°C.',
    documents: [
      {
        id: 'doc-ord-1',
        productId: 'prod-bty-01',
        name: 'The_Ordinary_Bottle_Batch_Scan.jpg',
        type: 'Batch Code Sticker',
        uploadDate: '2025-11-15',
        size: '1.1 MB',
        source: 'Mobile Camera Macro Scan',
        status: 'verified',
        previewSnippet: 'Batch: 3H04B | Deciem Toronto M6K 1W8 | 12M Open Jar Symbol',
        pageCount: 1
      },
      {
        id: 'doc-ord-2',
        productId: 'prod-bty-01',
        name: 'Deciem_Store_Receipt.pdf',
        type: 'Invoice',
        uploadDate: '2025-11-15',
        size: '520 KB',
        source: 'Deciem Covent Garden Store',
        status: 'verified',
        previewSnippet: 'Item: Niacinamide 10% + Zinc 1% 60ml | Qty: 1 | Paid: £9.80',
        pageCount: 1
      }
    ],
    extractedFields: [
      { id: 'ord-f1', key: 'productName', label: 'Product Name', value: 'Niacinamide 10% + Zinc 1%', sourceDoc: 'The_Ordinary_Bottle_Batch_Scan.jpg', confidence: 'high', status: 'verified' },
      { id: 'ord-f2', key: 'brand', label: 'Brand', value: 'The Ordinary', sourceDoc: 'The_Ordinary_Bottle_Batch_Scan.jpg', confidence: 'high', status: 'verified' },
      { id: 'ord-f3', key: 'batchNumber', label: 'Batch Number', value: '3H04B', sourceDoc: 'The_Ordinary_Bottle_Batch_Scan.jpg', confidence: 'high', status: 'verified' },
      { id: 'ord-f4', key: 'manufacturingDate', label: 'Manufacturing Date', value: '2025-02-10', sourceDoc: 'Deciem Batch Attestation DB', confidence: 'high', status: 'verified' },
      { id: 'ord-f5', key: 'expiryDate', label: 'Factory Expiry Date', value: '2027-02-10', sourceDoc: 'Deciem Batch Attestation DB', confidence: 'high', status: 'verified' },
      { id: 'ord-f6', key: 'paoMonths', label: 'PAO (Period-After-Opening)', value: '12M', sourceDoc: 'The_Ordinary_Bottle_Batch_Scan.jpg', confidence: 'high', status: 'verified' },
      { id: 'ord-f7', key: 'openedDate', label: 'Opened Date', value: '2025-11-15', sourceDoc: 'User Manual Entry', confidence: 'high', status: 'verified' }
    ],
    timeline: [
      { id: 'ord-tl-1', date: 'Feb 10, 2025', title: 'Batch Manufactured', description: 'Batch 3H04B manufactured at Deciem Toronto Facility.', category: 'product' },
      { id: 'ord-tl-2', date: 'Nov 15, 2025', title: 'Product Added to Vault', description: 'Cataloged via batch photo scan and Deciem receipt.', category: 'document' },
      { id: 'ord-tl-3', date: 'Nov 15, 2025', title: 'Bottle Opened & PAO Timer Started', description: '12-Month Period-After-Opening lifecycle countdown initiated.', category: 'verification' }
    ]
  },

  // 2. Drunk Elephant Vitamin C Serum
  {
    id: 'prod-bty-02',
    name: 'C-Firma Fresh Vitamin C Day Serum',
    brand: 'Drunk Elephant',
    category: 'Vitamin C Serum',
    type: 'beauty',
    batchNumber: 'DE-2391A',
    manufacturingDate: '2025-08-01',
    expiryDate: '2026-10-11',
    paoMonths: '6M',
    openedDate: '2026-04-12',
    openedStatus: 'expiring_soon',
    usagePeriodDays: 170,
    allergensWarning: ['Contains L-Ascorbic Acid 15%'],
    volumeSize: '28ml',
    purchasePrice: '$78.00',
    seller: 'Space NK London',
    reminderIntervalDays: 7,
    status: 'attention',
    createdAt: '2026-04-12T08:30:00Z',
    image: 'https://images.unsplash.com/photo-1608248597359-2998492025d5?auto=format&fit=crop&w=600&q=80',
    notes: 'Opened 170 days ago with a 6M (180 days) PAO. Recommended to finish bottle within 12 days before active L-Ascorbic acid oxidizes.',
    documents: [
      {
        id: 'doc-de-1',
        productId: 'prod-bty-02',
        name: 'Drunk_Elephant_Base_Bottle_Batch.jpg',
        type: 'Batch Code Sticker',
        uploadDate: '2026-04-12',
        size: '1.6 MB',
        source: 'Box Base Photo',
        status: 'verified',
        previewSnippet: 'Batch DE-2391A | Space NK Regent St | PAO: 6M | 28ml 0.94 fl oz',
        pageCount: 1
      }
    ],
    extractedFields: [
      { id: 'de-f1', key: 'productName', label: 'Product Name', value: 'C-Firma Fresh Vitamin C Day Serum', sourceDoc: 'Drunk_Elephant_Base_Bottle_Batch.jpg', confidence: 'high', status: 'verified' },
      { id: 'de-f2', key: 'brand', label: 'Brand', value: 'Drunk Elephant', sourceDoc: 'Drunk_Elephant_Base_Bottle_Batch.jpg', confidence: 'high', status: 'verified' },
      { id: 'de-f3', key: 'batchNumber', label: 'Batch Number', value: 'DE-2391A', sourceDoc: 'Drunk_Elephant_Base_Bottle_Batch.jpg', confidence: 'high', status: 'verified' },
      { id: 'de-f4', key: 'manufacturingDate', label: 'Manufacturing Date', value: '2025-08-01', sourceDoc: 'Global Batch Database', confidence: 'high', status: 'verified' },
      { id: 'de-f5', key: 'expiryDate', label: 'Factory Expiry Date', value: '2026-10-11', sourceDoc: 'Global Batch Database', confidence: 'high', status: 'verified' },
      { id: 'de-f6', key: 'paoMonths', label: 'PAO (Period-After-Opening)', value: '6M', sourceDoc: 'Drunk_Elephant_Base_Bottle_Batch.jpg', confidence: 'high', status: 'verified' },
      { id: 'de-f7', key: 'openedDate', label: 'Opened Date', value: '2026-04-12', sourceDoc: 'User Manual Entry', confidence: 'high', status: 'verified' }
    ],
    timeline: [
      { id: 'de-tl-1', date: 'Aug 01, 2025', title: 'Batch Manufactured', description: 'Batch DE-2391A produced and nitrogen-sealed.', category: 'product' },
      { id: 'de-tl-2', date: 'Apr 12, 2026', title: 'Reconstituted & Opened', description: 'Liquid serum base mixed with 15% L-Ascorbic acid powder.', category: 'verification' },
      { id: 'de-tl-3', date: 'Sep 29, 2026', title: 'PAO Oxidation Warning Triggered', description: '170 days in routine. 12 days remaining before 180-day stability threshold.', category: 'document' }
    ]
  },

  // 3. CeraVe Moisturizing Lotion
  {
    id: 'prod-bty-03',
    name: 'Daily Moisturizing Lotion (Dry Skin)',
    brand: 'CeraVe',
    category: 'Moisturizers',
    type: 'beauty',
    batchNumber: '70U802',
    manufacturingDate: '2025-01-15',
    expiryDate: '2028-01-15',
    paoMonths: '12M',
    openedDate: '2026-03-01',
    openedStatus: 'fresh',
    usagePeriodDays: 212,
    allergensWarning: ['Fragrance-free', 'Paraben-free'],
    volumeSize: '473ml',
    purchasePrice: '$16.99',
    seller: 'Boots Pharmacy',
    reminderIntervalDays: 60,
    status: 'active',
    createdAt: '2026-03-01T12:00:00Z',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    notes: 'Essential ceramides 1, 3, 6-II and hyaluronic acid.',
    documents: [],
    extractedFields: [],
    timeline: []
  },

  // 4. La Roche-Posay Sunscreen
  {
    id: 'prod-bty-04',
    name: 'Anthelios UVMune 400 Invisible Fluid SPF 50+',
    brand: 'La Roche-Posay',
    category: 'Sunscreen',
    type: 'beauty',
    batchNumber: '54W301',
    manufacturingDate: '2025-05-18',
    expiryDate: '2028-05-18',
    paoMonths: '12M',
    openedDate: '2026-05-01',
    openedStatus: 'fresh',
    usagePeriodDays: 151,
    allergensWarning: ['Non-comedogenic', 'Very water resistant'],
    volumeSize: '50ml',
    purchasePrice: '$21.50',
    seller: 'Superdrug Piccadilly',
    reminderIntervalDays: 30,
    status: 'active',
    createdAt: '2026-05-01T07:15:00Z',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    notes: 'Ultra-long UVA protection filter Mexoryl 400.',
    documents: [],
    extractedFields: [],
    timeline: []
  },

  // 5. Paula's Choice BHA
  {
    id: 'prod-bty-05',
    name: 'Skin Perfecting 2% BHA Liquid Exfoliant',
    brand: "Paula's Choice",
    category: 'Exfoliants',
    type: 'beauty',
    batchNumber: 'PC-88219B',
    manufacturingDate: '2025-04-02',
    expiryDate: '2027-10-02',
    paoMonths: '12M',
    openedDate: '2025-10-10',
    openedStatus: 'fresh',
    usagePeriodDays: 354,
    allergensWarning: ['Salicylic Acid 2%'],
    volumeSize: '118ml',
    purchasePrice: '$35.00',
    seller: "Paula's Choice Direct UK",
    reminderIntervalDays: 30,
    status: 'active',
    createdAt: '2025-10-10T20:00:00Z',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
    notes: 'PAO 12M expiring next month. Keep upright.',
    documents: [],
    extractedFields: [],
    timeline: []
  },

  // 6. Estée Lauder Night Repair
  {
    id: 'prod-bty-06',
    name: 'Advanced Night Repair Synchronized Recovery',
    brand: 'Estée Lauder',
    category: 'Night Care',
    type: 'beauty',
    batchNumber: 'EL-901B3',
    manufacturingDate: '2025-09-12',
    expiryDate: '2028-09-12',
    paoMonths: '24M',
    openedStatus: 'unopened',
    allergensWarning: ['Dermatologist-tested', 'Ophthalmologist-tested'],
    volumeSize: '50ml',
    purchasePrice: '$115.00',
    seller: 'Selfridges Beauty Hall',
    status: 'active',
    createdAt: '2026-08-01T15:00:00Z',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    notes: 'Unopened sealed backup bottle stored in vanity reserve.',
    documents: [],
    extractedFields: [],
    timeline: []
  }
];

export const ATTENTION_ITEMS: AttentionItem[] = [
  // 1. Needs Attention (Urgent / Active)
  {
    id: 'att-1',
    title: 'Warranty Expiring Soon',
    productId: 'prod-dur-01',
    productName: 'MacBook Air M3',
    productType: 'durable',
    severity: 'high',
    category: 'needs_attention',
    whatHappened: 'Manufacturer standard hardware warranty expires in 18 days (October 18, 2026).',
    whyItMatters: 'Any unaddressed hardware failures, keyboard or display defects must be reported prior to expiration.',
    recommendedAction: 'Schedule a free hardware diagnostic check or evaluate AppleCare extension before coverage closes.',
    ctaText: 'Review Warranty',
    targetRoute: '/products/prod-dur-01',
    timeRemaining: '18 days remaining'
  },
  {
    id: 'att-2',
    title: 'Document Conflict Detected',
    productId: 'prod-dur-02',
    productName: 'Samsung Galaxy S24 Ultra',
    productType: 'durable',
    severity: 'medium',
    category: 'needs_attention',
    whatHappened: 'Purchase date differs between invoice (Feb 14, 2026) and warranty registration card (Feb 10, 2026).',
    whyItMatters: 'Discrepancy can trigger automated warranty claim rejection or warranty start-date disputes with Samsung Care.',
    recommendedAction: 'Verify original store receipt timestamp and update the synchronized warranty record.',
    ctaText: 'Resolve Conflict',
    targetRoute: '/products/prod-dur-02',
    timeRemaining: 'Action recommended'
  },
  {
    id: 'att-3',
    title: 'Missing Claim Evidence',
    productId: 'prod-dur-03',
    productName: 'Sony WH-1000XM5',
    productType: 'durable',
    severity: 'medium',
    category: 'needs_attention',
    whatHappened: 'Itemized invoice is missing. Only retailer order confirmation email is on file.',
    whyItMatters: 'Sony authorized service partners mandate VAT/sales receipt showing serial number for repair authorization.',
    recommendedAction: 'Download VAT receipt from Amazon account portal and attach to product vault.',
    ctaText: 'Complete Evidence',
    targetRoute: '/products/prod-dur-03',
    timeRemaining: 'Claim readiness: 48%'
  },
  {
    id: 'att-4',
    title: 'Beauty Product Expiring',
    productId: 'prod-bty-02',
    productName: 'Vitamin C Day Serum',
    productType: 'beauty',
    severity: 'high',
    category: 'needs_attention',
    whatHappened: 'L-Ascorbic Acid formula opened 170 days ago; Period-After-Opening (PAO) is 6 months (180 days).',
    whyItMatters: 'Active vitamin C rapidly oxidizes past PAO limit, degrading efficacy and increasing potential skin irritation.',
    recommendedAction: 'Use remaining serum over the next 12 days or inspect discoloration before daily application.',
    ctaText: 'Review Product',
    targetRoute: '/products/prod-bty-02',
    timeRemaining: '12 days before PAO expiry'
  },

  // 2. Upcoming Actions (Medium / Scheduled)
  {
    id: 'att-5',
    title: 'Filter Replacement Schedule',
    productId: 'prod-dur-05',
    productName: 'Dyson Purifier Hot+Cool HP09',
    productType: 'durable',
    severity: 'low',
    category: 'upcoming',
    whatHappened: 'HEPA H13 carbon combo filter usage counter reached 320 days of continuous air scrubbing.',
    whyItMatters: 'Filter saturation decreases particulate capture rate and increases motor fan workload.',
    recommendedAction: 'Order genuine Dyson replacement filter cartridge before seasonal air quality shift.',
    ctaText: 'Review Maintenance',
    targetRoute: '/products/prod-dur-05',
    timeRemaining: '32 days remaining'
  },
  {
    id: 'att-6',
    title: 'Battery Health Inspection Due',
    productId: 'prod-dur-06',
    productName: 'Apple Watch Ultra 2',
    productType: 'durable',
    severity: 'low',
    category: 'upcoming',
    whatHappened: 'Scheduled 9-month battery capacity calibration checkpoint recommended.',
    whyItMatters: 'Verifies capacity retention above 80% threshold required for complimentary manufacturer battery swap.',
    recommendedAction: 'Run battery diagnostics via companion Watch settings app.',
    ctaText: 'Check Battery Terms',
    targetRoute: '/products/prod-dur-06',
    timeRemaining: '45 days remaining'
  },

  // 3. Recently Completed (Resolved / Verified)
  {
    id: 'att-7',
    title: 'Extended Guarantee Verified',
    productId: 'prod-dur-04',
    productName: 'LG OLED C3 65" TV',
    productType: 'durable',
    severity: 'low',
    category: 'completed',
    whatHappened: '5-Year panel warranty certificate validated with LG VIP attestation ledger.',
    whyItMatters: 'Provides 100% claim readiness score through June 20, 2030.',
    recommendedAction: 'Zero action required. Policy is securely archived in the Documents Vault.',
    ctaText: 'View Documents',
    targetRoute: '/products/prod-dur-04',
    timeRemaining: 'Completed Sep 22',
    completedAt: '2026-09-22T14:10:00Z'
  },
  {
    id: 'att-8',
    title: 'Cosmetic Batch Code Attested',
    productId: 'prod-bty-03',
    productName: 'CeraVe Daily Moisturizing Lotion',
    productType: 'beauty',
    severity: 'low',
    category: 'completed',
    whatHappened: 'Factory batch 70U802 checked against manufacturer registry for freshness compliance.',
    whyItMatters: 'Validates unopened shelf stability through January 15, 2028.',
    recommendedAction: 'Record opened date whenever bottle seal is initially broken.',
    ctaText: 'View Record',
    targetRoute: '/products/prod-bty-03',
    timeRemaining: 'Completed Sep 18',
    completedAt: '2026-09-18T09:30:00Z'
  }
];

export const INITIAL_CLAIMS: ProductClaim[] = [
  {
    id: 'clm-1',
    productId: 'prod-dur-03',
    productName: 'WH-1000XM5 Wireless Headphones',
    productBrand: 'Sony',
    productType: 'durable',
    issueTitle: 'Right Ear Cup High-Pitched Acoustic Hiss',
    issueCategory: 'Audio / Speaker',
    status: 'Preparing',
    evidenceCompleteness: 60,
    evidenceChecklist: {
      invoice: false,
      warranty: true,
      serial: true,
      issueEvidence: true
    },
    createdAt: '2026-09-27',
    updatedAt: '2026-09-28',
    nextAction: 'Upload itemized VAT invoice displaying serial number',
    nextActionRoute: '/products/prod-dur-03',
    timeline: [
      { title: 'Defect Logged', date: 'Sep 27, 2026', note: 'Right ear cup hiss artifact reported by owner.' },
      { title: 'Readiness Audit Run', date: 'Sep 28, 2026', note: 'Audit flagged missing itemized retailer invoice.' }
    ]
  },
  {
    id: 'clm-2',
    productId: 'prod-dur-01',
    productName: 'MacBook Air M3 (15-inch)',
    productBrand: 'Apple',
    productType: 'durable',
    issueTitle: 'Pre-Expiry Hardware Diagnostic Review',
    issueCategory: 'Hardware',
    status: 'Draft',
    evidenceCompleteness: 95,
    evidenceChecklist: {
      invoice: true,
      warranty: true,
      serial: true,
      issueEvidence: false
    },
    createdAt: '2026-09-25',
    updatedAt: '2026-09-26',
    nextAction: 'Attach diagnostic hardware test log before Oct 18',
    nextActionRoute: '/products/prod-dur-01',
    timeline: [
      { title: 'Draft Claim Prepared', date: 'Sep 25, 2026', note: 'Pre-expiration claim file initiated.' }
    ]
  },
  {
    id: 'clm-3',
    productId: 'prod-dur-11',
    productName: 'Barista Touch Espresso Machine',
    productBrand: 'Breville / Sage',
    productType: 'durable',
    issueTitle: 'High-Pressure Extraction Pump Failure',
    issueCategory: 'Hardware',
    status: 'Submitted',
    evidenceCompleteness: 100,
    evidenceChecklist: {
      invoice: true,
      warranty: true,
      serial: true,
      issueEvidence: true
    },
    createdAt: '2026-09-10',
    updatedAt: '2026-09-18',
    nextAction: 'Awaiting repair partner diagnostic report',
    nextActionRoute: '/products/prod-dur-11',
    claimAmount: '$240.00',
    timeline: [
      { title: 'Claim Packet Submitted', date: 'Sep 10, 2026', note: 'Claim bundle #SAGE-8820 transmitted to Sage Care.' },
      { title: 'Documentation Accepted', date: 'Sep 14, 2026', note: 'Proof of purchase and serial attestation approved.' },
      { title: 'In Service Queue', date: 'Sep 18, 2026', note: 'Machine assigned to Authorized Breville Service Center.' }
    ]
  },
  {
    id: 'clm-4',
    productId: 'prod-dur-07',
    productName: 'XPS 15 9530 Core i9 32GB',
    productBrand: 'Dell',
    productType: 'durable',
    issueTitle: 'Thermal Throttling & Battery Expansion',
    issueCategory: 'Battery / Power',
    status: 'Rejected',
    evidenceCompleteness: 85,
    evidenceChecklist: {
      invoice: true,
      warranty: true,
      serial: true,
      issueEvidence: true
    },
    createdAt: '2025-05-15',
    updatedAt: '2025-05-22',
    nextAction: 'Review denial analysis or check post-warranty repair options',
    nextActionRoute: '/products/prod-dur-07',
    denialReason: 'Section 3.1: Hardware warranty expired 35 days prior to case filing timestamp.',
    clausesCited: ['Dell Basic Hardware Guarantee Section 3.1: Strict 12-Month Expiration'],
    timeline: [
      { title: 'Claim Lodged', date: 'May 15, 2025', note: 'Case filed for swollen battery cell.' },
      { title: 'Denial Issued', date: 'May 22, 2025', note: 'Rejected citing expired base warranty policy.' }
    ]
  },
  {
    id: 'clm-5',
    productId: 'prod-dur-04',
    productName: 'OLED C3 65" 4K Smart TV',
    productBrand: 'LG Electronics',
    productType: 'durable',
    issueTitle: 'Sub-Pixel Row Defect on Upper Right Quadrant',
    issueCategory: 'Display',
    status: 'Approved',
    evidenceCompleteness: 100,
    evidenceChecklist: {
      invoice: true,
      warranty: true,
      serial: true,
      issueEvidence: true
    },
    createdAt: '2026-08-01',
    updatedAt: '2026-08-15',
    nextAction: 'In-home technician panel replacement confirmed',
    nextActionRoute: '/products/prod-dur-04',
    claimAmount: '$420.00',
    timeline: [
      { title: 'Claim Filed', date: 'Aug 01, 2026', note: 'Pixel row photo evidence submitted.' },
      { title: 'VIP Guarantee Attested', date: 'Aug 05, 2026', note: '5-Year panel warranty confirmed.' },
      { title: 'Replacement Approved', date: 'Aug 15, 2026', note: 'Panel replacement authorized under warranty code LG-OLED-VIP.' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'warranty',
    title: 'MacBook Air M3 Warranty Expiring',
    explanation: 'Manufacturer standard hardware coverage expires in 18 days (Oct 18, 2026).',
    timestamp: '25m ago',
    read: false,
    targetRoute: '/products/prod-dur-01',
    productId: 'prod-dur-01'
  },
  {
    id: 'notif-2',
    type: 'conflict',
    title: 'Galaxy S24 Purchase Date Conflict',
    explanation: 'Invoice (Feb 14) differs from warranty slip (Feb 10). Resolution recommended.',
    timestamp: '2h ago',
    read: false,
    targetRoute: '/products/prod-dur-02',
    productId: 'prod-dur-02'
  },
  {
    id: 'notif-3',
    type: 'beauty',
    title: 'Vitamin C Day Serum Approaching PAO Expiry',
    explanation: 'Opened 170 days ago; 12 days remaining before 6M oxidation threshold.',
    timestamp: '4h ago',
    read: false,
    targetRoute: '/products/prod-bty-02',
    productId: 'prod-bty-02'
  },
  {
    id: 'notif-4',
    type: 'evidence',
    title: 'Missing VAT Invoice for Sony Headphones',
    explanation: 'Claim readiness is currently 48%. Upload VAT receipt to enable claim filing.',
    timestamp: '1d ago',
    read: true,
    targetRoute: '/products/prod-dur-03',
    productId: 'prod-dur-03'
  },
  {
    id: 'notif-5',
    type: 'claim',
    title: 'LG OLED C3 Panel Claim Approved',
    explanation: 'In-home technician dispatch authorized for panel sub-pixel service.',
    timestamp: '2d ago',
    read: true,
    targetRoute: '/claims',
    productId: 'prod-dur-04'
  }
];

export const PRICE_COMPARISONS: Record<string, PriceComparisonItem[]> = {
  'prod-dur-07': [
    {
      id: 'pc-1',
      currentProductId: 'prod-dur-07',
      modelName: 'Dell XPS 16 9640 (Intel Core Ultra 9, RTX 4070)',
      brand: 'Dell',
      price: '$2,299.00',
      keySpecs: '32GB LPDDR5X, 1TB NVMe, 3.2K OLED 120Hz Touch, 99.5Wh Battery',
      similarityPercentage: 96,
      availability: 'In Stock',
      recommendedFor: 'Direct successor to your current XPS 15 with matching CNC aluminum chassis.'
    },
    {
      id: 'pc-2',
      currentProductId: 'prod-dur-07',
      modelName: 'MacBook Pro 16" (Apple M3 Max 36GB)',
      brand: 'Apple',
      price: '$2,499.00',
      keySpecs: 'Liquid Retina XDR Display, 18h Battery Life, MagSafe 3, 3x Thunderbolt 4',
      similarityPercentage: 88,
      availability: 'In Stock',
      recommendedFor: 'Best-in-class power efficiency and battery endurance for workstation workloads.'
    },
    {
      id: 'pc-3',
      currentProductId: 'prod-dur-07',
      modelName: 'Lenovo ThinkPad X1 Extreme Gen 6',
      brand: 'Lenovo',
      price: '$2,149.00',
      keySpecs: 'Intel Core i9-13900H, RTX 4060, 32GB RAM, Mil-SPEC Durability',
      similarityPercentage: 92,
      availability: 'Limited Stock',
      recommendedFor: 'Superior keyboard ergonomics and modular field-replaceable memory.'
    }
  ],
  'prod-dur-01': [
    {
      id: 'pc-mba-1',
      currentProductId: 'prod-dur-01',
      modelName: 'MacBook Pro 14" (Apple M3 Pro 18GB)',
      brand: 'Apple',
      price: '$1,799.00',
      keySpecs: '120Hz ProMotion XDR, HDMI & SDXC reader, Active Dual Fans',
      similarityPercentage: 91,
      availability: 'In Stock',
      recommendedFor: 'Heavier multi-core rendering and external multi-monitor support.'
    },
    {
      id: 'pc-mba-2',
      currentProductId: 'prod-dur-01',
      modelName: 'ASUS Zenbook S 16 OLED',
      brand: 'ASUS',
      price: '$1,399.00',
      keySpecs: 'AMD Ryzen AI 9, 32GB RAM, 3K 120Hz OLED, 1.5kg Ceraluminum',
      similarityPercentage: 86,
      availability: 'In Stock',
      recommendedFor: 'Lightweight ultraportable with expansive 16-inch display.'
    }
  ]
};

export const WARRANTY_AI_KNOWLEDGE_BASE: Record<string, {
  questions: string[];
  answers: Record<string, {
    clause: string;
    source: string;
    confidence: 'high' | 'medium';
    answer: string;
  }>;
}> = {
  'prod-dur-01': {
    questions: [
      'Is battery replacement covered?',
      'What exclusions apply to my warranty?',
      'How long is my warranty valid?',
      'Does accidental liquid damage appear to be covered?',
      'What documents do I need for a claim?'
    ],
    answers: {
      'Is battery replacement covered?': {
        clause: 'Section 2.1: Batteries that retain less than 80 percent of original design capacity during the 1-year limited term are eligible for complimentary exchange.',
        source: 'Apple_1Year_Limited_Warranty_Terms.pdf, Page 2',
        confidence: 'high',
        answer: 'Yes, battery replacement is fully covered under the Apple Limited Warranty if the maximum capacity degrades below 80% within your 12-month coverage period (active until October 18, 2026). Routine degradation above 80% is considered normal consumable wear.'
      },
      'What exclusions apply to my warranty?': {
        clause: 'Section 4.1: Exclusions include cosmetic damage, drops, unauthorized disassembly, non-Apple parts, and liquid contact without AppleCare+ coverage.',
        source: 'Apple_1Year_Limited_Warranty_Terms.pdf, Page 3',
        confidence: 'high',
        answer: 'The policy explicitly excludes accidental drops, chassis dents, scratches, liquid spills, and unauthorized third-party hardware repairs. For accidental liquid protection, an active AppleCare+ policy is mandatory.'
      },
      'How long is my warranty valid?': {
        clause: 'Section 1.0: Apple warrants this MacBook Air for a period of one (1) year from the original retail purchase date (October 18, 2025).',
        source: 'Apple_Store_Invoice_C02GK993MD6R.pdf, Page 1',
        confidence: 'high',
        answer: 'Your manufacturer warranty is valid until October 18, 2026 (18 days remaining). After this date, standard out-of-warranty diagnostic and repair rates apply unless renewed.'
      },
      'Does accidental liquid damage appear to be covered?': {
        clause: 'Section 4.1 (d): Damage caused by liquid contact is expressly excluded from standard limited hardware guarantees.',
        source: 'Apple_1Year_Limited_Warranty_Terms.pdf, Page 3',
        confidence: 'high',
        answer: 'No. The standard 1-Year Limited Warranty does not cover liquid contact or immersion. Liquid contact indicator (LCI) sensors inside the chassis will trigger claim denial unless an AppleCare+ accidental policy is active.'
      },
      'What documents do I need for a claim?': {
        clause: 'Section 6.2: Proof of purchase demonstrating serial number and date is required at time of intake.',
        source: 'Apple_1Year_Limited_Warranty_Terms.pdf, Page 4',
        confidence: 'high',
        answer: 'To file an authorized claim, you need your itemized Apple Store Tax Invoice (#INV-99201) and your verified hardware serial number (C02GK993MD6R). Both are already attested and accessible in your Documents Vault.'
      }
    }
  },
  'prod-dur-02': {
    questions: [
      'Is screen burn-in or line defect covered?',
      'Does the purchase date conflict affect my warranty claim?',
      'What exclusions apply to water submersion?',
      'What documents do I need for a claim?'
    ],
    answers: {
      'Is screen burn-in or line defect covered?': {
        clause: 'Section 3.2: AMOLED display lines, digitizer dead zones, and factory panel anomalies are covered for 24 months.',
        source: 'Samsung_Care_Registration_Slip.pdf, Page 1',
        confidence: 'high',
        answer: 'Yes. Vertical line defects and panel manufacturing anomalies on the Dynamic AMOLED 2X display are covered under the 24-month manufacturer guarantee through February 14, 2028.'
      },
      'Does the purchase date conflict affect my warranty claim?': {
        clause: 'Section 1.4: In the event of date discrepancy, retailer bill of sale supersedes registration card.',
        source: 'BestBuy_Midtown_Register_Invoice.pdf, Page 1',
        confidence: 'medium',
        answer: 'Yes, until resolved. Automated service intake can reject claims if your registration card date (Feb 10) conflicts with your invoice (Feb 14). We recommend synchronizing to the store invoice date in your Conflicts tab.'
      },
      'What exclusions apply to water submersion?': {
        clause: 'Section 4.2: Water resistance IP68 rating does not constitute unconditional waterproof warranty. Saltwater and chemical immersion are excluded.',
        source: 'Samsung_Care_Registration_Slip.pdf, Page 2',
        confidence: 'high',
        answer: 'While the phone is IP68 rated, liquid damage resulting from depth exceeding 1.5 meters, pressure water jets, or chlorinated/salt water is excluded from warranty coverage.'
      },
      'What documents do I need for a claim?': {
        clause: 'Section 5.1: Proof of purchase with IMEI / Serial Number required.',
        source: 'BestBuy_Midtown_Register_Invoice.pdf, Page 1',
        confidence: 'high',
        answer: 'You will need the Best Buy itemized register receipt and device serial (RF8W301XZ9K). Once your date conflict is resolved, your claim bundle can be generated immediately.'
      }
    }
  },
  'prod-dur-03': {
    questions: [
      'Is acoustic distortion or ANC hiss covered?',
      'Why is my claim readiness score at 48%?',
      'How long is my Sony warranty valid?'
    ],
    answers: {
      'Is acoustic distortion or ANC hiss covered?': {
        clause: 'Section 2.3: Audio driver coil failures and active noise cancellation microphone processing defects are covered for 24 months.',
        source: 'Sony_1Year_Hardware_Policy.pdf, Page 1',
        confidence: 'high',
        answer: 'Yes. Acoustic hiss, mic squeal, and ANC driver feedback are manufacturing defects covered under your 24-month Sony warranty (active until December 5, 2027).'
      },
      'Why is my claim readiness score at 48%?': {
        clause: 'Section 4.1: Authorized Sony Service Centers mandate an official VAT tax invoice showing product serial number.',
        source: 'Amazon_Order_Confirmation_Email.pdf, Page 1',
        confidence: 'high',
        answer: 'Your vault currently only contains an Amazon order confirmation email without itemized tax details or serial breakdown. Download the VAT invoice from your Amazon portal to reach 100% readiness.'
      },
      'How long is my Sony warranty valid?': {
        clause: 'Section 1.1: 24 Months European Consumer Guarantee from purchase date December 05, 2025.',
        source: 'Amazon_Order_Confirmation_Email.pdf, Page 1',
        confidence: 'high',
        answer: 'Your Sony warranty is valid until December 5, 2027. You have ample time, but resolving your document evidence now ensures rapid turnaround.'
      }
    }
  }
};


export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'product_added',
    title: 'Product Added',
    productName: 'MacBook Air M3 (15-inch)',
    detail: 'Imported from Apple Store digital receipt with serial extraction.',
    timestamp: '2 hours ago'
  },
  {
    id: 'act-2',
    type: 'document_uploaded',
    title: 'Document Uploaded',
    productName: 'LG OLED C3 65" 4K Smart TV',
    detail: 'Extended 5-Year panel warranty certificate uploaded (PDF 2.4 MB).',
    timestamp: '5 hours ago'
  },
  {
    id: 'act-3',
    type: 'field_verified',
    title: 'Field Verified',
    productName: 'Dyson Purifier Hot+Cool HP09',
    detail: 'Serial number verified against Dyson registration database.',
    timestamp: 'Yesterday at 16:30'
  },
  {
    id: 'act-4',
    type: 'conflict_detected',
    title: 'Conflict Detected',
    productName: 'Samsung Galaxy S24 Ultra',
    detail: 'Purchase date inconsistency flagged between bill of sale and card.',
    timestamp: 'Yesterday at 11:15'
  },
  {
    id: 'act-5',
    type: 'issue_reported',
    title: 'Issue Reported',
    productName: 'Sony WH-1000XM5',
    detail: 'Headphone noise cancellation hiss reported on right ear cup.',
    timestamp: '2 days ago'
  },
  {
    id: 'act-6',
    type: 'claim_evidence_added',
    title: 'Claim Evidence Added',
    productName: 'Barista Touch Espresso Machine',
    detail: 'Pump failure diagnostic video and proof of purchase indexed.',
    timestamp: '3 days ago'
  }
];
