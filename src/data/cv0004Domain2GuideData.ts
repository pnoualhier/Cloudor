import { DomainTask } from './cv0004Domain1GuideData';

export const CV0_004_DOMAIN_2_TASKS: DomainTask[] = [
  {
    id: 'task-2-1',
    title: '2.1 Identity and Access Management (IAM)',
    subtitle: 'Least Privilege, RBAC vs ABAC, MFA, SAML 2.0 Federation, PAM & JIT Access',
    weight: '22% of Domain',
    cardRange: 'Cards 101–120',
    subObjectives: [
      'Enforce Principle of Least Privilege (PoLP) and default implicit deny semantics',
      'Architect static Role-Based (RBAC) vs dynamic Attribute-Based (ABAC) access models',
      'Deploy phishing-resistant hardware MFA (FIDO2) and conditional access rules',
      'Integrate federated enterprise directories using SAML 2.0 assertions and OIDC ID tokens',
      'Implement Privileged Access Management (PAM), JIT temporary elevation, and cross-account roles',
    ],
    keyExamTakeaway:
      'Explicit Deny always overrides any Allow statements. Workloads on VMs or containers must always assume temporary IAM roles instead of using static API access keys. SAML IdP authenticates users, while cloud SP trusts the IdP.',
  },
  {
    id: 'task-2-2',
    title: '2.2 Data Protection, Cryptography & Privacy',
    subtitle: 'Data Classification, Envelope Encryption, KMS vs CloudHSM, BYOK/HYOK & WORM',
    weight: '20% of Domain',
    cardRange: 'Cards 121–140',
    subObjectives: [
      'Classify data assets across Public, Internal, Confidential, and Restricted tiers',
      'Implement envelope encryption using Data Encryption Keys (DEK) and Key Encryption Keys (KEK)',
      'Compare multi-tenant KMS with dedicated single-tenant CloudHSM (FIPS 140-2 Level 3)',
      'Evaluate key sovereignty models: Provider-managed, Customer-managed (BYOK), and on-prem (HYOK)',
      'Enforce object immutability (WORM Compliance Mode) and cryptographic erasure (crypto-shredding)',
    ],
    keyExamTakeaway:
      'Envelope encryption encrypts data with a DEK and encrypts the DEK with a KEK in KMS. Compliance Mode object locks cannot be bypassed even by the root account. Crypto-shredding sanitizes data by permanently destroying its encryption keys.',
  },
  {
    id: 'task-2-3',
    title: '2.3 Cloud Network Security & Segmentation',
    subtitle: 'Stateful SGs, Stateless NACLs, WAF Layer 7, DDoS Mitigation & Zero Trust',
    weight: '22% of Domain',
    cardRange: 'Cards 141–160',
    subObjectives: [
      'Contrast stateful Security Groups (return traffic auto-allowed) with stateless NACLs',
      'Filter Layer 7 HTTP/HTTPS attacks (SQLi, XSS) using Web Application Firewalls (WAF)',
      'Mitigate Layer 3/4 volumetric DDoS via Anycast scrubbers and Layer 7 via WAF rate-limiting',
      'Implement Zero Trust Architecture (ZTA) microsegmentation, mTLS, and PrivateLink endpoints',
      'Analyze VPC Flow Logs Layer 3/4 metadata and establish out-of-band Traffic Mirroring',
    ],
    keyExamTakeaway:
      'Security Groups are stateful; Network ACLs are stateless and require explicit return rules for ephemeral ports (1024-65535). WAF operates at Layer 7 to inspect payload bodies. Zero Trust treats all network perimeters as hostile.',
  },
  {
    id: 'task-2-4',
    title: '2.4 Vulnerability Management & Workload Hardening',
    subtitle: 'CIS Benchmarks, Golden Images, CSPM vs CWPP, SAST/DAST & IMDSv2',
    weight: '20% of Domain',
    cardRange: 'Cards 161–180',
    subObjectives: [
      'Apply CIS Benchmarks for operating system, container, and cloud control plane hardening',
      'Standardize hardened virtual machine baselines via automated Golden Image pipelines',
      'Differentiate CSPM (cloud misconfigurations) from CWPP (workload runtime protection)',
      'Integrate DevSecOps pipeline testing: SAST (source code), DAST (runtime), and SCA (dependencies)',
      'Enforce IMDSv2 session tokens to neutralize Server-Side Request Forgery (SSRF) credential theft',
    ],
    keyExamTakeaway:
      'CSPM audits the cloud control plane for misconfigurations; CWPP protects running containers and VMs. IMDSv2 requires a PUT token header, preventing SSRF credential theft. Golden Images eliminate configuration drift.',
  },
  {
    id: 'task-2-5',
    title: '2.5 Compliance, Governance & Auditing',
    subtitle: 'Global CloudTrail, Immutable Logs, SOC 1/2/3, PCI-DSS, HIPAA, GDPR & Forensics',
    weight: '16% of Domain',
    cardRange: 'Cards 181–200',
    subObjectives: [
      'Enable multi-region cloud audit logging with cryptographic hash integrity and WORM retention',
      'Differentiate SOC 1 (Financial), SOC 2 (Security/Trust under NDA), and SOC 3 (Public Summary)',
      'Reduce PCI-DSS audit scope via Cardholder Data Environment (CDE) segmentation and tokenization',
      'Execute mandatory HIPAA Business Associate Agreements (BAA) and fulfill GDPR 72-hour notifications',
      'Preserve digital forensic chain of custody: memory dumps (volatile RAM) before disk snapshots',
    ],
    keyExamTakeaway:
      'SOC 2 Type II validates operational effectiveness over 6 to 12 months. When handling a compromised VM, volatile RAM must be captured before taking disk snapshots or isolating the network. GDPR requires breach notification within 72 hours.',
  },
];

