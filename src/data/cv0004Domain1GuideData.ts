export interface DomainTask {
  id: string;
  title: string;
  subtitle: string;
  weight: string;
  cardRange: string;
  subObjectives: string[];
  keyExamTakeaway: string;
}

export const CV0_004_EXAM_METADATA = {
  code: 'CV0-004',
  title: 'CompTIA Cloud+',
  provider: 'CompTIA',
  passingScore: '750 / 900',
  durationMinutes: 90,
  maxQuestions: 90,
  questionFormats: 'Multiple-choice (single and multiple response), Drag-and-drop, and Performance-Based Questions (PBQs)',
  officialGuideUrl: 'https://www.comptia.org/certifications/cloud',
  domains: [
    { number: 1, name: 'Cloud Architecture', weight: '23%', cardCount: 100, active: true },
    { number: 2, name: 'Security & Compliance', weight: '25%', cardCount: 100, active: true },
    { number: 3, name: 'Deployment & Operations', weight: '28%', cardCount: 100, active: true },
    { number: 4, name: 'Disaster Recovery & Troubleshooting', weight: '24%', cardCount: 0, active: false },
  ],
};

export const CV0_004_DOMAIN_1_TASKS: DomainTask[] = [
  {
    id: 'task-1-1',
    title: '1.1 Cloud Service & Deployment Models',
    subtitle: 'IaaS, PaaS, SaaS, FaaS, CaaS, Public, Private, Hybrid & Multi-Cloud',
    weight: '15% of Domain',
    cardRange: 'Cards 1–15',
    subObjectives: [
      'Evaluate boundary of shared responsibility across IaaS, PaaS, and SaaS',
      'Analyze single-tenant private vs multi-tenant public cloud resource pooling',
      'Architect hybrid cloud interconnects and cloud bursting workloads',
      'Differentiate edge computing, fog computing, and centralized processing',
      'Address noisy neighbor issues and dedicated host regulatory requirements',
    ],
    keyExamTakeaway:
      'Data, user endpoints, and credential identities ALWAYS remain 100% the customer’s responsibility across all cloud models. If a company needs custom OS kernel modifications, select IaaS.',
  },
  {
    id: 'task-1-2',
    title: '1.2 Cloud Storage Technologies & Configurations',
    subtitle: 'Object, Block & File Storage, Tiers, IOPS, Protocols & WORM',
    weight: '15% of Domain',
    cardRange: 'Cards 16–30',
    subObjectives: [
      'Compare Object (REST API flat namespace), Block (raw LUN), and File (NFS/SMB)',
      'Manage lifecycle transitions across Hot, Cool, and Archive cold tiers',
      'Tune IOPS vs Throughput for transactional databases vs sequential streaming',
      'Evaluate SAN fabrics (iSCSI, Fibre Channel, NVMe-oF) and thin provisioning risks',
      'Implement WORM/Object Lock immutability against ransomware and BYOK/HYOK KMS',
    ],
    keyExamTakeaway:
      'Object storage cannot be formatted with an OS filesystem. RAID 10 offers the best write performance for DB transaction logs. Thin provisioning requires proactive capacity monitoring to avoid storage pool crashes.',
  },
  {
    id: 'task-1-3',
    title: '1.3 Compute, Virtualization & Container Architecture',
    subtitle: 'Type 1 Hypervisors, vCPUs, SR-IOV, Affinity, Containers & K8s',
    weight: '18% of Domain',
    cardRange: 'Cards 31–48',
    subObjectives: [
      'Contrast Type 1 bare-metal hypervisors with Type 2 hosted hypervisors',
      'Mitigate CPU oversubscription ready time (%RDY) and memory ballooning',
      'Leverage SR-IOV for high-throughput, low-jitter direct hardware networking',
      'Enforce anti-affinity rules to separate redundant HA pairs across physical hosts',
      'Differentiate containers (shared kernel) from VMs, microVMs, and K8s Pod architectures',
    ],
    keyExamTakeaway:
      'Type 1 hypervisors run directly on bare metal. Anti-affinity rules prevent single physical host failures from downing HA pairs. Containers share the host OS kernel via namespaces and cgroups.',
  },
  {
    id: 'task-1-4',
    title: '1.4 Cloud Networking, Connectivity & Hybrid Design',
    subtitle: 'VPCs, Subnets, Gateways, Dedicated Direct Connect, SDN & L4/L7 LB',
    weight: '18% of Domain',
    cardRange: 'Cards 49–66',
    subObjectives: [
      'Segment VPCs using RFC 1918 CIDR blocks with public and private subnets',
      'Route outbound private subnet traffic through NAT Gateways without inbound access',
      'Compare IPsec VPNs over public internet with Dedicated Direct Connections',
      'Solve non-transitive VPC peering limitations using centralized Transit Gateways',
      'Differentiate Layer 4 (TCP/UDP) from Layer 7 (HTTP/URL path) load balancing and WAFs',
    ],
    keyExamTakeaway:
      'VPC Peering is strictly non-transitive; hub-and-spoke multi-VPC topologies require a Transit Gateway. Dedicated Direct Connect circuits do NOT encrypt traffic by default. WAF operates at Layer 7 to block SQLi/XSS.',
  },
  {
    id: 'task-1-5',
    title: '1.5 High Availability, Resiliency & Disaster Recovery',
    subtitle: 'RTO, RPO, Multi-AZ vs Multi-Region, DR Sites (Cold to Hot) & Snapshots',
    weight: '14% of Domain',
    cardRange: 'Cards 67–80',
    subObjectives: [
      'Calculate RTO (acceptable downtime) and RPO (acceptable data loss)',
      'Design Multi-AZ synchronous redundancy vs Multi-Region asynchronous DR',
      'Compare DR strategies: Backup & Restore, Pilot Light, Warm Standby, and Hot Active-Active',
      'Enforce Application-Consistent snapshots with VSS vs Crash-Consistent snapshots',
      'Prevent split-brain data divergence in clustered nodes using quorum and witness disks',
    ],
    keyExamTakeaway:
      'RTO measures time to restore service; RPO measures data loss. Pilot Light runs only the database live in the DR region; Warm Standby runs a scaled-down version of all tiers 24/7. Split-brain is prevented by quorum (>50%).',
  },
  {
    id: 'task-1-6',
    title: '1.6 Application & Database Design Principles',
    subtitle: 'Decoupled Microservices, Message Queues, SQL vs NoSQL, Caching & CAP',
    weight: '12% of Domain',
    cardRange: 'Cards 81–92',
    subObjectives: [
      'Decouple monolithic services with asynchronous message queues and pub/sub fan-out',
      'Compare ACID relational databases with BASE horizontally scalable NoSQL databases',
      'Select specialized NoSQL models: Key-Value, Document, Columnar, and Graph',
      'Utilize In-Memory Caching (Redis vs Memcached) to reduce database read latencies',
      'Apply CAP Theorem (CP vs AP) and distinguish Read Replicas from Multi-AZ Standby',
    ],
    keyExamTakeaway:
      'Message queues act as elastic buffers between fast producers and slow consumers. Multi-AZ Standby is for disaster recovery; Read Replicas are for offloading read queries. Graph databases excel at relationship modeling.',
  },
  {
    id: 'task-1-7',
    title: '1.7 Cloud Economics, Sizing & Optimization',
    subtitle: 'CapEx vs OpEx, Purchasing Options (Reserved, Spot), Autoscaling & Tagging',
    weight: '8% of Domain',
    cardRange: 'Cards 93–100',
    subObjectives: [
      'Transition financial budgeting from upfront CapEx to consumption-based OpEx',
      'Leverage Reserved Instances for baseline steady state and Spot for fault-tolerant batch',
      'Right-size compute and storage by auditing historical CPU, memory, and IOPS metrics',
      'Configure reactive Target Tracking vs proactive Scheduled auto-scaling policies',
      'Eliminate orphaned cloud waste (unattached block volumes, idle elastic IPs) and egress fees',
    ],
    keyExamTakeaway:
      'Never run stateful production databases on Spot instances. Right-size resources before purchasing 1-year or 3-year commitments. Terminating a VM does not automatically purge unattached block storage volumes.',
  },
];

