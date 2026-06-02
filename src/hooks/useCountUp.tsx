import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
}

export function useCountUp({ start = 0, end, duration = 2000, decimals = 0, suffix = '', prefix = '', delay = 0 }: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    
    const animate = () => {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = start + (end - start) * easeOutQuart;
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      
      requestAnimationFrame(step);
    };

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const timeout = setTimeout(() => {
            animate();
          }, delay);
          
          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer?.disconnect();
  }, [end, duration, start, delay, hasAnimated]);

  const formatted = count.toLocaleString('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return { ref, value: `${prefix}${formatted}${suffix}` };
}

interface AnimatedNumberProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
  className?: string;
}

export function AnimatedNumber({ end, duration = 1500, decimals = 0, suffix = '', prefix = '', delay = 0, className }: AnimatedNumberProps) {
  const countUp = useCountUp({ end, duration, decimals, suffix, prefix, delay });
  return <span ref={countUp.ref} className={className}>{countUp.value}</span>;
}

export default useCountUp;
