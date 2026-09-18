export interface Az900TopicSection {
  id: string;
  titleEn: string;
  titleFr: string;
  weight: string;
  descriptionEn: string;
  descriptionFr: string;
  keyConcepts: Array<{
    nameEn: string;
    nameFr: string;
    summaryEn: string;
    summaryFr: string;
    examTipEn: string;
    examTipFr: string;
  }>;
}

export const AZ900_DOMAIN_1_METADATA = {
  examCode: 'AZ-900',
  examName: 'Microsoft Azure Fundamentals',
  domainNumber: 1,
  domainNameEn: 'Domain 1: Describe cloud concepts',
  domainNameFr: 'Domaine 1 : Décrire les concepts du cloud',
  weight: '25–30%',
  passingScore: '700 / 1000',
  descriptionEn: 'Covers cloud computing principles, the shared responsibility model, cloud deployment models, financial and consumption principles, and cloud service categories (IaaS, PaaS, SaaS).',
  descriptionFr: 'Couvre les principes du cloud computing, le modèle de responsabilité partagée, les modèles de déploiement cloud, les principes financiers et de consommation, ainsi que les catégories de services cloud (IaaS, PaaS, SaaS).',
};

export const AZ900_DOMAIN_1_TASKS: Az900TopicSection[] = [
  {
    id: 'task-1-1',
    titleEn: '1.1 Describe Cloud Computing & Cloud Models',
    titleFr: '1.1 Décrire le Cloud Computing & les Modèles Cloud',
    weight: '35% of Domain 1',
    descriptionEn: 'Understand cloud computing fundamentals, the shared responsibility model, public/private/hybrid/multi-cloud architectures, and financial CapEx vs. OpEx models.',
    descriptionFr: 'Comprendre les fondamentaux du cloud, le modèle de responsabilité partagée, les architectures public/privé/hybride/multi-cloud et les modèles financiers CapEx vs OpEx.',
    keyConcepts: [
      {
        nameEn: 'Shared Responsibility Model',
        nameFr: 'Modèle de Responsabilité Partagée',
        summaryEn: 'Identities, endpoint devices, and stored data ALWAYS remain the customer’s responsibility. Physical data centers, hosts, and network hardware ALWAYS belong to Microsoft.',
        summaryFr: 'Les identités, appareils terminaux et données stockées restent TOUJOURS sous la responsabilité du client. Les datacenters physiques, hôtes et réseaux appartiennent TOUJOURS à Microsoft.',
        examTipEn: 'In SaaS (Microsoft 365), you are still responsible for configuring MFA, user access rights, and data backups.',
        examTipFr: 'En SaaS (Microsoft 365), vous êtes toujours responsable de la configuration du MFA, des droits d’accès et des sauvegardes des données.',
      },
      {
        nameEn: 'Cloud Models: Public, Private, Hybrid & Multi-Cloud',
        nameFr: 'Modèles Cloud : Public, Privé, Hybride & Multi-Cloud',
        summaryEn: 'Public: Multi-tenant hardware owned by Microsoft. Private: Dedicated hardware for one organization. Hybrid: Bridges on-premises and Azure. Multi-Cloud: Utilizes 2+ public cloud providers.',
        summaryFr: 'Public : Matériel mutualisé géré par Microsoft. Privé : Matériel dédié à une seule organisation. Hybride : Relie datacenter sur site et Azure. Multi-Cloud : Utilise 2+ fournisseurs cloud publics.',
        examTipEn: 'Cloud bursting is ONLY possible in a Hybrid Cloud deployment architecture.',
        examTipFr: 'Le cloud bursting n’est possible QUE dans une architecture de déploiement Cloud Hybride.',
      },
      {
        nameEn: 'CapEx vs. OpEx & Consumption-Based Billing',
        nameFr: 'CapEx vs OpEx & Facturation à la Consommation',
        summaryEn: 'CapEx: High upfront hardware spending depreciated over years. OpEx: Pay-as-you-go operating expense deducted in the same tax year without upfront hardware commitments.',
        summaryFr: 'CapEx : Fort investissement initial amorti sur plusieurs années. OpEx : Dépenses opérationnelles à l’usage déductibles immédiatement sans engagement matériel.',
        examTipEn: 'Stopping (deallocating) an Azure VM stops compute charges immediately, though storage disks continue to be billed.',
        examTipFr: 'Arrêter (désallouer) une VM Azure stoppe immédiatement les coûts de calcul, bien que les disques de stockage restent facturés.',
      },
    ],
  },
  {
    id: 'task-1-2',
    titleEn: '1.2 Describe the Benefits of Using Cloud Services',
    titleFr: '1.2 Décrire les Avantages des Services Cloud',
    weight: '35% of Domain 1',
    descriptionEn: 'Explore high availability, vertical vs. horizontal scalability, elasticity, agility, reliability, disaster recovery, predictability, and governance.',
    descriptionFr: 'Explorer la haute disponibilité, l’évolutivité verticale vs horizontale, l’élasticité, l’agilité, la fiabilité, la reprise après sinistre, la prévisibilité et la gouvernance.',
    keyConcepts: [
      {
        nameEn: 'High Availability & Fault Tolerance',
        nameFr: 'Haute Disponibilité & Tolérance aux Pannes',
        summaryEn: 'HA ensures systems remain accessible with minimal downtime (99.9% to 99.99% SLAs). Fault tolerance eliminates Single Points of Failure with redundant components.',
        summaryFr: 'La HA garantit la disponibilité avec un minimum d’interruption (SLA de 99,9% à 99,99%). La tolérance aux pannes élimine les points uniques de défaillance.',
        examTipEn: 'Deploying Virtual Machines across multiple Availability Zones elevates your SLA to 99.99%.',
        examTipFr: 'Déployer des machines virtuelles sur plusieurs zones de disponibilité élève votre SLA à 99,99%.',
      },
      {
        nameEn: 'Vertical vs. Horizontal Scalability & Elasticity',
        nameFr: 'Scalabilité Verticale vs Horizontale & Élasticité',
        summaryEn: 'Vertical (Scale Up): Adding CPU/RAM to a single VM. Horizontal (Scale Out): Adding multiple VM instances (VMSS). Elasticity: Dynamic automatic scaling and shrinking based on live traffic.',
        summaryFr: 'Verticale (Scale Up) : Ajouter du CPU/RAM à une seule VM. Horizontale (Scale Out) : Ajouter plusieurs instances de VM (VMSS). Élasticité : Ajustement automatique en temps réel.',
        examTipEn: 'Scalability is the capability to scale; Elasticity is the real-time automation of scaling.',
        examTipFr: 'La scalabilité est la capacité d’évoluer ; l’élasticité est l’automatisation en temps réel de cette évolution.',
      },
      {
        nameEn: 'Predictability: Cost and Performance',
        nameFr: 'Prévisibilité : Coûts et Performances',
        summaryEn: 'Performance: Guaranteed throughput via autoscaling and load balancers. Cost: Predictable budgets via Azure Pricing Calculator, Budgets, and Cost Management.',
        summaryFr: 'Performance : Débit garanti par l’autoscaling et les répartiteurs de charge. Coût : Budgets prévisibles via le calculateur Azure et Azure Cost Management.',
        examTipEn: 'Azure Advisor provides recommendations across Cost, Security, Reliability, Performance, and Operational Excellence.',
        examTipFr: 'Azure Advisor fournit des recommandations sur les coûts, la sécurité, la fiabilité, les performances et l’excellence opérationnelle.',
      },
    ],
  },
  {
    id: 'task-1-3',
    titleEn: '1.3 Describe Cloud Service Types (IaaS, PaaS, SaaS)',
    titleFr: '1.3 Décrire les Types de Services Cloud (IaaS, PaaS, SaaS)',
    weight: '30% of Domain 1',
    descriptionEn: 'Deep dive into Infrastructure as a Service (IaaS), Platform as a Service (PaaS), Software as a Service (SaaS), Serverless computing, and appropriate use cases.',
    descriptionFr: 'Étude approfondie de l’IaaS, du PaaS, du SaaS, du calcul Serverless et des cas d’usage appropriés.',
    keyConcepts: [
      {
        nameEn: 'Infrastructure as a Service (IaaS)',
        nameFr: 'Infrastructure en tant que Service (IaaS)',
        summaryEn: 'Renting raw compute, networking, and storage. Microsoft manages physical datacenter and virtualization; customer manages OS, patching, middleware, and applications.',
        summaryFr: 'Location de calcul, réseau et stockage bruts. Microsoft gère le datacenter physique et l’hyperviseur ; le client gère l’OS, les correctifs, le middleware et les applications.',
        examTipEn: 'Azure Virtual Machines is the primary IaaS service. Best for lift-and-shift migrations.',
        examTipFr: 'Azure Virtual Machines est le service IaaS de référence. Idéal pour les migrations lift-and-shift.',
      },
      {
        nameEn: 'Platform as a Service (PaaS)',
        nameFr: 'Plateforme en tant que Service (PaaS)',
        summaryEn: 'Managed development and deployment runtime. Microsoft manages OS patching, database engines, and runtime; customer only manages application code and data.',
        summaryFr: 'Environnement de développement managé. Microsoft gère les correctifs OS, les moteurs de base de données et l’exécution ; le client gère le code et les données.',
        examTipEn: 'Azure App Service and Azure SQL Database are flagship PaaS services without OS management overhead.',
        examTipFr: 'Azure App Service et Azure SQL Database sont les services PaaS phares sans gestion d’OS.',
      },
      {
        nameEn: 'Software as a Service (SaaS) & Serverless',
        nameFr: 'Logiciel en tant que Service (SaaS) & Serverless',
        summaryEn: 'SaaS: Complete end-user application (Microsoft 365) consumed via browser. Serverless: Event-driven execution (Azure Functions) that scales to zero with millisecond billing.',
        summaryFr: 'SaaS : Logiciel prêt à l’emploi (Microsoft 365) via navigateur. Serverless : Exécution orientée événements (Azure Functions) avec facturation à la milliseconde.',
        examTipEn: 'In Serverless, you pay zero dollars when no code is running (zero idle cost).',
        examTipFr: 'En Serverless, vous payez zéro euro lorsque le code ne s’exécute pas (aucun coût d’inactivité).',
      },
    ],
  },
];