export const IAM_ACCESS_MODELS_COMPTIA_TABLE = [
  {
    model: 'Role-Based Access Control (RBAC)',
    mechanism: 'Permissions bound to static job roles (e.g., DBA, Cloud Admin)',
    flexibility: 'Medium',
    managementOverhead: 'Low to Medium; simple role assignments',
    bestUseCase: 'Standard organizational hierarchy and functional team permissions.',
  },
  {
    model: 'Attribute-Based Access Control (ABAC)',
    mechanism: 'Permissions evaluated dynamically based on user tags, resource tags, and environment context',
    flexibility: 'Highest',
    managementOverhead: 'Requires structured tagging policies',
    bestUseCase: 'Dynamic environments where access depends on department, security clearance, project tags, and client IP.',
  },
  {
    model: 'Mandatory Access Control (MAC)',
    mechanism: 'Centrally enforced security labels (Top Secret, Secret) compared to user clearance level',
    flexibility: 'Rigid',
    managementOverhead: 'High; controlled strictly by security officers',
    bestUseCase: 'Military, intelligence, and high-security government cloud environments.',
  },
  {
    model: 'Discretionary Access Control (DAC)',
    mechanism: 'Resource owner decides who can access their files (e.g., standard Unix chmod/chown)',
    flexibility: 'High',
    managementOverhead: 'Decentralized; prone to permission leakage',
    bestUseCase: 'End-user file sharing and local desktop filesystems; avoided in cloud infrastructure.',
  },
];

