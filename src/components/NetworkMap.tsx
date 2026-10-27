import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Activity, CircleDot, Globe2, LockKeyhole, Server, ShieldCheck } from 'lucide-react';

type NodeItem = { id: string; x: number; y: number; label: string; type: 'core' | 'secure' | 'edge' | 'data'; status: string; detail: string };
const nodes: NodeItem[] = [
  { id: 'gateway', x: 13, y: 46, label: 'GATEWAY', type: 'edge', status: 'ROUTING', detail: 'Edge gateway · mock routes only · no real network connection.' },
  { id: 'firewall', x: 35, y: 27, label: 'FIREWALL', type: 'secure', status: 'ACTIVE', detail: 'Policy simulator · 4 example rules · all traffic is fictional.' },
  { id: 'core', x: 53, y: 50, label: 'NEXUS CORE', type: 'core', status: 'NOMINAL', detail: 'Central orchestration node · status generated locally in the browser.' },
  { id: 'vault', x: 77, y: 22, label: 'KEY VAULT', type: 'data', status: 'SEALED', detail: 'Mock secrets vault · contains no credentials, tokens or private keys.' },
  { id: 'intel', x: 83, y: 72, label: 'INTEL NODE', type: 'secure', status: 'SYNCED', detail: 'Fictional intelligence feed · static sample telemetry for learning.' },
  { id: 'archive', x: 31, y: 78, label: 'ARCHIVE', type: 'data', status: 'IDLE', detail: 'Sample event archive · no persistence or external writes.' },
];
const connections = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [0, 5], [1, 5]] as const;

export default function NetworkMap() {
  const [selected, setSelected] = useState('core');
  const reduceMotion = useReducedMotion();
  const current = nodes.find((node) => node.id === selected) ?? nodes[2];
  return (
    <div className="network-panel">
      <div className="network-panel-header">
        <div><span className="panel-kicker">TOPOLOGY / 001</span><h3>Simulated node map</h3></div>
        <span className="demo-pill"><span className="live-dot" /> SIMULATION</span>
      </div>
      <div className="network-map-wrap">
        <div className="network-grid" />
        <svg className="network-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Simulated network connections">
          <defs><linearGradient id="connectionGradient"><stop offset="0%" stopColor="#00ff66" stopOpacity=".25" /><stop offset="55%" stopColor="#00e5ff" stopOpacity=".95" /><stop offset="100%" stopColor="#00ff66" stopOpacity=".2" /></linearGradient></defs>
          {connections.map(([from, to], index) => {
            const a = nodes[from]; const b = nodes[to];
            return <g key={`${from}-${to}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="network-connection" style={{ animationDelay: `${index * -0.35}s` }} />{!reduceMotion && <circle r=".8" fill="#00ff66"><animateMotion dur={`${3.7 + index * .43}s`} repeatCount="indefinite" path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} /></circle>}</g>;
          })}
        </svg>
        {nodes.map((node) => {
          const Icon = node.type === 'edge' ? Globe2 : node.type === 'secure' ? ShieldCheck : node.type === 'data' ? LockKeyhole : Server;
          return <button key={node.id} className={`network-node node-${node.type} ${selected === node.id ? 'node-selected' : ''}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => setSelected(node.id)} aria-pressed={selected === node.id} aria-label={`Inspect ${node.label}`}>
            <span className="node-icon"><Icon size={16} strokeWidth={1.7} /></span><span className="node-label">{node.label}</span><span className="node-state"><i />{node.status}</span>
          </button>;
        })}
        <div className="map-axis axis-x">X / 00—100</div><div className="map-axis axis-y">Y / 00—100</div>
      </div>
      <motion.div className="node-detail" key={current.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <div className="node-detail-icon"><Activity size={16} /></div>
        <div className="node-detail-copy"><span className="panel-kicker">SELECTED NODE // {current.id.toUpperCase()}</span><p>{current.detail}</p></div>
        <span className="node-detail-state"><CircleDot size={12} /> {current.status}</span>
      </motion.div>
      <div className="network-legend"><span><i className="legend-dot green" /> Secure node</span><span><i className="legend-dot cyan" /> Core node</span><span><i className="legend-line" /> Mock connection</span></div>
    </div>
  );
}
