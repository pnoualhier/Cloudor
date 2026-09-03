import {
  CertificationPathway,
  MatrixRow,
  ServiceEquivalency,
  ExamQuestion,
  TopologyInspectionNode,
  CramCard
} from '../types';

export const PATHWAY_CARDS: CertificationPathway[] = [
  {
    id: 'it-beginner',
    goalNumber: 'Goal 01',
    goalSub: 'Fundamentals',
    title: 'IT Beginner',
    badge: 'ENTRY LEVEL',
    badgeType: 'entry',
    timeEstimate: 'Avg 4–6 weeks',
    description: 'Build fundamental cloud literacy, core compute/storage mechanics, shared responsibility, and compliance foundations.',
    recommendedCerts: [
      {
        provider: 'AWS',
        name: 'AWS Certified Cloud Practitioner',
        code: 'CLF-C02',
        url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf',
        description: 'Validates overall understanding of AWS Cloud platform, basic security, compliance, and billing models.',
        passingScore: '700 / 1000',
        examDuration: '90 Minutes',
        questionsCount: '65 Questions (Multiple choice / response)',
        domains: [
          { name: 'Cloud Concepts', weight: '24%' },
          { name: 'Security and Compliance', weight: '30%' },
          { name: 'Cloud Technology and Services', weight: '34%' },
          { name: 'Billing, Pricing, and Support', weight: '12%' }
        ]
      },
      {
        provider: 'AZURE',
        name: 'Microsoft Azure Fundamentals',
        code: 'AZ-900',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
        description: 'Demonstrates foundational knowledge of cloud concepts, Azure core architecture, and management governance.',
        passingScore: '700 / 1000',
        examDuration: '45 Minutes (65 min appointment)',
        questionsCount: '35–45 Questions',
        domains: [
          { name: 'Describe cloud concepts', weight: '25–30%' },
          { name: 'Describe Azure architecture and services', weight: '35–40%' },
          { name: 'Describe Azure management and governance', weight: '30–35%' }
        ]
      },
      {
        provider: 'COMPTIA',
        name: 'CompTIA Cloud+',
        code: 'CV0-004',
        url: 'https://www.comptia.org/certifications/cloud',
        programUrl: 'https://www.comptia.org/certifications/cloud#examdetails',
        description: 'Vendor-neutral validation of technical skills to deploy, secure, and automate multi-cloud environments.',
        passingScore: '750 / 900',
        examDuration: '90 Minutes',
        questionsCount: 'Maximum of 90 Questions',
        domains: [
          { name: 'Cloud Architecture & Design', weight: '25%' },
          { name: 'Security & Operations', weight: '30%' },
          { name: 'Deployment & Automation', weight: '23%' },
          { name: 'Disaster Recovery & Troubleshooting', weight: '22%' }
        ]
      }
    ],
    metric1Label: 'PRACTICE READINESS',
    metric1Value: '35% Avg',
    metric1Progress: 35,
    salaryBenchmark: '$78,000 /yr',
    providers: ['aws', 'azure', 'comptia']
  },
  {
    id: 'cloud-architect',
    goalNumber: 'Goal 02',
    goalSub: 'Enterprise Scale',
    title: 'Cloud Architect',
    badge: 'CORE & ADVANCED',
    badgeType: 'popular',
    timeEstimate: 'Avg 12–16 weeks',
    description: 'Master complex distributed system design, multi-region failover, cost governance, and enterprise hybrid migrations.',
    recommendedCerts: [
      {
        provider: 'AWS',
        name: 'AWS Solutions Architect – Associate',
        code: 'SAA-C03',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf',
        description: 'Design secure, resilient, high-performing, and cost-optimized architectures using the AWS Well-Architected Framework.',
        passingScore: '720 / 1000',
        examDuration: '130 Minutes',
        questionsCount: '65 Questions',
        domains: [
          { name: 'Design Secure Architectures', weight: '30%' },
          { name: 'Design Resilient Architectures', weight: '26%' },
          { name: 'Design High-Performing Architectures', weight: '24%' },
          { name: 'Design Cost-Optimized Architectures', weight: '20%' }
        ]
      },
      {
        provider: 'AWS',
        name: 'AWS Solutions Architect – Professional',
        code: 'SAP-C02',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-sa-pro/AWS-Certified-Solutions-Architect-Professional_Exam-Guide.pdf',
        description: 'Advanced technical expertise in designing enterprise-scale distributed systems, multi-account structures, and hybrid connectivity.',
        passingScore: '750 / 1000',
        examDuration: '180 Minutes',
        questionsCount: '75 Questions (Complex scenario-based)',
        domains: [
          { name: 'Design Solutions for Organizational Complexity', weight: '26%' },
          { name: 'Design for New Solutions', weight: '29%' },
          { name: 'Continuous Improvement for Existing Solutions', weight: '25%' },
          { name: 'Accelerate Workload Migration and Modernization', weight: '20%' }
        ]
      },
      {
        provider: 'AZURE',
        name: 'Microsoft Azure Solutions Architect Expert',
        code: 'AZ-305',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305',
        description: 'Design cloud and hybrid identity, governance, monitoring, business continuity, and data storage solutions on Azure.',
        passingScore: '700 / 1000',
        examDuration: '100 Minutes (120 min seat)',
        questionsCount: '40–60 Questions (Includes case studies)',
        domains: [
          { name: 'Design identity, governance, and monitor solutions', weight: '25–30%' },
          { name: 'Design data storage solutions', weight: '25–30%' },
          { name: 'Design business continuity solutions', weight: '10–15%' },
          { name: 'Design infrastructure solutions', weight: '25–30%' }
        ]
      },
      {
        provider: 'GCP',
        name: 'Google Cloud Professional Cloud Architect',
        code: 'PCA-2025',
        url: 'https://cloud.google.com/learn/certification/cloud-architect',
        programUrl: 'https://cloud.google.com/learn/certification/guides/cloud-architect',
        description: 'Enable organizations to leverage Google Cloud technologies to design robust, secure, scalable, and dynamic solutions.',
        passingScore: 'Pass / Fail (Scaled score)',
        examDuration: '120 Minutes',
        questionsCount: '50–60 Questions (Includes 2 case studies: EHR Healthcare, TerramEarth)',
        domains: [
          { name: 'Designing and planning a cloud solution architecture', weight: '24%' },
          { name: 'Managing and provisioning a solution infrastructure', weight: '22%' },
          { name: 'Designing for security and compliance', weight: '18%' },
          { name: 'Analyzing and optimizing technical and business processes', weight: '18%' },
          { name: 'Ensuring solution and operations reliability', weight: '18%' }
        ]
      }
    ],
    metric1Label: 'DIFFICULTY RATING',
    metric1Value: 'High (88%)',
    metric1Progress: 88,
    salaryBenchmark: '$156,000 /yr',
    providers: ['aws', 'azure', 'gcp']
  },
  {
    id: 'cloud-developer',
    goalNumber: 'Goal 03',
    goalSub: 'App Modernization',
    title: 'Cloud Developer',
    badge: 'HANDS-ON CODE',
    badgeType: 'code',
    timeEstimate: 'Avg 8–10 weeks',
    description: 'Focus on serverless code execution, microservices orchestration, event streaming, API management, and SDK integration.',
    recommendedCerts: [
      {
        provider: 'AWS',
        name: 'AWS Certified Developer – Associate',
        code: 'DVA-C02',
        url: 'https://aws.amazon.com/certification/certified-developer-associate/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf',
        description: 'Writing code and optimizing AWS services such as Lambda, DynamoDB, API Gateway, ECS, and Cognito.',
        passingScore: '720 / 1000',
        examDuration: '130 Minutes',
        questionsCount: '65 Questions',
        domains: [
          { name: 'Development with AWS Services', weight: '32%' },
          { name: 'Security', weight: '26%' },
          { name: 'Deployment', weight: '24%' },
          { name: 'Troubleshooting and Optimization', weight: '18%' }
        ]
      },
      {
        provider: 'AZURE',
        name: 'Microsoft Azure Developer Associate',
        code: 'AZ-204',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-204',
        description: 'Participate in all phases of cloud development from requirements definition to testing, deployment, and maintenance.',
        passingScore: '700 / 1000',
        examDuration: '100 Minutes',
        questionsCount: '40–60 Questions',
        domains: [
          { name: 'Develop Azure compute solutions (App Service, Functions)', weight: '25–30%' },
          { name: 'Develop for Azure storage (Cosmos DB, Blob)', weight: '15–20%' },
          { name: 'Implement Azure security (Key Vault, Managed ID)', weight: '20–25%' },
          { name: 'Monitor, troubleshoot, and optimize solutions', weight: '15–20%' },
          { name: 'Connect to and consume Azure and third-party services', weight: '15–20%' }
        ]
      }
    ],
    optionalCert: {
      provider: 'GCP',
      name: 'Google Cloud Associate Cloud Engineer',
      code: 'ACE',
      url: 'https://cloud.google.com/learn/certification/cloud-engineer',
      programUrl: 'https://cloud.google.com/learn/certification/guides/cloud-engineer'
    },
    metric1Label: 'CODE RATIO',
    metric1Value: '75% Labs',
    metric1Progress: 75,
    salaryBenchmark: '$134,000 /yr',
    providers: ['aws', 'azure']
  },
  {
    id: 'data-ai',
    goalNumber: 'Goal 04',
    goalSub: 'MLOps & Pipelines',
    title: 'Data / AI',
    badge: 'HIGH GROWTH',
    badgeType: 'growth',
    timeEstimate: 'Avg 10–14 weeks',
    description: 'Engineer automated Big Data pipelines, vector embeddings, cloud-native model training, and LLM inference endpoints.',
    recommendedCerts: [
      {
        provider: 'GCP',
        name: 'Google Cloud Professional Data Engineer',
        code: 'PDE-GCP',
        url: 'https://cloud.google.com/learn/certification/data-engineer',
        programUrl: 'https://cloud.google.com/learn/certification/guides/data-engineer',
        description: 'Design, build, operationalize, and secure data processing systems with BigQuery, Dataflow, Dataproc, and Pub/Sub.',
        passingScore: 'Pass / Fail',
        examDuration: '120 Minutes',
        questionsCount: '50–60 Questions',
        domains: [
          { name: 'Designing data processing systems', weight: '22%' },
          { name: 'Ingesting and processing data', weight: '25%' },
          { name: 'Storing the data and managing databases', weight: '20%' },
          { name: 'Preparing and using data for analysis', weight: '15%' },
          { name: 'Maintaining and automating data workloads', weight: '18%' }
        ]
      },
      {
        provider: 'AWS',
        name: 'AWS Certified Machine Learning – Specialty',
        code: 'MLS-C01',
        url: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-ml-specialty/AWS-Certified-Machine-Learning-Specialty_Exam-Guide.pdf',
        description: 'Design, implement, deploy, and maintain machine learning solutions on SageMaker, Comprehend, and Rekognition.',
        passingScore: '750 / 1000',
        examDuration: '180 Minutes',
        questionsCount: '65 Questions',
        domains: [
          { name: 'Data Engineering', weight: '20%' },
          { name: 'Exploratory Data Analysis', weight: '24%' },
          { name: 'Modeling', weight: '36%' },
          { name: 'Machine Learning Implementation and Operations', weight: '20%' }
        ]
      },
      {
        provider: 'AZURE',
        name: 'Microsoft Azure AI Engineer Associate',
        code: 'AI-102',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-102',
        description: 'Build, manage, and deploy AI solutions that leverage Azure AI services, Azure OpenAI, Document Intelligence, and AI Search.',
        passingScore: '700 / 1000',
        examDuration: '100 Minutes',
        questionsCount: '40–60 Questions',
        domains: [
          { name: 'Plan and manage an Azure AI solution', weight: '15–20%' },
          { name: 'Implement content moderation and computer vision solutions', weight: '20–25%' },
          { name: 'Implement natural language processing solutions', weight: '20–25%' },
          { name: 'Implement knowledge mining and document intelligence', weight: '15–20%' },
          { name: 'Implement generative AI solutions with Azure OpenAI', weight: '20–25%' }
        ]
      }
    ],
    metric1Label: 'MARKET DEMAND',
    metric1Value: '+94% YoY',
    metric1Progress: 94,
    salaryBenchmark: '$162,000 /yr',
    providers: ['aws', 'azure', 'gcp']
  },
  {
    id: 'security',
    goalNumber: 'Goal 05',
    goalSub: 'Zero Trust & IAM',
    title: 'Security',
    badge: 'CRITICAL SKILL',
    badgeType: 'security',
    timeEstimate: 'Avg 10–12 weeks',
    description: 'Implement perimeter defense, KMS envelope encryption, federated SSO/SAML, posture compliance, and incident response.',
    recommendedCerts: [
      {
        provider: 'ISC2',
        name: 'ISC2 CCSP (Certified Cloud Security Professional)',
        code: 'CCSP-PRO',
        url: 'https://www.isc2.org/certifications/ccsp',
        programUrl: 'https://www.isc2.org/certifications/ccsp/ccsp-certification-exam-outline',
        description: 'Global benchmark for cloud security architecture, data governance, legal, and operational compliance.',
        passingScore: '700 / 1000',
        examDuration: '180 Minutes (3 Hours)',
        questionsCount: '125 Multiple Choice Questions',
        domains: [
          { name: 'Cloud Concepts, Architecture and Design', weight: '17%' },
          { name: 'Cloud Data Security', weight: '20%' },
          { name: 'Cloud Platform & Infrastructure Security', weight: '17%' },
          { name: 'Cloud Application Security', weight: '17%' },
          { name: 'Cloud Security Operations', weight: '16%' },
          { name: 'Legal, Risk and Compliance', weight: '13%' }
        ]
      },
      {
        provider: 'AWS',
        name: 'AWS Certified Security – Specialty',
        code: 'SCS-C02',
        url: 'https://aws.amazon.com/certification/certified-security-specialty/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-security-spec/AWS-Certified-Security-Specialty_Exam-Guide.pdf',
        description: 'Demonstrates deep knowledge of data classification, encryption mechanisms, secure internet protocols, and incident management.',
        passingScore: '750 / 1000',
        examDuration: '170 Minutes',
        questionsCount: '65 Questions',
        domains: [
          { name: 'Threat Detection and Incident Response', weight: '14%' },
          { name: 'Security Logging and Monitoring', weight: '18%' },
          { name: 'Infrastructure Security', weight: '20%' },
          { name: 'Identity and Access Management', weight: '16%' },
          { name: 'Data Protection (KMS / TLS)', weight: '18%' },
          { name: 'Management and Security Governance', weight: '14%' }
        ]
      }
    ],
    optionalCert: {
      provider: 'AZURE',
      name: 'Microsoft Azure Security Engineer Associate',
      code: 'AZ-500',
      url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/',
      programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-500'
    },
    metric1Label: 'EXAM DIFFICULTY',
    metric1Value: 'Expert (82%)',
    metric1Progress: 82,
    salaryBenchmark: '$148,000 /yr',
    providers: ['aws', 'comptia']
  },
  {
    id: 'devops-sre',
    goalNumber: 'Goal 06',
    goalSub: 'Production Rigor',
    title: 'DevOps / SRE',
    badge: 'CI/CD & CONTAINERS',
    badgeType: 'devops',
    timeEstimate: 'Avg 14–18 weeks',
    description: 'Master infrastructure-as-code (Terraform), Kubernetes cluster orchestration, GitOps automation, and zero-downtime deployments.',
    recommendedCerts: [
      {
        provider: 'AWS',
        name: 'AWS Certified DevOps Engineer – Professional',
        code: 'DOP-C02',
        url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-devops-pro/AWS-Certified-DevOps-Engineer-Professional_Exam-Guide.pdf',
        description: 'Test technical expertise in provisioning, operating, and managing distributed application systems on the AWS platform.',
        passingScore: '750 / 1000',
        examDuration: '180 Minutes',
        questionsCount: '75 Questions',
        domains: [
          { name: 'SDLC Automation', weight: '22%' },
          { name: 'Configuration Management and IaC', weight: '17%' },
          { name: 'Resilient Cloud Solutions', weight: '15%' },
          { name: 'Monitoring and Logging', weight: '15%' },
          { name: 'Incident and Event Response', weight: '14%' },
          { name: 'Security and Compliance', weight: '17%' }
        ]
      },
      {
        provider: 'AZURE',
        name: 'Microsoft Azure DevOps Engineer Expert',
        code: 'AZ-400',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-400',
        description: 'Design and implement strategies for collaboration, code, infrastructure, source control, security, compliance, and testing.',
        passingScore: '700 / 1000',
        examDuration: '100 Minutes',
        questionsCount: '40–60 Questions',
        domains: [
          { name: 'Configure processes and communications', weight: '10–15%' },
          { name: 'Design and implement source control', weight: '15–20%' },
          { name: 'Design and implement build and release pipelines', weight: '40–45%' },
          { name: 'Develop a security and compliance plan', weight: '10–15%' },
          { name: 'Implement an instrumentation strategy', weight: '10–15%' }
        ]
      },
      {
        provider: 'K8S',
        name: 'Certified Kubernetes Administrator (CKA)',
        code: 'CKA',
        url: 'https://www.cncf.io/training/certification/cka/',
        programUrl: 'https://github.com/cncf/curriculum/blob/master/CKA_Curriculum_v1.31.pdf',
        description: 'Performance-based, hands-on command-line exam testing real-world Kubernetes installation, networking, and cluster debugging.',
        passingScore: '66% Score',
        examDuration: '120 Minutes (2 Hours)',
        questionsCount: '15–20 Hands-on live terminal tasks',
        domains: [
          { name: 'Storage (PV, PVC, StorageClass)', weight: '10%' },
          { name: 'Troubleshooting (Cluster & Worker nodes)', weight: '30%' },
          { name: 'Workloads & Scheduling (Deployments, DaemonSets)', weight: '15%' },
          { name: 'Cluster Architecture, Installation & Config (kubeadm, etcd)', weight: '25%' },
          { name: 'Services & Networking (CNI, Ingress, CoreDNS)', weight: '20%' }
        ]
      }
    ],
    metric1Label: 'HANDS-ON WEIGHT',
    metric1Value: '90% Lab Exam',
    metric1Progress: 90,
    salaryBenchmark: '$165,000 /yr',
    providers: ['aws', 'azure', 'k8s']
  }
];

