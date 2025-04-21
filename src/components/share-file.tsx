'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  decryptFile,
  fetchEncryptedFile,
  triggerDownload,
} from '@/utils/crypto.util';
import { deriveEncryptionKeyFromPassphrase } from '@/utils/key-ops.util';
import bcrypt from 'bcryptjs';
import {
  differenceInSeconds,
  format,
  formatDistanceToNow,
  isBefore,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileIcon,
  Lock,
  Shield,
  Timer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatFileSize } from './file-card';

interface ShareFileProp {
  shareId: string;
  sharedFileName: string;
  originalFileId: string;
  passphraseHash: string;
  fileSize: bigint;
  iv: string; // this should be the IV from the re-encryption (base64-encoded)
  originalName: string;
  expireAt: Date;
}

export function ShareFile({
  // shareId,
  passphraseHash,
  originalName,
  sharedFileName,
  fileSize,
  expireAt,
  // originalFileId,
  iv, // base64 string
}: ShareFileProp) {
  const [passphrase, setPassphrase] = useState<string>('');
  const [isPassphraseCorrect, setIsPassphraseCorrect] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [progressValue, setProgressValue] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [, forceRerender] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceRerender((prev) => prev + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  // Check if file is expired and calculate remaining time
  useEffect(() => {
    const expireDate = new Date(expireAt);
    const now = new Date();

    // Check if file is expired
    if (isBefore(expireDate, now)) {
      setIsExpired(true);
      return;
    }

    // Calculate remaining time percentage
    const updateTimeRemaining = () => {
      const now = new Date();
      if (isBefore(expireDate, now)) {
        setIsExpired(true);
        return;
      }

      // Format remaining time string
      const timeRemaining = formatDistanceToNow(expireDate, {
        addSuffix: true,
      });
      setRemainingTime(timeRemaining);

      // Calculate progress percentage for remaining time
      const totalSeconds = differenceInSeconds(expireDate, now);
      const totalDuration = 24 * 60 * 60; // 1 days max duration
      const percentage = Math.max(
        0,
        Math.min(100, (totalSeconds / totalDuration) * 100),
      );
      setProgressValue(percentage);
    };

    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [expireAt]);

  const comparePassphrase = async () => {
    if (!passphrase.trim()) {
      setError('Please enter a passphrase');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isSame = await bcrypt.compare(passphrase, passphraseHash);
      setIsPassphraseCorrect(isSame);
      if (!isSame) {
        setError('Incorrect passphrase. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Error verifying passphrase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      comparePassphrase();
    }
  };

  const handleFileDownload = async () => {
    if (isExpired) return;

    setDownloading(true);
    setError(null);

    try {
      const encryptedFileArrayBuffer = await fetchEncryptedFile(
        `upload/share/${sharedFileName}`,
      );

      const derivedKey = await deriveEncryptionKeyFromPassphrase(passphrase);

      const decryptedFile = await decryptFile(
        encryptedFileArrayBuffer,
        derivedKey,
        iv,
      );

      triggerDownload(decryptedFile, originalName);
      setDownloadSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to decrypt the file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const getFileIcon = () => {
    const extension = getFileExtension(originalName).toLowerCase();

    // You could expand this with more file type icons based on extension
    switch (extension) {
      case 'pdf':
        return <FileIcon className="h-12 w-12 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-12 w-12 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon className="h-12 w-12 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileIcon className="h-12 w-12 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileIcon className="h-12 w-12 text-purple-500" />;
      default:
        return <FileIcon className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <div className="from-background to-muted/30 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <AnimatePresence mode="wait">
        {isExpired ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-red-200 shadow-lg">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-red-500">
                  <AlertCircle className="h-6 w-6" />
                  File Expired
                </CardTitle>
                <CardDescription>
                  This shared file is no longer available
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-4 pb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Timer className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-muted-foreground text-center">
                  The file &quot;{originalName}&quot; has expired and can no
                  longer be accessed.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Badge
                  variant="outline"
                  className="border-red-200 text-red-500"
                >
                  Expired on {format(new Date(expireAt), 'MMMM d, yyyy')}
                </Badge>
              </CardFooter>
            </Card>
          </motion.div>
        ) : !isPassphraseCorrect ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Shield className="text-primary h-5 w-5" />
                  Secure File Access
                </CardTitle>
                <CardDescription>
                  Enter the passphrase to access the shared file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="relative">
                  <Input
                    type={showPassphrase ? 'text' : 'password'}
                    placeholder="Enter passphrase"
                    value={passphrase}
                    onChange={(e) => {
                      setPassphrase(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    className="pr-10"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                  >
                    {showPassphrase ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button
                  onClick={comparePassphrase}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <span className="animate-pulse">Verifying</span>
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
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock File
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-green-200 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-green-200 text-green-500"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Access Granted
                  </Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary">
                          {getFileExtension(originalName)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>File Type: {getFileExtension(originalName)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {getFileIcon()}
                  <div className="truncate">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block truncate">{originalName}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{originalName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardTitle>
                <CardDescription>Shared file details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">
                    {formatFileSize(Number(fileSize))}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Time Remaining
                    </span>
                    <span className="font-medium text-amber-500">
                      {remainingTime}
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                  <p className="text-muted-foreground text-right text-xs">
                    Expires {format(new Date(expireAt), 'MMM d, yyyy')}
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {downloadSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert
                        variant="default"
                        className="border-green-200 bg-green-50 py-2 text-green-800"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          File downloaded successfully!
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleFileDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <span className="animate-pulse">Downloading</span>
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
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
