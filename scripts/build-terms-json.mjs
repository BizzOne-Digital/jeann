import fs from "fs";
import path from "path";

const outPath = path.join("src/lib/content/legal/terms-and-conditions.json");

function section(id, title, paragraphs = [], bullets = []) {
  return { id: String(id), title, paragraphs, bullets, subsections: [] };
}

const sections = [];

sections.push(
  section(
    "1",
    "1. PURPOSE AND APPLICATION",
    [
      'These Standard International Commodity Trade Terms and Conditions ("Terms") are intended to govern transactions involving Finekarts Incorporated ("Finekarts", "Seller", "Buyer", "Trader", "Distributor", "Company", "we", "us" or "our") and its customers, suppliers, manufacturers, producers, exporters, importers, distributors, agents, brokers, mandates and other authorized commercial counterparties ("Counterparty").',
      "These Terms may be incorporated into transaction-specific commercial documentation.",
    ],
    [
      'Full Corporate Offer ("FCO")',
      'Soft Corporate Offer ("SCO")',
      "Commercial quotation",
      'Purchase Order ("PO")',
      'Irrevocable Corporate Purchase Order ("ICPO")',
      'Proforma Invoice ("PI")',
      'Sales and Purchase Agreement ("SPA")',
      "Supply Agreement",
      "Distribution Agreement",
      "Commodity Sales Agreement",
      "Commodity Purchase Agreement",
      "Other transaction-specific commercial documentation",
    ],
  ),
);

sections.push(
  section(
    "2",
    "2. CONTRACT HIERARCHY",
    [
      "Unless expressly agreed otherwise in writing, the transaction shall be interpreted in the following order of precedence:",
      "If there is a conflict between these Terms and an executed transaction-specific agreement, the transaction-specific agreement shall prevail to the extent of the conflict.",
    ],
    [
      "Mandatory applicable law",
      "Executed transaction-specific SPA/Sales or Purchase Agreement",
      "Transaction-specific payment and banking provisions",
      "Incorporated ICC rules",
      "Agreed Incoterms® rule",
      "Proforma Invoice",
      "Accepted ICPO/PO",
      "FCO/quotation",
      "These Standard Terms",
    ],
  ),
);

sections.push(
  section("3", "3. FORMATION OF CONTRACT", [
    "A binding transaction shall arise only when the required contractual documents have been properly executed or otherwise accepted in accordance with the agreed transaction procedure.",
    "A quotation, FCO or other preliminary commercial document does not necessarily constitute acceptance of an order.",
    "Finekarts reserves the right to reject any proposed transaction before execution of a binding contract.",
  ]),
);

sections.push(
  section("4", "4. COUNTERPARTY AUTHORITY", ["Each party represents and warrants that:"], [
    "It is duly organized and legally existing",
    "It has authority to enter into the transaction",
    "Its signatory is authorized",
    "Its documents are genuine",
    "It has the legal capacity to perform its obligations",
    "Its transaction does not violate applicable law",
  ]),
);

sections.push(
  section(
    "5",
    "5. BUYER AND SELLER DUE DILIGENCE",
    [
      "Finekarts may conduct reasonable due diligence before accepting or continuing a transaction.",
      "Due diligence may include verification of:",
    ],
    [
      "Corporate registration",
      "Registered address",
      "Directors and authorized representatives",
      "Beneficial ownership",
      "Tax information",
      "Import/export licences",
      "EORI or equivalent registration",
      "Banking information",
      "Trade references",
      "Sanctions status",
      "Regulatory registrations",
      "Financial capacity",
      "Product authorization",
      "Other commercially or legally relevant information",
    ],
  ),
);

sections.push(
  section(
    "6",
    "6. ZERO-TOLERANCE FRAUD POLICY",
    [
      "Finekarts has a strict zero-tolerance policy concerning fraudulent or unlawful activity.",
      "Finekarts may immediately suspend or terminate a transaction where fraud or material misrepresentation is reasonably suspected, subject to applicable law.",
    ],
    [
      "Fake buyers, sellers, mandates, brokers, suppliers, or manufacturers",
      "Fake or forged documents, ICPOs, LOIs, POs, bank documents, or SWIFT messages",
      "Fake proof of funds or financial instruments",
      "Fraudulent inspection certificates or false product allocations",
      "Identity theft, impersonation, money laundering, sanctions evasion, and trade-based financial crime",
    ],
  ),
);

sections.push(
  section("7", "7. LEGITIMATE BUSINESS ONLY", [
    "Only legitimate commercial buyers, sellers, manufacturers, producers, exporters, importers, distributors, traders, agents, brokers and customers may participate in Finekarts transactions.",
    "Every party must conduct business lawfully and in good faith.",
  ]),
);

sections.push(
  section(
    "8",
    "8. PRODUCT DESCRIPTION",
    [
      "The product shall be identified in the applicable transaction document.",
      "The final executed contract shall control in the event of discrepancies.",
    ],
    [
      "Product name, grade, specification, origin, quantity, packaging, crop/year where applicable",
      "Quality standard, delivery location, Incoterm, price, and other agreed specifications",
    ],
  ),
);

