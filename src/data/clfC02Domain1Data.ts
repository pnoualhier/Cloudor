export interface Domain1TaskStatement {
  id: string;
  code: string;
  title: string;
  shortDesc: string;
  weight: string;
  officialDocUrl: string;
  subtopics: Array<{
    title: string;
    badge: string;
    summary: string;
    keyPoints: string[];
    examTrap?: string;
  }>;
}

export const CLF_C02_DOMAIN_1_METADATA = {
  domainNumber: 1,
  code: 'CLF-C02 Domain 1',
  name: 'Cloud Concepts',
  examWeight: '24%',
  officialUrl: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain1.html',
  description:
    'Domain 1 covers foundational knowledge of the AWS Cloud, including cloud value proposition, the AWS Well-Architected Framework, migration frameworks (AWS CAF and the 7 Rs), and fundamental concepts of cloud economics and financial management.',
  targetAudience: 'Candidates preparing for AWS Certified Cloud Practitioner (CLF-C02)',
  keyMetrics: {
    questionShare: '~15 to 16 out of 65 questions',
    focusAreas: '4 Task Statements (1.1 to 1.4)',
    pillarCount: '6 Well-Architected Pillars',
    migrationStrategies: '7 Rs of Migration',
  },
};

export const CLF_C02_DOMAIN_1_TASKS: Domain1TaskStatement[] = [
  {
    id: 'task-1-1',
    code: 'Task Statement 1.1',
    title: 'Define the benefits of the AWS Cloud',
    shortDesc: 'Understand the value proposition of AWS cloud computing, the 6 core advantages, service models, and global agility.',
    weight: '~7% of total exam',
    officialDocUrl: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html',
    subtopics: [
      {
        title: 'Six Advantages of Cloud Computing',
        badge: 'Core Curriculum',
        summary:
          'AWS formally defines six key advantages of migrating from traditional on-premises infrastructure to the AWS Cloud.',
        keyPoints: [
          '1. Trade fixed expense for variable expense: Replace heavy upfront capital expenditure (CapEx) on servers and facilities with flexible operational expenditure (OpEx).',
          '2. Benefit from massive economies of scale: Higher cloud adoption translates into AWS achieving massive purchasing power, resulting in frequent price reductions for customers.',
          '3. Stop guessing capacity: Scale dynamically up or down as demand shifts, eliminating idle over-provisioned servers or outage-inducing shortages.',
          '4. Increase speed and agility: Developers can spin up new compute, storage, and database instances in minutes rather than waiting months for hardware procurement.',
          '5. Stop spending money running and maintaining data centers: Shift focus and budget from "undifferentiated heavy lifting" (power, cooling, cabling, racking) to business innovation.',
          '6. Go global in minutes: Deploy applications worldwide across multiple AWS Regions with minimal latency for end users.',
        ],
        examTrap:
          'Exam questions frequently give a scenario where a company spent months procuring servers that sat idle 80% of the year. The primary cloud benefit resolving this is "Stop guessing capacity" or "Trading fixed expense for variable expense".',
      },
      {
        title: 'Cloud Service Models: IaaS vs. PaaS vs. SaaS',
        badge: 'Service Categorization',
        summary:
          'Cloud computing services are categorized into three primary service models based on customer management boundaries.',
        keyPoints: [
          'Infrastructure as a Service (IaaS): Provides basic building blocks for cloud IT. Customer manages the OS, software runtime, and data, while AWS manages the physical servers, virtualization, and networking (e.g. Amazon EC2, Amazon VPC, Amazon EBS).',
          'Platform as a Service (PaaS): Removes the need for organizations to manage the underlying infrastructure (hardware and OS). Customer focuses solely on deploying code and data (e.g. AWS Elastic Beanstalk, Amazon RDS).',
          'Software as a Service (SaaS): Complete product managed and run by the service provider. End users interact with the application via web browser or client interface (e.g. AWS WorkSpaces, Amazon QuickSight, Amazon Chime).',
        ],
        examTrap:
          'Remember: Amazon EC2 is IaaS. Elastic Beanstalk is PaaS. Amazon QuickSight is SaaS. Moving from IaaS to SaaS reduces administrative burden.',
      },
      {
        title: 'Cloud Deployment Models',
        badge: 'Deployment Strategies',
        summary:
          'Organizations deploy architectures across Public, Private, or Hybrid cloud models depending on compliance and operational requirements.',
        keyPoints: [
          'Cloud / Public Cloud: Fully deployed in the cloud; all application components run in AWS with no dependencies on on-premises data centers.',
          'Hybrid Cloud: Connects existing on-premises infrastructure or private clouds with AWS resources via AWS Direct Connect or AWS Site-to-Site VPN.',
          'On-Premises / Private Cloud: Infrastructure deployed within corporate data centers using virtualization technologies or AWS Outposts for local data residency.',
        ],
        examTrap:
          'If a question states an organization must keep highly sensitive financial databases on-premises for legal compliance while deploying customer-facing web apps in AWS, the model is Hybrid Cloud.',
      },
      {
        title: 'Elasticity, Scalability, and High Availability',
        badge: 'Architectural Capabilities',
        summary:
          'Foundational characteristics defining cloud resilience and performance flexibility.',
        keyPoints: [
          'Scalability: Ability to handle increased load by adding compute/storage capacity (vertically or horizontally).',
          'Elasticity: Dynamic, automated scaling that adds resources during traffic spikes and removes them when load subsides (e.g. EC2 Auto Scaling).',
          'High Availability (HA): Ensuring systems remain operational and accessible with minimal downtime by deploying across multiple Availability Zones (Multi-AZ).',
          'Fault Tolerance: The ability of a system to continue operating without interruption even if one or more subcomponents completely fail.',
        ],
      },
    ],
  },
  {
    id: 'task-1-2',
    code: 'Task Statement 1.2',
    title: 'Identify design principles of the AWS Cloud',
    shortDesc: 'Master the 6 Pillars of the AWS Well-Architected Framework and architectural best practices.',
    weight: '~6% of total exam',
    officialDocUrl: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html',
    subtopics: [
      {
        title: 'The AWS Well-Architected Framework: 6 Pillars',
        badge: 'Framework Core',
        summary:
          'The Well-Architected Framework guides cloud architects in building secure, high-performing, resilient, and efficient cloud infrastructure.',
        keyPoints: [
          'Pillar 1 - Operational Excellence: Running workloads effectively, understanding operations, and continuously improving processes. Key practices: perform operations as code, make small/reversible changes, anticipate failure, learn from operational failures.',
          'Pillar 2 - Security: Protecting data, systems, and assets via zero-trust architecture. Key practices: implement strong identity foundation (IAM least privilege), maintain traceability (CloudTrail), apply security at all layers, protect data in transit & at rest.',
          'Pillar 3 - Reliability: Ensuring a workload performs its intended function correctly and consistently. Key practices: automatically recover from failure, test recovery procedures, scale horizontally, stop guessing capacity.',
          'Pillar 4 - Performance Efficiency: Using computing resources efficiently to meet requirements. Key practices: democratize advanced technologies, go global in minutes, use serverless architectures, experiment frequently.',
          'Pillar 5 - Cost Optimization: Avoiding unnecessary costs and maximizing ROI. Key practices: implement cloud financial management, adopt a consumption model, measure overall efficiency, stop spending money on undifferentiated heavy lifting.',
          'Pillar 6 - Sustainability: Minimizing the environmental impacts of running cloud workloads. Key practices: understand your impact, establish sustainability goals, maximize utilization, anticipate and adopt new efficient hardware (e.g. AWS Graviton).',
        ],
        examTrap:
          'Sustainability was added as the 6th pillar. Exam questions often ask which pillar is supported by switching from x86 EC2 instances to energy-efficient ARM-based AWS Graviton processors (Sustainability and Cost Optimization).',
      },
      {
        title: 'Core Architectural Tenets',
        badge: 'System Design',
        summary:
          'Fundamental principles every AWS cloud architect must follow when designing cloud systems.',
        keyPoints: [
          'Decouple components: Use asynchronous messaging (Amazon SQS, Amazon SNS, EventBridge) to ensure failure in one component does not cascade to others.',
          'Design for failure: Always assume hardware, networks, and disks will fail. Deploy across multiple Availability Zones with automated health checks and failovers.',
          'Implement elasticity: Automate provisioning and de-provisioning based on demand metrics to prevent paying for idle servers.',
          'Think parallel: Distribute requests across pools of smaller worker instances rather than relying on a single monolithic server.',
          'Managed services over IaaS: Favor serverless and managed services (Amazon S3, DynamoDB, Lambda, RDS) to reduce administrative and patching overhead.',
        ],
      },
    ],
  },
  {
    id: 'task-1-3',
    code: 'Task Statement 1.3',
    title: 'Understand the benefits of and strategies for migration to the AWS Cloud',
    shortDesc: 'Understand the AWS Cloud Adoption Framework (AWS CAF), the 7 Rs of cloud migration, and migration acceleration tools.',
    weight: '~6% of total exam',
    officialDocUrl: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html',
    subtopics: [
      {
        title: 'AWS Cloud Adoption Framework (AWS CAF)',
        badge: 'Transformation Framework',
        summary:
          'AWS CAF organizes cloud migration and organizational transformation guidance into six distinct perspectives.',
        keyPoints: [
          'Business Perspectives (Focus on business strategy & organizational alignment):',
          '• Business Perspective: Ensures cloud investments align with business strategies, ROI goals, and digital revenue models.',
          '• People Perspective: Focuses on skills development, staffing, training, and organizational change management to cultivate cloud fluency.',
          '• Governance Perspective: Coordinates cloud initiatives with portfolio management, risk evaluation, and program prioritization.',
          'Technical Perspectives (Focus on technical architecture & operational execution):',
          '• Platform Perspective: Guides cloud architecture, infrastructure as code, CI/CD pipelines, and cloud environment provisioning.',
          '• Security Perspective: Implements identity and access management (IAM), data protection, compliance auditing, and incident response.',
          '• Operations Perspective: Manages operational health, observability, incident response, and service level agreements (SLAs).',
        ],
        examTrap:
          'Exam questions frequently ask which perspective evaluates employee cloud skills or organizational change management (Answer: People Perspective).',
      },
      {
        title: 'The 7 Rs Migration Strategies',
        badge: 'Migration Decision Matrix',
        summary:
          'The 7 Rs define the migration pattern for every application moving to AWS.',
        keyPoints: [
          '1. Rehost ("Lift and Shift"): Move applications to AWS without making any changes (e.g. migrating physical servers to EC2 with AWS MGN). Fastest with lowest risk.',
          '2. Relocate: Move hypervisor-level workloads to AWS without purchasing new hardware or rewriting apps (e.g. VMware Cloud on AWS).',
          '3. Replatform ("Lift, Tinker, and Shift"): Make targeted cloud optimizations without changing core code (e.g. moving a self-managed Oracle database to Amazon RDS).',
          '4. Refactor / Re-architect: Re-imagine application architecture to be cloud-native (e.g. breaking monoliths into microservices using Lambda and DynamoDB).',
          '5. Repurchase ("Drop and Shop"): Discard existing legacy software and replace it with a third-party SaaS solution (e.g. switching on-prem CRM to Salesforce).',
          '6. Retain: Keep applications on-premises because they were recently upgraded, have heavy regulatory constraints, or are pending retirement.',
          '7. Retire: Identify and decommission redundant or unneeded applications and servers (often reduces portfolio footprint by 10–20%).',
        ],
      },
      {
        title: 'AWS Migration Tools & The Snow Family',
        badge: 'Data Transfer & Migration',
        summary:
          'Purpose-built services to accelerate and automate the transfer of servers, databases, and massive datasets.',
        keyPoints: [
          'AWS Application Migration Service (AWS MGN): The primary automated lift-and-shift service that continuously replicates source servers into AWS EC2 with minimal cutover downtime.',
          'AWS Database Migration Service (AWS DMS): Migrates relational and NoSQL databases to AWS with source databases remaining fully online during replication.',
          'AWS Schema Conversion Tool (AWS SCT): Converts database schemas between different engines (e.g. Oracle to PostgreSQL) for heterogeneous migrations.',
          'AWS DataSync: Online high-speed automated data transfer service between on-prem storage and S3, EFS, or FSx.',
          'AWS Snowcone: 8 TB / 14 TB edge data transfer and computing device; lightweight and portable.',
          'AWS Snowball Edge: 80 TB / 210 TB ruggedized physical storage device for petabyte-scale offline data transfer.',
          'AWS Snowmobile: Ruggedized 45-foot shipping container truck capable of moving up to 100 PB for exabyte-scale data migration.',
        ],
      },
    ],
  },
  {
    id: 'task-1-4',
    code: 'Task Statement 1.4',
    title: 'Understand concepts of cloud economics',
    shortDesc: 'Examine the financial advantages of cloud computing, CapEx vs OpEx, TCO, rightsizing, and cost governance tools.',
    weight: '~5% of total exam',
    officialDocUrl: 'https://docs.aws.amazon.com/whitepapers/latest/cost-management-overview/welcome.html',
    subtopics: [
      {
        title: 'CapEx vs. OpEx & The Cloud Financial Shift',
        badge: 'Financial Economics',
        summary:
          'Cloud economics replaces heavy, risky upfront capital outlays with flexible, pay-as-you-go operational expenses.',
        keyPoints: [
          'Capital Expenditures (CapEx): Large upfront financial commitments to physical assets (servers, storage arrays, data center leases, backup generators, HVAC cooling). Depreciates over 3–5 years.',
          'Operational Expenditures (OpEx): Recurring day-to-day operating costs. In AWS, you pay only for the compute hours, storage gigabytes, and data transfer consumed.',
          'Total Cost of Ownership (TCO): TCO is NOT just the purchase price of servers; on-premises TCO includes direct costs (hardware, power, cooling, network transit, OS licensing) AND indirect costs (real estate, facility maintenance, admin salaries, downtime losses).',
          'Economies of Scale: AWS aggregates hundreds of thousands of customer workloads, driving down wholesale infrastructure costs and passing savings to customers through price reductions.',
        ],
      },
      {
        title: 'Rightsizing & Cost Optimization Practices',
        badge: 'Governance & Efficiency',
        summary:
          'Techniques to ensure infrastructure capacity closely matches real workload demand without over-spending.',
        keyPoints: [
          'Rightsizing: The continuous process of matching instance types and sizes to workload performance requirements, eliminating over-provisioned resources.',
          'AWS Compute Optimizer: Machine learning service that analyzes historical CloudWatch utilization metrics to recommend optimal EC2 instance types, EBS volumes, and Lambda memory sizes.',
          'Licensing Strategies: Choose between "License Included" AMIs (pay hourly for Windows/SQL licenses) and Bring Your Own License (BYOL) on AWS Dedicated Hosts to reduce licensing costs.',
          'Tagging Policies: Cost Allocation Tags categorize cloud spending by department, project, or environment for internal chargeback reporting.',
        ],
      },
      {
        title: 'AWS Cost Planning & Governance Services',
        badge: 'Cost Management Tools',
        summary:
          'Essential AWS tools used to forecast, track, and budget cloud expenditure.',
        keyPoints: [
          'AWS Pricing Calculator: Web-based planning tool to estimate costs prior to deploying workloads on AWS.',
          'AWS Cost Explorer: Interactive visualization tool to view historical spending trends, breakdown costs by service/tag, and forecast future 12-month spend.',
          'AWS Budgets: Set custom monthly cost and usage budgets; triggers automated notifications or actions (SNS, email, IAM policy) when actual or forecasted spend exceeds thresholds.',
          'CloudWatch Billing Alarms: Simple alarms monitoring estimated total charges that send email alerts via SNS.',
          'AWS Organizations Consolidated Billing: Combines all member account invoices into one unified bill paid by the management account, automatically aggregating usage to qualify for higher volume discount tiers.',
        ],
        examTrap:
          'Pricing Calculator is for PRE-DEPLOYMENT estimates. Cost Explorer is for POST-DEPLOYMENT historical analysis and forecasting.',
      },
    ],
  },
];