export const SHARED_RESPONSIBILITY_COMPTIA_TABLE = [
  {
    layer: 'Data & Access Credentials',
    onPremise: 'Customer',
    iaas: 'Customer',
    paas: 'Customer',
    saas: 'Customer',
  },
  {
    layer: 'Application Software',
    onPremise: 'Customer',
    iaas: 'Customer',
    paas: 'Customer',
    saas: 'Cloud Provider',
  },
  {
    layer: 'Operating System & Runtime',
    onPremise: 'Customer',
    iaas: 'Customer',
    paas: 'Cloud Provider',
    saas: 'Cloud Provider',
  },
  {
    layer: 'Virtualization & Hypervisor',
    onPremise: 'Customer',
    iaas: 'Cloud Provider',
    paas: 'Cloud Provider',
    saas: 'Cloud Provider',
  },
  {
    layer: 'Physical Hardware & Network',
    onPremise: 'Customer',
    iaas: 'Cloud Provider',
    paas: 'Cloud Provider',
    saas: 'Cloud Provider',
  },
  {
    layer: 'Physical Datacenter Security',
    onPremise: 'Customer',
    iaas: 'Cloud Provider',
    paas: 'Cloud Provider',
    saas: 'Cloud Provider',
  },
];

export const DR_STRATEGIES_COMPTIA_TABLE = [
  {
    strategy: 'Backup & Restore (Cold Site)',
    cost: 'Lowest ($)',
    rto: 'Hours to Days',
    rpo: 'Hours to 24 Hours',
    characteristics: 'No running compute in DR region; data restored from cold backup archives on demand.',
  },
  {
    strategy: 'Pilot Light',
    cost: 'Low ($$)',
    rto: '10s of Minutes to Hours',
    rpo: 'Minutes (Live DB sync)',
    characteristics: 'Only core critical database runs continuously; app/web tiers provisioned via IaC during disaster.',
  },
  {
    strategy: 'Warm Standby',
    cost: 'Medium ($$$)',
    rto: 'Minutes',
    rpo: 'Near Real-time',
    characteristics: 'Scaled-down, fully functional copy of all tiers runs 24/7; scaled out during disaster.',
  },
  {
    strategy: 'Multi-Site Active-Active (Hot Site)',
    cost: 'Highest ($$$$)',
    rto: 'Near Zero (Instant)',
    rpo: 'Near Zero',
    characteristics: 'Full production capacity active in multiple regions simultaneously; traffic split by global load balancer.',
  },
];

export const STORAGE_TYPES_COMPTIA_TABLE = [
  {
    type: 'Block Storage',
    namespace: 'LUNs / Volumes',
    protocol: 'iSCSI, FC, NVMe-oF',
    latency: 'Ultra-low (<1-5 ms)',
    idealUseCases: 'Boot volumes, OS drives, transactional databases (MS SQL, Oracle, PostgreSQL).',
  },
  {
    type: 'File Storage',
    namespace: 'Hierarchical Trees',
    protocol: 'NFS, SMB / CIFS',
    latency: 'Low (5-15 ms)',
    idealUseCases: 'Shared folders, legacy apps, multi-pod Kubernetes shared volumes (ReadWriteMany).',
  },
  {
    type: 'Object Storage',
    namespace: 'Flat Buckets / Blobs',
    protocol: 'HTTP/HTTPS REST API',
    latency: 'Moderate (10-100 ms)',
    idealUseCases: 'Unstructured media, static web hosting, backup archives, big data data lakes.',
  },
];
