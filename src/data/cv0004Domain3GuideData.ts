import { DomainTask } from './cv0004Domain1GuideData';

export const CV0_004_DOMAIN_3_TASKS: DomainTask[] = [
  {
    id: 'task-3-1',
    title: '3.1 Cloud Deployment Methodologies & Orchestration',
    subtitle: 'IaC (Terraform, Bicep, Ansible), CI/CD Pipelines, Blue/Green, Canary, Kubernetes & GitOps',
    weight: '22% of Domain',
    cardRange: 'Cards 201–220',
    subObjectives: [
      'Contrast declarative (Terraform, CloudFormation, Bicep) with imperative (CLI, scripts) IaC models',
      'Select CI/CD release strategies: Blue/Green (instant rollback), Canary (traffic ramp), Rolling (zero-downtime batch)',
      'Manage container orchestration using Kubernetes Deployments, StatefulSets, DaemonSets, and Ingress controllers',
      'Package and template multi-cloud container manifests using Helm charts and values files',
      'Implement GitOps continuous delivery (ArgoCD, Flux) using automated Git repository reconciliation',
    ],
    keyExamTakeaway:
      'Declarative IaC defines desired end state; imperative defines explicit procedural steps. Blue/Green requires duplicate environments and offers immediate zero-downtime rollback. DaemonSets run exactly one pod replica per node (ideal for logging/monitoring agents). StatefulSets provide persistent identities and stable storage.',
  },
  {
    id: 'task-3-2',
    title: '3.2 Cloud Compute, Storage & Network Maintenance & Optimization',
    subtitle: 'Auto-Scaling Policies, Cooldowns, Spot Instances, Volume Resizing, Tiering & IPAM',
    weight: '22% of Domain',
    cardRange: 'Cards 221–240',
    subObjectives: [
      'Configure auto-scaling policies: Target tracking, step scaling, scheduled scaling, and cooldown timers',
      'Manage VM maintenance: Live migration (vMotion/Azure Live Migration), hypervisor maintenance, and Spot eviction handling',
      'Perform non-disruptive cloud storage maintenance: Online block volume expansion (growpart/resize2fs), IOPS provisioning, and tiering',
      'Configure object storage lifecycle transitions (Standard -> Infrequent Access -> Archive) and multipart upload rules',
      'Maintain cloud networks: IPAM address conflict prevention, secondary CIDRs, route tables, DNS TTL lowering, and CDN cache invalidations',
    ],
    keyExamTakeaway:
      'Cooldown periods prevent scaling thrashing/flapping while new instances initialize. Expanding cloud block storage requires two steps: expanding the volume in the cloud console, then expanding the OS partition/filesystem (growpart + xfs_growfs/resize2fs). Lower DNS TTL to 60–300 seconds prior to migration cutovers.',
  },
  {
    id: 'task-3-3',
    title: '3.3 Backup and Restore Operations',
    subtitle: 'Full, Incremental & Differential, VSS Application-Consistent Backups, Air-Gapped Vaults & PITR',
    weight: '20% of Domain',
    cardRange: 'Cards 241–260',
    subObjectives: [
      'Distinguish backup mechanics: Full, Incremental (changes since last backup), and Differential (changes since last full)',
      'Enforce consistency levels: Crash-consistent vs Application-consistent (VSS writers / pre-freeze scripts)',
      'Establish cross-region and cross-account air-gapped backup replication for ransomware resilience',
      'Implement Point-in-Time Recovery (PITR) with continuous database write-ahead log (WAL) archiving',
      'Conduct automated restore drills and validate backup integrity using cryptographic checksums (SHA-256)',
    ],
    keyExamTakeaway:
      'Incremental backups take less time and storage to create but take longest to restore (Full + all subsequent incrementals). Differential backups take longer to create over time but require only Full + latest Differential to restore. Application-consistent backups quiesce dirty in-memory buffers using VSS or pre-freeze scripts.',
  },
  {
    id: 'task-3-4',
    title: '3.4 Cloud Performance & Capacity Monitoring',
    subtitle: 'Metrics, Logs & Distributed Traces (OpenTelemetry), Agent vs Agentless, APM, Synthetic Canaries & Alarms',
    weight: '18% of Domain',
    cardRange: 'Cards 261–280',
    subObjectives: [
      'Synthesize the three pillars of cloud observability: Metrics (time-series), Logs (events), and Traces (spans/correlation IDs)',
      'Compare agent-based monitoring (OS-level memory, disk space, processes) with agentless hypervisor metrics',
      'Monitor end-user performance using Synthetic Canaries (scripted headless browsers) and Real User Monitoring (RUM)',
      'Profile application code, slow database queries, and thread dumps using Application Performance Monitoring (APM)',
      'Prevent alert fatigue with anomaly detection, composite alarms (CPU > 85% AND 5xx > 5%), and deduplication',
    ],
    keyExamTakeaway:
      'Hypervisors cannot see guest OS memory utilization or disk space without an in-guest monitoring agent installed. Synthetic monitoring detects outages proactively before real users arrive; RUM captures actual end-user browser latencies. Distributed tracing correlates requests across microservices via trace and span IDs.',
  },
  {
    id: 'task-3-5',
    title: '3.5 Identity & Resource Life-Cycle Management',
    subtitle: 'Tagging Strategies, Cost Allocation, Orphaned Resource Janitors, Resource Locks & CAB Decommissioning',
    weight: '18% of Domain',
    cardRange: 'Cards 281–300',
    subObjectives: [
      'Enforce mandatory resource tagging schemas for cost allocation, environment isolation, and automated scheduling',
      'Detect and eliminate cloud resource sprawl: Orphaned unattached block volumes, idle public IPs, and zombie instances',
      'Protect mission-critical cloud resources using Read-Only and Cannot-Delete Resource Locks',
      'Automate enterprise multi-account landing zones and vending machines with baseline guardrails',
      'Execute formal Change Management: Change Advisory Board (CAB) review, maintenance windows, and graceful draining',
    ],
    keyExamTakeaway:
      'Orphaned unattached volumes and unassociated Elastic/Public IPs continue accruing costs even when instances are terminated. Cannot-Delete resource locks override IAM admin permissions until explicitly removed. Connection draining (deregistration delay) allows in-flight HTTP requests to finish before instance termination.',
  },
];