export const WELL_ARCHITECTED_PILLARS = [
  {
    name: 'Operational Excellence',
    icon: 'tune',
    color: '#8083ff',
    bg: 'bg-[#8083ff]/10',
    border: 'border-[#8083ff]/30',
    focus: 'Operations as code, frequent small changes, anticipating failure',
    examKeywords: ['Infrastructure as Code', 'CloudFormation', 'Runbooks', 'Continuous improvement'],
  },
  {
    name: 'Security',
    icon: 'shield_lock',
    color: '#4cd7f6',
    bg: 'bg-[#4cd7f6]/10',
    border: 'border-[#4cd7f6]/30',
    focus: 'Identity management, least privilege, traceability, encryption at rest & in transit',
    examKeywords: ['IAM Roles', 'KMS Encryption', 'CloudTrail audits', 'MFA', 'Zero Trust'],
  },
  {
    name: 'Reliability',
    icon: 'autorenew',
    color: '#5eead4',
    bg: 'bg-[#5eead4]/10',
    border: 'border-[#5eead4]/30',
    focus: 'Automatic recovery from failure, Multi-AZ deployments, horizontal scaling',
    examKeywords: ['Auto Scaling', 'Multi-AZ RDS', 'ELB health checks', 'Design for failure'],
  },
  {
    name: 'Performance Efficiency',
    icon: 'speed',
    color: '#ffb95f',
    bg: 'bg-[#ffb95f]/10',
    border: 'border-[#ffb95f]/30',
    focus: 'Serverless architectures, caching, mechanical sympathy, global reach',
    examKeywords: ['Lambda', 'CloudFront', 'ElastiCache', 'DynamoDB latency'],
  },
  {
    name: 'Cost Optimization',
    icon: 'savings',
    color: '#34d399',
    bg: 'bg-[#34d399]/10',
    border: 'border-[#34d399]/30',
    focus: 'Pay for what you use, rightsizing, Savings Plans, stopping idle resources',
    examKeywords: ['Spot Instances', 'Compute Optimizer', 'Budgets', 'Consolidated billing'],
  },
  {
    name: 'Sustainability',
    icon: 'eco',
    color: '#10b981',
    bg: 'bg-[#10b981]/10',
    border: 'border-[#10b981]/30',
    focus: 'Reducing carbon footprint, maximizing hardware utilization, adopting ARM Graviton',
    examKeywords: ['AWS Graviton', 'Managed services', 'Decommission idle workloads'],
  },
];

