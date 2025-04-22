'use client';

import { useFilesContext } from '@/context/file.context';
import { useKeyPair } from '@/context/keypair.context';
import { useUser } from '@/context/user.context';
import { Encryptor } from '@/utils/crypto.util';
import { filesUploader } from '@/utils/s3.util';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { Lock, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import Dropzone, { FileRejection, FileWithPath } from 'react-dropzone';
import { toast } from 'sonner';
import { FileCard } from './file-card';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function UploadMainPage() {
  const { theme } = useTheme();
  const { publicKey } = useKeyPair();
  const { googleID } = useUser();
  const { contextFiles, setContextFiles } = useFilesContext();
  const [scope, animate] = useAnimate();
  const [isIslandView, setIsIslandView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const dropzoneStyles = {
    initial: {
      width: '100%',
      height: '75vh',
      minHeight: '200px',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: `2px dashed var(--border-color)`,
      borderRadius: '1rem',
      transition: 'all 0.2s ease-out',
      backgroundColor:
        theme === 'dark'
          ? 'hsl(var(--background))'
          : 'hsl(var(--background-lighter))',
    },
    island: {
      height: 'auto',
      minHeight: '120px',
      padding: '1.5rem',
      borderRadius: '1rem',
      backgroundColor:
        theme === 'dark'
          ? 'hsl(var(--background-darker))'
          : 'hsl(var(--background))',
      border: '2px solid var(--border-color)',
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  useEffect(() => {
    const shouldShowIslandView = contextFiles.length > 0;
    if (shouldShowIslandView !== isIslandView) {
      setIsIslandView(shouldShowIslandView);
      if (shouldShowIslandView) {
        animateToIsland();
      } else {
        animateToInitial();
      }
    }
  }, [contextFiles.length]);

  const animateToIsland = useCallback(async () => {
    try {
      await animate(
        scope.current,
        {
          scale: [1, 0.95, 1],
          ...dropzoneStyles.island,
        },
        {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        },
      );
    } catch (error) {
      toast.error(`Animation Failed: ${(error as Error).message}`);
    }
  }, [animate, scope, theme]);

  const animateToInitial = useCallback(async () => {
    try {
      await animate(
        scope.current,
        {
          scale: [1, 0.95, 1],
          ...dropzoneStyles.initial,
        },
        {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        },
      );
    } catch (error) {
      toast.error(`Animation Failed: ${(error as Error).message}`);
    }
  }, [animate, scope, theme]);

  const onDropAccepted = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setContextFiles(acceptedFiles);
    },
    [setContextFiles],
  );
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    for (const rejection of fileRejections) {
      const { file, errors } = rejection;
      for (const error of errors) {
        if (error.code === 'file-too-large') {
          toast.error(`"${file.name}" exceeds the 100MB limit.`);
        }
        if (error.code === 'too-many-files') {
          toast.error(`You can only upload up to 5 files at a time.`);
        }
      }
    }
  }, []);

  // TODO: THIS IS THE TEMPORARY ENCRYPTION FUNCTION, WILL BE REFACTORED LATER
  const handleFilesEncryption = async () => {
    if (!publicKey) {
      toast.error('Public key is not present');
      return;
    }

    setIsProcessing(true);
    const enc_load = toast.loading('ENCRYPTING');
    try {
      const encryptedFiles = await Encryptor(contextFiles, publicKey, googleID);
      toast.loading('UPLOADING', { id: enc_load });
      await filesUploader(encryptedFiles);
      toast.success('DONE', { id: enc_load });
    } catch  {
      toast.error('Failed to encrypt and upload files', { id: enc_load });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        ref={scope}
        className="mx-auto rounded-lg shadow-sm transition-colors duration-300"
        style={isIslandView ? dropzoneStyles.island : dropzoneStyles.initial}
      >
        <Dropzone
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
          maxFiles={5}
          maxSize={104857600}
          multiple
          disabled={isProcessing}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={`h-full w-full rounded-lg transition-all duration-300 ${isDragActive ? 'bg-primary/10 border-primary' : ''} ${isProcessing ? 'cursor-not-allowed opacity-50' : ''} `}
            >
              <Input {...getInputProps()} />
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <Upload
                  className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <p className="text-muted-foreground text-center">
                  {isIslandView
                    ? `${contextFiles.length} file(s) selected. Drop more or click to select`
                    : 'Drag and drop files here, or click to select'}
                </p>
              </div>
            </div>
          )}
        </Dropzone>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {contextFiles.length > 0 && (
          <motion.div
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {contextFiles.map((file) => (
              <motion.div
                key={file.path || file.name}
                layout
                layoutId={file.path || file.name}
                className="w-full"
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.2 },
                }}
              >
                <FileCard
                  file={file}
                  onRemove={() =>
                    setContextFiles((files) => files.filter((f) => f !== file))
                  }
                  disabled={isProcessing}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="my-8 flex flex-wrap justify-center gap-4 md:justify-end"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={handleFilesEncryption}
            disabled={isProcessing || contextFiles.length === 0}
            className="flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Encrypt & Upload'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