sections.push(
  section("9", "9. PRODUCT SPECIFICATIONS", [
    "Product specifications shall be those expressly stated in the SPA, FCO, PI or other binding transaction document.",
    "Where applicable, specifications may be supported by certificates, laboratory reports, manufacturer specifications, or independent inspection certificates.",
  ]),
);

sections.push(
  section("10", "10. QUANTITY", [
    'The contractual quantity shall be stated in metric tonnes ("MT") unless otherwise agreed.',
    "Permitted quantity tolerance shall be specified in the applicable transaction contract.",
    "Where no tolerance is stated, any applicable industry tolerance shall be determined according to the governing contract and applicable law.",
  ]),
);

sections.push(
  section("11", "11. PRICE", [
    "The transaction price shall be the price stated in the executed transaction agreement.",
    "Prices may be expressed in USD/MT, CAD/MT, EUR/MT, or another agreed currency.",
    "Unless expressly stated otherwise, prices are subject to the agreed quantity, specification, origin, destination, packaging, Incoterm and delivery schedule.",
  ]),
);

sections.push(
  section("12", "12. PRICE VALIDITY", [
    "A quotation or FCO may contain a specified validity period. After expiration, the price is subject to reconfirmation.",
    "Commodity prices may change because of market conditions, currency movements, freight, insurance, energy costs, government measures, export/import restrictions, taxes, duties, tariffs, port costs, and other material market conditions.",
  ]),
);

sections.push(
  section("13", "13. MARKET PRICE ADJUSTMENT", [
    "For long-term or recurring contracts, the parties may agree to a price-adjustment mechanism based upon published commodity indexes, agreed market references, freight indexes, currency benchmarks, producer pricing, government duties, agreed formula pricing, or other objectively identifiable market references.",
    "No unilateral price change shall apply unless permitted by the transaction agreement.",
  ]),
);

sections.push(
  section("14", "14. INCOTERMS®", [
    "The applicable transaction shall specify the agreed Incoterms® 2020 rule and named place or port.",
    "Examples include FOB Port of Loading, CIF Port of Destination, CFR Port of Destination, and DAP Named Place — all Incoterms® 2020.",
    "The applicable Incoterm shall allocate the relevant delivery responsibilities, costs and risk according to the selected rule.",
  ]),
);

sections.push(
  section("15", "15. TITLE", [
    "Transfer of ownership/title shall occur as expressly stated in the transaction contract and subject to applicable law.",
    "Incoterms® alone shall not be interpreted as determining every issue concerning title.",
  ]),
);

sections.push(
  section("16", "16. RISK OF LOSS", [
    "Risk shall transfer according to the applicable Incoterm and transaction-specific contractual provisions, subject to mandatory applicable law.",
  ]),
);

sections.push(
  section(
    "17",
    "17. PAYMENT TERMS",
    ["Payment shall be made according to the transaction agreement.", "Permitted payment methods may include:"],
    [
      "T/T",
      "SWIFT payment",
      "LC at Sight",
      "Irrevocable LC at Sight",
      "Confirmed LC",
      "SBLC as agreed security",
      "Bank Guarantee",
      "Documentary Collection",
      "Other mutually accepted payment arrangements",
    ],
  ),
);

sections.push(
  section(
    "18",
    "18. IRREVOCABLE LETTER OF CREDIT AT SIGHT",
    [
      "Where an LC at Sight is agreed, the Buyer shall arrange an irrevocable documentary credit issued by an acceptable bank.",
      "The LC shall identify the correct beneficiary, state the agreed amount and expiry date, identify the transaction, specify required documents, permit payment against compliant documents, comply with the agreed ICC banking rules, and be acceptable to Finekarts and its receiving bank.",
    ],
  ),
);

sections.push(
  section("19", "19. LC GOVERNING RULES", [
    "Where agreed, the documentary credit may expressly incorporate the applicable ICC rules, such as UCP 600.",
    "The transaction documents must identify the applicable version/rules.",
  ]),
);

sections.push(
  section("20", "20. STRICT DOCUMENTARY COMPLIANCE", [
    "Where payment is made through documentary credit, payment shall be subject to the terms of the documentary credit and the applicable banking rules.",
    "Finekarts shall provide documents required under the agreed LC, subject to the Seller's ability to obtain those documents from the relevant authorities, carriers, inspection companies and other responsible parties.",
  ]),
);

sections.push(
  section("21", "21. SBLC AS TRANSACTION SECURITY", [
    "Where expressly agreed, the Buyer may provide an SBLC as security supporting its payment obligations.",
    "The SBLC shall be issued by an acceptable bank, irrevocable, verifiable bank-to-bank, in the agreed amount, valid for the agreed period, subject to agreed rules, and payable according to its express terms.",
    "An SBLC does not automatically replace payment for delivered goods unless the transaction agreement expressly provides otherwise.",
  ]),
);

