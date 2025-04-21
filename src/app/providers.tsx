'use client';

import { Toaster } from '@/components/ui/sonner';
import { FilesContextProvider } from '@/context/file.context';
import NextTopLoader from 'nextjs-toploader';
import { useEffect, useState } from 'react';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="px-4 py-2">
      <Toaster />
      <NextTopLoader showSpinner={false} />
      <FilesContextProvider>{children}</FilesContextProvider>
    </div>
  );
}