export interface ComparisonTableRow {
  criteria: string;
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
  examHighlight: string;
}

// Table 1: Deployment Release Strategies
export const DEPLOYMENT_STRATEGIES_COMPTIA_TABLE: ComparisonTableRow[] = [
  {
    criteria: 'Traffic Routing Mechanism',
    col1: 'DNS / Load Balancer instantaneous cutover (100% flip)',
    col2: 'Weighted load balancing / ingress routing (e.g., 90% old / 10% new)',
    col3: 'Batch replacement in autoscaling groups (e.g., 25% at a time)',
    col4: 'Complete teardown of existing fleet before deploying new fleet',
    examHighlight: 'Blue/Green provides instantaneous cutover; Canary allows real-world risk mitigation on a small traffic slice.',
  },
  {
    criteria: 'Infrastructure Footprint & Cost',
    col1: 'High (requires 2x full production capacity during deployment)',
    col2: 'Low to Medium (small incremental capacity for canary pods/instances)',
    col3: 'Minimal (uses existing pool or small surge buffer, e.g., maxSurge)',
    col4: 'Zero extra capacity required (reuses identical compute resources)',
    examHighlight: 'Blue/Green temporarily doubles infrastructure costs until older environment is decommissioned.',
  },
  {
    criteria: 'Downtime & Service Interruption',
    col1: 'Zero downtime during cutover',
    col2: 'Zero downtime; continuous availability',
    col3: 'Zero downtime if minimum healthy percentage is maintained',
    col4: 'Definite downtime during shutdown and replacement phase',
    examHighlight: 'Recreate strategy induces downtime and is only used when stateful database schemas cannot coexist.',
  },
  {
    criteria: 'Rollback Speed & Complexity',
    col1: 'Instantaneous (flip DNS or target group router back to Blue)',
    col2: 'Fast (drop canary weighting to 0% if error thresholds spike)',
    col3: 'Moderate (requires reverse rolling update across instance batches)',
    col4: 'Slow (requires full redeployment of previous version fleet)',
    examHighlight: 'Blue/Green offers the fastest and safest rollback because the previous Blue environment is still idle and warm.',
  },
  {
    criteria: 'CompTIA CV0-004 Exam Scenario',
    col1: 'Mission-critical apps where immediate rollback is paramount and cost is secondary',
    col2: 'Testing experimental features or validating error rates against production telemetry',
    col3: 'Standard production deployments with stable backward-compatible APIs',
    col4: 'Legacy apps, monolithic databases, or dev environments where downtime is tolerated',
    examHighlight: 'Watch for scenarios asking for "gradual deployment with automatic rollback on error spikes" -> Canary.',
  },
];