export const ENCRYPTION_KEY_MODELS_COMPTIA_TABLE = [
  {
    model: 'Provider-Managed Keys',
    keyCustodian: 'Cloud Service Provider (CSP)',
    fipsLevel: 'FIPS 140-2 Level 2',
    customerControl: 'Minimal (transparent default encryption)',
    idealFor: 'Baseline compliance with zero operational key management overhead.',
  },
  {
    model: 'Customer-Managed Keys (KMS)',
    keyCustodian: 'Customer within Cloud KMS',
    fipsLevel: 'FIPS 140-2 Level 2 / Level 3',
    customerControl: 'Full control over key policies, rotation schedule, and instant key revocation',
    idealFor: 'Standard enterprise compliance (SOC 2, ISO 27001, PCI-DSS).',
  },
  {
    model: 'Bring Your Own Key (BYOK)',
    keyCustodian: 'Customer generates on-prem, imports to cloud KMS',
    fipsLevel: 'FIPS 140-2 Level 3 (On-prem HSM)',
    customerControl: 'Customer maintains copy of root entropy outside the cloud provider',
    idealFor: 'Regulated organizations required to generate keys on dedicated certified HSMs.',
  },
  {
    model: 'Hold Your Own Key (HYOK / CloudHSM)',
    keyCustodian: 'Customer on-premises HSM or dedicated CloudHSM',
    fipsLevel: 'FIPS 140-2 Level 3 Dedicated Hardware',
    customerControl: 'Maximum; cloud provider has zero cryptographic visibility or access',
    idealFor: 'National security, payment gateway PIN processing, and strict banking data privacy.',
  },
];

export const NETWORK_SECURITY_CONTROLS_COMPTIA_TABLE = [
  {
    control: 'Security Group (SG)',
    osiLayer: 'Layer 4 (Transport)',
    nature: 'Stateful (Return traffic automatically permitted)',
    scope: 'Virtual Network Interface (vNIC / ENI)',
    ruleType: 'Allow rules only (implicit default deny)',
  },
  {
    control: 'Network ACL (NACL)',
    osiLayer: 'Layer 4 (Transport)',
    nature: 'Stateless (Inbound and outbound evaluated independently)',
    scope: 'Subnet boundary',
    ruleType: 'Ordered numbered rules (Allow and explicit Deny)',
  },
  {
    control: 'Web Application Firewall (WAF)',
    osiLayer: 'Layer 7 (Application)',
    nature: 'Stateful & Content-Aware',
    scope: 'Application Load Balancer / CloudFront / API Gateway',
    ruleType: 'OWASP Top 10 rules, rate limiting, SQLi/XSS signature regex',
  },
  {
    control: 'Next-Generation Firewall (NGFW)',
    osiLayer: 'Layers 3 through 7',
    nature: 'Deep Packet Inspection (DPI)',
    scope: 'VPC Transit / Gateway Ingress & Egress',
    ruleType: 'TLS decryption, IPS signatures, URL filtering, C2 beacon detection',
  },
];

export const COMPLIANCE_FRAMEWORKS_COMPTIA_TABLE = [
  {
    framework: 'SOC 2 Type II',
    scope: 'Security, Availability, Confidentiality, Processing Integrity, Privacy',
    targetAudience: 'B2B Customers & enterprise vendor assessment under NDA',
    verification: 'Independent CPA audit proving operational effectiveness over 6–12 months.',
  },
  {
    framework: 'PCI-DSS v4.0',
    scope: 'Cardholder Data Environment (CDE) protecting payment card numbers (PAN)',
    targetAudience: 'Merchants, acquiring banks, and payment service providers',
    verification: 'Quarterly ASV network scans and annual Report on Compliance (RoC).',
  },
  {
    framework: 'HIPAA / HITECH',
    scope: 'Protected Health Information (PHI) confidentiality and integrity',
    targetAudience: 'Healthcare providers, insurers, and cloud Business Associates (BA)',
    verification: 'Mandatory signed Business Associate Agreement (BAA) and administrative audits.',
  },
  {
    framework: 'GDPR',
    scope: 'European citizen Personally Identifiable Information (PII) privacy',
    targetAudience: 'Global organizations processing EU resident personal data',
    verification: '72-hour breach notification, Right to Erasure, and severe statutory fines (up to 4% turnover).',
  },
  {
    framework: 'FedRAMP',
    scope: 'US Federal Government information system cloud authorizations',
    targetAudience: 'Federal agencies and government cloud contractors',
    verification: '3PAO third-party assessment meeting NIST SP 800-53 security controls.',
  },
];
