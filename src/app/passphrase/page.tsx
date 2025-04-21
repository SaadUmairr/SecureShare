import { auth } from '@/auth';
import { PassphraseInput } from '@/components/passphrase-input';
import { Redirect } from '@/components/redirect';
import { KeyPairContextProvider } from '@/context/keypair.context';
import { UserContextProvider } from '@/context/user.context';

export default async function PassphrasePage() {
  // The onSubmit callback: what do you want to do with the passphrase?
  // In "setup" mode, you'll likely save it (and update user record) and then redirect.
  // In "enter" mode, you'll verify it to decrypt the keypair and then update local storage / context.
  const session = await auth();
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <UserContextProvider>
        <KeyPairContextProvider>
          <PassphraseInput />
        </KeyPairContextProvider>
      </UserContextProvider>
    </div>
  );
}
