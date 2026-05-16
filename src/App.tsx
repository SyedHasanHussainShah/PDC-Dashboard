/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Network, 
  LineChart, 
  Settings, 
  HelpCircle, 
  LifeBuoy, 
  Clock, 
  Wifi, 
  Terminal,
  AlertTriangle,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface LogEntry {
  id: string;
  timestamp: string;
  rank: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// --- Mock Data Generators ---
const generateLogMessage = (index: number): LogEntry => {
  const types: LogEntry['type'][] = ['info', 'success', 'warning', 'error'];
  const ranks = [0, 1, 2, 3, 4, 7, 8];
  const messages = [
    "Polling slave ranks...",
    "Received local time: 10:00:00.045",
    "Calculated fault-tolerant average: +0.002s",
    "Broadcasting Berkeley correction values...",
    "Slewing clock by -3ms...",
    "DRIFT_DETECTED",
    "AGGRESSIVE_SLEW",
    "Heartbeat signal persistent",
    "Consensus reached in 45ms",
    "Node topology updated",
  ];

  const type = index % 10 === 5 ? 'error' : index % 8 === 0 ? 'warning' : 'info';
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    rank,
    message: msg,
    type,
  };
};

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeRank, setActiveRank] = useState(9);
  const [avgSkew, setAvgSkew] = useState(2.4);
  const [maxDrift, setMaxDrift] = useState(12);
  const [syncCycles, setSyncCycles] = useState(14204);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Background Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [generateLogMessage(prev.length), ...prev].slice(0, 50);
        return next;
      });
      // Randomly tweak KPIs
      setAvgSkew(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(1));
      setMaxDrift(prev => +(prev + (Math.random() - 0.5) * 0.5).toFixed(1));
      setSyncCycles(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background bg-noise font-sans selection:bg-primary/30">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 glass-card border-b-0">
        <div className="flex items-center gap-4">
          <span className="font-mono text-lg font-bold tracking-tighter text-primary text-glow uppercase">
            MPI_SYNC_ENGINE
          </span>
        </div>
        
        <div className="flex-1 hidden md:flex justify-center items-center gap-6">
          <div className="flex items-center gap-2 bg-surface-container/50 px-3 py-1 rounded-full border border-white/5">
            <div className="relative w-2.5 h-2.5">
              <span className="absolute inset-0 rounded-full bg-primary opacity-40 animate-ping"></span>
              <span className="relative block h-full w-full rounded-full bg-primary animate-pulse-rhythmic"></span>
            </div>
            <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">Sys_Pulse</span>
          </div>
          <h1 className="font-mono text-sm text-on-surface font-medium">
            Master: <span className="text-primary">Node 0</span> • Cluster Sync: <span className="text-secondary text-glow">±5ms</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <Clock size={20} />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <Wifi size={20} />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <Terminal size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 p-6 glass-card border-r-0 z-40">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-primary/30 overflow-hidden relative group">
              <div className="absolute inset-0 bg-primary/20 animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=100&h=100" 
                alt="Consensus" 
                className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-80"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-primary text-glow">Temporal Consensus</h2>
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Dist_Cluster_01</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem icon={<Activity size={18} />} label="Live Monitor" active />
            <NavItem icon={<Network size={18} />} label="Node Topology" />
            <NavItem icon={<LineChart size={18} />} label="Drift Analytics" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
            <button className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors w-full px-3 py-2 cursor-pointer">
              <HelpCircle size={16} />
              <span className="font-mono text-[11px] uppercase tracking-wider">Docs</span>
            </button>
            <button className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors w-full px-3 py-2 cursor-pointer">
              <LifeBuoy size={16} />
              <span className="font-mono text-[11px] uppercase tracking-wider">Support</span>
            </button>
          </div>
        </aside>

        {/* content */}
        <main className="flex-1 lg:ml-64 p-6 min-h-[calc(100vh-64px)] relative z-10 overflow-x-hidden">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KPICard 
              label="Active Ranks" 
              value={activeRank} 
              subtext="Master + 8 Slaves" 
              color="primary"
              pulse
            />
            <KPICard 
              label="Avg Skew" 
              value={`${avgSkew}ms`} 
              subtext="±0.2ms var" 
              color="secondary"
              icon={<Wifi size={16} />}
            />
            <KPICard 
              label="Max Drift" 
              value={`+${maxDrift}ms`} 
              subtext="Rank 7" 
              color="error"
              icon={<AlertTriangle size={16} />}
              warning
            />
            <KPICard 
              label="Sync Cycles" 
              value={syncCycles.toLocaleString()} 
              subtext="Up: 04:12:00" 
              color="accent"
              icon={<Clock size={16} />}
            />
          </div>

          {/* Visualizations row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Topology */}
            <div className="lg:col-span-5 glass-card rounded-xl flex flex-col overflow-hidden h-[400px]">
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-2">
                  <Network size={16} className="text-primary" />
                  <h3 className="font-mono text-[13px] font-bold text-on-surface tracking-wide">Topology Map</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </div>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">Live Grid</span>
                </div>
              </div>
              
              <div className="flex-1 relative bg-[#080a0e] overflow-hidden flex items-center justify-center p-6">
                <div className="absolute inset-0 opacity-20 grid-pattern"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-32 animate-scan opacity-30"></div>
                <TopologyMap />
              </div>
            </div>

            {/* Drift Analytics */}
            <div className="lg:col-span-7 glass-card rounded-xl flex flex-col overflow-hidden h-[400px]">
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <LineChart size={16} className="text-accent-light" />
                    <h3 className="font-mono text-[13px] font-bold text-on-surface tracking-wide">Drift Analytics</h3>
                  </div>
                  <div className="px-2 py-0.5 rounded text-[9px] font-mono bg-accent/10 text-accent-light border border-accent/30 uppercase tracking-widest">
                    60s Window
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_currentColor]"></span>
                  Sync Active
                </div>
              </div>
              <div className="flex-1 p-6 relative bg-[#080a0e]/50">
                <DriftChart />
              </div>
            </div>
          </div>

          {/* Log Stream */}
          <div className="glass-card rounded-xl overflow-hidden flex flex-col shadow-lg border-white/5 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none opacity-20"></div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 z-10">
              <h3 className="font-mono text-[13px] text-on-surface font-bold flex items-center gap-2 tracking-wide uppercase">
                <Terminal size={16} className="text-primary" />
                Live MPI Stream
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-outline hover:text-on-surface border border-white/10 transition-all uppercase tracking-wider flex items-center gap-1.5">
                  <Download size={12} /> Export
                </button>
              </div>
            </div>
            
            <div 
              ref={logContainerRef}
              className="p-5 font-mono text-xs text-on-surface-variant h-56 overflow-y-auto flex flex-col gap-1.5 leading-relaxed bg-[#06080a]/80 custom-scrollbar"
            >
              <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-4 px-3 py-1 rounded transition-colors group ${
                      log.type === 'error' ? 'bg-error/5 border-l-2 border-error' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-outline/50 shrink-0">[{log.timestamp}]</span>
                    <span className={`font-bold shrink-0 ${
                      log.rank === 0 ? 'text-primary text-glow' : 
                      log.type === 'error' ? 'text-error text-glow' : 'text-secondary'
                    }`}>
                      [Rank {log.rank}]
                    </span>
                    <span className={`flex-1 ${log.type === 'error' ? 'text-error-container' : 'text-on-surface-variant'}`}>
                      {log.message}
                      {log.type === 'error' && (
                        <span className="ml-3 px-2 py-0.5 rounded bg-error text-[#1a0b0d] font-bold uppercase text-[9px] tracking-widest shadow-[0_0_8px_rgba(255,180,171,0.4)]">
                          DRIFT_DETECTED
                        </span>
                      )}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="mt-4 text-outline/40 italic flex items-center gap-2 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-outline/50 animate-ping"></span>
                Waiting for next sync cycle...
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`
      flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all border
      ${active 
        ? 'text-primary font-medium bg-primary/5 border-primary/20 shadow-[inset_0_0_10px_rgba(164,230,255,0.05)]' 
        : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border-transparent font-mono uppercase text-xs tracking-wider'
      }
    `}>
      <span className={active ? 'text-glow' : ''}>{icon}</span>
      <span className="font-mono text-[13px] tracking-wide">{label}</span>
    </button>
  );
}

