import { useState, useEffect, useRef } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const getDelay = (char: string, baseSpeed: number) => {
  if ([".", "!", "?"].includes(char)) return baseSpeed * 8;
  if ([",", ";", ":"].includes(char)) return baseSpeed * 4;
  return baseSpeed;
};

const StreamingText = ({ text, speed = 15, className = '' }: StreamingTextProps) => {
  const [visibleText, setVisibleText] = useState('');
  const indexRef = useRef(0)
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setVisibleText('');
    indexRef.current = 0;

    if (!text) return; 

    const step = () => {
      const nextIndex = indexRef.current + 1;
      const nextChar = text[nextIndex - 1];

      setVisibleText(text.slice(0, nextIndex));
      indexRef.current = nextIndex;

      if (nextIndex >= text.length) return;

      const delay = getDelay(nextChar, speed);

      timeoutRef.current = setTimeout(() => {
        frameRef.current = requestAnimationFrame(step);
      }, delay);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  const isComplete = visibleText.length >= text.length;

  return (
    <span className={className}>
      <span className="whitespace-pre-wrap">{visibleText}</span>
      {!isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-primary align-middle animate-pulse ml-0.5" />
      )}
    </span>
  );
};

export default StreamingText;