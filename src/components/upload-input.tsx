"use client"

import { useCallback, useEffect, useState } from "react"
import { saveFileShareRecordInDb } from "@/actions/file"
import { EncryptArrayBuffer, toUrlSafeBase64 } from "@/utils/crypto.util"
import { deriveEncryptionKeyFromPassphrase } from "@/utils/key-ops.util"
import axios from "axios"
import bcrypt from "bcryptjs"
import { AnimatePresence, motion, useAnimate } from "framer-motion"
import {
  AlertTriangleIcon,
  EyeIcon,
  EyeOffIcon,
  Lock,
  Upload,
} from "lucide-react"
import { customAlphabet } from "nanoid"
import { useTheme } from "next-themes"
import Dropzone, { FileRejection, FileWithPath } from "react-dropzone"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generatePutObjectSignedURL } from "@/app/aws/s3/put-object"

import { FileCard } from "./file-card"

const MAX_FILES_PER_DAY = 1
const MAX_UPLOAD_SIZE_PER_DAY = 50 * 1024 * 1024 // 50 MB

export function UploadTrialPage() {
  const { theme } = useTheme()
  const [scope, animate] = useAnimate()
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [passphraseValue, setPassphraseValue] = useState<string>("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passphraseDialogOpen, setpassphraseDialogOpen] =
    useState<boolean>(false)
  const [isIslandView, setIsIslandView] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const dropzoneStyles = {
    initial: {
      width: "100%",
      height: "75vh",
      minHeight: "200px",
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      border: `2px dashed var(--border-color)`,
      borderRadius: "1rem",
      transition: "all 0.2s ease-out",
      backgroundColor:
        theme === "dark"
          ? "hsl(var(--background))"
          : "hsl(var(--background-lighter))",
    },
    island: {
      height: "auto",
      minHeight: "120px",
      padding: "1.5rem",
      borderRadius: "1rem",
      backgroundColor:
        theme === "dark"
          ? "hsl(var(--background-darker))"
          : "hsl(var(--background))",
      border: "2px solid var(--border-color)",
    },
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  }

  useEffect(() => {
    const shouldShowIslandView = files.length > 0
    if (shouldShowIslandView !== isIslandView) {
      setIsIslandView(shouldShowIslandView)
      if (shouldShowIslandView) {
        animateToIsland()
      } else {
        animateToInitial()
      }
    }
  }, [files.length])

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
        }
      )
    } catch (error) {
      toast.error(`Animation Failed: ${(error as Error).message}`)
    }
  }, [animate, scope, theme])

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
        }
      )
    } catch (error) {
      toast.error(`Animation Failed: ${(error as Error).message}`)
    }
  }, [animate, scope, theme])

  const onDropAccepted = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles(acceptedFiles)
    },
    [setFiles]
  )
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    for (const rejection of fileRejections) {
      const { file, errors } = rejection
      for (const error of errors) {
        if (error.code === "file-too-large") {
          toast.error(`"${file.name}" exceeds the 50MB limit.`)
        }
        if (error.code === "too-many-files") {
          toast.error(
            `You can only upload up to ${MAX_FILES_PER_DAY} files at a time.`
          )
        }
      }
    }
  }, [])

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleFilesEncryption = async () => {
    setIsProcessing(true)
    const uploadingToast = toast.loading("ENCRYPTING...")
    try {
      const ip = await axios.get("/api/get-data")

      const ipAddress = ip.data.ip

      const nanoidShort = customAlphabet(
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.~",

        5
      )

      const shareId = nanoidShort()

      const derivedKey =
        await deriveEncryptionKeyFromPassphrase(passphraseValue)

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer()

        const passphraseHash = await bcrypt.hash(passphraseValue, 12)

        const encryptedShareFile = await EncryptArrayBuffer(
          fileBuffer,
          derivedKey,
          file.name
        )

        const iv = encryptedShareFile.iv

        const ivBase64 = btoa(String.fromCharCode(...iv))
        const encryptedBlob = new Blob([encryptedShareFile.encryptedData])

        const encryptedFileName = toUrlSafeBase64(
          encryptedShareFile.encryptedName
        )

        const presignedURL = await generatePutObjectSignedURL({
          key: `upload/share/${encryptedFileName}`,
          fileType: "application/octet-stream",
        })

        await saveFileShareRecordInDb({
          ipAddress,
          shareId,
          sharedFileName: encryptedFileName,
          passphraseHash,
          iv: ivBase64,
          fileSize: BigInt(file.size),
          expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })

        await axios.put(presignedURL, encryptedBlob)
      }
      toast.success("File Shared", { id: uploadingToast })
    } catch {
      toast.error("Try Again! Something went wrong.", { id: uploadingToast })
    } finally {
      setIsProcessing(false)
    }
  }
  return (
    <>
      <Dialog
        onOpenChange={setpassphraseDialogOpen}
        open={passphraseDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Passphrase</DialogTitle>
            <DialogDescription>
              Set a passphrase to protect your shared file.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <h4 className="flex items-center gap-1.5 text-sm font-medium text-amber-700">
              <AlertTriangleIcon className="h-4 w-4" />
              Important
            </h4>
            <p className="mt-1 text-xs text-amber-600">
              Make sure to set a new and distinct passphrase for file sharing.
              Anyone with this passphrase can access your file until it expires.
            </p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passphrase" className="text-right">
                Passphrase
              </Label>
              <Input
                id="passphrase"
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassphraseValue(e.target.value)}
                className="col-span-3"
                disabled={isProcessing}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-8 bottom-20 h-8 w-8 -translate-y-1/2"
                onClick={togglePasswordVisibility}
                type="button"
                tabIndex={-1}
              >
                {passwordVisible ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeOffIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleFilesEncryption}
              disabled={isProcessing || passphraseValue.length <= 2}
            >
              Set Passphrase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="container mx-auto p-4">
        <motion.div
          ref={scope}
          className="mx-auto rounded-lg shadow-sm transition-colors duration-300"
          style={isIslandView ? dropzoneStyles.island : dropzoneStyles.initial}
        >
          <Dropzone
            onDropAccepted={onDropAccepted}
            onDropRejected={onDropRejected}
            maxFiles={MAX_FILES_PER_DAY}
            maxSize={MAX_UPLOAD_SIZE_PER_DAY}
            disabled={isProcessing}
            multiple
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={`h-full w-full rounded-lg transition-all duration-300 ${isDragActive ? "bg-primary/10 border-primary" : ""} ${isProcessing ? "cursor-not-allowed opacity-50" : ""} `}
              >
                <Input {...getInputProps()} />
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <Upload
                    className={`h-12 w-12 ${isDragActive ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <p className="text-muted-foreground text-center">
                    {isIslandView
                      ? `${files.length} file(s) selected. Drop more or click to select`
                      : "Drag and drop files here, or click to select"}
                  </p>
                </div>
              </div>
            )}
          </Dropzone>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {files.length > 0 && (
            <motion.div
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {files.map((file) => (
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
                      setFiles((files) => files.filter((f) => f !== file))
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
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="button"
              onClick={() => setpassphraseDialogOpen(true)}
              disabled={isProcessing || files.length === 0}
              className="flex items-center gap-2 text-white"
            >
              <Lock className="h-4 w-4" />
              {isProcessing ? "Processing..." : "Encrypt"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
