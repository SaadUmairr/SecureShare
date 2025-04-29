'use client';

import { DeleteFileRecord, getAllFiles } from '@/actions/file';
import { generateGetObjectSignedURL } from '@/app/aws/s3/get-object';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { deleteObjectFromS3 } from '@/app/aws/s3/delete-object';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useKeyPair } from '@/context/keypair.context';
import { useUser } from '@/context/user.context';
import { cn } from '@/lib/utils';
import { FileNameDecryptor, FileShareManager } from '@/utils/crypto.util';
import { differenceInMinutes, format, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Copy,
  Download,
  Lock,
  MoreHorizontal,
  Share,
  Trash2,
} from 'lucide-react';
import { customAlphabet } from 'nanoid';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formatFileSize, getFileTypeInfo, trimFilename } from './file-card';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DecryptedFile {
  id: string;
  originalName: string;
  encryptedName: string;
  createdAt: Date;
  expireAt: Date;
  fileSize: bigint;
  symmetricKey: string;
  fileIV: string;
}

// const getIstTime = (date: Date) => {
//   const formattedDate = format(date, 'dd/MM');
//   const formattedTime = format(date, 'hh:mm a');
//   return `${formattedDate} at ${formattedTime}`;
// };

const getRemainingTime = (expirationTime: Date) => {
  const now = new Date();

  if (isBefore(expirationTime, now)) return 'Expired';

  const totalMinutes = differenceInMinutes(expirationTime, now);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m remaining`;
};
const formatRemainingTime = (expirationTime: Date) => {
  const now = new Date();
  if (isBefore(expirationTime, now)) return 'Expired';

  const totalMinutes = differenceInMinutes(expirationTime, now);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m remaining`;
};

export function AllFilesMain() {
  const { googleID } = useUser();
  const { privateKey } = useKeyPair();
  const [decryptedFiles, setDecryptedFiles] = useState<DecryptedFile[]>([]);
  const [, forceRerender] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceRerender((prev) => prev + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!googleID || !privateKey) return;

    const fetchAndDecryptFiles = async () => {
      const response = await getAllFiles(googleID);
      const decrypted = await Promise.all(
        response.map(async (file) => {
          const originalName = await FileNameDecryptor(
            file.fileName,
            file.fileNameIV,
            file.symmetricKey,
            privateKey,
          );

          return {
            id: file.id,
            originalName,
            encryptedName: file.fileName,
            createdAt: file.createdAt,
            expireAt: file.expireAt,
            fileSize: file.fileSize,
            symmetricKey: file.symmetricKey,
            fileIV: file.fileIV,
          };
        }),
      );
      setDecryptedFiles(decrypted);
    };

    fetchAndDecryptFiles();
  }, [googleID, privateKey]);

  const handleFileDownload = async ({
    fileName,
    encryptedSymmetricKey,
    fileIV,
    privateKey,
    originalName,
  }: {
    fileName: string;
    encryptedSymmetricKey: string;
    fileIV: string;
    privateKey: CryptoKey;
    originalName: string;
  }) => {
    const presignedUrl = await generateGetObjectSignedURL(`upload/${fileName}`);
    const response = await fetch(presignedUrl);
    const encryptedArrayBuffer = await response.arrayBuffer();

    const encryptedSymmetricKeyBytes = Uint8Array.from(
      atob(encryptedSymmetricKey),
      (c) => c.charCodeAt(0),
    );
    const symmetricKeyBuffer = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedSymmetricKeyBytes,
    );

    const symmetricKey = await crypto.subtle.importKey(
      'raw',
      symmetricKeyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt'],
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: Uint8Array.from(atob(fileIV), (c) => c.charCodeAt(0)),
      },
      symmetricKey,
      encryptedArrayBuffer,
    );

    const blob = new Blob([decryptedBuffer]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareFile = (fileId: string) => {
    fileId.charAt(0); // Dummy action
  };

  const handleDeleteFile = (fileId: string) => {
    setDecryptedFiles(decryptedFiles.filter((file) => file.id !== fileId));
  };

  // Mock function to simulate getting a file from the file name
  const getFileFromFileName = (fileName: string): File => {
    return new File([], fileName);
  };

  return (
    <div className="space-y-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Your Files</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {decryptedFiles.map((file) => {
          const mockFile = getFileFromFileName(file.originalName);
          const { icon, color, label } = getFileTypeInfo(mockFile);
          const isExpired = isBefore(file.expireAt, new Date());
          // const trimmedFileName = trimFilename(file.originalName);

          return (
            <FileCard
              key={file.id}
              file={file}
              icon={icon}
              iconColor={color}
              label={label}
              isExpired={isExpired}
              onDownload={() =>
                handleFileDownload({
                  fileName: file.encryptedName,
                  encryptedSymmetricKey: file.symmetricKey,
                  fileIV: file.fileIV,
                  privateKey: privateKey!,
                  originalName: file.originalName,
                })
              }
              onShare={() => handleShareFile(file.id)}
              onDelete={() => handleDeleteFile(file.id)}
            />
          );
        })}
      </div>

      {decryptedFiles.length === 0 && (
        <div className="text-muted-foreground py-12 text-center">
          No files found. Upload some files to see them here.
        </div>
      )}
    </div>
  );
}