sections.push(
  section("22", "22. SBLC BACKUP FOR LONG-TERM CONTRACTS", [
    "For multi-shipment or twelve-month transactions, the parties may agree that an SBLC serves as backup security for the Buyer's contractual payment obligations.",
    "The precise amount, validity, renewal, draw conditions, expiry, issuing bank, advising bank, confirmation, applicable rules, and reduction mechanism must be specified in the transaction agreement.",
  ]),
);

sections.push(
  section("23", "23. BANK GUARANTEE", [
    "Where a BG is required, it shall be issued by an acceptable financial institution and shall contain the exact terms agreed by the parties.",
    "No party may represent that a BG has been issued until authentic bank confirmation has been received through appropriate channels.",
  ]),
);

sections.push(
  section("24", "24. BANK-TO-BANK VERIFICATION", [
    "Financial instruments shall be authenticated through appropriate banking channels.",
    "Screenshots, PDFs, emails or forwarded messages shall not, by themselves, constitute proof that an instrument has been authenticated.",
  ]),
);

sections.push(
  section("25", "25. SWIFT COMMUNICATION", [
    "Where SWIFT communication is required, the applicable SWIFT message type and purpose shall be identified in the transaction documentation.",
    "No party may create, modify, reproduce or falsely represent a SWIFT message.",
  ]),
);

sections.push(
  section("26", "26. BANKING FEES", [
    "Bank charges shall be allocated according to the transaction agreement.",
    "Unless otherwise agreed, each party shall generally bear charges imposed by its own bank.",
    "Correspondent-bank charges shall be allocated according to the agreed payment terms.",
  ]),
);

sections.push(
  section("27", "27. PROOF OF FUNDS", [
    "Where commercially necessary, Finekarts may request reasonable evidence of financial capacity.",
    "Proof of funds shall be verified appropriately.",
    "Finekarts is not required to accept an unverifiable or suspicious proof-of-funds document.",
  ]),
);

sections.push(
  section(
    "28",
    "28. PAYMENT DEFAULT",
    [
      "If a Buyer fails to make a required payment or provide agreed payment security, Finekarts may, subject to the contract and applicable law:",
    ],
    [
      "Suspend shipments or performance",
      "Require cure",
      "Claim contractual interest or documented losses",
      "Cancel affected shipments or terminate the contract",
      "Draw an applicable security instrument where contractually and legally permitted",
      "Exercise other contractual remedies",
    ],
  ),
);

sections.push(
  section(
    "29",
    "29. DELIVERY",
    ["Delivery shall be made according to the agreed:"],
    [
      "Quantity",
      "Shipment schedule",
      "Port",
      "Destination",
      "Incoterm",
      "Carrier",
      "Delivery window",
      "Contractual documents",
    ],
  ),
);

sections.push(
  section(
    "30",
    "30. SHIPPING DOCUMENTS",
    ["Where applicable, documents may include:"],
    [
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading",
      "Certificate of Origin",
      "Certificate of Analysis",
      "Certificate of Conformity",
      "Inspection Certificate",
      "Health Certificate",
      "Phytosanitary Certificate",
      "Fumigation Certificate",
      "Insurance Certificate",
      "Weight Certificate",
      "Export documentation",
      "Other documents specified in the contract",
    ],
  ),
);

sections.push(
  section("31", "31. INSPECTION", [
    "The parties may agree to inspection by an independent inspection company.",
    "The inspection company, location, timing, scope and standard shall be specified in the contract.",
    "Possible inspection providers include SGS, Intertek, Bureau Veritas, Cotecna, Control Union, CCIC or another mutually agreed independent inspector.",
  ]),
);

sections.push(
  section(
    "32",
    "32. INSPECTION AS EVIDENCE",
    [
      "Where expressly agreed, an independent inspection certificate may be used as evidence of quantity, quality, weight, condition, loading, sampling, or other agreed characteristics.",
      "The contract shall specify whether the inspection result is final and binding, subject to applicable law.",
    ],
  ),
);

sections.push(
  section("33", "33. QUALITY CLAIMS", [
    "Claims concerning quality must be submitted within the contractual claim period.",
    "A claim must include reasonable supporting evidence.",
    "Where appropriate, an independent laboratory or inspection company shall determine the relevant issue.",
  ]),
);

sections.push(
  section(
    "34",
    "34. NON-CONFORMING GOODS",
    [
      "Where goods materially fail to meet the agreed specifications, the parties shall apply the remedy specified in the transaction agreement.",
      "Possible remedies may include replacement, reconditioning, price adjustment, credit, rejection, refund, or other agreed remedy.",
    ],
  ),
);

sections.push(
  section("35", "35. SHIPPING DELAYS", [
    "The responsible party shall promptly notify the other party of material shipment delays.",
    "Where delays result from circumstances outside the responsible party's reasonable control, the applicable Force Majeure provisions shall apply.",
  ]),
);

