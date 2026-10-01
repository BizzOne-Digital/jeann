/** Canonical /verification (Due diligence) marketing copy. */

export const DUE_DILIGENCE_HERO = {
  eyebrow: "Due diligence profile & verification",
  title: "Structured counterparty and trade verification",
  description:
    "Subject company: Finekarts Incorporated — global commodity trading and supply chain distribution (energy, agri-commodities, metals). Evaluation scope covers corporate governance, financial health, supply chain integrity, and sanctions/compliance screening.",
  primaryCta: { href: "#due-diligence-overview", label: "Explore diligence framework →" },
  secondaryCta: { href: "/contact", label: "Contact trade desk" },
} as const;

export const DUE_DILIGENCE_OVERVIEW = {
  title: "Evaluation scope",
  subject: "Finekarts Incorporated",
  industry:
    "Global commodity trading & supply chain distribution (energy, agri-commodities, metals)",
  scope:
    "Corporate governance, financial health, supply chain integrity & sanctions/compliance screening",
} as const;

export const DUE_DILIGENCE_CORPORATE_IDENTITY = {
  n: 1,
  title: "Corporate identity & legal verification",
  rows: [
    {
      parameter: "Legal registered entity",
      status: "Pending verification",
      mechanism:
        "Verification against primary trade registries (e.g., SEC EDGAR, Companies House, regional business registers).",
    },
    {
      parameter: "Ultimate beneficial owners (UBO)",
      status: "Mandatory disclosure",
      mechanism:
        "Identification of natural persons holding ≥ 25% voting rights or equity interests under global AML/CFT standards.",
    },
    {
      parameter: "Corporate structure",
      status: "Active holding / operating subsidiaries",
      mechanism:
        "Cross-examination of parent–subsidiary networks, tax residency status, and shell company risks.",
    },
    {
      parameter: "Sanctions & watchlist status",
      status: "Zero-tolerance screening",
      mechanism:
        "Screening UBOs, executive officers, and corporate entities against OFAC SDN, UN, EU Consolidated, and UK HMT lists.",
    },
  ],
} as const;

export const DUE_DILIGENCE_SUPPLY_CHAIN = {
  n: 2,
  title: "Commercial & supply chain operations",
  flow: [
    "Primary origination / producers",
    "Finekarts Incorporated",
    "Structured trade finance / credit lines",
    "Port / warehousing / freight execution",
    "Off-takers / buyers",
  ],
  riskAreas: [
    {
      title: "Concentration exposure",
      body:
        "Assessing top-tier supplier and off-taker reliance to prevent structural revenue bottlenecks.",
    },
    {
      title: "Traceability & proof of product",
      body:
        "Rigorous audit of Certificate of Analysis (COA), Safety Data Sheets (SDS), and chain-of-custody documentation.",
    },
    {
      title: "Logistics & freight reliability",
      body:
        "Verification of charter party agreements, vessel tracking (AIS), port congestion risks, and cold-chain compliance (where applicable).",
    },
  ],
} as const;

export const DUE_DILIGENCE_RISK_MATRIX = {
  n: 3,
  title: "Comprehensive risk assessment matrix",
  rows: [
    {
      domain: "Financial & liquidity",
      kris: "High debt-to-equity ratio, delayed trade payables, mismatch between deal size and net asset base.",
      mitigation: "Standby Letters of Credit (SBLC), Bank Guarantees (BG), or escrow mechanisms.",
    },
    {
      domain: "Counterparty / credit",
      kris:
        "Adverse media, lack of verifiable track record, high concentration of off-takers in high-risk jurisdictions.",
      mitigation:
        "Obtain trade references, review 3-year audited financials, and purchase independent credit reports (e.g., D&B, Coface).",
    },
    {
      domain: "Regulatory & sanctions",
      kris:
        "Trade routes passing near embargoed zones, dynamically changing ownership structures, transshipment risks.",
      mitigation:
        "Real-time vessel AIS tracking, automated watchlist re-screening, and strict origin certification checks.",
    },
    {
      domain: "Legal & contractual",
      kris:
        "Ambiguous Incoterms, non-standard force majeure clauses, unclear dispute resolution venues.",
      mitigation:
        "Alignment with standard ICC Incoterms (2020), GAFTA/FOSFA/LME standard contracts, and recognized arbitration forums.",
    },
  ],
} as const;

