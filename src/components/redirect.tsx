'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

interface RedirectProps {
  to: string;
  label: string;
}

export function Redirect({ to, label }: RedirectProps) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();

    const updateProgress = () => {
      if (!mounted) return;

      const elapsed = Date.now() - startTime;
      const duration = 800; // Total animation time in ms

      // Quick progression: 0-100% in 800ms with fast start
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(newProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        router.push(to);
      }
    };

    // Initial jump to 30% immediately
    setProgress(30);

    // Start smooth animation
    requestAnimationFrame(updateProgress);

    // Safety net timeout
    const timeout = setTimeout(() => {
      if (mounted) router.push(to);
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [router, to]);

  return (
    <div className="flex h-screen w-screen flex-col gap-10 px-8 py-4 pt-28">
      <Progress value={progress} className="h-4 transition-all duration-75" />
      <p className="animate-pulse text-center text-2xl font-bold">{label}</p>
    </div>
  );
}
