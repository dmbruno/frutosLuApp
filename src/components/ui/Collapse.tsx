import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CollapseProps {
  open: boolean;
  children: ReactNode;
  duration?: number;
}

export function Collapse({ open, children, duration = 0.32 }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
