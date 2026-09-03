export type ActiveTab =
  | 'career-pathways'
  | 'my-study-dashboard'
  | 'practice-exam-lab'
  | 'cheatsheets-and-playground'
  | 'clf-c02-hub';

export type Provider = 'all' | 'aws' | 'azure' | 'gcp' | 'k8s' | 'comptia';

export interface CertificationDomainWeight {
  name: string;
  weight: string;
}

export interface RecommendedCert {
  provider: 'AWS' | 'AZURE' | 'GCP' | 'COMPTIA' | 'ISC2' | 'K8S';
  name: string;
  code: string;
  url: string;
  programUrl?: string;
  description?: string;
  passingScore?: string;
  examDuration?: string;
  questionsCount?: string;
  domains?: CertificationDomainWeight[];
}

export interface OptionalCert {
  name: string;
  code?: string;
  url: string;
  programUrl?: string;
  provider?: 'AWS' | 'AZURE' | 'GCP' | 'COMPTIA' | 'ISC2' | 'K8S';
}

export interface CertificationPathway {
  id: string;
  goalNumber: string;
  goalSub: string;
  title: string;
  badge: string;
  badgeType: 'entry' | 'popular' | 'code' | 'growth' | 'security' | 'devops';
  timeEstimate: string;
  description: string;
  recommendedCerts: RecommendedCert[];
  optionalCert?: string | OptionalCert;
  metric1Label: string;
  metric1Value: string;
  metric1Progress?: number;
  salaryBenchmark?: string;
  providers: Provider[];
}

export interface MatrixRowCert {
  name: string;
  code: string;
  url: string;
  programUrl?: string;
  provider: 'AWS' | 'AZURE' | 'GCP' | 'COMPTIA' | 'ISC2' | 'K8S';
}

export interface MatrixRow {
  id: string;
  goal: string;
  subGoal: string;
  certifications: string;
  certList?: MatrixRowCert[];
  tags: string[];
  domainLevel: string;
  levelBadgeClass: string;
}

export interface ServiceEquivalency {
  id: string;
  domain: string;
  icon: string;
  iconColor: string;
  aws: {
    name: string;
    detail: string;
  };
  azure: {
    name: string;
    detail: string;
  };
  gcp: {
    name: string;
    detail: string;
  };
  k8s: {
    name: string;
    detail: string;
  };
  pivot: string;
  keywords: string;
}

export interface ExamQuestion {
  id: number;
  domain: string;
  estimatedTime: string;
  stem: string;
  subStem?: string;
  options: Array<{
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
  }>;
  correctOption: 'A' | 'B' | 'C' | 'D';
  correctExplanation: string;
  distractorExplanations: {
    [key in 'A' | 'B' | 'C' | 'D']?: string;
  };
  diagramTitle?: string;
  referenceDoc: string;
  flagged?: boolean;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  eliminatedOptions?: Array<'A' | 'B' | 'C' | 'D'>;
}

export interface TopologyInspectionNode {
  title: string;
  tier: string;
  badge: string;
  badgeColor: string;
  desc: string;
  multiCloud: {
    azure: string;
    gcp: string;
    k8s: string;
  };
  note: string;
}

export interface CramCard {
  id: string;
  badge: string;
  badgeColor: string;
  type: string;
  title: string;
  description: string;
  items: Array<{
    label: string;
    subLabel: string;
    tag: string;
    tagColor: string;
    isCode?: boolean;
  }>;
  footerNote: string;
  provider: 'aws' | 'azure' | 'k8s';
  pinned?: boolean;
}
