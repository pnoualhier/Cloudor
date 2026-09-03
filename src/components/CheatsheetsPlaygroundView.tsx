import React, { useState } from 'react';
import { Provider } from '../types';
import {
  SERVICE_EQUIVALENCY_DATA,
  TOPOLOGY_INSPECTOR_DATA,
  CRAM_CARDS_DATA
} from '../data/mockData';

export const CheatsheetsPlaygroundView: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeKey, setSelectedNodeKey] = useState<string>('alb');
  const [isFailoverActive, setIsFailoverActive] = useState<boolean>(false);
  const [failoverAlert, setFailoverAlert] = useState<string | null>(null);
  const [cramCards, setCramCards] = useState(CRAM_CARDS_DATA);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const pinnedCount = cramCards.filter((c) => c.pinned).length;

  const togglePin = (id: string) => {
    setCramCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleBatchPin = () => {
    const allPinned = cramCards.every((c) => c.pinned);
    setCramCards((prev) => prev.map((c) => ({ ...c, pinned: !allPinned })));
  };

  const handleTriggerFailover = () => {
    setIsFailoverActive(!isFailoverActive);
    if (!isFailoverActive) {
      setFailoverAlert(
        'FAILOVER INITIATED: us-east-1a Primary DB degraded. Aurora auto-promoted Standby Replica in us-east-1b to Primary in 14.2s. CNAME switched with zero application data loss.'
      );
    } else {
      setFailoverAlert('FAILBACK COMPLETE: Primary cluster restored to normal multi-AZ active-standby topology.');
    }
    setTimeout(() => {
      setFailoverAlert(null);
    }, 6000);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filter service equivalency matrix
  const filteredServices = SERVICE_EQUIVALENCY_DATA.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.domain.toLowerCase().includes(q) ||
        item.aws.name.toLowerCase().includes(q) ||
        item.azure.name.toLowerCase().includes(q) ||
        item.gcp.name.toLowerCase().includes(q) ||
        item.k8s.name.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const selectedNode = TOPOLOGY_INSPECTOR_DATA[selectedNodeKey] || TOPOLOGY_INSPECTOR_DATA.alb;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Toast Alert for Failover */}
      {failoverAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1f2a] border border-[#ffb95f] text-[#dfe2f1] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 max-w-lg">
          <span className="material-symbols-outlined text-[#ffb95f] text-[24px]">swap_calls</span>
          <p className="text-xs font-mono-code leading-relaxed">{failoverAlert}</p>
        </div>
      )}

      {/* Top Banner & Telemetry Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171b26] via-[#1c1f2a] to-[#171b26] border border-[#262a35] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#8083ff]"></span>
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#c0c1ff] font-bold">
              Cross-Cloud Crosswalk Engine / Spec v4.8
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Multi-Cloud Equivalency & Topology Playground
          </h1>
          <p className="text-xs sm:text-sm text-[#c7c4d7] mt-2 leading-relaxed">
            Translate architectural patterns seamlessly between AWS, Azure, Google Cloud, and Kubernetes. Inspect real-world 3-tier topologies and test failover mechanics.
          </p>
        </div>

        {/* Telemetry Chips */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0 font-mono-code text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-[#0a0e18] border border-[#262a35] flex items-center gap-2">
            <span className="text-[#908fa0]">Equivalencies:</span>
            <span className="text-[#4cd7f6] font-bold">142</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#0a0e18] border border-[#262a35] flex items-center gap-2">
            <span className="text-[#908fa0]">Pinned Cards:</span>
            <span className="text-[#ffb95f] font-bold">{pinnedCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#0a0e18] border border-[#262a35] flex items-center gap-2">
            <span className="text-[#908fa0]">CKA Shortcuts:</span>
            <span className="text-[#8083ff] font-bold">38</span>
          </div>
        </div>
      </div>

      {/* Controls: Provider Filters, Search, Batch Pin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262a35] pb-4">
        {/* Provider Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all' as Provider, label: 'All Providers' },
            { id: 'aws' as Provider, label: 'AWS Only' },
            { id: 'azure' as Provider, label: 'Azure Only' },
            { id: 'gcp' as Provider, label: 'GCP Only' },
            { id: 'k8s' as Provider, label: 'K8s / CKA' },
          ].map((p) => {
            const isSelected = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono-code transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#262a35] text-white ring-1 ring-white/10 shadow-sm'
                    : 'text-[#908fa0] hover:text-[#dfe2f1] hover:bg-[#171b26]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#908fa0] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search cross-cloud services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0e18] border border-[#262a35] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#dfe2f1] placeholder-[#908fa0] outline-none focus:border-[#4cd7f6] transition-colors font-mono-code"
            />
          </div>
          <button
            onClick={handleBatchPin}
            className="px-3 py-1.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-mono-code text-[#dfe2f1] shrink-0"
          >
            {cramCards.every((c) => c.pinned) ? 'Unpin All' : 'Batch Pin Cards'}
          </button>
        </div>
      </div>

      {/* SECTION 01: Service Equivalency Matrix Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">sync_alt</span>
            <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-tight">
              SECTION 01: Service Equivalency & Comparison Matrix
            </h2>
          </div>
          <span className="text-xs font-mono-code text-[#908fa0]">
            Displaying {filteredServices.length} Archetypes
          </span>
        </div>

        <div className="rounded-2xl bg-[#171b26] border border-[#262a35] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#262a35] text-[#908fa0] font-mono-code text-[11px] uppercase bg-[#0a0e18]">
                  <th className="py-3 px-4">Domain & Archetype</th>
                  <th className={`py-3 px-4 ${selectedProvider === 'aws' ? 'bg-[#ffb95f]/10 text-[#ffb95f]' : ''}`}>
                    AWS (Amazon)
                  </th>
                  <th className={`py-3 px-4 ${selectedProvider === 'azure' ? 'bg-[#4cd7f6]/10 text-[#4cd7f6]' : ''}`}>
                    Microsoft Azure
                  </th>
                  <th className={`py-3 px-4 ${selectedProvider === 'gcp' ? 'bg-[#c0c1ff]/10 text-[#c0c1ff]' : ''}`}>
                    Google Cloud (GCP)
                  </th>
                  <th className={`py-3 px-4 ${selectedProvider === 'k8s' ? 'bg-white/10 text-white' : ''}`}>
                    Kubernetes / CNCF
                  </th>
                  <th className="py-3 px-4 text-right">Exam Pivot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262a35]/60 font-mono-code text-[11px]">
                {filteredServices.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1c1f2a] transition-colors">
                    {/* Domain column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-display font-semibold text-white">
                        <span className={`material-symbols-outlined text-[18px] ${item.iconColor}`}>
                          {item.icon}
                        </span>
                        <span>{item.domain}</span>
                      </div>
                    </td>

                    {/* AWS */}
                    <td className={`py-3.5 px-4 ${selectedProvider !== 'all' && selectedProvider !== 'aws' ? 'opacity-40' : ''}`}>
                      <span className="font-bold text-[#ffb95f] block">{item.aws.name}</span>
                      <span className="text-[#908fa0] text-[10px]">{item.aws.detail}</span>
                    </td>

                    {/* Azure */}
                    <td className={`py-3.5 px-4 ${selectedProvider !== 'all' && selectedProvider !== 'azure' ? 'opacity-40' : ''}`}>
                      <span className="font-bold text-[#4cd7f6] block">{item.azure.name}</span>
                      <span className="text-[#908fa0] text-[10px]">{item.azure.detail}</span>
                    </td>

                    {/* GCP */}
                    <td className={`py-3.5 px-4 ${selectedProvider !== 'all' && selectedProvider !== 'gcp' ? 'opacity-40' : ''}`}>
                      <span className="font-bold text-[#c0c1ff] block">{item.gcp.name}</span>
                      <span className="text-[#908fa0] text-[10px]">{item.gcp.detail}</span>
                    </td>

                    {/* K8s */}
                    <td className={`py-3.5 px-4 ${selectedProvider !== 'all' && selectedProvider !== 'k8s' ? 'opacity-40' : ''}`}>
                      <span className="font-bold text-[#dfe2f1] block">{item.k8s.name}</span>
                      <span className="text-[#908fa0] text-[10px]">{item.k8s.detail}</span>
                    </td>

                    {/* Exam Pivot */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#0a0e18] border border-[#262a35] text-[10px] text-[#908fa0]">
                        {item.pivot}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 02: Interactive 3-Tier HA Topology Sandbox */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8083ff] text-[20px]">account_tree</span>
            <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-tight">
              SECTION 02: Interactive 3-Tier HA Topology Sandbox
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerFailover}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 ${
                isFailoverActive
                  ? 'bg-[#ca8100]/20 border-[#ffb95f] text-[#ffb95f]'
                  : 'bg-[#262a35] border-[#313540] text-[#dfe2f1] hover:text-[#ffb95f]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>{isFailoverActive ? 'Failover Active (AZ-1b Master)' : 'Trigger Failover Route'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Topology Canvas (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="text-[#908fa0]">AWS VPC (10.0.0.0/16) • Multi-AZ Production Infrastructure</span>
              <span className="text-[#4cd7f6] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                <span>Click any node to inspect telemetry</span>
              </span>
            </div>

            {/* SVG Visual Canvas */}
            <div className="rounded-xl bg-[#0a0e18] border border-[#262a35] p-4 overflow-x-auto">
              <svg className="w-full min-w-[540px] h-96" viewBox="0 0 600 380">
                {/* Defs */}
                <defs>
                  <linearGradient id="albGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#03b5d3" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Tier 1 Public Subnet Box (DMZ) */}
                <rect x="20" y="20" width="560" height="90" rx="10" fill="#171b26" stroke="#262a35" strokeWidth="1.5" />
                <text x="35" y="40" fill="#4cd7f6" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  TIER 1: PUBLIC SUBSETS (DMZ • 10.0.1.0/24 & 10.0.2.0/24)
                </text>

                {/* ALB Node */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedNodeKey('alb')}
                >
                  <rect
                    x="50"
                    y="50"
                    width="230"
                    height="45"
                    rx="8"
                    fill={selectedNodeKey === 'alb' ? '#8083ff' : '#0a0e18'}
                    fillOpacity={selectedNodeKey === 'alb' ? 0.3 : 1}
                    stroke={selectedNodeKey === 'alb' ? '#8083ff' : '#4cd7f6'}
                    strokeWidth="1.5"
                  />
                  <text x="65" y="72" fill="#dfe2f1" fontSize="11" fontFamily="Inter" fontWeight="bold">
                    Application Load Balancer
                  </text>
                  <text x="65" y="85" fill="#4cd7f6" fontSize="9" fontFamily="JetBrains Mono">
                    Cross-Zone • SSL Offload • Ingress
                  </text>
                </g>

                {/* NAT Gateway Node */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedNodeKey('nat')}
                >
                  <rect
                    x="320"
                    y="50"
                    width="230"
                    height="45"
                    rx="8"
                    fill={selectedNodeKey === 'nat' ? '#ffb95f' : '#0a0e18'}
                    fillOpacity={selectedNodeKey === 'nat' ? 0.2 : 1}
                    stroke={selectedNodeKey === 'nat' ? '#ffb95f' : '#313540'}
                    strokeWidth="1.5"
                  />
                  <text x="335" y="72" fill="#dfe2f1" fontSize="11" fontFamily="Inter" fontWeight="bold">
                    Managed NAT Gateway
                  </text>
                  <text x="335" y="85" fill="#ffb95f" fontSize="9" fontFamily="JetBrains Mono">
                    Elastic IP • Outbound Egress Only
                  </text>
                </g>

                {/* Connections between Tier 1 and Tier 2 */}
                <path d="M 165 95 L 165 140" fill="none" stroke="#464554" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 435 95 L 435 140" fill="none" stroke="#464554" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Tier 2 Private App Subnet Box */}
                <rect x="20" y="140" width="560" height="100" rx="10" fill="#171b26" stroke="#262a35" strokeWidth="1.5" />
                <text x="35" y="160" fill="#c0c1ff" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  TIER 2: PRIVATE APP TIER (ASG FLEET • 10.0.10.0/24 & 10.0.20.0/24)
                </text>

                {/* ASG AZ-1 */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeKey('compute')}
                >
                  <rect
                    x="50"
                    y="170"
                    width="230"
                    height="55"
                    rx="8"
                    fill={selectedNodeKey === 'compute' ? '#8083ff' : '#0a0e18'}
                    fillOpacity={selectedNodeKey === 'compute' ? 0.25 : 1}
                    stroke={selectedNodeKey === 'compute' ? '#8083ff' : '#464554'}
                    strokeWidth="1.5"
                  />
                  <text x="65" y="193" fill="#dfe2f1" fontSize="11" fontFamily="Inter" fontWeight="bold">
                    EC2 Instance Fleet (AZ-1a)
                  </text>
                  <text x="65" y="208" fill="#908fa0" fontSize="9" fontFamily="JetBrains Mono">
                    ASG Target: Min 2, Max 10 • TargetTracking
                  </text>
                </g>

                {/* ASG AZ-2 */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeKey('compute')}
                >
                  <rect
                    x="320"
                    y="170"
                    width="230"
                    height="55"
                    rx="8"
                    fill={selectedNodeKey === 'compute' ? '#8083ff' : '#0a0e18'}
                    fillOpacity={selectedNodeKey === 'compute' ? 0.25 : 1}
                    stroke={selectedNodeKey === 'compute' ? '#8083ff' : '#464554'}
                    strokeWidth="1.5"
                  />
                  <text x="335" y="193" fill="#dfe2f1" fontSize="11" fontFamily="Inter" fontWeight="bold">
                    EC2 Instance Fleet (AZ-1b)
                  </text>
                  <text x="335" y="208" fill="#908fa0" fontSize="9" fontFamily="JetBrains Mono">
                    AZ Redundancy • Health Check via ALB
                  </text>
                </g>

                {/* Connections to Tier 3 */}
                <path d="M 165 225 L 165 265" fill="none" stroke="#ca8100" strokeWidth="1.5" />
                <path d="M 435 225 L 435 265" fill="none" stroke="#ca8100" strokeWidth="1.5" />

                {/* Tier 3 Isolated DB Subnet Box */}
                <rect x="20" y="265" width="560" height="95" rx="10" fill="#171b26" stroke="#262a35" strokeWidth="1.5" />
                <text x="35" y="285" fill="#ffb95f" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  TIER 3: ISOLATED DATABASE SUBNETS (10.0.100.0/24 & 10.0.200.0/24)
                </text>

                {/* RDS Primary / Master Node */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeKey('database')}
                >
                  <rect
                    x="50"
                    y="295"
                    width="230"
                    height="50"
                    rx="8"
                    fill={isFailoverActive ? '#1c1f2a' : selectedNodeKey === 'database' ? '#ca8100' : '#0a0e18'}
                    fillOpacity={selectedNodeKey === 'database' && !isFailoverActive ? 0.3 : 1}
                    stroke={isFailoverActive ? '#908fa0' : '#ffb95f'}
                    strokeWidth={selectedNodeKey === 'database' ? 2 : 1.5}
                  />
                  <text x="65" y="318" fill="#dfe2f1" fontSize="11" fontFamily="Inter" fontWeight="bold">
                    {isFailoverActive ? 'Demoted / Recovering Replica' : 'RDS Aurora Primary (AZ-1a)'}
                  </text>
                  <text x="65" y="333" fill={isFailoverActive ? '#908fa0' : '#ffb95f'} fontSize="9" fontFamily="JetBrains Mono">
                    {isFailoverActive ? 'Synchronizing delta logs' : 'Read / Write Master Node'}
                  </text>
                </g>

                {/* RDS Standby / Replica Node */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeKey('replica')}
                >
                  <rect
                    x="320"
                    y="295"
                    width="230"
                    height="50"
                    rx="8"
                    fill={isFailoverActive ? '#ca8100' : selectedNodeKey === 'replica' ? '#03b5d3' : '#0a0e18'}
                    fillOpacity={isFailoverActive ? 0.3 : selectedNodeKey === 'replica' ? 0.25 : 1}
                    stroke={isFailoverActive ? '#ffb95f' : '#4cd7f6'}
                    strokeWidth={selectedNodeKey === 'replica' ? 2 : 1.5}
                  />
                  <text x="335" y="318" fill="#dfe2f1" fontSize="11" fontFamily="Inter" fontWeight="bold">
                    {isFailoverActive ? 'PROMOTED PRIMARY (AZ-1b)' : 'Multi-AZ Standby Replica (AZ-1b)'}
                  </text>
                  <text x="335" y="333" fill={isFailoverActive ? '#ffb95f' : '#4cd7f6'} fontSize="9" fontFamily="JetBrains Mono">
                    {isFailoverActive ? 'Elevated Master • Active R/W' : 'Synchronous Replication target'}
                  </text>
                </g>

                {/* Sync Arrow between DB nodes */}
                <path
                  d={isFailoverActive ? 'M 320 320 L 285 320' : 'M 280 320 L 315 320'}
                  fill="none"
                  stroke={isFailoverActive ? '#ffb95f' : '#4cd7f6'}
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>
          </div>

          {/* Inspector Telemetry Panel (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#171b26] border border-[#262a35] p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">troubleshoot</span>
                  <h3 className="text-xs font-bold text-white font-mono-code uppercase">Inspector Telemetry</h3>
                </div>
                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full ${selectedNode.badgeColor}`}>
                  {selectedNode.badge}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono-code text-[#908fa0] uppercase block">{selectedNode.tier}</span>
                <h4 className="text-base font-bold text-white mt-0.5">{selectedNode.title}</h4>
                <p className="text-xs text-[#c7c4d7] mt-2 leading-relaxed">{selectedNode.desc}</p>
              </div>

              {/* Multi-Cloud Equivalents */}
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-2 text-xs font-mono-code">
                <span className="text-[10px] uppercase text-[#908fa0] block">Multi-Cloud Counterparts:</span>
                <div className="flex justify-between text-[#4cd7f6]">
                  <span className="text-[#908fa0]">Azure:</span>
                  <span className="font-bold">{selectedNode.multiCloud.azure}</span>
                </div>
                <div className="flex justify-between text-[#c0c1ff]">
                  <span className="text-[#908fa0]">GCP:</span>
                  <span className="font-bold">{selectedNode.multiCloud.gcp}</span>
                </div>
                <div className="flex justify-between text-[#dfe2f1]">
                  <span className="text-[#908fa0]">K8s:</span>
                  <span className="font-bold">{selectedNode.multiCloud.k8s}</span>
                </div>
              </div>

              {/* Exam Note */}
              <div className="p-3 rounded-xl bg-[#ca8100]/10 border border-[#ca8100]/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#ffb95f] font-mono-code font-bold text-[11px]">
                  <span className="material-symbols-outlined text-[16px]">priority_high</span>
                  <span>Exam Rationale & Pitfall</span>
                </div>
                <p className="text-[#ffddb8] leading-relaxed text-[11px]">{selectedNode.note}</p>
              </div>
            </div>

            <button
              onClick={handleTriggerFailover}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#0f131d] font-bold text-xs font-mono-code shadow-md hover:opacity-95 transition-opacity"
            >
              Simulate Failure Scenario
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 03: High-Yield Exam Cram Sheets & Memory Aids */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">bookmark</span>
            <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-tight">
              SECTION 03: High-Yield Exam Cram Sheets & Memory Aids
            </h2>
          </div>
          <span className="text-xs font-mono-code text-[#4cd7f6]">{pinnedCount} Cards Pinned</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cramCards.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl bg-[#171b26] border p-6 flex flex-col justify-between transition-all duration-200 relative ${
                card.pinned
                  ? 'border-[#ffb95f]/50 shadow-[0_0_18px_rgba(255,185,95,0.1)]'
                  : 'border-[#262a35] hover:border-[#313540]'
              }`}
            >
              <div>
                {/* Header Badge & Pin */}
                <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                  <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                  <button
                    onClick={() => togglePin(card.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      card.pinned ? 'text-[#ffb95f] bg-[#ffb95f]/15' : 'text-[#908fa0] hover:text-white'
                    }`}
                    title={card.pinned ? 'Unpin Cram Card' : 'Pin Cram Card'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {card.pinned ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-mono-code uppercase text-[#908fa0]">{card.type}</span>
                  <h3 className="text-base font-display font-bold text-white mt-0.5">{card.title}</h3>
                  <p className="text-xs text-[#c7c4d7] mt-1">{card.description}</p>
                </div>

                {/* Items List */}
                <div className="mt-4 space-y-2">
                  {card.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-2.5 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs font-mono-code space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">{item.label}</span>
                        <span className={`text-[10px] ${item.tagColor}`}>{item.tag}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#908fa0] break-all">{item.subLabel}</span>
                        {item.isCode && (
                          <button
                            onClick={() => handleCopyCode(item.subLabel, `${card.id}-${iIdx}`)}
                            className="p-1 rounded hover:bg-[#262a35] text-[#908fa0] hover:text-white shrink-0"
                            title="Copy command"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {copiedIndex === `${card.id}-${iIdx}` ? 'done' : 'content_copy'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-[#262a35] text-[11px] font-mono-code text-[#4cd7f6]">
                {card.footerNote}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
