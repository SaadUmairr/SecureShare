import { fetchFileDetailFromShareId } from '@/actions/file';
import { ShareFile } from '@/components/share-file';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params; // Use the first part of the catch-all
  const details = await fetchFileDetailFromShareId(shareId);

  console.log('FILE DETAILS: ', details);

  if (!details) {
    notFound(); // Render 404 if no file found
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