export const SHARED_RESPONSIBILITY_TABLE = [
  {
    layerEn: 'Information & Data',
    layerFr: 'Informations & Données',
    onPrem: 'Customer',
    iaas: 'Customer',
    paas: 'Customer',
    saas: 'Customer',
  },
  {
    layerEn: 'Devices & Endpoints',
    layerFr: 'Appareils & Terminaux',
    onPrem: 'Customer',
    iaas: 'Customer',
    paas: 'Customer',
    saas: 'Customer',
  },
  {
    layerEn: 'Accounts & Identities',
    layerFr: 'Comptes & Identités',
    onPrem: 'Customer',
    iaas: 'Customer',
    paas: 'Customer',
    saas: 'Customer',
  },
  {
    layerEn: 'Application Code',
    layerFr: 'Code Applicatif',
    onPrem: 'Customer',
    iaas: 'Customer',
    paas: 'Customer',
    saas: 'Microsoft',
  },
  {
    layerEn: 'Network Controls (NSG / Routing)',
    layerFr: 'Contrôles Réseau (NSG / Routage)',
    onPrem: 'Customer',
    iaas: 'Customer',
    paas: 'Shared',
    saas: 'Microsoft',
  },
  {
    layerEn: 'Operating System & Patching',
    layerFr: 'Système d’Exploitation & Correctifs',
    onPrem: 'Customer',
    iaas: 'Customer',
    paas: 'Microsoft',
    saas: 'Microsoft',
  },
  {
    layerEn: 'Physical Hosts & Virtualization',
    layerFr: 'Hôtes Physiques & Virtualisation',
    onPrem: 'Customer',
    iaas: 'Microsoft',
    paas: 'Microsoft',
    saas: 'Microsoft',
  },
  {
    layerEn: 'Physical Data Center & Network',
    layerFr: 'Datacenter Physique & Réseau',
    onPrem: 'Customer',
    iaas: 'Microsoft',
    paas: 'Microsoft',
    saas: 'Microsoft',
  },
];