sections.push(
  section("36", "36. DEMURRAGE AND DETENTION", [
    "Demurrage, detention, storage and port charges shall be allocated according to the applicable Incoterm and transaction agreement.",
    "A party shall not knowingly cause avoidable charges through unreasonable delay or failure to provide required documents.",
  ]),
);

sections.push(
  section("37", "37. CUSTOMS", [
    "Each party shall perform the customs responsibilities allocated to it under the applicable Incoterm and contract.",
    "The Buyer shall be responsible for destination-country import requirements unless the contract expressly provides otherwise.",
  ]),
);

sections.push(
  section("38", "38. TAXES, DUTIES AND TARIFFS", [
    "Taxes, duties, tariffs and governmental charges shall be allocated according to the applicable Incoterm and transaction agreement.",
    "Any newly imposed governmental charge materially affecting the transaction may be addressed through the contract's change-in-law provisions.",
  ]),
);

sections.push(
  section(
    "39",
    "39. EXPORT AND IMPORT COMPLIANCE",
    ["Each party shall comply with all applicable:"],
    [
      "Export laws",
      "Import laws",
      "Customs requirements",
      "Sanctions",
      "Embargoes",
      "Trade restrictions",
      "Product regulations",
      "Licensing requirements",
      "Governmental requirements",
    ],
  ),
);

sections.push(
  section("40", "40. SANCTIONS", [
    "No party shall knowingly use the transaction to violate applicable sanctions or trade restrictions.",
    "Finekarts may suspend or terminate a transaction where continued performance could violate applicable law or create material sanctions risk.",
  ]),
);

sections.push(
  section(
    "41",
    "41. ANTI-MONEY LAUNDERING",
    [
      "Each party shall comply with applicable anti-money-laundering and anti-terrorist-financing laws.",
      "Finekarts may request reasonable information concerning beneficial ownership, source of funds, transaction purpose, corporate structure, payment origin, and counterparty identity.",
    ],
  ),
);

sections.push(
  section("42", "42. ANTI-BRIBERY", [
    "No party shall offer, solicit, authorize or accept an unlawful bribe, kickback or improper payment in connection with the transaction.",
    "Each party shall comply with applicable anti-corruption laws.",
  ]),
);

sections.push(
  section("43", "43. BENEFICIAL OWNERSHIP", [
    "Each party represents that its ownership and control information provided during due diligence is accurate to the best of its knowledge.",
    "Material changes shall be disclosed where legally or contractually required.",
  ]),
);

sections.push(
  section(
    "44",
    "44. AGENTS AND BROKERS",
    [
      "Agents and brokers may participate only where they have legitimate authority.",
      "No agent or broker may bind Finekarts without written authority, alter Finekarts' commercial terms without authority, collect funds on behalf of Finekarts without authorization, represent false mandates, misrepresent the product or pricing, or make unauthorized promises.",
    ],
  ),
);

sections.push(
  section("45", "45. COMMISSIONS", [
    "Any commission payable by Finekarts must be expressly approved in writing.",
    "Undisclosed commissions or side agreements shall not bind Finekarts.",
  ]),
);

sections.push(
  section("46", "46. NON-CIRCUMVENTION", [
    "Where required, the parties may execute a separate NCNDA/non-circumvention agreement defining protected parties, protected contacts, protected transactions, duration, permitted disclosures, commission arrangements, and remedies.",
  ]),
);

sections.push(
  section(
    "47",
    "47. CONFIDENTIALITY",
    [
      "Each party shall protect confidential commercial information received from the other party.",
      "Confidential information includes supplier identities, buyer identities, prices, banking information, product sources, commercial strategies, contracts, logistics information, customer lists, trade documents, and other non-public information.",
    ],
  ),
);

sections.push(
  section(
    "48",
    "48. NON-DISCLOSURE",
    [
      "A party shall not disclose confidential information to a third party except with authorization, to professional advisers under confidentiality obligations, to banks and financial institutions where necessary, to insurers, to logistics providers, to inspection companies, to governmental authorities where legally required, or as otherwise permitted by the agreement.",
    ],
  ),
);

sections.push(
  section("49", "49. PRODUCT TRACEABILITY", [
    "Where required, the parties shall maintain reasonable records concerning product origin, batch, lot, shipment and relevant supply-chain information.",
  ]),
);

sections.push(
  section(
    "50",
    "50. FORCE MAJEURE",
    [
      "Neither party shall be liable for delay or non-performance caused by events beyond reasonable control, subject to the contract and applicable law.",
      "Events may include war, armed conflict, civil unrest, terrorism, government action, sanctions, embargo, natural disaster, flood, fire, earthquake, epidemic, pandemic, port closure, vessel casualty, strike, labour disruption, severe weather, infrastructure failure, cyberattack, export prohibition, import prohibition, or other qualifying events beyond reasonable control.",
    ],
  ),
);