export const COMPARATIVE_MATRIX_ROWS: MatrixRow[] = [
  {
    id: 'm1',
    goal: 'IT Beginner',
    subGoal: 'Foundations & Concepts',
    certifications: 'AWS Cloud Practitioner, Azure Fundamentals (AZ-900), or CompTIA Cloud+',
    certList: [
      {
        provider: 'AWS',
        name: 'AWS Cloud Practitioner',
        code: 'CLF-C02',
        url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf'
      },
      {
        provider: 'AZURE',
        name: 'Azure Fundamentals',
        code: 'AZ-900',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900'
      },
      {
        provider: 'COMPTIA',
        name: 'CompTIA Cloud+',
        code: 'CV0-004',
        url: 'https://www.comptia.org/certifications/cloud',
        programUrl: 'https://www.comptia.org/certifications/cloud#examdetails'
      }
    ],
    tags: ['Cloud Concepts', 'Security & Compliance', 'Billing Models'],
    domainLevel: 'Foundational',
    levelBadgeClass: 'bg-[#262a35] text-[#acedff]'
  },
  {
    id: 'm2',
    goal: 'Cloud Architect',
    subGoal: 'Systems & Governance',
    certifications: 'AWS Solutions Architect – Associate / Professional, Azure Solutions Architect Expert, GCP Professional Cloud Architect',
    certList: [
      {
        provider: 'AWS',
        name: 'Solutions Architect Associate',
        code: 'SAA-C03',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf'
      },
      {
        provider: 'AWS',
        name: 'Solutions Architect Professional',
        code: 'SAP-C02',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-sa-pro/AWS-Certified-Solutions-Architect-Professional_Exam-Guide.pdf'
      },
      {
        provider: 'AZURE',
        name: 'Azure Solutions Architect Expert',
        code: 'AZ-305',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305'
      },
      {
        provider: 'GCP',
        name: 'GCP Professional Cloud Architect',
        code: 'PCA',
        url: 'https://cloud.google.com/learn/certification/cloud-architect',
        programUrl: 'https://cloud.google.com/learn/certification/guides/cloud-architect'
      }
    ],
    tags: ['High Availability', 'Disaster Recovery', 'Multi-Account Topology'],
    domainLevel: 'Associate & Expert',
    levelBadgeClass: 'bg-[#ca8100]/30 text-[#ffb95f]'
  },
  {
    id: 'm3',
    goal: 'Cloud Developer',
    subGoal: 'Application Services',
    certifications: 'AWS Developer – Associate, Azure Developer Associate (AZ-204)',
    certList: [
      {
        provider: 'AWS',
        name: 'AWS Developer – Associate',
        code: 'DVA-C02',
        url: 'https://aws.amazon.com/certification/certified-developer-associate/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf'
      },
      {
        provider: 'AZURE',
        name: 'Azure Developer Associate',
        code: 'AZ-204',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-204'
      }
    ],
    tags: ['Serverless Functions', 'NoSQL Storage', 'Event-Driven CI'],
    domainLevel: 'Associate',
    levelBadgeClass: 'bg-[#8083ff]/20 text-[#c0c1ff]'
  },
  {
    id: 'm4',
    goal: 'Data / AI',
    subGoal: 'Pipelines & Inference',
    certifications: 'GCP Professional Data Engineer, AWS Machine Learning – Specialty, Azure AI Engineer Associate (AI-102)',
    certList: [
      {
        provider: 'GCP',
        name: 'GCP Professional Data Engineer',
        code: 'PDE',
        url: 'https://cloud.google.com/learn/certification/data-engineer',
        programUrl: 'https://cloud.google.com/learn/certification/guides/data-engineer'
      },
      {
        provider: 'AWS',
        name: 'AWS Machine Learning – Specialty',
        code: 'MLS-C01',
        url: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-ml-specialty/AWS-Certified-Machine-Learning-Specialty_Exam-Guide.pdf'
      },
      {
        provider: 'AZURE',
        name: 'Azure AI Engineer Associate',
        code: 'AI-102',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-102'
      }
    ],
    tags: ['BigQuery / Redshift', 'SageMaker Pipelines', 'Cognitive Services'],
    domainLevel: 'Specialty & Expert',
    levelBadgeClass: 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
  },
  {
    id: 'm5',
    goal: 'Security',
    subGoal: 'Threat Detection & Auth',
    certifications: 'CCSP (Certified Cloud Security Professional), AWS Security – Specialty',
    certList: [
      {
        provider: 'ISC2',
        name: 'ISC2 CCSP Security',
        code: 'CCSP',
        url: 'https://www.isc2.org/certifications/ccsp',
        programUrl: 'https://www.isc2.org/certifications/ccsp/ccsp-certification-exam-outline'
      },
      {
        provider: 'AWS',
        name: 'AWS Security – Specialty',
        code: 'SCS-C02',
        url: 'https://aws.amazon.com/certification/certified-security-specialty/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-security-spec/AWS-Certified-Security-Specialty_Exam-Guide.pdf'
      }
    ],
    tags: ['IAM Least Privilege', 'CloudHSM / Key Vault', 'SIEM / GuardDuty'],
    domainLevel: 'Specialty',
    levelBadgeClass: 'bg-[#93000a]/30 text-[#ffb4ab]'
  },
  {
    id: 'm6',
    goal: 'DevOps / SRE',
    subGoal: 'Containers & Automation',
    certifications: 'AWS DevOps Engineer – Professional, Azure DevOps Engineer Expert, CKA (Kubernetes)',
    certList: [
      {
        provider: 'AWS',
        name: 'AWS DevOps Engineer – Professional',
        code: 'DOP-C02',
        url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/',
        programUrl: 'https://d1.awsstatic.com/training-and-certification/docs-devops-pro/AWS-Certified-DevOps-Engineer-Professional_Exam-Guide.pdf'
      },
      {
        provider: 'AZURE',
        name: 'Azure DevOps Engineer Expert',
        code: 'AZ-400',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/',
        programUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-400'
      },
      {
        provider: 'K8S',
        name: 'Certified Kubernetes Administrator',
        code: 'CKA',
        url: 'https://www.cncf.io/training/certification/cka/',
        programUrl: 'https://github.com/cncf/curriculum/blob/master/CKA_Curriculum_v1.31.pdf'
      }
    ],
    tags: ['Kubernetes Pod Ingress', 'Terraform IaC', 'Blue/Green Deployments'],
    domainLevel: 'Professional',
    levelBadgeClass: 'bg-[#ffb95f]/15 text-[#ffb95f]'
  }
];

