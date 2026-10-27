import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, CircleHelp, Maximize2, Minus, Terminal as TerminalIcon } from 'lucide-react';

type Entry = { id: number; command?: string; lines: string[]; tone?: 'error' | 'success' | 'muted' | 'cyan' };

const initialEntries: Entry[] = [
  { id: 1, lines: ['CYBER NEXUS interactive console [simulated]', 'Safe sandbox environment · no external systems are contacted', 'Type “help” to inspect available commands.'], tone: 'muted' },
];

function resolveCommand(raw: string): { lines: string[]; tone?: Entry['tone']; clear?: boolean } {
  const command = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!command) return { lines: [] };
  switch (command) {
    case 'help':
      return { tone: 'cyan', lines: [
        'AVAILABLE COMMANDS',
        '  help       Show this command reference',
        '  about      Display the simulation brief',
        '  status     View fictional system telemetry',
        '  scan       Run an educational, local-only demo scan',
        '  whoami     Identify the current sandbox user',
        '  clear      Clear console history',
        '',
        'All output is simulated. No shell or network commands are executed.',
      ] };
    case 'about':
      return { lines: ['CYBER NEXUS // DIGITAL FRONTIER', 'A visual learning environment for security-minded builders.', 'Modules: telemetry, threat modeling, network literacy, secure-by-design.', 'Operating mode: isolated front-end simulation.'], tone: 'success' };
    case 'status':
      return { lines: ['CORE.............. ONLINE', 'SANDBOX........... ISOLATED', 'ENCRYPTION........ AES-256 [DEMO]', 'FIREWALL.......... ACTIVE [SIMULATED]', 'EXTERNAL TRAFFIC.. NONE', `TIMESTAMP......... ${new Date().toLocaleTimeString()}`], tone: 'success' };
    case 'scan':
      return { lines: ['Starting safe demonstration scan…', ' [01/04] Checking local mock inventory  ........ OK', ' [02/04] Reviewing example headers       ........ OK', ' [03/04] Modeling common misconfigurations ........ 0 findings', ' [04/04] Generating training report      ........ DONE', 'RESULT: 0 simulated critical findings. No real host was scanned.'], tone: 'success' };
    case 'whoami':
      return { lines: ['guest@cyber-nexus', 'ROLE: learner', 'PRIVILEGES: sandbox-only', 'ACCESS: read-only simulation'], tone: 'cyan' };
    case 'clear':
      return { lines: [], clear: true };
    default:
      return { lines: [`command not found: ${raw.trim()}`, 'Type “help” to list supported demo commands.'], tone: 'error' };
  }
}

interface TerminalPanelProps {
  compact?: boolean;
}

export default function TerminalPanel({ compact = false }: TerminalPanelProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [sequence, setSequence] = useState(2);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries, busy]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const commandText = value;
    const result = resolveCommand(commandText);
    if (!commandText.trim()) return;
    setHistory((old) => [commandText, ...old].slice(0, 30));
    setHistoryIndex(-1);
    setValue('');
    if (result.clear) {
      setEntries([]);
      return;
    }
    const userEntry: Entry = { id: sequence, command: commandText, lines: result.lines, tone: result.tone };
    setSequence((n) => n + 1);
    if (commandText.trim().toLowerCase() === 'scan') {
      setBusy(true);
      window.setTimeout(() => {
        setEntries((old) => [...old, userEntry]);
        setBusy(false);
      }, 650);
    } else {
      setEntries((old) => [...old, userEntry]);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[next] ?? '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setValue(next === -1 ? '' : history[next] ?? '');
    }
  };

  return (
    <motion.div className={`terminal-window ${compact ? 'terminal-compact' : ''}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
      <div className="terminal-topbar">
        <div className="terminal-window-dots"><i /><i /><i /></div>
        <div className="terminal-title"><TerminalIcon size={13} /> NEXUS_SHELL <span>— sandbox</span></div>
        <div className="terminal-window-actions" aria-hidden="true"><Minus size={13} /><Maximize2 size={12} /></div>
      </div>
      <div className="terminal-runtime"><span className="live-dot" /> SANDBOX SESSION ACTIVE <span className="runtime-sep">/</span> <span>NO EXTERNAL CONNECTION</span></div>
      <div className="terminal-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
        {entries.map((entry) => (
          <div className="terminal-entry" key={entry.id}>
            {entry.command && <div className="terminal-command"><span className="terminal-prompt">root@cyber:~$</span> <span>{entry.command}</span></div>}
            <div className={`terminal-output ${entry.tone ? `tone-${entry.tone}` : ''}`}>
              {entry.lines.map((line, i) => <div key={`${entry.id}-${i}`} className={line === '' ? 'terminal-blank' : ''}>{line || '\u00a0'}</div>)}
            </div>
          </div>
        ))}
        {busy && <div className="terminal-working"><span className="spinner-small" /> executing simulated routine<span className="dots-animated">...</span></div>}
        <form className="terminal-input-row" onSubmit={submit}>
          <label htmlFor="terminal-command" className="terminal-prompt">root@cyber:~$</label>
          <input ref={inputRef} id="terminal-command" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} autoComplete="off" autoCapitalize="off" spellCheck={false} disabled={busy} aria-label="Terminal command input" placeholder="enter command..." />
          <span className="terminal-cursor" aria-hidden="true" />
          <button type="submit" className="terminal-submit" disabled={busy || !value.trim()} aria-label="Run command"><ChevronRight size={16} /></button>
        </form>
      </div>
      <div className="terminal-footer"><span><span className="status-square" /> UTF-8</span><span><CircleHelp size={12} /> Type help for commands</span><span>{entries.length.toString().padStart(2, '0')} lines</span></div>
    </motion.div>
  );
}