sections.push(
  section("51", "51. NOTICE OF FORCE MAJEURE", [
    "The affected party shall provide reasonable notice where practicable describing the event, expected duration, affected obligations, expected impact, and reasonable mitigation measures.",
  ]),
);

sections.push(
  section("52", "52. MITIGATION", [
    "Each party shall use commercially reasonable efforts to mitigate the effects of a force majeure event.",
  ]),
);

sections.push(
  section("53", "53. CHANGE IN LAW", [
    "If a change in applicable law, regulation, tariff, sanction, export restriction or governmental requirement materially affects the transaction, the parties shall consult in good faith regarding an appropriate contractual solution.",
    "If lawful performance becomes impossible or prohibited, the affected obligations may be suspended or terminated according to the contract and applicable law.",
  ]),
);

sections.push(
  section(
    "54",
    "54. BUYER REPRESENTATIONS",
    ["The Buyer represents that:"],
    [
      "It has authority to purchase the goods",
      "It has the financial capacity to perform",
      "Its payment funds are lawful",
      "Its import activity is lawful",
      "Its information is accurate",
      "It will provide required documents",
      "It will comply with sanctions and trade laws",
      "It will not submit fraudulent documents",
      "It will not use the transaction for an unlawful purpose",
    ],
  ),
);

sections.push(
  section(
    "55",
    "55. SELLER REPRESENTATIONS",
    ["The Seller represents that, to the extent applicable to the transaction:"],
    [
      "It has authority to sell the goods",
      "It has lawful control or access to the goods",
      "The goods conform to agreed specifications",
      "Its documents are genuine",
      "It will comply with applicable export laws",
      "It will not knowingly provide fraudulent documents",
      "It will provide agreed shipping documents",
      "It will perform according to the transaction agreement",
    ],
  ),
);

sections.push(
  section(
    "56",
    "56. BUYER DEFAULT",
    ["Buyer default may include:"],
    [
      "Failure to pay",
      "Failure to provide agreed financial security",
      "Failure to provide required import documents",
      "Material misrepresentation",
      "Fraudulent documentation",
      "Unauthorized cancellation",
      "Failure to take delivery where contractually required",
      "Sanctions violation",
      "Material breach of contract",
    ],
  ),
);

sections.push(
  section(
    "57",
    "57. SELLER DEFAULT",
    ["Seller default may include:"],
    [
      "Failure to deliver",
      "Materially non-conforming goods",
      "False product representation",
      "Fraudulent documentation",
      "Failure to provide required contractual documents",
      "Failure to maintain agreed delivery obligations",
      "Material breach of contract",
    ],
  ),
);

sections.push(
  section(
    "58",
    "58. REMEDIES",
    [
      "Subject to applicable law and the transaction agreement, remedies for material breach may include notice to cure, suspension, cancellation, termination, replacement, refund, price adjustment, recovery of documented losses, enforcement of agreed security, and other lawful contractual remedies.",
    ],
  ),
);

sections.push(
  section("59", "59. LIMITATION OF LIABILITY", [
    "To the maximum extent permitted by applicable law, Finekarts shall not be liable for indirect, special, incidental, consequential or punitive damages, including loss of anticipated profits, revenue, business opportunities or goodwill.",
    "Nothing in these Terms excludes liability that cannot legally be excluded.",
  ]),
);

sections.push(
  section("60", "60. INDEMNIFICATION", [
    "To the maximum extent permitted by applicable law, each party shall indemnify the other against losses arising from its fraud, willful misconduct, material breach, violation of applicable law, intellectual-property infringement, unauthorized representation, or other unlawful conduct.",
  ]),
);

sections.push(
  section("61", "61. INSURANCE", [
    "Where insurance is required, responsibility shall be determined by the applicable Incoterm and transaction agreement.",
    "The required insurance coverage, insurer, insured parties and minimum coverage should be specified where necessary.",
  ]),
);

sections.push(
  section(
    "62",
    "62. RISK MANAGEMENT",
    [
      "Each party acknowledges that international commodity trading involves commercial risks, including price volatility, currency risk, freight risk, political risk, regulatory risk, counterparty risk, supply risk, payment risk, and logistics risk.",
      "Each party shall conduct its own commercial due diligence.",
    ],
  ),
);

sections.push(
  section("63", "63. NO FINANCING GUARANTEE", [
    "Finekarts does not guarantee that a Buyer will obtain financing, LC facilities, SBLC facilities, bank guarantees, credit facilities or other financial accommodation.",
  ]),
);

sections.push(
  section("64", "64. NO BANK ACCEPTANCE GUARANTEE", [
    "Finekarts does not guarantee that any particular bank will issue, advise, confirm or accept an LC, SBLC, BG or other banking instrument.",
  ]),
);

sections.push(
  section("65", "65. CYBERSECURITY AND PAYMENT FRAUD", [
    "Each party must verify payment instructions independently.",
    "No party should rely solely on an email or electronic message requesting a change to bank account, beneficiary, SWIFT/BIC, IBAN, payment instructions, or other financial information.",
    "Any change in banking instructions should be independently verified through an authorized communication channel.",
  ]),
);

