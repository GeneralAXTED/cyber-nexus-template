import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Terminal } from 'lucide-react';

const bootLines = [
  'INITIALIZING NEXUS CORE...',
  'VERIFYING ENCRYPTED CHANNELS  [ OK ]',
  'LOADING DEFENSE SIMULATION    [ OK ]',
  'SYNCING NEURAL INTERFACE      [ OK ]',
  'SYSTEM READY. WELCOME BACK.',
];

export default function BootScreen() {
  const [visible, setVisible] = useState(true);
  const [linesVisible, setLinesVisible] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      const finish = window.setTimeout(() => setVisible(false), 450);
      return () => window.clearTimeout(finish);
    }
    const lineTimers = bootLines.map((_, index) => window.setTimeout(() => setLinesVisible(index + 1), 220 + index * 300));
    const finish = window.setTimeout(() => setVisible(false), 2150);
    return () => {
      lineTimers.forEach(window.clearTimeout);
      window.clearTimeout(finish);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.05 : 0.55 } }}>
          <div className="boot-inner">
            <div className="boot-logo"><Terminal size={23} /><span>CYBER<span className="accent">_NEXUS</span></span></div>
            <div className="boot-kicker">SECURE BOOT SEQUENCE // v.04.27</div>
            <div className="boot-lines" aria-live="polite">
              {bootLines.slice(0, linesVisible).map((line, index) => (
                <motion.div key={line} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }} className={index === bootLines.length - 1 ? 'boot-success' : ''}>
                  <span className="boot-arrow">›</span> {line}
                </motion.div>
              ))}
            </div>
            <div className="boot-progress"><motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: reduceMotion ? 0.2 : 1.8, ease: 'linear' }} /></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