export const SERVICE_EQUIVALENCY_DATA: ServiceEquivalency[] = [
  {
    id: 'compute',
    domain: 'Compute (IaaS)',
    icon: 'memory',
    iconColor: 'text-[#c0c1ff]',
    aws: {
      name: 'EC2',
      detail: 'Elastic Compute Cloud • Nitro Hypervisor'
    },
    azure: {
      name: 'Virtual Machines',
      detail: 'Azure Compute Scale Sets (VMSS)'
    },
    gcp: {
      name: 'Compute Engine',
      detail: 'GCE • Live Migration support'
    },
    k8s: {
      name: 'Nodes / kubelet',
      detail: 'Bare metal / Worker Daemons'
    },
    pivot: 'SAA-C03 / AZ-104',
    keywords: 'ec2 vm virtual compute instances hypervisor gce'
  },
  {
    id: 'serverless',
    domain: 'Serverless (FaaS)',
    icon: 'bolt',
    iconColor: 'text-[#4cd7f6]',
    aws: {
      name: 'AWS Lambda',
      detail: '15 min max execution • 10GB RAM'
    },
    azure: {
      name: 'Azure Functions',
      detail: 'Consumption & Premium plans • Event Grid'
    },
    gcp: {
      name: 'Cloud Functions',
      detail: '2nd Gen (Built on Cloud Run / Knative)'
    },
    k8s: {
      name: 'Knative / OpenFaaS',
      detail: 'Scale to Zero event triggers'
    },
    pivot: 'DVA-C02 / AZ-204',
    keywords: 'lambda functions cloud run event driven faas knative'
  },
  {
    id: 'storage',
    domain: 'Object Storage',
    icon: 'cloud_circle',
    iconColor: 'text-[#ffb95f]',
    aws: {
      name: 'Amazon S3',
      detail: '11 9s durability • Versioning • Glacier'
    },
    azure: {
      name: 'Azure Blob',
      detail: 'Block, Append, Page • Lifecycle tiers'
    },
    gcp: {
      name: 'Cloud Storage',
      detail: 'Unified API • Dual/Multi-region buckets'
    },
    k8s: {
      name: 'MinIO / Rook Ceph',
      detail: 'S3-compliant in-cluster storage'
    },
    pivot: 'All Cloud Certs',
    keywords: 's3 blob cloud storage buckets objects minio ceph'
  },
  {
    id: 'kubernetes',
    domain: 'Managed K8s',
    icon: 'hub',
    iconColor: 'text-[#03b5d3]',
    aws: {
      name: 'Amazon EKS',
      detail: 'VPC CNI Plugin • IAM Roles for SA'
    },
    azure: {
      name: 'Azure AKS',
      detail: 'Azure CNI / Kubenet • Entra Pod Identity'
    },
    gcp: {
      name: 'Google GKE',
      detail: 'Autopilot mode • Native Workload Identity'
    },
    k8s: {
      name: 'kubeadm / Control Plane',
      detail: 'etcd, apiserver, scheduler, c-m'
    },
    pivot: 'CKA / CKAD / CKS',
    keywords: 'eks aks gke cka containers orchestrator control plane'
  },
  {
    id: 'security',
    domain: 'Identity & RBAC',
    icon: 'shield',
    iconColor: 'text-[#ffb4ab]',
    aws: {
      name: 'AWS IAM',
      detail: 'Policies (JSON) • SCPs • STS AssumeRole'
    },
    azure: {
      name: 'Entra ID',
      detail: '(Formerly Azure AD) • PIM • Conditional Access'
    },
    gcp: {
      name: 'Cloud IAM',
      detail: 'Member + Role bindings • Org Hierarchy'
    },
    k8s: {
      name: 'K8s RBAC API',
      detail: 'ClusterRole • RoleBinding • ServiceAccounts'
    },
    pivot: 'SCS-C02 / SC-300',
    keywords: 'iam entra active directory security roles rbac permissions'
  },
  {
    id: 'database',
    domain: 'Managed NoSQL',
    icon: 'dataset',
    iconColor: 'text-[#8083ff]',
    aws: {
      name: 'Amazon DynamoDB',
      detail: 'Single-digit ms latency • Global Tables • DAX'
    },
    azure: {
      name: 'Azure Cosmos DB',
      detail: 'Multi-model • 5 Consistency Levels • SLA 99.999%'
    },
    gcp: {
      name: 'Cloud Spanner / Firestore',
      detail: 'TrueTime ACID horizontally scalable NoSQL/SQL'
    },
    k8s: {
      name: 'etcd (Key-Value)',
      detail: 'Raft Consensus engine for cluster state'
    },
    pivot: 'DP-420 / AWS-MLS',
    keywords: 'dynamodb cosmos spanner nosql database document etcd raft'
  }
];