// Table 2: IaC and Configuration Management
export const IAC_CONFIGURATION_MGMT_COMPTIA_TABLE: ComparisonTableRow[] = [
  {
    criteria: 'Paradigm / Execution Model',
    col1: 'Declarative (defines desired end-state; engine computes diff)',
    col2: 'Declarative (hybrid; uses YAML playbooks with task execution)',
    col3: 'Declarative (uses Puppet DSL manifests with client-server agent)',
    col4: 'Imperative / Procedural (defines exact sequence of commands/scripts)',
    examHighlight: 'Declarative tools ensure idempotency: executing the template multiple times produces the exact same state.',
  },
  {
    criteria: 'Agent Architecture',
    col1: 'Agentless (calls cloud provider REST APIs directly)',
    col2: 'Agentless (connects via SSH for Linux, WinRM for Windows)',
    col3: 'Agent-based (Puppet Agent runs on guest and polls Puppet Master)',
    col4: 'Agentless (runs locally on client or bastion machine)',
    examHighlight: 'Ansible is strictly agentless over SSH/WinRM; Terraform is agentless over cloud REST APIs.',
  },
  {
    criteria: 'State File Management',
    col1: 'Explicit state file (terraform.tfstate, remote locking in S3/DynamoDB)',
    col2: 'No state file (queries live systems dynamically per task)',
    col3: 'Managed by PuppetDB / Puppet Master catalog',
    col4: 'No state file; script blindly re-executes commands',
    examHighlight: 'Terraform state locking prevents concurrent modifications and catastrophic state corruption.',
  },
  {
    criteria: 'Primary Use Case',
    col1: 'Provisioning cloud infrastructure (VPCs, subnets, VMs, DBs, IAM)',
    col2: 'In-guest configuration, package installation, patching & service restarts',
    col3: 'Continuous drift enforcement and enterprise fleet compliance',
    col4: 'Ad-hoc automation, emergency fixes, and single-run operational tasks',
    examHighlight: 'Terraform provisions the infrastructure; Ansible/Chef/Puppet configures the operating systems inside.',
  },
];

// Table 3: Backup Types & Consistency
export const BACKUP_TYPES_CONSISTENCY_COMPTIA_TABLE: ComparisonTableRow[] = [
  {
    criteria: 'Data Captured',
    col1: 'Entire dataset / all selected blocks regardless of change',
    col2: 'Only data blocks modified since the LAST backup of any type',
    col3: 'Only data blocks modified since the LAST FULL backup',
    col4: 'Point-in-time storage block state (Copy-on-Write / Redirect-on-Write)',
    examHighlight: 'Incremental captures changes since ANY prior backup; Differential captures changes since LAST FULL.',
  },
  {
    criteria: 'Backup Window Duration',
    col1: 'Longest backup window (copies 100% of data)',
    col2: 'Shortest backup window (smallest daily delta)',
    col3: 'Grows progressively larger each day until next full backup',
    col4: 'Near-instantaneous creation (metadata pointer swap)',
    examHighlight: 'Incremental has the fastest daily backup window; Full has the longest backup window.',
  },
  {
    criteria: 'Restore Chain Complexity & Time',
    col1: 'Fastest restore (requires only the single full backup media)',
    col2: 'Slowest restore (requires Full + every consecutive Incremental in sequence)',
    col3: 'Fast restore (requires only Full + the latest Differential backup)',
    col4: 'Instantaneous mount or restore to new cloud volume',
    examHighlight: 'Differential requires only 2 backup sets to restore (Full + last Diff); Incremental requires the entire chain.',
  },
  {
    criteria: 'Consistency Level (OS & App State)',
    col1: 'Crash-consistent (in-memory data lost; equivalent to pulling power cord)',
    col2: 'Application-consistent (flushes dirty memory, freezes I/O via VSS / pre-freeze)',
    col3: 'Application-consistent with point-in-time transaction log playback (WAL)',
    col4: 'File-level consistent (individual files copied; open files may fail)',
    examHighlight: 'Database backups must be Application-Consistent or use continuous WAL archiving to avoid corrupt tables.',
  },
];

// Table 4: Cloud Monitoring Pillars & Agent Architecture
export const MONITORING_TELEMETRY_PILLARS_TABLE: ComparisonTableRow[] = [
  {
    criteria: 'Telemetry Data Format',
    col1: 'Numerical time-series aggregations (Counters, Gauges, Histograms)',
    col2: 'Timestamped discrete textual/JSON event strings',
    col3: 'Distributed spans with Trace IDs, Parent IDs, and timing data',
    col4: 'Synthetic scripted web transactions (HTTP pings, browser flows)',
    examHighlight: 'Metrics reveal THAT something is wrong; Logs and Traces explain WHY and WHERE it failed.',
  },
  {
    criteria: 'Visibility Scope',
    col1: 'Resource utilization trends (CPU %, Disk IOPS, Network throughput)',
    col2: 'Granular system events (auth failures, OS syslog, web server 5xx)',
    col3: 'End-to-end request latency across microservice hops (service map)',
    col4: 'Proactive external reachability and SLA compliance verification',
    examHighlight: 'Distributed tracing is mandatory for microservices to pinpoint which downstream API caused latency spikes.',
  },
  {
    criteria: 'Collection Method: Agent vs Agentless',
    col1: 'Agentless (hypervisor) collects host CPU/Net; Agent collects in-guest RAM/Disk',
    col2: 'Requires log shipping daemon (CloudWatch Agent, Fluentd, Promtail)',
    col3: 'Requires SDK instrumentation / auto-instrumentation agent (OpenTelemetry)',
    col4: 'Agentless; executed by cloud managed runners outside the VPC',
    examHighlight: 'Cloud hypervisors CANNOT measure in-guest RAM or OS disk space without a guest agent installed.',
  },
];
