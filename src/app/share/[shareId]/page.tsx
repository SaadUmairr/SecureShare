import { fetchFileDetailFromShareId } from '@/actions/file';
import { ShareFile } from '@/components/share-file';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const details = await fetchFileDetailFromShareId(shareId);

  if (!details) {
    notFound();
  }

  return (
    <ShareFile
      sharedFileName={details.sharedFileName}
      fileSize={details.fileSize}
      originalFileId={details.originalFileId}
      originalName={details.originalName}
      iv={details.iv}
      passphraseHash={details.passphraseHash}
      expireAt={details.expireAt}
      shareId={shareId}
    />
  );
}