export const TOPOLOGY_INSPECTOR_DATA: Record<string, TopologyInspectionNode> = {
  alb: {
    title: 'Application Load Balancer (ALB)',
    tier: 'TIER 1 • PUBLIC (DMZ)',
    badge: 'LAYER 7 INGRESS',
    badgeColor: 'text-[#4cd7f6] bg-[#4cd7f6]/10',
    desc: 'Layer 7 HTTP/HTTPS reverse proxy. Terminates SSL/TLS certificates and evaluates path routing rules (e.g. /api vs /static). Cross-zone load balancing distributes connections evenly across registered target EC2 or container instances regardless of AZ saturation.',
    multiCloud: {
      azure: 'Application Gateway v2',
      gcp: 'Cloud HTTP(S) Load Balancing',
      k8s: 'Ingress Controller (NGINX/Traefik)'
    },
    note: 'SAA-C03 Question: If instances in private subnets cannot download OS security patches, confirm the Route Table points 0.0.0.0/0 to the NAT Gateway in the Public subnet, NOT directly to an IGW.'
  },
  nat: {
    title: 'Managed NAT Gateway',
    tier: 'TIER 1 • PUBLIC EGRESS',
    badge: 'OUTBOUND SECURE',
    badgeColor: 'text-[#ffb95f] bg-[#ffb95f]/10',
    desc: 'Provides one-way outbound internet connectivity for instances in private subnets while completely blocking inbound traffic originated from the public internet. Allocated with an Elastic IP (EIP) per availability zone.',
    multiCloud: {
      azure: 'Virtual Network NAT Gateway',
      gcp: 'Cloud NAT Gateway',
      k8s: 'Egress IP Gateway / Calico Egress'
    },
    note: 'Architecture Pivot: High-availability setups require one NAT Gateway per Availability Zone. A single NAT Gateway serving 2 AZs is a critical single-point of failure (SPOF).'
  },
  compute: {
    title: 'Auto Scaling Group (ASG)',
    tier: 'TIER 2 • PRIVATE COMPUTE',
    badge: 'ELASTIC FLEET',
    badgeColor: 'text-[#c0c1ff] bg-[#c0c1ff]/10',
    desc: 'Dynamically scales EC2 capacity up or down based on Target Tracking policies (e.g. ASGAverageCPUUtilization at 65%). Health checks are delegated to the ALB to automatically terminate and replace unhealthy instances.',
    multiCloud: {
      azure: 'Virtual Machine Scale Sets (VMSS)',
      gcp: 'Managed Instance Groups (MIGs)',
      k8s: 'Horizontal Pod Autoscaler (HPA) & Cluster Autoscaler'
    },
    note: 'Exam Trap: Termination Policies default to: Oldest Launch Template/Config -> Closest to next billing hour -> Allocation Strategy.'
  },
  database: {
    title: 'RDS Aurora / Multi-AZ Primary',
    tier: 'TIER 3 • ISOLATED DATA',
    badge: 'SYNCHRONOUS REPLICATION',
    badgeColor: 'text-[#ca8100] bg-[#ca8100]/20',
    desc: 'Isolated inside private DB Subnet Groups (spanning at least 2 AZs). The master node receives read/write traffic while synchronously replicating changes to the secondary standby node without network-level downtime.',
    multiCloud: {
      azure: 'Azure SQL Database Hyperscale Multi-AZ',
      gcp: 'Cloud SQL HA / Cloud Spanner',
      k8s: 'CloudNativePG / Vitess Operator'
    },
    note: 'Failover Rationale: Aurora storage is decoupled across 6 copies across 3 AZs. Read Replicas can be elevated to Master in under 30 seconds via auto DNS CNAME switch.'
  },
  replica: {
    title: 'Standby / Read Replica Node',
    tier: 'TIER 3 • DISASTER RECOVERY',
    badge: 'STANDBY TARGET',
    badgeColor: 'text-[#908fa0] bg-[#262a35]',
    desc: 'Acts as passive warm standby in synchronous Multi-AZ mode, or actively serves offloaded read-heavy reporting queries when provisioned as an Aurora Read Replica endpoint.',
    multiCloud: {
      azure: 'Azure SQL Active Geo-Replication',
      gcp: 'Cloud SQL Cross-Region Read Replica',
      k8s: 'StatefulSet Follower Pods'
    },
    note: 'AZ-305 Note: In Azure SQL, Active Geo-Replication provides readable secondary databases in up to 4 regions with automated or manual failover groups.'
  }
};

