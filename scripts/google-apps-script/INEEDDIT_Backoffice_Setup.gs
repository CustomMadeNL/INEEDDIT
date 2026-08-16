/**
 * INEEDDIT — Backoffice Setup
 * Version: 1.0.0
 *
 * Run: setupINEEDDITBackoffice()
 * Safe to run repeatedly: folders and files are reused by exact name.
 * Existing files are never deleted, overwritten or moved.
 */

const INEEDDIT_CONFIG = Object.freeze({
  ROOT_FOLDER_ID: '1QzyuNvDGRM2_v_fhrmlwMG9uP5U0aavV',
  BRAND: 'INEEDDIT',
  SLOGAN: 'Thank me later',
  VERSION: '1.0.0',
  TIME_ZONE: 'Europe/Amsterdam',
  DRY_RUN: false
});

const INEEDDIT_PRODUCTS = [
  ['P001', 'COLLAGEN GLASS MASK', 'Beauty & selfcare', 'Sample sourcing', ''],
  ['P002', 'DARK CIRCLE EYE PATCHES', 'Beauty & selfcare', 'Sample sourcing', ''],
  ['P003', 'MULTI SPF CREAM', 'Beauty & selfcare', 'Sample sourcing', ''],
  ['P004', 'EVERYTHING BAG', 'Travel & organization', 'Sample sourcing', ''],
  ['P005', 'CLEAN MACHINE', 'Smart home & cleaning', 'Sample sourcing', ''],
  ['P006', 'SKIN THERAPY LED', 'Beauty tech', 'Sample sourcing', ''],
  ['P007', 'MOISTURIZER SKIN SERUM', 'Beauty & selfcare', 'Sample sourcing', ''],
  ['P008', 'CABLE SET', 'Tech essentials', 'Sample sourcing', ''],
  ['P009', 'PREMIUM HEATLESS CURL SET', 'Beauty & selfcare', 'Sample sourcing', '']
];

const FOLDER_TREE = {
  '00_ADMIN & GOVERNANCE': [
    '01_Governance', '02_Systems & Access', '03_Decisions', '04_Meetings',
    '05_Company & Registration', '06_Insurance', '07_Risk & Incidents'
  ],
  '01_STRATEGY & BRAND': [
    '01_Business Strategy', '02_Brand Identity', '03_Customer & Positioning',
    '04_Roadmaps', '05_Research & Trends', '06_IP & Brand Assets'
  ],
  '02_PRODUCTS & SOURCING': [
    '01_Product Portfolio', '02_Product Development', '03_Suppliers',
    '04_Samples & QA', '05_Pricing & Margins', '06_Packaging',
    '07_Compliance Files', '08_Approved Products', '09_Discontinued'
  ],
  '03_SHOPIFY & ECOMMERCE': [
    '01_Store Setup', '02_Product Listings', '03_Collections', '04_Apps & Integrations',
    '05_Payments', '06_Checkout & Conversion', '07_Website Content',
    '08_Releases & Change Log', '09_Backups & Exports'
  ],
  '04_MARKETING & CONTENT': [
    '01_Strategy & Campaigns', '02_Content Calendar', '03_Product Photography',
    '04_Video & UGC', '05_Social Media', '06_Email & CRM', '07_Influencers & Creators',
    '08_Paid Media', '09_PR', '10_Approved Assets', '11_Performance'
  ],
  '05_SALES & PARTNERSHIPS': [
    '01_Sales Strategy', '02_Partnership Pipeline', '03_Affiliates',
    '04_Wholesale & Retail', '05_Offers & Promotions', '06_Proposals & Agreements'
  ],
  '06_CUSTOMER SERVICE & RETURNS': [
    '01_Policies', '02_SOPs', '03_Response Templates', '04_FAQ & Knowledge Base',
    '05_Returns & Refunds', '06_Complaints & Incidents', '07_Customer Insights'
  ],
  '07_OPERATIONS & LOGISTICS': [
    '01_Order Flow', '02_Fulfilment', '03_Shipping', '04_Inventory & Availability',
    '05_Dropshipping Suppliers', '06_SOPs', '07_Incidents', '08_Business Continuity'
  ],
  '08_FINANCE & TAX': [
    '01_Budgets & Forecasts', '02_Pricing & Unit Economics', '03_Revenue',
    '04_Purchases & Supplier Invoices', '05_Expenses', '06_Payouts',
    '07_Moneybird Exports', '08_Tax & VAT', '09_Year End', '10_Financial Reports'
  ],
  '09_LEGAL & COMPLIANCE': [
    '01_Company Documents', '02_Contracts', '03_Terms & Policies', '04_Privacy & GDPR',
    '05_Product Compliance', '06_Claims & Advertising', '07_Trademarks & IP',
    '08_Supplier Due Diligence', '09_Legal Matters'
  ],
  '10_DATA & REPORTING': [
    '01_KPI Dashboard', '02_Shopify Exports', '03_Marketing Analytics',
    '04_Customer Analytics', '05_Product Performance', '06_Automation Logs',
    '07_Weekly Reports', '08_Monthly Reports'
  ],
  '11_TEAM & AGENTS': [
    '01_Organization & Roles', '02_Access Matrix', '03_Agent Registry',
    '04_Agent Instructions', '05_Agent Output', '06_Quality Control',
    '07_Onboarding', '08_Offboarding', '09_Team Meetings'
  ],
  '90_TEMPLATES': [
    '01_Documents', '02_Spreadsheets', '03_Email & Customer Service',
    '04_Product & Supplier', '05_Marketing', '06_Legal', '07_Agent Templates'
  ],
  '99_ARCHIVE': [
    '2026', 'Superseded', 'Closed Projects', 'Former Suppliers', 'Former Team & Agents'
  ]
};