export const MIGRATION_7_RS = [
  {
    name: 'Rehost ("Lift and Shift")',
    strategy: 'No architectural changes; move virtual/physical servers directly to EC2.',
    effort: 'Low',
    time: 'Fastest',
    tool: 'AWS Application Migration Service (AWS MGN)',
  },
  {
    name: 'Relocate',
    strategy: 'Hypervisor-level migration without rewriting or modifying OS.',
    effort: 'Low',
    time: 'Very Fast',
    tool: 'VMware Cloud on AWS',
  },
  {
    name: 'Replatform ("Lift, Tinker, Shift")',
    strategy: 'Targeted cloud optimization without changing core app code (e.g. self-hosted DB to RDS).',
    effort: 'Medium',
    time: 'Moderate',
    tool: 'Amazon RDS, AWS Elastic Beanstalk',
  },
  {
    name: 'Refactor / Re-architect',
    strategy: 'Full cloud-native redesign using microservices, containers, and serverless.',
    effort: 'High',
    time: 'Longest',
    tool: 'AWS Lambda, DynamoDB, Amazon ECS/EKS',
  },
  {
    name: 'Repurchase ("Drop and Shop")',
    strategy: 'Switch from custom legacy software to a modern third-party SaaS application.',
    effort: 'Low-Medium',
    time: 'Moderate',
    tool: 'AWS Marketplace, SaaS solutions',
  },
  {
    name: 'Retain',
    strategy: 'Keep non-ready, highly compliant, or legacy apps in on-prem data centers.',
    effort: 'None',
    time: 'N/A',
    tool: 'AWS Outposts, Direct Connect, VPN',
  },
  {
    name: 'Retire',
    strategy: 'Decommission redundant or unneeded applications, reducing attack surface.',
    effort: 'Low',
    time: 'Fast',
    tool: 'AWS Application Discovery Service',
  },
];