interface FileCardProps {
  file: DecryptedFile;
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  isExpired: boolean;
  onDownload: () => void;
  onShare: () => void;
  onDelete: () => void;
}
interface SharePassphraseFormValue {
  passphrase: string;
}
const FileCard: React.FC<FileCardProps> = ({
  file,
  icon,
  iconColor,
  label,
  isExpired,
  onDownload,
}) => {
  const trimmedFileName = trimFilename(file.originalName);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { googleID } = useUser();
  const { privateKey } = useKeyPair();

  const shareForm = useForm<SharePassphraseFormValue>({
    defaultValues: {
      passphrase: '',
    },
  });

  const handleShare = async (values: SharePassphraseFormValue) => {
    if (!googleID || !privateKey) {
      toast.error('User not authenticated');
      return;
    }
    const shareToast = toast.loading('Sharing...');
    setIsSharing(true);

    try {
      const nanoidShort = customAlphabet(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.~',

        5,
      );

      const shareId = nanoidShort();

      await FileShareManager({
        googleID,
        fileId: file.id,
        shareId,
        fileName: file.encryptedName,
        encryptedSymmetricKey: file.symmetricKey,
        fileIV: file.fileIV,
        privateKey,
        originalName: file.originalName,
        passphrase: values.passphrase,
        expireAt: file.expireAt,
        fileSize: file.fileSize,
      });

      // Generate share link
      const shareLink = `${window.location.origin}/share/${shareId}`;
      setShareLink(shareLink);
      toast.success('File shared successfully!', { id: shareToast });
    } catch (error) {
      toast.error((error as Error).message, { id: shareToast });
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const key = `upload/${file.encryptedName}`;
      await deleteObjectFromS3(key);

      await DeleteFileRecord(file.id);

      toast.success('File deleted successfully');
      setDeleteDialogOpen(false);
    } catch {
      toast.error('Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'bg-card text-card-foreground relative w-full overflow-hidden rounded-lg border shadow-sm transition-colors duration-200',
        isExpired && 'opacity-60',
      )}
    >
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    'bg-muted/50 transition-colors duration-200',
                    iconColor,
                    isExpired && 'opacity-50',
                  )}
                >
                  {icon}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={onDownload}
                  disabled={isExpired}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => setShareDialogOpen(true)}
                  disabled={isExpired}
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-2 min-w-0 space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3
                  className={cn(
                    'truncate text-sm font-medium',
                    'text-foreground transition-colors duration-200',
                  )}
                >
                  {trimmedFileName}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{file.originalName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center justify-between">
            <span
              className={cn(
                'truncate text-xs',
                'text-muted-foreground transition-colors duration-200',
              )}
            >
              {formatFileSize(Number(file.fileSize))}
            </span>
          </div>

          <div className="text-muted-foreground text-xs">
            Uploaded: {format(file.createdAt, 'MMM d, yyyy')}
          </div>

          <div
            className={cn(
              'text-xs',
              isExpired ? 'text-red-500' : 'text-amber-500',
            )}
          >
            {isExpired ? 'Expired' : getRemainingTime(file.expireAt)}
          </div>
        </div>
      </div>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Share File
            </DialogTitle>
            <DialogDescription>
              {shareLink
                ? 'Your file is ready to share'
                : 'Set a secure passphrase to protect your shared file'}
            </DialogDescription>
          </DialogHeader>

          {shareLink ? (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="share-link"
                    value={shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleCopyShareLink}
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-md p-3">
                <h4 className="flex items-center gap-1.5 text-sm font-medium">
                  <Lock className="h-4 w-4 text-amber-500" />
                  Security Information
                </h4>
                <p className="text-muted-foreground mt-1 text-xs">
                  Share this link and the passphrase with trusted recipients
                  only. The link will expire in{' '}
                  {formatRemainingTime(file.expireAt)}.
                </p>
              </div>

              <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShareDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <Form {...shareForm}>
              <form
                onSubmit={shareForm.handleSubmit(handleShare)}
                className="space-y-4"
              >
                <FormField
                  control={shareForm.control}
                  name="passphrase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passphrase</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter a strong passphrase"
                          type="text"
                          disabled={isSharing}
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        This passphrase will be required to access the file.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <h4 className="flex items-center gap-1.5 text-sm font-medium text-amber-700">
                    <AlertTriangle className="h-4 w-4" />
                    Important
                  </h4>
                  <p className="mt-1 text-xs text-amber-600">
                    Make sure to set a new and distinct passphrase for file
                    sharing. Anyone with this passphrase can access your file
                    until it expires.
                  </p>
                </div>

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSharing}>
                    {isSharing ? (
                      <>
                        <span className="animate-pulse">Sharing</span>
                        <span className="ml-1 flex">
                          <span className="animate-bounce">.</span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          >
                            .
                          </span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: '0.4s' }}
                          >
                            .
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Share className="mr-2 h-4 w-4" />
                        Generate Link
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete File
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted rounded-md p-4">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <h4 className="text-sm font-medium">{file.originalName}</h4>
                <p className="text-muted-foreground text-xs">
                  {`${Number(file.fileSize).toLocaleString()} bytes · Uploaded on ${format(file.createdAt, 'MMM d, yyyy')}`}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="animate-pulse">Deleting</span>
                  <span className="ml-1 flex">
                    <span className="animate-bounce">.</span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    >
                      .
                    </span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    >
                      .
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete File
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