function setupINEEDDITBackoffice() {
  const started = new Date();
  const root = DriveApp.getFolderById(INEEDDIT_CONFIG.ROOT_FOLDER_ID);
  const audit = [];
  const folders = {};

  Object.keys(FOLDER_TREE).forEach(function (parentName) {
    const parent = getOrCreateFolder_(root, parentName, audit);
    folders[parentName] = parent;
    FOLDER_TREE[parentName].forEach(function (childName) {
      folders[parentName + '/' + childName] = getOrCreateFolder_(parent, childName, audit);
    });
  });

  createProductWorkspaces_(folders['02_PRODUCTS & SOURCING/02_Product Development'], audit);
  createCoreDocuments_(folders, audit);
  createCoreRegisters_(folders, audit);
  createTemplateLibrary_(folders, audit);

  const logSheet = createOrGetSheet_(
    folders['00_ADMIN & GOVERNANCE/01_Governance'],
    'INEEDDIT — Backoffice Build Log',
    audit
  );
  ensureSheet_(logSheet, 'Build Log', ['Timestamp', 'Version', 'Action', 'Item', 'Status']);
  appendAudit_(logSheet.getSheetByName('Build Log'), audit);

  PropertiesService.getScriptProperties().setProperties({
    INEEDDIT_LAST_RUN: Utilities.formatDate(new Date(), INEEDDIT_CONFIG.TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss"),
    INEEDDIT_VERSION: INEEDDIT_CONFIG.VERSION,
    INEEDDIT_ROOT_FOLDER_ID: INEEDDIT_CONFIG.ROOT_FOLDER_ID
  });

  const summary = {
    status: 'COMPLETE',
    version: INEEDDIT_CONFIG.VERSION,
    root: root.getName(),
    actions: audit.length,
    durationSeconds: Math.round((new Date() - started) / 1000),
    dryRun: INEEDDIT_CONFIG.DRY_RUN
  };
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}

function createProductWorkspaces_(parent, audit) {
  INEEDDIT_PRODUCTS.forEach(function (product) {
    const productFolder = getOrCreateFolder_(parent, product[0] + ' — ' + product[1], audit);
    [
      '01_Brief & Positioning', '02_Supplier Research', '03_Quotes & Costing',
      '04_Samples', '05_QA & Testing', '06_Compliance', '07_Packaging',
      '08_Photography & Content', '09_Shopify Listing', '10_Approved Final'
    ].forEach(function (name) {
      getOrCreateFolder_(productFolder, name, audit);
    });
  });
}

function createCoreDocuments_(folders, audit) {
  createOrGetDoc_(folders['00_ADMIN & GOVERNANCE/01_Governance'], 'INEEDDIT — Backoffice README', [
    ['Title', 'INEEDDIT — Backoffice README'],
    ['Heading1', 'Purpose'],
    ['Body', 'This Drive is the single source of truth for INEEDDIT. Drive stores approved records; execution is tracked in the future task-management layer; financial truth remains in Moneybird.'],
    ['Heading1', 'Operating principles'],
    ['Bullets', ['One owner per deliverable', 'Approved finals only in Approved folders', 'Never overwrite signed or approved records', 'Use YYYY-MM-DD in dated filenames', 'Archive; never delete business records without approval']],
    ['Heading1', 'Brand direction'],
    ['Body', 'Premium, useful and high-conversion. Visual balance: approximately 80% black and white with restrained pink and yellow accents. Slogan: “Thank me later”.'],
    ['Heading1', 'Folder logic'],
    ['Body', '00–11 contain active business functions. 90 contains reusable templates. 99 contains archived or superseded material. Product workspaces follow a fixed ten-stage product lifecycle.'],
    ['Heading1', 'Governance'],
    ['Body', 'Access is granted by role and minimum necessity. Agents receive scoped folders and must place output in 11_TEAM & AGENTS/05_Agent Output pending quality control.']
  ], audit);

  createOrGetDoc_(folders['00_ADMIN & GOVERNANCE/01_Governance'], 'INEEDDIT — Governance Manual', [
    ['Title', 'INEEDDIT — Governance Manual'],
    ['Heading1', 'Decision rights'],
    ['Body', 'Founder approval is required for supplier commitments, product claims, pricing below the approved margin floor, refunds outside policy, legal publication, new integrations and external access.'],
    ['Heading1', 'Sources of truth'],
    ['Bullets', ['Drive: records and assets', 'Shopify: commerce and order operations', 'Moneybird: financial truth', 'Future task system: execution and accountability', 'GitHub: scripts, technical documentation and versioned automation']],
    ['Heading1', 'Document lifecycle'],
    ['Body', 'Draft → Review → Approved → Published/Operational → Superseded → Archived. Signed agreements and compliance evidence are immutable records.'],
    ['Heading1', 'Agent controls'],
    ['Body', 'Every agent requires an owner, defined inputs, permitted tools, output location, review standard, escalation rule and revocation procedure. No agent receives unrestricted access by default.'],
    ['Heading1', 'Review cadence'],
    ['Bullets', ['Weekly: launch, order and incident review', 'Monthly: finance, margin and supplier performance', 'Quarterly: access, compliance, systems and automation audit']]
  ], audit);

  createOrGetDoc_(folders['01_STRATEGY & BRAND/02_Brand Identity'], 'INEEDDIT — Brand Bible', [
    ['Title', 'INEEDDIT — Brand Bible'],
    ['Heading1', 'Brand idea'],
    ['Body', 'INEEDDIT curates products that feel instantly desirable because they solve a visible everyday problem. The customer reaction should be: I need this — thank me later.'],
    ['Heading1', 'Visual system'],
    ['Bullets', ['80% black and white foundation', 'Maximum 10% pink accent', 'Maximum 10% yellow accent', 'Premium product-first photography', 'Clean contrast, generous white space, no visual clutter']],
    ['Heading1', 'Voice'],
    ['Body', 'Direct, clever, confident, concise and useful. Avoid exaggerated medical promises, generic dropshipping language and discount-store aesthetics.'],
    ['Heading1', 'Product presentation'],
    ['Body', 'Launch route: premium unbranded samples first; winning products may move to private label. Product, packaging and photography must feel like one brand system.'],
    ['Heading1', 'Slogan'],
    ['Body', 'Thank me later.']
  ], audit);

  createOrGetDoc_(folders['06_CUSTOMER SERVICE & RETURNS/02_SOPs'], 'INEEDDIT — Customer Service SOP', [
    ['Title', 'INEEDDIT — Customer Service SOP'],
    ['Heading1', 'Service standard'],
    ['Body', 'Acknowledge customer messages within one business day. Resolve at first contact when policy and evidence allow. Escalate safety, legal, payment and repeated-product complaints immediately.'],
    ['Heading1', 'Case flow'],
    ['Numbered', ['Verify customer and order', 'Classify request', 'Check policy and tracking evidence', 'Offer approved resolution', 'Record outcome and reason code', 'Escalate exceptions', 'Close and tag insight']],
    ['Heading1', 'Do not'],
    ['Bullets', ['Promise medical results', 'Admit liability without review', 'Request unnecessary personal data', 'Refund outside policy without approval', 'Delete complaint evidence']]
  ], audit);

  createOrGetDoc_(folders['09_LEGAL & COMPLIANCE/05_Product Compliance'], 'INEEDDIT — Product Compliance Gate', [
    ['Title', 'INEEDDIT — Product Compliance Gate'],
    ['Heading1', 'No product goes live without'],
    ['Checklist', ['Verified supplier identity', 'Product specification and ingredient/material list', 'EU responsible-person/importer position where applicable', 'Required CE or other conformity evidence where applicable', 'Safety and claims review', 'Label and instructions review', 'Returns and incident route', 'Batch/traceability plan', 'Approved sample and QA result']],
    ['Heading1', 'High-risk categories'],
    ['Body', 'Cosmetics, ingestible collagen, SPF products, electrical cleaning devices and LED skincare devices require category-specific legal and technical verification before sale. Supplier marketing statements are not sufficient evidence.']
  ], audit);

  createOrGetDoc_(folders['11_TEAM & AGENTS/04_Agent Instructions'], 'INEEDDIT — Agent Operating Standard', [
    ['Title', 'INEEDDIT — Agent Operating Standard'],
    ['Heading1', 'Required agent definition'],
    ['Checklist', ['Agent name and purpose', 'Human owner', 'Approved systems and permissions', 'Authoritative inputs', 'Exact output folder', 'Quality criteria', 'Escalation triggers', 'Logging and audit method', 'Disable/offboarding procedure']],
    ['Heading1', 'Rules'],
    ['Body', 'Agents may not publish, spend, contract, refund, change bank details, alter legal copy or invite new users without explicit authority. All material output is reviewed before becoming an approved record.']
  ], audit);
}

function createCoreRegisters_(folders, audit) {
  const products = createOrGetSheet_(folders['02_PRODUCTS & SOURCING/01_Product Portfolio'], 'INEEDDIT — Product Master', audit);
  writeTableIfEmpty_(ensureSheet_(products, 'Products', ['Product ID', 'Product', 'Category', 'Stage', 'Owner', 'Supplier', 'Sample Cost', 'Landed Cost', 'Target Retail', 'Gross Margin %', 'Risk Level', 'Compliance Status', 'Next Action', 'Decision']), INEEDDIT_PRODUCTS);
  ensureSheet_(products, 'Stage Definitions', ['Stage', 'Entry Criteria', 'Exit Criteria', 'Approval Owner']);

  const suppliers = createOrGetSheet_(folders['02_PRODUCTS & SOURCING/03_Suppliers'], 'INEEDDIT — Supplier & Sample Tracker', audit);
  ensureSheet_(suppliers, 'Suppliers', ['Supplier ID', 'Company', 'Country', 'Contact', 'Platform', 'Products', 'EU Stock', 'MOQ', 'Lead Time', 'Dropshipping', 'Certifications', 'Due Diligence', 'Risk', 'Status', 'Notes']);
  ensureSheet_(suppliers, 'Samples', ['Sample ID', 'Product ID', 'Supplier ID', 'Ordered', 'Cost', 'Shipping', 'Received', 'QA Score', 'Packaging Score', 'Content Score', 'Decision', 'Evidence Link']);

  const launch = createOrGetSheet_(folders['03_SHOPIFY & ECOMMERCE/01_Store Setup'], 'INEEDDIT — Launch Control', audit);
  ensureSheet_(launch, 'Launch Checklist', ['Workstream', 'Deliverable', 'Owner', 'Status', 'Due Date', 'Dependency', 'Evidence Link', 'Approval']);
  ensureSheet_(launch, 'Shopify Catalog', ['Handle', 'Title', 'Product ID', 'Vendor', 'Category', 'Price', 'Compare-at Price', 'Cost', 'SKU', 'Barcode', 'Inventory Policy', 'Weight', 'Status']);

  const content = createOrGetSheet_(folders['04_MARKETING & CONTENT/02_Content Calendar'], 'INEEDDIT — Content & Campaign Calendar', audit);
  ensureSheet_(content, 'Content Calendar', ['Publish Date', 'Channel', 'Campaign', 'Product ID', 'Format', 'Hook', 'CTA', 'Asset Link', 'Owner', 'Status', 'Result']);
  ensureSheet_(content, 'Creator Pipeline', ['Creator', 'Channel', 'Audience', 'Fit', 'Contact', 'Offer', 'Usage Rights', 'Status', 'Cost', 'Performance']);

  const finance = createOrGetSheet_(folders['08_FINANCE & TAX/02_Pricing & Unit Economics'], 'INEEDDIT — Unit Economics', audit);
  ensureSheet_(finance, 'Unit Economics', ['Product ID', 'Retail ex VAT', 'VAT', 'Supplier Cost', 'Shipping', 'Duty', 'Packaging', 'Payment Fee', 'Returns Allowance', 'CAC', 'Contribution', 'Contribution %', 'Target Met']);
  ensureSheet_(finance, 'Monthly P&L', ['Month', 'Revenue', 'COGS', 'Gross Profit', 'Marketing', 'Payment Fees', 'Returns', 'Software', 'Other Opex', 'Operating Result']);

  const legal = createOrGetSheet_(folders['09_LEGAL & COMPLIANCE/05_Product Compliance'], 'INEEDDIT — Compliance Register', audit);
  ensureSheet_(legal, 'Product Compliance', ['Product ID', 'Category', 'Legal Regime', 'Supplier Evidence', 'Test Reports', 'Label Review', 'Claims Review', 'Responsible Person', 'Risk', 'Approved By', 'Approval Date', 'Expiry/Review', 'Status']);
  ensureSheet_(legal, 'Incidents', ['Incident ID', 'Date', 'Product ID', 'Order', 'Type', 'Severity', 'Immediate Action', 'Escalated To', 'Regulatory Action', 'Outcome', 'Closed']);

  const access = createOrGetSheet_(folders['11_TEAM & AGENTS/02_Access Matrix'], 'INEEDDIT — Access & Agent Register', audit);
  ensureSheet_(access, 'Access Matrix', ['Person/Agent', 'Role', 'System', 'Folder/Scope', 'Permission', 'Owner', 'Granted', 'Review Date', 'Revoked', 'Notes']);
  ensureSheet_(access, 'Agent Registry', ['Agent ID', 'Agent Name', 'Purpose', 'Human Owner', 'Inputs', 'Tools', 'Output Folder', 'Review Rule', 'Escalation', 'Status', 'Last Audit']);

  const decisions = createOrGetSheet_(folders['00_ADMIN & GOVERNANCE/03_Decisions'], 'INEEDDIT — Decision & Risk Register', audit);
  ensureSheet_(decisions, 'Decisions', ['Decision ID', 'Date', 'Topic', 'Decision', 'Reason', 'Owner', 'Impact', 'Review Date', 'Evidence Link']);
  ensureSheet_(decisions, 'Risks', ['Risk ID', 'Category', 'Description', 'Likelihood', 'Impact', 'Rating', 'Mitigation', 'Owner', 'Due Date', 'Status']);

  const kpi = createOrGetSheet_(folders['10_DATA & REPORTING/01_KPI Dashboard'], 'INEEDDIT — KPI Dashboard', audit);
  ensureSheet_(kpi, 'Weekly KPI', ['Week', 'Sessions', 'Conversion %', 'Orders', 'Revenue', 'AOV', 'Gross Margin %', 'CAC', 'ROAS', 'Refund %', 'On-time Delivery %', 'Support Tickets', 'NPS/CSAT']);
}

function createTemplateLibrary_(folders, audit) {
  createOrGetDoc_(folders['90_TEMPLATES/04_Product & Supplier'], 'TEMPLATE — Product Brief', [
    ['Title', 'TEMPLATE — Product Brief'],
    ['Heading1', 'Problem and customer need'], ['Body', '[Describe the concrete problem.]'],
    ['Heading1', 'Product promise'], ['Body', '[Describe the useful outcome without unsupported claims.]'],
    ['Heading1', 'Target customer'], ['Body', '[Audience, context and buying trigger.]'],
    ['Heading1', 'Commercial criteria'], ['Checklist', ['Target retail price', 'Maximum landed cost', 'Minimum margin', 'Acceptable delivery time', 'Returns risk']],
    ['Heading1', 'Compliance gate'], ['Checklist', ['Category identified', 'Required evidence identified', 'Claims reviewed', 'Sample approved']]
  ], audit);

  createOrGetDoc_(folders['90_TEMPLATES/04_Product & Supplier'], 'TEMPLATE — Supplier Due Diligence', [
    ['Title', 'TEMPLATE — Supplier Due Diligence'],
    ['Checklist', ['Legal company name and registration', 'Physical address', 'Beneficial owner/contact', 'Bank beneficiary match', 'Trading history and references', 'Product certificates verified at source', 'Test report laboratory verified', 'Insurance', 'Recall/incident history', 'Dropshipping SLA', 'Data-processing position', 'Contract and governing law']]
  ], audit);

  createOrGetDoc_(folders['90_TEMPLATES/07_Agent Templates'], 'TEMPLATE — Agent Definition', [
    ['Title', 'TEMPLATE — Agent Definition'],
    ['Heading1', 'Identity'], ['Body', 'Name:\nPurpose:\nHuman owner:\nStatus:'],
    ['Heading1', 'Scope'], ['Body', 'Authorized inputs:\nAuthorized tools:\nForbidden actions:\nOutput location:'],
    ['Heading1', 'Controls'], ['Body', 'Quality standard:\nReview method:\nEscalation triggers:\nAudit cadence:\nRevocation procedure:']
  ], audit);

  createOrGetDoc_(folders['90_TEMPLATES/03_Email & Customer Service'], 'TEMPLATE — Customer Service Response', [
    ['Title', 'TEMPLATE — Customer Service Response'],
    ['Body', 'Subject: [Clear outcome]\n\nHi [Name],\n\nThank you for contacting INEEDDIT. [Acknowledge the issue clearly.]\n\n[State verified facts and the resolution.]\n\n[Give the next step and expected timing.]\n\nThank me later,\nINEEDDIT Customer Care']
  ], audit);
}

function getOrCreateFolder_(parent, name, audit) {
  const matches = parent.getFoldersByName(name);
  if (matches.hasNext()) {
    const existing = matches.next();
    audit.push(['REUSE_FOLDER', name, 'EXISTS']);
    return existing;
  }
  if (INEEDDIT_CONFIG.DRY_RUN) {
    audit.push(['CREATE_FOLDER', name, 'DRY_RUN']);
    return parent;
  }
  const created = parent.createFolder(name);
  audit.push(['CREATE_FOLDER', name, 'CREATED']);
  return created;
}

function createOrGetDoc_(folder, name, blocks, audit) {
  const existing = folder.getFilesByName(name);
  if (existing.hasNext()) {
    audit.push(['REUSE_DOC', name, 'EXISTS']);
    return existing.next();
  }
  if (INEEDDIT_CONFIG.DRY_RUN) {
    audit.push(['CREATE_DOC', name, 'DRY_RUN']);
    return null;
  }
  const doc = DocumentApp.create(name);
  const body = doc.getBody();
  body.clear();
  blocks.forEach(function (block) { appendDocBlock_(body, block[0], block[1]); });
  doc.saveAndClose();
  DriveApp.getFileById(doc.getId()).moveTo(folder);
  audit.push(['CREATE_DOC', name, 'CREATED']);
  return DriveApp.getFileById(doc.getId());
}

function appendDocBlock_(body, type, value) {
  if (type === 'Title') body.appendParagraph(value).setHeading(DocumentApp.ParagraphHeading.TITLE);
  else if (type === 'Heading1') body.appendParagraph(value).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  else if (type === 'Heading2') body.appendParagraph(value).setHeading(DocumentApp.ParagraphHeading.HEADING2);
  else if (type === 'Body') body.appendParagraph(value);
  else if (type === 'Bullets') value.forEach(function (x) { body.appendListItem(x).setGlyphType(DocumentApp.GlyphType.BULLET); });
  else if (type === 'Numbered') value.forEach(function (x) { body.appendListItem(x).setGlyphType(DocumentApp.GlyphType.NUMBER); });
  else if (type === 'Checklist') value.forEach(function (x) { body.appendListItem('☐ ' + x).setGlyphType(DocumentApp.GlyphType.BULLET); });
}

function createOrGetSheet_(folder, name, audit) {
  const existing = folder.getFilesByName(name);
  if (existing.hasNext()) {
    const file = existing.next();
    audit.push(['REUSE_SHEET', name, 'EXISTS']);
    return SpreadsheetApp.openById(file.getId());
  }
  if (INEEDDIT_CONFIG.DRY_RUN) {
    audit.push(['CREATE_SHEET', name, 'DRY_RUN']);
    throw new Error('DRY_RUN cannot continue into sheet writes. Set DRY_RUN to false for setup.');
  }
  const sheet = SpreadsheetApp.create(name);
  DriveApp.getFileById(sheet.getId()).moveTo(folder);
  audit.push(['CREATE_SHEET', name, 'CREATED']);
  return sheet;
}

function ensureSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeader_(sheet, headers.length);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 2), headers.length).createFilter();
    sheet.autoResizeColumns(1, headers.length);
  }
  const defaultSheet = spreadsheet.getSheetByName('Sheet1') || spreadsheet.getSheetByName('Blad1');
  if (defaultSheet && defaultSheet.getSheetId() !== sheet.getSheetId() && spreadsheet.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    spreadsheet.deleteSheet(defaultSheet);
  }
  return sheet;
}

