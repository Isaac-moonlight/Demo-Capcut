import React from 'react';
import { motion } from 'motion/react';

interface WavyTextProps {
  text: string;
  className?: string;
  delayOffset?: number;
  repeatDelay?: number;
}

export const WavyText: React.FC<WavyTextProps> = ({
  text,
  className = '',
  delayOffset = 0,
}) => {
  const letters = Array.from(text);

  return (
    <span className={`inline-block ${className}`}>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -7, 0],
            rotate: [0, -1, 1, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: delayOffset + index * 0.05,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};
