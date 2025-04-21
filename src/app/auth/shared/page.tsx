import { auth } from '@/auth';
import { Redirect } from '@/components/redirect';
import { SharedFiles } from '@/components/shared-files';

export default async function SharedPage() {
  const session = await auth();
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />;

  return (
    <>
      <p>SHARED FILES</p>
      <SharedFiles />
    </>
  );
}