function writeTableIfEmpty_(sheet, rows) {
  if (sheet.getLastRow() > 1 || !rows.length) return;
  const width = sheet.getLastColumn();
  const padded = rows.map(function (row) {
    const copy = row.slice(0, width);
    while (copy.length < width) copy.push('');
    return copy;
  });
  sheet.getRange(2, 1, padded.length, width).setValues(padded);
  sheet.autoResizeColumns(1, width);
}

function styleHeader_(sheet, columns) {
  sheet.getRange(1, 1, 1, columns)
    .setBackground('#000000')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}

function appendAudit_(sheet, audit) {
  if (!audit.length) return;
  const timestamp = Utilities.formatDate(new Date(), INEEDDIT_CONFIG.TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
  const rows = audit.map(function (item) {
    return [timestamp, INEEDDIT_CONFIG.VERSION, item[0], item[1], item[2]];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
}

function auditINEEDDITBackoffice() {
  const root = DriveApp.getFolderById(INEEDDIT_CONFIG.ROOT_FOLDER_ID);
  const missing = [];
  Object.keys(FOLDER_TREE).forEach(function (parentName) {
    const parents = root.getFoldersByName(parentName);
    if (!parents.hasNext()) {
      missing.push(parentName);
      return;
    }
    const parent = parents.next();
    FOLDER_TREE[parentName].forEach(function (childName) {
      if (!parent.getFoldersByName(childName).hasNext()) missing.push(parentName + '/' + childName);
    });
  });
  const result = { status: missing.length ? 'INCOMPLETE' : 'PASS', missing: missing };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}