export const CRAM_CARDS_DATA: CramCard[] = [
  {
    id: 'cram-s3',
    badge: 'AWS-SAA / S3',
    badgeColor: 'bg-[#ffb95f]/10 text-[#ffb95f]',
    type: 'Tiering Cheat',
    title: 'S3 Storage Classes & Retrieval Times',
    description: 'Memorize retrieval speed boundaries & minimum billing duration.',
    items: [
      {
        label: 'Standard',
        subLabel: 'Frequent access, millisecond latency',
        tag: 'No Min Duration',
        tagColor: 'text-[#ffb95f]'
      },
      {
        label: 'Standard-IA',
        subLabel: 'Infrequent access, millisecond latency',
        tag: '30d Min • Retrieval Fee',
        tagColor: 'text-[#908fa0]'
      },
      {
        label: 'Glacier Flexible',
        subLabel: 'Expedited (1-5m), Std (3-5h), Bulk (5-12h)',
        tag: '90d Min Fee',
        tagColor: 'text-[#ffb95f]'
      },
      {
        label: 'Glacier Deep Archive',
        subLabel: 'Standard (12h), Bulk (48h)',
        tag: '180d Min • Cheapest',
        tagColor: 'text-[#ffb4ab]'
      }
    ],
    footerNote: '• S3 Object Lock = WORM compliance',
    provider: 'aws',
    pinned: true
  },
  {
    id: 'cram-azure',
    badge: 'AZ-104 / AZURE',
    badgeColor: 'bg-[#4cd7f6]/10 text-[#4cd7f6]',
    type: 'Lifecycle Policy',
    title: 'Azure Blob Access Tiers & Hydration',
    description: 'Rehydration priorities and tier transition rules.',
    items: [
      {
        label: 'Hot Tier',
        subLabel: 'Highest storage cost, lowest access cost',
        tag: 'Online Tier',
        tagColor: 'text-[#4cd7f6]'
      },
      {
        label: 'Cool Tier',
        subLabel: 'Accessed < once per 30 days',
        tag: '30-day min charge',
        tagColor: 'text-[#908fa0]'
      },
      {
        label: 'Cold Tier',
        subLabel: 'Infrequently modified • 90-day minimum',
        tag: 'Newer Slot',
        tagColor: 'text-[#4cd7f6]'
      },
      {
        label: 'Archive Tier',
        subLabel: 'Offline • Standard or High Rehydration',
        tag: '180d min • Offline',
        tagColor: 'text-[#ffb4ab]'
      }
    ],
    footerNote: '• Rehydration priority: Standard (up to 15h) vs High',
    provider: 'azure',
    pinned: true
  },
  {
    id: 'cram-cka',
    badge: 'CKA EXAM DRILL',
    badgeColor: 'bg-[#8083ff]/10 text-[#8083ff]',
    type: 'Speed Imperatives',
    title: 'CKA: Instant Speed Commands & etcd',
    description: 'Never write YAML from scratch in the 2-hour lab exam.',
    items: [
      {
        label: 'Dry-Run Generator:',
        subLabel: 'k run nginx --image=nginx --dry-run=client -o yaml > pod.yaml',
        tag: 'K8s CLI',
        tagColor: 'text-[#c0c1ff]',
        isCode: true
      },
      {
        label: 'Imperative Service Exposure:',
        subLabel: 'k expose deploy web --port=80 --target-port=8080 --type=NodePort',
        tag: 'Networking',
        tagColor: 'text-[#c0c1ff]',
        isCode: true
      },
      {
        label: 'etcd Snapshot Save (Target V3):',
        subLabel: 'ETCDCTL_API=3 etcdctl --cacert=... --cert=... --key=... snapshot save /tmp/etcd.db',
        tag: 'Backup',
        tagColor: 'text-[#4cd7f6]',
        isCode: true
      },
      {
        label: 'JSONPath Secret Decode:',
        subLabel: "k get secret sec -o jsonpath='{.data.pass}' | base64 -d",
        tag: 'Secrets',
        tagColor: 'text-[#ffb95f]',
        isCode: true
      }
    ],
    footerNote: '• Set bashrc: alias k=kubectl + do="--dry-run=client -o yaml"',
    provider: 'k8s',
    pinned: true
  }
];

