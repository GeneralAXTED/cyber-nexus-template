import { motion, useReducedMotion } from 'motion/react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  index?: string;
}

export default function SectionHeading({ eyebrow, title, accent, description, index }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="section-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="section-eyebrow"><span className="eyebrow-line" />{eyebrow}{index && <span className="section-index">/{index}</span>}</div>
      <h2>{title}{accent && <> <span className="text-accent">{accent}</span></>}</h2>
      {description && <p>{description}</p>}
    </motion.div>
  );
}
