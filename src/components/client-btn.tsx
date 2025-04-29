'use client';

import { GoogleLoginHandler } from '@/actions/user';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function GoogleClientButton() {
  const handleLogin = async () => {
    await GoogleLoginHandler();
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full border-[#1446B5] dark:border-[#1446B5]"
      onClick={handleLogin}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="mr-2 size-5"
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      Continue with Google
    </Button>
  );
}

export function GuestClientButton() {
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    toast('🤌 COMING SOON...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full gap-x-4 border-[#1446B5] dark:border-[#1446B5]"
      onClick={handleGuestLogin}
      disabled={loading}
    >
      <UserIcon absoluteStrokeWidth />
      {loading ? 'Just a moment...' : 'Try as guest'}
    </Button>
  );
}
