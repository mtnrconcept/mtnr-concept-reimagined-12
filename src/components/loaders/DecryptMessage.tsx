
import React from 'react';
import { motion } from 'framer-motion';

interface DecryptMessageProps {
  text: string;
}

export const DecryptMessage: React.FC<DecryptMessageProps> = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div 
        className="decrypt-message font-mono text-xl"
        style={{
          color: '#D2FF3F',
          textShadow: '0 0 8px rgba(210, 255, 63, 0.8)',
          letterSpacing: '0.05em'
        }}
      >
        {text}
      </div>
    </motion.div>
  );
};
