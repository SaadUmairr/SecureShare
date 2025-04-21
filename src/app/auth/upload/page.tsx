import { auth } from '@/auth';
import { Redirect } from '@/components/redirect';
import { UploadMainPage } from '@/components/upload';
import { KeyPairContextProvider } from '@/context/keypair.context';
import { UserContextProvider } from '@/context/user.context';

export default async function UploadPage() {
  const session = await auth();
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />;
  return (
    <UserContextProvider>
      <KeyPairContextProvider>
        <UploadMainPage />
      </KeyPairContextProvider>
    </UserContextProvider>
  );
}
