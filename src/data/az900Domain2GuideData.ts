export interface Az900Domain2TopicSection {
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

export const AZ900_DOMAIN_2_METADATA = {
  examCode: 'AZ-900',
  examName: 'Microsoft Azure Fundamentals',
  domainNumber: 2,
  domainNameEn: 'Domain 2: Describe Azure architecture and services',
  domainNameFr: 'Domaine 2 : Décrire l’architecture et les services Azure',
  weight: '35–40%',
  passingScore: '700 / 1000',
  descriptionEn: 'Heaviest domain in the AZ-900 exam (35-40%). Covers core Azure infrastructure (Regions, Availability Zones, Management Groups), compute services (VMs, VMSS, AVD, Containers, Functions), networking (VNets, Peering, Bastion, ExpressRoute), storage solutions (Blobs, Files, Tiers, Redundancy), and identity/security (Entra ID, RBAC, Zero Trust, Sentinel).',
  descriptionFr: 'Domaine le plus lourd de l’examen AZ-900 (35-40%). Couvre l’infrastructure Azure de base (Régions, Zones de Disponibilité, Groupes d’Aménagement), les services de calcul (VMs, VMSS, AVD, Conteneurs, Functions), le réseau (VNets, Peering, Bastion, ExpressRoute), le stockage (Blobs, Fichiers, Niveaux, Redondance), et l’identité/sécurité (Entra ID, RBAC, Zero Trust, Sentinel).',
};

export const AZ900_DOMAIN_2_TASKS: Az900Domain2TopicSection[] = [
  {
    id: 'task-2-1',
    titleEn: '2.1 Describe Core Architectural Components of Azure',
    titleFr: '2.1 Décrire les Composants Architecturaux de Base d’Azure',
    weight: '25% of Domain 2',
    descriptionEn: 'Regions, Availability Zones, Datacenters, Region Pairs, Sovereign Clouds (US Government, China), Subscriptions, Management Groups, and Azure Resource Manager (ARM/Bicep).',
    descriptionFr: 'Régions, Zones de Disponibilité, Datacenters, Paires de Régions, Clouds Souverains (US Gov, Chine), Abonnements, Groupes d’Aménagement et ARM/Bicep.',
    keyConcepts: [
      {
        nameEn: 'Azure Regions & Availability Zones',
        nameFr: 'Régions Azure & Zones de Disponibilité',
        summaryEn: 'A Region is a geographic area with 1+ datacenters linked by low-latency fiber. Availability Zones are physically isolated datacenters with separate power, cooling, and networking (offering a 99.99% VM SLA).',
        summaryFr: 'Une Région est une zone géographique avec 1+ datacenters reliés par fibre à faible latence. Les Zones de Disponibilité sont des datacenters isolés avec alimentation/refroidissement indépendants (SLA VM 99,99%).',
        examTipEn: 'Availability Zones protect against whole-datacenter disasters within a single region.',
        examTipFr: 'Les Zones de Disponibilité protègent contre les pannes complètes de datacenter au sein d’une région.',
      },
      {
        nameEn: 'Management Hierarchy (MG -> Sub -> RG -> Resource)',
        nameFr: 'Hiérarchie de Gestion (MG -> Sub -> RG -> Ressource)',
        summaryEn: 'Four levels of management: Management Groups (governance across subscriptions) -> Subscriptions (billing/quota boundary) -> Resource Groups (logical deployment containers) -> Resources.',
        summaryFr: 'Quatre niveaux de gestion : Groupes de gestion (gouvernance multi-abonnements) -> Abonnements (facturation/quotas) -> Groupes de ressources (conteneurs logiques) -> Ressources.',
        examTipEn: 'Policies and RBAC permissions cascade downward from Management Groups to child Subscriptions and Resource Groups.',
        examTipFr: 'Les stratégies et rôles RBAC héritent vers le bas depuis les groupes de gestion vers les abonnements et groupes de ressources.',
      },
      {
        nameEn: 'Azure Resource Manager (ARM) & Bicep',
        nameFr: 'Azure Resource Manager (ARM) & Bicep',
        summaryEn: 'ARM provides a consistent management layer via REST API. ARM Templates (JSON) and Bicep provide declarative Infrastructure as Code (IaC) with idempotency.',
        summaryFr: 'ARM fournit une couche de gestion unifiée via API REST. Les modèles ARM (JSON) et Bicep permettent une Infrastructure as Code (IaC) déclarative et idempotente.',
        examTipEn: 'Resource locks (CanNotDelete and ReadOnly) override RBAC permissions, preventing accidental deletion even by Owners.',
        examTipFr: 'Les verrous de ressources (CanNotDelete et ReadOnly) prévalent sur les permissions RBAC, empêchant même les Propriétaires de supprimer la ressource.',
      },
    ],
  },
  {
    id: 'task-2-2',
    titleEn: '2.2 Describe Azure Compute and Networking Services',
    titleFr: '2.2 Décrire les Services de Calcul et Réseau Azure',
    weight: '30% of Domain 2',
    descriptionEn: 'Virtual Machines, Scale Sets (VMSS), App Service, Azure Virtual Desktop (AVD), Containers (ACI, AKS), Functions, VNets, Peering, Bastion, VPN Gateway, and ExpressRoute.',
    descriptionFr: 'Machines Virtuelles, Jeux de Mise à l’Échelle (VMSS), App Service, Azure Virtual Desktop, Conteneurs (ACI, AKS), Functions, VNets, Peering, Bastion, Passerelle VPN et ExpressRoute.',
    keyConcepts: [
      {
        nameEn: 'Compute Selection: VMs vs. Containers vs. Serverless',
        nameFr: 'Choix de Calcul : VMs vs Conteneurs vs Serverless',
        summaryEn: 'VMs: Full OS control for lift-and-shift. App Service: PaaS web hosting without OS maintenance. ACI: Simple container execution without orchestrator. AKS: Enterprise Kubernetes cluster. Functions: Event-driven code snippets scaling to zero.',
        summaryFr: 'VMs : Contrôle OS complet pour lift-and-shift. App Service : Hébergement web PaaS sans maintenance OS. ACI : Exécution simple de conteneurs sans orchestrateur. AKS : Cluster Kubernetes d’entreprise. Functions : Code orienté événements avec échelle à zéro.',
        examTipEn: 'Azure Virtual Desktop (AVD) features exclusive Windows 10/11 multi-session to reduce desktop compute costs.',
        examTipFr: 'Azure Virtual Desktop (AVD) propose la fonctionnalité exclusive multi-session Windows 10/11 pour réduire les coûts.',
      },
      {
        nameEn: 'Azure Virtual Network (VNet) & Peering',
        nameFr: 'Réseau Virtuel Azure (VNet) & Peering',
        summaryEn: 'VNets provide private network isolation. Azure reserves 5 IP addresses per subnet. VNet Peering links VNets via Microsoft fiber without public internet; peering is non-transitive.',
        summaryFr: 'Les VNets offrent une isolation réseau privée. Azure réserve 5 adresses IP par sous-réseau. Le Peering relie les VNets via la fibre Microsoft sans internet public ; il est non-transitif.',
        examTipEn: '5 reserved IPs per subnet (.0, .1, .2, .3, .255). A /24 subnet has 251 usable IP addresses for VMs.',
        examTipFr: '5 adresses IP réservées par sous-réseau (.0, .1, .2, .3, .255). Un sous-réseau /24 a 251 adresses utilisables.',
      },
      {
        nameEn: 'Hybrid Connectivity: VPN vs. ExpressRoute & Bastion',
        nameFr: 'Connectivité Hybride : VPN vs ExpressRoute & Bastion',
        summaryEn: 'VPN Gateway: Encrypted IPsec tunnels over public internet. ExpressRoute: Private, dedicated physical fiber bypassing the internet. Azure Bastion: Secure browser-based RDP/SSH without public IPs.',
        summaryFr: 'Passerelle VPN : Tunnels IPsec chiffrés sur internet public. ExpressRoute : Fibre physique privée dédiée évitant internet. Azure Bastion : RDP/SSH sécurisé par navigateur sans IP publique.',
        examTipEn: 'If connection must NOT travel over the public internet, select ExpressRoute. If managing VMs without public IPs, select Bastion.',
        examTipFr: 'Si la connexion NE DOIT PAS passer par internet, choisir ExpressRoute. Pour administrer les VMs sans IP publique, choisir Bastion.',
      },
    ],
  },
  {
    id: 'task-2-3',
    titleEn: '2.3 Describe Azure Storage Services',
    titleFr: '2.3 Décrire les Services de Stockage Azure',
    weight: '25% of Domain 2',
    descriptionEn: 'Storage Accounts, Blob Storage (Hot, Cool, Cold, Archive tiers), Azure Files, File Sync, Queues, Tables, Managed Disks, and Redundancy options (LRS, ZRS, GRS, GZRS).',
    descriptionFr: 'Comptes de stockage, Stockage Blob (Niveaux Chaud, Froid, Très Froid, Archive), Azure Files, File Sync, Files d’Attente, Tables, Disques Managés et Redondance (LRS, ZRS, GRS, GZRS).',
    keyConcepts: [
      {
        nameEn: 'Blob Storage Access Tiers',
        nameFr: 'Niveaux d’Accès du Stockage Blob',
        summaryEn: 'Hot: Frequent access, low transaction cost. Cool: Infrequent access, 30-day min. Cold: Rare access, 90-day min. Archive: Offline storage, 180-day min, lowest storage cost, requires up to 15 hours rehydration.',
        summaryFr: 'Chaud : Accès fréquent, faible coût de transaction. Froid : Accès occasionnel, min 30 jours. Très Froid : Accès rare, min 90 jours. Archive : Stockage hors ligne, min 180 jours, réhydratation jusqu’à 15h.',
        examTipEn: 'Archive data is offline and cannot be read until rehydrated. Lifecycle management automates tier transitions.',
        examTipFr: 'Les données en Archive sont hors ligne et illisibles sans réhydratation. La gestion du cycle de vie automatise les transitions.',
      },
      {
        nameEn: 'Storage Redundancy (LRS, ZRS, GRS, GZRS, RA-GRS)',
        nameFr: 'Redondance du Stockage (LRS, ZRS, GRS, GZRS, RA-GRS)',
        summaryEn: 'LRS: 3 copies in 1 datacenter. ZRS: 3 copies across 3 AZs. GRS: 3 copies primary + 3 copies secondary paired region (6 total). RA-GRS: Secondary region read-access without failover.',
        summaryFr: 'LRS : 3 copies dans 1 datacenter. ZRS : 3 copies sur 3 AZs. GRS : 3 copies primaire + 3 copies secondaire (6 total). RA-GRS : Accès en lecture sur la région secondaire sans basculement.',
        examTipEn: 'ZRS protects against datacenter disasters. GRS protects against whole-region catastrophes hundreds of miles away.',
        examTipFr: 'ZRS protège contre la perte d’un datacenter. GRS protège contre une catastrophe régionale majeure.',
      },
      {
        nameEn: 'Storage Migration: AzCopy, Storage Explorer & Data Box',
        nameFr: 'Migration de Stockage : AzCopy, Storage Explorer & Data Box',
        summaryEn: 'AzCopy: Fast command-line utility for bulk transfers. Storage Explorer: GUI desktop app (Win/Mac/Linux). Data Box: Shipped physical hardware appliances (up to 500 TB) for petabyte offline data transfers.',
        summaryFr: 'AzCopy : Outil CLI performant pour transferts en masse. Storage Explorer : Application de bureau graphique. Data Box : Boîtier physique expédié (jusqu’à 500 To) pour transfert hors ligne.',
        examTipEn: 'Use Data Box when network bandwidth is too slow to transfer tens or hundreds of terabytes over internet.',
        examTipFr: 'Utiliser Data Box lorsque la bande passante réseau est trop lente pour transférer des dizaines/centaines de téraoctets.',
      },
    ],
  },
  {
    id: 'task-2-4',
    titleEn: '2.4 Describe Azure Identity, Access, and Security',
    titleFr: '2.4 Décrire l’Identité, l’Accès et la Sécurité Azure',
    weight: '20% of Domain 2',
    descriptionEn: 'Microsoft Entra ID, SSO, MFA, Passwordless, Conditional Access, Azure RBAC, Zero Trust, Defense in Depth, Microsoft Defender for Cloud, Sentinel, and Purview.',
    descriptionFr: 'Microsoft Entra ID, SSO, MFA, Sans mot de passe, Accès Conditionnel, Azure RBAC, Zero Trust, Défense en Profondeur, Defender pour le Cloud, Sentinel et Purview.',
    keyConcepts: [
      {
        nameEn: 'Microsoft Entra ID & Authentication',
        nameFr: 'Microsoft Entra ID & Authentification',
        summaryEn: 'Entra ID provides cloud IAM using REST APIs (OAuth 2.0/SAML/OIDC). Features include Single Sign-On (SSO), Multi-Factor Authentication (MFA), Passwordless (FIDO2/Authenticator), and Conditional Access (If-Then rules).',
        summaryFr: 'Entra ID fournit l’IAM cloud via APIs REST (OAuth/SAML). Inclut le SSO, l’authentification multifacteur (MFA), le sans mot de passe (FIDO2/Authenticator) et l’accès conditionnel (règles Si-Alors).',
        examTipEn: 'Conditional Access evaluates signals (User, Location, Device, Risk) to enforce access controls (Block, Require MFA).',
        examTipFr: 'L’accès conditionnel évalue les signaux (Utilisateur, Emplacement, Appareil, Risque) pour appliquer les contrôles (Bloquer, Exiger MFA).',
      },
      {
        nameEn: 'Azure Role-Based Access Control (RBAC)',
        nameFr: 'Contrôle d’Accès Basé sur les Rôles (Azure RBAC)',
        summaryEn: 'Enforces Least Privilege on Azure resources. Built-in roles: Owner (full control + access grant), Contributor (create/delete resources, CANNOT grant access), Reader (read-only), User Access Admin (manages access only).',
        summaryFr: 'Applique le moindre privilège sur les ressources Azure. Rôles clés : Propriétaire (contrôle total + gestion des accès), Collaborateur (crée/supprime, NE PEUT PAS gérer les accès), Lecteur (lecture seule).',
        examTipEn: 'Contributor CANNOT grant permissions to others. Permissions inherit: MG -> Subscription -> RG -> Resource.',
        examTipFr: 'Le Collaborateur NE PEUT PAS attribuer de permissions à d’autres. L’héritage est : MG -> Subscription -> RG -> Resource.',
      },
      {
        nameEn: 'Zero Trust, Defender for Cloud & Microsoft Sentinel',
        nameFr: 'Zero Trust, Defender for Cloud & Microsoft Sentinel',
        summaryEn: 'Zero Trust: Verify explicitly, Least privilege, Assume breach. Defender for Cloud: Cloud Security Posture (Secure Score) & Workload Protection. Microsoft Sentinel: Cloud-native SIEM & SOAR for threat detection/remediation.',
        summaryFr: 'Zero Trust : Vérifier explicitement, Moindre privilège, Supposer la violation. Defender pour le Cloud : Posture de sécurité (Secure Score). Microsoft Sentinel : SIEM & SOAR pour la détection et remédiation automatisée.',
        examTipEn: 'Microsoft Sentinel uses Azure Logic Apps playbooks for automated incident response (SOAR).',
        examTipFr: 'Microsoft Sentinel utilise des playbooks basés sur Azure Logic Apps pour la réponse automatisée aux incidents (SOAR).',
      },
    ],
  },
];

export const STORAGE_TIERS_COMPARISON_TABLE = [
  {
    tier: 'Hot',
    nameFr: 'Chaud',
    accessFreqEn: 'Frequently accessed',
    accessFreqFr: 'Accès très fréquent',
    minRetention: 'None',
    latencyEn: 'Milliseconds (Online)',
    latencyFr: 'Millisecondes (En ligne)',
    storageCost: 'Highest',
    accessCost: 'Lowest',
  },
  {
    tier: 'Cool',
    nameFr: 'Froid',
    accessFreqEn: 'Infrequently accessed',
    accessFreqFr: 'Accès occasionnel',
    minRetention: '30 days',
    latencyEn: 'Milliseconds (Online)',
    latencyFr: 'Millisecondes (En ligne)',
    storageCost: 'Lower',
    accessCost: 'Higher',
  },
  {
    tier: 'Cold',
    nameFr: 'Très Froid',
    accessFreqEn: 'Rarely accessed',
    accessFreqFr: 'Accès rare',
    minRetention: '90 days',
    latencyEn: 'Milliseconds (Online)',
    latencyFr: 'Millisecondes (En ligne)',
    storageCost: 'Very Low',
    accessCost: 'Very High',
  },
  {
    tier: 'Archive',
    nameFr: 'Archive',
    accessFreqEn: 'Rarely / Long-term',
    accessFreqFr: 'Archivage à long terme',
    minRetention: '180 days',
    latencyEn: 'Up to 15 hours (Offline)',
    latencyFr: 'Jusqu’à 15h (Hors ligne)',
    storageCost: 'Lowest',
    accessCost: 'Highest',
  },
];

export const STORAGE_REDUNDANCY_COMPARISON_TABLE = [
  {
    code: 'LRS',
    nameEn: 'Locally Redundant Storage',
    nameFr: 'Stockage Localement Redondant',
    copies: 3,
    locationsEn: '1 physical datacenter (single facility)',
    locationsFr: '1 datacenter physique (site unique)',
    durability: '11 nines (99.999999999%)',
    resilienceEn: 'Server, disk, rack failure',
    resilienceFr: 'Panne de serveur, disque, baie',
  },
  {
    code: 'ZRS',
    nameEn: 'Zone-Redundant Storage',
    nameFr: 'Stockage Redondant par Zone',
    copies: 3,
    locationsEn: '3 separate Availability Zones (same region)',
    locationsFr: '3 Zones de Disponibilité distinctes (même région)',
    durability: '12 nines (99.9999999999%)',
    resilienceEn: 'Whole datacenter outage / disaster',
    resilienceFr: 'Panne complète d’un datacenter / sinistre',
  },
  {
    code: 'GRS',
    nameEn: 'Geo-Redundant Storage',
    nameFr: 'Stockage Géo-Redondant',
    copies: 6,
    locationsEn: 'Primary (3 in 1 DC) + Paired Region (3 in 1 DC)',
    locationsFr: 'Primaire (3 dans 1 DC) + Région Paire (3 dans 1 DC)',
    durability: '16 nines (99.99999999999999%)',
    resilienceEn: 'Complete regional disaster / catastrophe',
    resilienceFr: 'Catastrophe / sinistre régional complet',
  },
  {
    code: 'GZRS',
    nameEn: 'Geo-Zone-Redundant Storage',
    nameFr: 'Stockage Géo-Zone-Redondant',
    copies: 6,
    locationsEn: 'Primary (3 zones) + Paired Region (3 in 1 DC)',
    locationsFr: 'Primaire (3 zones) + Région Paire (3 dans 1 DC)',
    durability: '16 nines (99.99999999999999%)',
    resilienceEn: 'Primary zone outage + full regional catastrophe',
    resilienceFr: 'Panne de zone primaire + catastrophe régionale',
  },
];
