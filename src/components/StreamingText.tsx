import { useState, useEffect } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const StreamingText = ({ text, speed = 60, className = '' }: StreamingTextProps) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const words = text.split(' ');
  const isComplete = visibleCount >= words.length;

  useEffect(() => {
    setVisibleCount(0);
    if (!text) return;

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= words.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, words.length, speed]);

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline transition-opacity duration-150 ${
            i < visibleCount ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {word}{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
      {!isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-primary align-middle animate-pulse ml-0.5" />
      )}
    </span>
  );
};

export default StreamingText;
