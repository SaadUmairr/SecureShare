import { fetchShareDetails } from '@/actions/file';
import { ShareFile } from '@/components/share-page';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const shareDetails = await fetchShareDetails(shareId);
  console.log('DETAILS:  ', shareDetails);
  if (!shareDetails) {
    notFound();
  }

  return (
    <ShareFile
      shareId={shareDetails.shareId}
      originalFileId={shareDetails.originalFileId ?? undefined}
      passphraseHash={shareDetails.passphraseHash}
      sharedFileName={shareDetails.sharedFileName}
      fileSize={shareDetails.fileSize}
      expireAt={shareDetails.expireAt}
      iv={shareDetails.iv}
      originalName={shareDetails.sharedFileName}
      downloadCount={shareDetails.downloadCount}
      maxDownloads={shareDetails.maxDownloads}
    />
  );
}