function KPICard({ label, value, subtext, color, icon, pulse = false, warning = false }: any) {
  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    error: 'text-error',
    accent: 'text-accent-light',
  };

  return (
    <div className={`glass-card rounded-xl p-5 flex flex-col relative overflow-hidden group ${warning ? 'border-error/30' : ''}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-10 bg-current ${colors[color as keyof typeof colors]}`}></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{label}</span>
        {pulse ? (
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(164,230,255,0.8)]"></span>
        ) : (
          <span className={`${colors[color as keyof typeof colors]} opacity-70`}>{icon}</span>
        )}
      </div>

      <div className={`font-mono text-3xl font-bold mb-2 text-glow ${colors[color as keyof typeof colors]}`}>
        {value}
      </div>

      <div className="flex items-center justify-between mt-auto relative z-10">
        <div className={`font-mono text-[10px] uppercase transition-colors ${warning ? 'text-error bg-error/10 px-2 py-0.5 rounded border border-error/20' : 'text-outline/70'}`}>
          {subtext}
        </div>
        
        {/* Sparkline simulation */}
        <div className="flex items-end gap-0.5 h-5 opacity-40 group-hover:opacity-80 transition-opacity">
          {[0.4, 0.6, 0.3, 0.8, 0.5, 0.9, 0.7].map((h, i) => (
            <div 
              key={i} 
              className={`w-1 rounded-t-sm transition-all duration-500 ${colors[color as keyof typeof colors].replace('text-', 'bg-')}`}
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TopologyMap() {
  const nodes = [
    { id: 'R1', x: 140, y: 20 },
    { id: 'R2', x: 244, y: 80, active: true },
    { id: 'R3', x: 244, y: 200 },
    { id: 'R4', x: 140, y: 260, color: 'accent' },
    { id: 'R7', x: 36, y: 200, color: 'error', pulse: true },
    { id: 'R8', x: 36, y: 80 },
  ];

  return (
    <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 280">
        <defs>
          <filter id="glow-fx">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Lines */}
        {nodes.map(node => (
          <g key={node.id}>
            <line 
              x1="140" y1="140" x2={node.x} y2={node.y} 
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" 
            />
            {node.active && (
              <line 
                x1="140" y1="140" x2={node.x} y2={node.y} 
                stroke="#a4e6ff" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4"
                filter="url(#glow-fx)"
              >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="10s" repeatCount="indefinite" />
              </line>
            )}
            {node.color === 'error' && (
              <line 
                x1="140" y1="140" x2={node.x} y2={node.y} 
                stroke="#ffb4ab" strokeWidth="2" strokeDasharray="2 6"
                filter="url(#glow-fx)"
              >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" repeatCount="indefinite" />
              </line>
            )}
          </g>
        ))}

        {/* Dynamic Rings */}
        <circle cx="140" cy="140" r="60" fill="none" stroke="rgba(164,230,255,0.1)" strokeDasharray="2 4" />
        <circle cx="140" cy="140" r="110" fill="none" stroke="rgba(164,230,255,0.05)" strokeDasharray="1 8" />
      </svg>

      {/* Master Node */}
      <div className="relative w-14 h-14 bg-[#0b0e14] border border-primary/50 rounded-lg flex items-center justify-center z-20 shadow-[0_0_20px_rgba(164,230,255,0.2)] before:absolute before:inset-0 before:border before:border-primary/20 before:rounded-lg before:scale-[1.15] before:animate-pulse-rhythmic">
        <span className="font-mono text-sm text-primary font-bold text-glow">R0</span>
        <div className="absolute -bottom-6 text-[8px] font-mono text-primary/70 uppercase font-bold tracking-widest">Master</div>
      </div>

      {/* Slave Nodes */}
      {nodes.map(node => (
        <div 
          key={node.id}
          className={`
            absolute w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer z-20 glass-card
            ${node.color === 'error' ? 'border-error text-error bg-error/10 animate-pulse-rhythmic' : 
              node.color === 'accent' ? 'border-accent/40 text-accent-light' : 
              node.active ? 'border-primary/50 text-primary shadow-[0_0_10px_rgba(164,230,255,0.2)]' : 
              'border-white/10 text-on-surface-variant hover:border-primary/40 hover:text-primary'
            }
          `}
          style={{ 
            left: `${(node.x / 280) * 100}%`, 
            top: `${(node.y / 280) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {node.id}
        </div>
      ))}
    </div>
  );
}

function DriftChart() {
  const points = 50;
  return (
    <div className="w-full h-full flex flex-col group">
      {/* Y-Axis */}
      <div className="absolute left-6 top-6 bottom-12 w-10 flex flex-col justify-between font-mono text-[9px] text-outline text-right pr-4 border-r border-white/5 z-10">
        <span className="text-error">+15.0</span>
        <span>+10.0</span>
        <span>+5.0</span>
        <span className="text-primary font-bold">0.0</span>
        <span>-5.0</span>
        <span>-10.0</span>
      </div>

      {/* Grid */}
      <div className="absolute left-16 right-6 top-6 bottom-12 flex flex-col justify-between z-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`w-full h-px ${i === 3 ? 'bg-primary/20 border-b border-dashed border-primary/40 shadow-[0_0_8px_rgba(164,230,255,0.2)]' : 'bg-white/5'}`} />
        ))}
      </div>

      {/* Visual Data Traces */}
      <div className="absolute left-16 right-6 top-6 bottom-12 overflow-hidden z-10">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
             <linearGradient id="error-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Static Ribbon for range */}
          <path d="M0,50 L10,51 L20,49 L30,52 L40,48 L50,51 L60,53 L70,50 L80,49 L90,52 L100,50 L100,60 L0,60 Z" fill="rgba(164,230,255,0.05)" />
          
          {/* Master Trace */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#a4e6ff" strokeWidth="0.5" strokeOpacity="0.5" />

          {/* Normal Rank Trace */}
          <path 
            d="M0,52 Q5,50 10,53 T20,51 T30,54 T40,50 T50,52 T60,51 T70,55 T80,52 T90,53 T100,51" 
            fill="none" stroke="#bbc9cf" strokeWidth="1" strokeOpacity="0.6" 
          />

          {/* Rank 4 Accent Trace */}
          <path 
            d="M0,50 L20,45 L40,48 L60,40 L80,42 L100,35" 
            fill="none" stroke="#e0aaff" strokeWidth="1.5" strokeOpacity="0.8"
            style={{ filter: "drop-shadow(0 0 3px rgba(157,78,221,0.4))" }}
          />

          {/* Rank 7 Error Trace */}
          <path 
            d="M0,50 L10,45 L20,30 L30,35 L40,15 L50,20 L60,10 L70,12 L80,8 L100,5" 
            fill="none" stroke="#ffb4ab" strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 5px rgba(255,180,171,0.6))" }}
          />
          <path 
            d="M0,50 L10,45 L20,30 L30,35 L40,15 L50,20 L60,10 L70,12 L80,8 L100,5 V100 H0 Z" 
            fill="url(#error-grad)" 
          />
          
          <circle cx="100" cy="5" r="2" fill="#ffb4ab" />
        </svg>
      </div>

      {/* X-Axis */}
      <div className="absolute left-16 right-6 bottom-4 flex justify-between font-mono text-[9px] text-outline pt-2 border-t border-white/5">
        <span>T-60s</span>
        <span>T-45s</span>
        <span>T-30s</span>
        <span>T-15s</span>
        <span className="text-primary font-bold">NOW</span>
      </div>
    </div>
  );
}