export const INITIAL_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 25,
    domain: 'DOMAIN 2: HIGH-PERFORMING ARCHITECTURES (24%)',
    estimatedTime: '1m 45s',
    stem: 'A financial services company is designing a multi-tier mission-critical web application that requires sub-millisecond latency for cache reads and cross-region disaster recovery with automated failover capabilities. The caching tier must support transactional reads and replica promotion with zero manual intervention.',
    subStem: 'Which architectural combination satisfies these requirements with the lowest operational overhead?',
    options: [
      {
        id: 'A',
        text: 'Deploy an Amazon Aurora Multi-Master cluster with active read replicas in secondary regions, configured with an Amazon ElastiCache for Memcached node in each Availability Zone using cross-region VPC peering.'
      },
      {
        id: 'B',
        text: 'Provision an Amazon ElastiCache for Redis Global Datastore with automatic failover, combined with Amazon Route 53 Latency-Based Routing (LBR) and health checks mapped to Multi-AZ read-replicas across primary and secondary regions.'
      },
      {
        id: 'C',
        text: 'Configure Amazon DynamoDB Global Tables with DynamoDB Accelerator (DAX) clusters deployed independently in both regions, synchronizing cache invalidation signals via custom AWS Lambda functions triggered by DynamoDB Streams.'
      },
      {
        id: 'D',
        text: 'Deploy Amazon CloudFront in front of regional Amazon API Gateways with regional Redis clusters, backed by custom AWS Step Functions state machine orchestration to promote read replicas upon synthetic latency breach alarms.'
      }
    ],
    correctOption: 'B',
    correctExplanation: 'Amazon ElastiCache for Redis Global Datastore provides fully managed, cross-region replication with replication latency under 1 second. It enables local reads with sub-millisecond latency. In the event of a regional degradation, a secondary cluster can be promoted to primary with minimal operational overhead.',
    distractorExplanations: {
      A: 'Option A Fails: Memcached does not support multi-region replication or persistent cross-region datastores natively.',
      C: 'Option C Fails: DAX clusters are strictly single-region. Syncing separate DAX clusters via custom Lambda and Streams introduces severe operational overhead and write latency.',
      D: 'Option D Fails: Custom Step Functions introduce manual logic and brittle failover mechanisms where native Global Datastore automation exists.'
    },
    referenceDoc: 'Ref: AWS Well-Architected Reliability Pillar Doc #774-SAA',
    selectedOption: 'B',
    flagged: false
  },
  {
    id: 3,
    domain: 'DOMAIN 1: SECURE ARCHITECTURES (30%)',
    estimatedTime: '2m 10s',
    stem: 'An enterprise wants to enforce that any EC2 instance launched in any account across their AWS Organization has IMDSv2 (Instance Metadata Service Version 2) required, preventing SSRF attacks. They must centrally prohibit any IAM administrator in member accounts from bypassing this configuration.',
    subStem: 'What is the most effective approach?',
    options: [
      {
        id: 'A',
        text: 'Attach a Service Control Policy (SCP) to the AWS Organizations root with a Deny effect on ec2:RunInstances unless the condition ec2:MetadataHttpTokens equals required.'
      },
      {
        id: 'B',
        text: 'Create an AWS Config rule in each account that evaluates instance compliance and triggers an AWS Systems Manager Automation document to stop non-compliant EC2 instances.'
      },
      {
        id: 'C',
        text: 'Deploy IAM permission boundaries on all IAM roles in member accounts denying ec2:ModifyInstanceMetadataOptions.'
      },
      {
        id: 'D',
        text: 'Use Amazon GuardDuty with automated remediation Lambda functions to terminate instances whenever an IMDSv1 token is requested.'
      }
    ],
    correctOption: 'A',
    correctExplanation: 'Service Control Policies (SCPs) in AWS Organizations set guardrails that even account root users and local IAM administrators cannot override. Enforcing the ec2:MetadataHttpTokens condition on ec2:RunInstances guarantees that instances without IMDSv2 cannot even be launched.',
    distractorExplanations: {
      B: 'AWS Config is detective, not preventative. The instance would launch before being stopped.',
      C: 'Permission boundaries must be attached to every role manually and do not prevent root from launching instances.',
      D: 'GuardDuty is reactive and terminating production instances risks severe unintended downtime.'
    },
    referenceDoc: 'Ref: AWS Security Best Practices for Amazon EC2 IMDSv2',
    selectedOption: 'A',
    flagged: true
  },
  {
    id: 12,
    domain: 'DOMAIN 3: RESILIENT ARCHITECTURES (26%)',
    estimatedTime: '1m 30s',
    stem: 'A video streaming platform stores terabytes of ingested raw video footage on Amazon S3. The footage is accessed frequently during the first 14 days of editing, accessed rarely for the subsequent 60 days, and afterwards must be retained for 7 years for compliance. The company wants to minimize storage expenses without losing immediate access in the first 74 days.',
    subStem: 'Which S3 Lifecycle policy configuration should be established?',
    options: [
      {
        id: 'A',
        text: 'Transition to S3 Standard-IA at day 30, transition to S3 Glacier Deep Archive at day 75, and expire at day 2555.'
      },
      {
        id: 'B',
        text: 'Transition to S3 One Zone-IA at day 14, transition to S3 Glacier Flexible Retrieval at day 74, with object locking.'
      },
      {
        id: 'C',
        text: 'Transition to S3 Standard-IA at day 30, transition to S3 Glacier Deep Archive at day 90, and expire after 7 years.'
      },
      {
        id: 'D',
        text: 'Use S3 Intelligent-Tiering with Archive and Deep Archive access tiers activated immediately upon ingestion.'
      }
    ],
    correctOption: 'C',
    correctExplanation: 'S3 Standard-IA requires a 30-day minimum billing period before transition, so transitioning before day 30 incurs minimum billing penalties. Moving to S3 Glacier Deep Archive provides the lowest cost storage for 7-year compliance archiving.',
    distractorExplanations: {
      A: 'Day 75 creates an irregular transition cadence compared to the 30-day block boundaries.',
      B: 'One Zone-IA lacks multi-AZ resilience and is not recommended for critical master footage.',
      D: 'Intelligent-Tiering has a monthly monitoring charge per 10,000 objects which can outweigh savings on small video chunks.'
    },
    referenceDoc: 'Ref: Amazon S3 Lifecycle Configuration Guidelines Doc #418-SAA',
    selectedOption: 'C',
    flagged: true
  },
  {
    id: 29,
    domain: 'DOMAIN 4: COST-OPTIMIZED ARCHITECTURES (20%)',
    estimatedTime: '2m 00s',
    stem: 'A gaming company runs high-throughput multiplayer game servers on Amazon EC2. The workload can tolerate brief instance interruptions with 2-minute notifications and needs to scale aggressively between 100 and 1,000 instances during peak evening hours while keeping hourly compute costs to a minimum.',
    subStem: 'Which compute strategy meets these criteria?',
    options: [
      {
        id: 'A',
        text: 'Provision an EC2 Auto Scaling group configured with an Allocation Strategy of capacity-optimized Spot Instances across multiple instance types.'
      },
      {
        id: 'B',
        text: 'Purchase 3-Year All-Upfront Compute Savings Plans sized for the maximum 1,000 instance ceiling.'
      },
      {
        id: 'C',
        text: 'Utilize AWS Fargate with Spot capacity provider exclusively on single-core containers.'
      },
      {
        id: 'D',
        text: 'Deploy On-Demand EC2 instances using Warm Pools with stopped instances.'
      }
    ],
    correctOption: 'A',
    correctExplanation: 'Spot Instances offer up to 90% discount compared to On-Demand and provide a 2-minute termination notice. The capacity-optimized allocation strategy allocates Spot instances from the deepest pools to minimize interruption rates during sudden spikes.',
    distractorExplanations: {
      B: 'Purchasing Savings Plans for peak capacity guarantees massive over-spending during off-peak hours.',
      C: 'Fargate Spot adds container layer orchestration overhead and may not match native game server socket topologies.',
      D: 'Stopped instances in Warm Pools still incur EBS storage costs and require On-Demand hourly compute rates.'
    },
    referenceDoc: 'Ref: Amazon EC2 Spot Instances Architecture Guide',
    selectedOption: undefined,
    flagged: true
  }
];