sections.push(
  section("66", "66. DOCUMENT AUTHENTICITY", [
    "All documents submitted in connection with a transaction must be genuine and accurate.",
    "Submission of forged or materially falsified documents constitutes a material breach and may result in immediate termination and reporting to appropriate authorities where required or permitted by law.",
  ]),
);

sections.push(
  section("67", "67. INTELLECTUAL PROPERTY", [
    "All Finekarts trademarks, logos, documents, commercial templates, photographs, website content and proprietary materials remain the property of Finekarts or their lawful licensors.",
    "No party may reproduce or use them without authorization.",
  ]),
);

sections.push(
  section("68", "68. NO AUTHORITY TO BIND FINEKARTS", [
    "No broker, agent, mandate, intermediary or third party may bind Finekarts unless expressly authorized in writing.",
  ]),
);

sections.push(
  section("69", "69. INDEPENDENT CONTRACTORS", [
    "The parties are independent contractors.",
    "Nothing in the transaction creates a partnership, employment relationship, joint venture or fiduciary relationship unless expressly agreed in writing.",
  ]),
);

sections.push(
  section("70", "70. ASSIGNMENT", [
    "Neither party may assign its rights or obligations without the required contractual consent, except where permitted by applicable law or expressly provided in the agreement.",
  ]),
);

sections.push(
  section("71", "71. SUBCONTRACTING", [
    "Finekarts may use qualified third-party providers, manufacturers, logistics providers, inspection companies, warehouses, carriers and other service providers where commercially necessary, subject to the transaction agreement.",
  ]),
);

sections.push(
  section("72", "72. RECORDS AND AUDIT", [
    "Each party shall maintain commercially and legally required transaction records.",
    "Where reasonable and legally permitted, a party may request documentation necessary to verify contractual compliance.",
  ]),
);

sections.push(
  section("73", "73. ELECTRONIC CONTRACTING", [
    "Electronic documents and electronic signatures may be used where legally valid.",
    "Each party remains responsible for ensuring that its signatory is properly authorized.",
  ]),
);

sections.push(
  section("74", "74. NOTICES", [
    "Contractual notices shall be delivered according to the notice provisions of the transaction-specific agreement.",
    "Email may constitute written notice where the parties expressly agree or applicable law permits.",
  ]),
);

sections.push(
  section("75", "75. GOVERNING LAW", [
    "Unless otherwise expressly stated in the transaction-specific agreement, these Terms shall be governed by the laws of the Province of Ontario and applicable federal laws of Canada.",
    "Mandatory laws applicable to the transaction shall continue to apply.",
  ]),
);

sections.push(
  section("76", "76. CISG", [
    "For international sales, the parties shall expressly state whether the United Nations Convention on Contracts for the International Sale of Goods (CISG) applies or is excluded.",
    "If the parties intend to exclude the CISG, the transaction-specific agreement should expressly state that exclusion.",
  ]),
);

sections.push(
  section("77", "77. DISPUTE RESOLUTION", [
    "The parties shall first attempt to resolve disputes through good-faith commercial negotiations.",
    "If negotiations fail, the dispute shall be resolved according to the dispute-resolution mechanism specified in the transaction-specific agreement.",
  ]),
);

sections.push(
  section("78", "78. ICC ARBITRATION", [
    "Where the parties expressly agree to ICC arbitration, the transaction agreement shall identify ICC Arbitration Rules, seat of arbitration, number of arbitrators, language, governing law, and method of appointment.",
    "ICC arbitration shall not be implied merely by reference to \"ICC.\"",
  ]),
);

sections.push(
  section("79", "79. JURISDICTION", [
    "Where arbitration is not selected, disputes shall be submitted to the courts having appropriate jurisdiction under the governing-law provision, subject to applicable mandatory law.",
  ]),
);

sections.push(
  section("80", "80. LEGAL AND PROFESSIONAL COSTS", [
    "To the extent permitted by applicable law and the transaction agreement, a party may seek recovery of reasonable legal, arbitration and enforcement costs arising from a material breach.",
  ]),
);

sections.push(
  section("81", "81. CONFIDENTIALITY SURVIVAL", [
    "Confidentiality obligations shall survive termination for the period specified in the applicable NDA, NCNDA or transaction agreement.",
    "If no period is specified, confidentiality shall continue for a commercially reasonable period to the extent permitted by applicable law.",
  ]),
);

sections.push(
  section(
    "82",
    "82. SURVIVAL OF OBLIGATIONS",
    [
      "Provisions concerning payment, confidentiality, intellectual property, indemnification, liability, governing law, dispute resolution, compliance, and other provisions intended by their nature to survive shall survive termination.",
    ],
  ),
);

sections.push(
  section("83", "83. SEVERABILITY", [
    "If any provision is found invalid or unenforceable, it shall be modified or severed only to the minimum extent necessary.",
    "The remaining provisions shall remain effective.",
  ]),
);

