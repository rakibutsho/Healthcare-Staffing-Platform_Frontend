// components/legal/LegalContent.ts

export type LegalBullet = string;

export type LegalSectionData = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: LegalBullet[];
  subsections?: Array<{
    id: string;
    title: string;
    paragraphs?: string[];
    bullets?: LegalBullet[];
  }>;
};

export type LegalDocumentData = {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSectionData[];
  closing: string[];
};

export const anestheLinkLegalPolicies: LegalDocumentData = {
  title: "AnestheLink – Legal & Policies",
  lastUpdated: "January 2026",
  intro: [
    "These Legal & Policies govern the use of the AnestheLink mobile application and website (collectively, the “Platform”).",
    "AnestheLink connects anesthesia providers with hospitals, surgical centers, and other healthcare facilities for employment and engagement opportunities.",
    "By accessing or using AnestheLink, you agree to these terms.",
  ],
  sections: [
    {
      id: "1",
      title: "Definitions",
      bullets: [
        "“AnestheLink,” “we,” “us,” or “our” means the AnestheLink platform and its operators.",
        "“User” means any person or entity that accesses or uses the Platform.",
        "“Provider” means anesthesia professionals, including but not limited to anesthesiologists, CRNAs, and anesthesiology assistants.",
        "“Facility” means hospitals, surgical centers, clinics, or other healthcare organizations using the Platform.",
        "“Content” means all information, text, messages, documents, credentials, images, or other materials uploaded, posted, or transmitted on the Platform.",
      ],
    },
    {
      id: "2",
      title: "Nature of the Platform",
      paragraphs: [
        "AnestheLink is a technology marketplace that facilitates direct connections between Providers and Facilities. AnestheLink:",
      ],
      bullets: [
        "Is not a staffing agency, employer, recruiter, or placement firm.",
        "Does not employ Providers or act as an agent for Facilities.",
        "Does not guarantee employment, shifts, compensation, or outcomes.",
      ],
      subsections: [
        {
          id: "2-1",
          title: "Additional terms",
          paragraphs: [
            "All employment, contractual, credentialing, payment, tax, and compliance obligations are solely between Providers and Facilities.",
          ],
        },
      ],
    },
    {
      id: "3",
      title: "Eligibility and Accounts",
      subsections: [
        {
          id: "3-1",
          title: "Eligibility",
          paragraphs: ["You must:"],
          bullets: [
            "Be at least 18 years old.",
            "Have the legal authority to enter into binding agreements.",
            "Hold all required licenses, certifications, and credentials applicable to your role (if a Provider).",
          ],
        },
        {
          id: "3-2",
          title: "Account Registration",
          paragraphs: ["Users agree to:"],
          bullets: [
            "Provide accurate and current information.",
            "Maintain the confidentiality of login credentials.",
            "Accept responsibility for all activity under their account.",
          ],
        },
        {
          id: "3-3",
          title: "Enforcement",
          paragraphs: [
            "AnestheLink may suspend or terminate accounts for violations of these Policies.",
          ],
        },
      ],
    },
    {
      id: "4",
      title: "Provider Responsibilities",
      paragraphs: ["Providers are solely responsible for:"],
      bullets: [
        "Maintaining valid licenses, certifications, and professional credentials.",
        "Ensuring compliance with all federal, state, and local laws.",
        "Verifying facility details, job terms, compensation, and expectations.",
        "Performing services in accordance with applicable medical standards.",
      ],
      subsections: [
        {
          id: "4-1",
          title: "No clinical verification guarantee",
          paragraphs: [
            "AnestheLink does not verify clinical competence, medical decision-making, or professional conduct beyond any stated verification features.",
          ],
        },
      ],
    },
    {
      id: "5",
      title: "Facility Responsibilities",
      paragraphs: ["Facilities are solely responsible for:"],
      bullets: [
        "Verifying Provider credentials, licenses, background checks, and compliance.",
        "Ensuring compliance with employment, labor, tax, wage, and healthcare laws.",
        "Defining and honoring agreed-upon compensation and working conditions.",
      ],
    },
    {
      id: "6",
      title: "Credential Vault and Verification",
      paragraphs: [
        "AnestheLink may provide tools for storing and sharing credentials. Users acknowledge that:",
      ],
      bullets: [
        "Uploaded documents remain the responsibility of the User.",
        "AnestheLink does not guarantee accuracy, completeness, or regulatory sufficiency.",
        "Facilities must independently verify credentials before engagement.",
      ],
    },
    {
      id: "7",
      title: "Payments and Subscriptions",
      subsections: [
        {
          id: "7-1",
          title: "Subscription Plans",
          bullets: [
            "Providers may access free or paid subscription tiers.",
            "Facilities may access the Platform under free or paid plans as described in-app.",
          ],
        },
        {
          id: "7-2",
          title: "Billing",
          bullets: [
            "Fees are billed in advance unless otherwise stated.",
            "All payments are non-refundable unless required by law.",
          ],
        },
        {
          id: "7-3",
          title: "Provider/Facility payments",
          paragraphs: [
            "AnestheLink is not responsible for payments between Providers and Facilities.",
          ],
        },
      ],
    },
    {
      id: "8",
      title: "Cancellations, No-Shows, and Platform Integrity",
      paragraphs: ["To maintain trust and reliability:"],
      bullets: [
        "Providers who miss confirmed shifts without proper notice may receive warnings, penalties, or account removal.",
        "Repeated violations may result in permanent suspension.",
      ],
      subsections: [
        {
          id: "8-1",
          title: "Discretion",
          paragraphs: [
            "AnestheLink reserves discretion to enforce integrity policies.",
          ],
        },
      ],
    },
    {
      id: "9",
      title: "Community and Communications",
      paragraphs: [
        "Users may participate in community discussions and messaging. Users agree not to:",
      ],
      bullets: [
        "Post false, misleading, defamatory, or unlawful content.",
        "Harass, threaten, or impersonate others.",
        "Share protected health information (PHI) unlawfully.",
      ],
      subsections: [
        {
          id: "9-1",
          title: "Moderation",
          paragraphs: [
            "AnestheLink may remove Content or suspend accounts at its discretion.",
          ],
        },
      ],
    },
    {
      id: "10",
      title: "Privacy Policy",
      subsections: [
        {
          id: "10-1",
          title: "Information We Collect",
          bullets: [
            "Account information (name, email, role).",
            "Professional details and credentials.",
            "Communications within the Platform.",
            "Usage and device data.",
          ],
        },
        {
          id: "10-2",
          title: "Use of Information",
          paragraphs: ["We use data to:"],
          bullets: [
            "Operate and improve the Platform.",
            "Facilitate connections between Providers and Facilities.",
            "Ensure security, compliance, and support.",
          ],
        },
        {
          id: "10-3",
          title: "Data Sharing",
          paragraphs: ["We may share information:"],
          bullets: [
            "Between Providers and Facilities as initiated by Users.",
            "With service providers supporting Platform operations.",
            "When required by law.",
          ],
        },
        {
          id: "10-4",
          title: "No sale of personal data",
          paragraphs: ["We do not sell personal data."],
        },
        {
          id: "10-5",
          title: "Data Security",
          paragraphs: [
            "We implement reasonable technical and organizational safeguards but cannot guarantee absolute security.",
          ],
        },
      ],
    },
    {
      id: "11",
      title: "HIPAA and Health Information",
      paragraphs: [
        "AnestheLink is not a covered entity or business associate under HIPAA.",
        "Users must not upload or share PHI unless legally permitted.",
        "Users are solely responsible for HIPAA compliance.",
      ],
    },
    {
      id: "12",
      title: "Intellectual Property",
      bullets: [
        "The Platform, branding, and software are owned by AnestheLink.",
        "Users retain ownership of their Content but grant AnestheLink a license to use it for Platform operation.",
      ],
    },
    {
      id: "13",
      title: "Disclaimers",
      paragraphs: [
        "THE PLATFORM IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. ANESTHELINK DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
      ],
    },
    {
      id: "14",
      title: "Limitation of Liability",
      paragraphs: ["To the maximum extent permitted by law:"],
      bullets: [
        "AnestheLink shall not be liable for indirect, incidental, or consequential damages.",
        "Total liability shall not exceed the amount paid to AnestheLink in the prior 12 months.",
      ],
    },
    {
      id: "15",
      title: "Indemnification",
      paragraphs: [
        "Users agree to indemnify and hold harmless AnestheLink from claims arising out of:",
      ],
      bullets: [
        "Use of the Platform.",
        "Breach of these Policies.",
        "Violations of law or third-party rights.",
      ],
    },
    {
      id: "16",
      title: "Termination",
      paragraphs: [
        "AnestheLink may suspend or terminate access at any time for violations or risk to the Platform.",
      ],
    },
    {
      id: "17",
      title: "Governing Law and Dispute Resolution",
      paragraphs: [
        "These Policies are governed by the laws of the United States and the applicable state of operation, without regard to conflict of law principles.",
      ],
    },
    {
      id: "18",
      title: "Changes to These Policies",
      paragraphs: [
        "We may update these Policies from time to time. Continued use of the Platform constitutes acceptance of the updated terms.",
      ],
    },
    {
      id: "19",
      title: "Contact Information",
      paragraphs: ["For questions or legal concerns, contact:"],
      bullets: ["AnestheLink Support"],
    },
  ],
  closing: [
    "By using AnestheLink, you acknowledge that you have read, understood, and agreed to these Legal & Policies.",
  ],
};