export const DUE_DILIGENCE_DOCUMENTATION = {
  n: 4,
  title: "Key documentation required for final approval",
  items: [
    {
      title: "Know Your Supplier/Customer (KYS/KYC) dossier",
      body:
        "Certificate of incorporation, articles of association, proof of signatory authority, and UBO disclosures.",
    },
    {
      title: "Financial statements",
      body:
        "Audited balance sheets, cash flow statements, and income statements for the last 3 fiscal years.",
    },
    {
      title: "Trade references",
      body:
        "Minimum of three independent trade references from primary banking partners or established commodity buyers/sellers.",
    },
    {
      title: "Compliance & licensing certificates",
      body:
        "Applicable export/import licenses, sector-specific accreditations (e.g., ISO, REACH, FDA, or local energy board registrations).",
    },
  ],
} as const;

export const DUE_DILIGENCE_SWIFT = {
  title: "SWIFT bank message types",
  intro:
    "In international interbank communications via the SWIFT network (FIN messaging), trade finance operations and wire transfers rely on specific MT (Message Type) formats. Below is a breakdown of standard SWIFT message types mapped to Finekarts Incorporated's global commodity trade and banking operations.",
  primaryTitle: "1. Primary SWIFT message types in commodity trade",
  primaryRows: [
    {
      category: "Payments",
      mt: "MT 103",
      name: "Single customer credit transfer",
      function: "Direct wire transfer of funds (T/T) from buyer to seller account.",
    },
    {
      category: "Trade finance",
      mt: "MT 700",
      name: "Issue of a documentary credit",
      function: "Issuance of an irrevocable Letter of Credit (L/C) by buyer's bank.",
    },
    {
      category: "Trade finance",
      mt: "MT 707",
      name: "Amendment to a documentary credit",
      function: "Formal modification to L/C terms (e.g., expiry extension, shipment date).",
    },
    {
      category: "Trade finance",
      mt: "MT 760",
      name: "Guarantee / standby letter of credit",
      function: "Issuance of SBLC, Bank Guarantee (BG), or Performance Bond (PB).",
    },
    {
      category: "Verification",
      mt: "MT 199 / MT 799",
      name: "Free format message",
      function: "Interbank administrative communications and preliminary Proof of Funds (POF).",
    },
    {
      category: "Statements",
      mt: "MT 940",
      name: "Customer statement message",
      function: "Daily electronic end-of-day account statement detailing incoming wires.",
    },
  ],
  profileTitle: "2. Finekarts Incorporated — banking & SWIFT settlement profile",
  profileRows: [
    {
      field: "Beneficiary name",
      detail: "Finekarts Incorporated",
      swift: "Field 59 in MT 103 / MT 700",
    },
    {
      field: "Registered address",
      detail: "Mississauga, Ontario, Canada",
      swift: "Field 59 in MT 103 / MT 700",
    },
    {
      field: "Primary SWIFT / BIC",
      detail: "Bank specific (e.g., ROYCCAT2XXX, TDOMCATTTXXX, NOSCCATTXXX)",
      swift: "Field 57A / Field 51A",
    },
    {
      field: "Payment message",
      detail: "MT 103 (single customer credit transfer)",
      swift: "Direct payment settlement for invoices",
    },
    {
      field: "Trade instrument",
      detail: "MT 700 (irrevocable L/C at sight / usance)",
      swift: "Payment security for bulk commodity shipments",
    },
    {
      field: "Credit security",
      detail: "MT 760 (standby L/C / performance guarantee)",
      swift: "Performance bonds or collateral guarantees",
    },
  ],
  routingTitle: "3. SWIFT message routing in a trade transaction",
  routingSteps: [
    { role: "Buyer / importer", action: "Instructs bank" },
    { role: "Issuing bank", action: "MT 700 (L/C) · MT 103 (wire)" },
    { role: "Finekarts Incorporated", action: "Beneficiary / counterparty" },
    { role: "Advising / beneficiary bank", action: "Advises beneficiary" },
  ],
} as const;

export const DUE_DILIGENCE_CTA = {
  title: "Coordinate diligence on your programme",
  lead:
    "Share counterparty, corridor, commodity, and documentary requirements — our trade desk can align verification scope with your PSA and banking structure.",
  primaryLabel: "Contact the trade desk",
  primaryHref: "/contact",
  secondaryLabel: "Inspection overview",
  secondaryHref: "/inspections",
} as const;