sections.push(
  section("84", "84. WAIVER", [
    "Failure to enforce a provision does not constitute a waiver of that provision.",
  ]),
);

sections.push(
  section("85", "85. ENTIRE AGREEMENT", [
    "The executed transaction documents constitute the complete agreement between the parties concerning the relevant transaction and supersede prior discussions concerning the same subject matter, except for documents expressly incorporated by reference.",
  ]),
);

sections.push(
  section("86", "86. AMENDMENTS", [
    "Any amendment to the transaction must be made in writing and accepted by authorized representatives of the parties.",
  ]),
);

sections.push(
  section("87", "87. COUNTERPARTS", [
    "A contract may be executed in counterparts, including electronic counterparts, where legally valid.",
    "Each counterpart shall be considered an original.",
  ]),
);

sections.push(
  section("88", "88. LANGUAGE", [
    "The English-language version shall govern unless the transaction agreement expressly provides otherwise or mandatory law requires another language.",
  ]),
);

sections.push(
  section(
    "89",
    "89. COMPLIANCE WITH PRODUCT LAWS",
    [
      "For food, agricultural, meat, edible oils, sugar, rice and other regulated products, each party shall comply with applicable food safety laws, labelling requirements, sanitary requirements, phytosanitary requirements, veterinary requirements, customs laws, import permits, export permits, traceability requirements, and destination-country regulations.",
    ],
  ),
);

sections.push(
  section("90", "90. PRODUCT RECALL", [
    "Where a product safety or regulatory issue arises, the parties shall cooperate in good faith and in accordance with applicable law concerning investigation, notification, containment, recall, replacement, disposal, and regulatory reporting.",
  ]),
);

sections.push(
  section("91", "91. REGULATORY CHANGE", [
    "Where a regulatory change makes the transaction unlawful or materially changes the cost or ability to perform, the affected party shall promptly notify the other party.",
    "The parties shall attempt to establish a lawful commercial solution.",
  ]),
);

sections.push(
  section(
    "92",
    "92. NO FRAUDULENT COMMERCIAL CLAIMS",
    ["No party may falsely represent:"],
    [
      "Product ownership",
      "Product availability",
      "Production capacity",
      "Warehouse inventory",
      "Allocation",
      "Refinery relationship",
      "Manufacturer relationship",
      "Government approval",
      "Bank relationship",
      "Financial capability",
      "Shipping capacity",
      "Authority to transact",
    ],
  ),
);

sections.push(
  section("93", "93. COUNTERPARTY INTEGRITY", [
    "Finekarts may decline any transaction where the counterparty's conduct, documentation, ownership, financing, supply chain or proposed transaction creates an unacceptable legal, regulatory, banking or reputational risk.",
  ]),
);

sections.push(
  section(
    "94",
    "94. SUSPENSION OF PERFORMANCE",
    ["Finekarts may suspend performance where reasonably necessary because of:"],
    [
      "Payment default",
      "Failure to provide security",
      "Compliance concerns",
      "Sanctions concerns",
      "Fraud concerns",
      "Material documentary discrepancies",
      "Regulatory restrictions",
      "Supplier failure",
      "Force majeure",
      "Other material contractual risks",
    ],
  ),
);

sections.push(
  section("95", "95. TERMINATION FOR CAUSE", [
    "Finekarts may terminate the transaction where the Counterparty materially breaches the agreement and fails to cure the breach within the applicable contractual cure period.",
    "Immediate termination may be available where permitted by law for fraud, illegality, sanctions violations, insolvency, material misrepresentation, forged documents, or other serious misconduct.",
  ]),
);

sections.push(
  section("96", "96. TERMINATION FOR ILLEGALITY", [
    "If continued performance would violate applicable law, sanctions, export controls, import controls or governmental restrictions, Finekarts may suspend or terminate the affected obligations without being required to perform an unlawful act.",
  ]),
);

sections.push(
  section("97", "97. NO WAIVER OF RIGHTS", [
    "Any remedy exercised by Finekarts shall be without prejudice to any other rights or remedies available under the contract or applicable law, unless prohibited by law.",
  ]),
);

sections.push(
  section("98", "98. GOOD FAITH", [
    "The parties shall cooperate in good faith to perform their contractual obligations.",
    "Good-faith cooperation does not require Finekarts to waive contractual rights or accept unreasonable commercial risk.",
  ]),
);

sections.push(
  section("99", "99. COMMERCIAL REASONABLENESS", [
    "Where these Terms require a party to act reasonably, that requirement shall be interpreted in the context of international commodity trading, banking, logistics, regulatory compliance and normal commercial practices.",
  ]),
);

sections.push(
  section(
    "100",
    "100. FINAL PROTECTION AND ACCEPTANCE",
    [
      "By signing, accepting, acknowledging or otherwise entering into a transaction incorporating these Terms, the Counterparty acknowledges that it has had the opportunity to review the Terms and obtain independent legal, financial, tax, banking, customs and regulatory advice.",
      "LEGITIMATE BUSINESS ONLY IS PERMITTED.",
      "FAKE BUYERS, FAKE SELLERS, FRAUDULENT TRANSACTIONS, FORGED DOCUMENTS, IMPERSONATION, MONEY LAUNDERING, SANCTIONS EVASION AND OTHER ILLEGAL ACTIVITIES ARE NOT ACCEPTED BY FINEKARTS INCORPORATED.",
      "The parties agree that the specific transaction documents shall identify the applicable commodity, quantity, specification, origin, price, currency, Incoterm® 2020 rule, delivery port/place, payment instrument, LC/SBLC/BG requirements, applicable ICC banking rules, inspection company, inspection standard, shipping documents, governing law, CISG status, arbitration institution, arbitration seat, language, default remedies, and other transaction-specific requirements.",
    ],
  ),
);

sections.push(
  section(
    "schedule-a",
    "TRANSACTION-SPECIFIC SCHEDULE — SCHEDULE A: COMMERCIAL TERMS",
    [
      "Buyer: ______",
      "Seller: Finekarts Incorporated / ______",
      "Commodity: ______",
      "Specification: ______",
      "Origin: ______",
      "Quantity: ______ MT",
      "Tolerance: ______",
      "Packaging: ______",
      "Price: ______ USD/MT",
      "Total Contract Value: ______",
      "Currency: ______",
      "Incoterm®: ______ Incoterms® 2020",
      "Port/Place of Loading: ______",
      "Port/Place of Destination: ______",
      "Shipment Schedule: ______",
    ],
  ),
);

sections.push(
  section(
    "schedule-b",
    "SCHEDULE B — PAYMENT",
    [
      "Payment Method: T/T; Irrevocable LC at Sight; Confirmed LC at Sight; LC + SBLC Backup; SBLC; Bank Guarantee; Documentary Collection; or Other as specified.",
      "Issuing Bank: ______",
      "Advising Bank: ______",
      "Confirming Bank: ______",
      "Applicable ICC Banking Rules: ______",
      "Payment Currency: ______",
      "Payment Timing: ______",
    ],
  ),
);

sections.push(
  section(
    "schedule-c",
    "SCHEDULE C — INSPECTION",
    [
      "Inspection Company: ______",
      "Inspection Location: ______",
      "Inspection Standard: ______",
      "Inspection Timing: ______",
      "Inspection Cost: ______",
      "Finality of Certificate: ______",
    ],
  ),
);

sections.push(
  section(
    "schedule-d",
    "SCHEDULE D — DOCUMENTS",
    [
      "Required documents may include: Commercial Invoice; Packing List; Full Set Bill of Lading; Certificate of Origin; Certificate of Analysis; Certificate of Conformity; Inspection Certificate; Health Certificate; Phytosanitary Certificate; Fumigation Certificate; Insurance Certificate; Weight Certificate; or Other as specified.",
    ],
  ),
);

sections.push(
  section(
    "schedule-e",
    "SCHEDULE E — LEGAL TERMS",
    [
      "Governing Law: ______",
      "CISG: Applies / Excluded / As otherwise specified",
      "Dispute Resolution: ______",
      "Arbitration Institution: ______",
      "Arbitration Rules: ______",
      "Seat of Arbitration: ______",
      "Number of Arbitrators: ______",
      "Language: ______",
    ],
  ),
);

sections.push(
  section(
    "schedule-f",
    "SCHEDULE F — SIGNATURES",
    [
      "FINEKARTS INCORPORATED — Authorized Representative: Name ______, Title ______, Signature ______, Date ______, Company Seal ______",
      "COUNTERPARTY — Legal Company Name: ______, Authorized Representative: Name ______, Title ______, Signature ______, Date ______, Company Seal ______",
      "BY SIGNING OR OTHERWISE VALIDLY ACCEPTING THE TRANSACTION DOCUMENTS, EACH PARTY CONFIRMS ITS AUTHORITY AND AGREEMENT TO THE APPLICABLE TERMS.",
    ],
  ),
);

const doc = {
  company: "FINEKARTS INCORPORATED",
  title: "FCO / SPA TERMS & CONDITIONS",
  effectiveDate: "September 4, 2026",
  lastUpdated: "September 7, 2026",
  intro: [
    "INTERNATIONAL COMMODITY TRADE",
    "INTERNATIONAL SALES • PURCHASE • SUPPLY • DISTRIBUTION • TRADE FINANCE",
    "Company: Finekarts Incorporated",
    "Jurisdiction: Ontario, Canada",
    "Document: Standard International Commodity Trade Terms & Conditions",
  ],
  sections,
  closing: ["END OF STANDARD INTERNATIONAL COMMODITY TRADE TERMS"],
};

fs.writeFileSync(outPath, JSON.stringify(doc, null, 2));
console.log(`Wrote ${sections.length} sections to ${outPath}`);
