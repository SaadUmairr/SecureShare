"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { deleteSharedFile } from "@/actions/file"
import { useKeyPair } from "@/context/keypair.context"
import { FileNameDecryptor } from "@/utils/crypto.util"
import { FileShare } from "@prisma/client"
import { format } from "date-fns"
import {
  Ban,
  Check,
  CopyIcon,
  DownloadIcon,
  ExternalLink,
  ExternalLinkIcon,
  FileText,
  InfoIcon,
  Lock,
  MoreHorizontal,
  Shield,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { formatRemainingTime } from "./all-files"
import { formatFileSize, trimFilename } from "./file-card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface SharedFilesClientProp
  extends Omit<
    FileShare,
    "ipAddress" | "originalFileId" | "passphraseHash" | "userId"
  > {
  keyBase64: string
  fileNameIV: string
  originalFileName: string
}
export function SharedFilesClient({
  id,
  shareId,
  sharedFileName,
  maxDownloads,
  downloadCount,
  fileNameIV,
  originalFileName,
  fileSize,
  keyBase64,
  createdAt,
  expireAt,
}: SharedFilesClientProp) {
  const { privateKey } = useKeyPair()
  const [decryptedFileName, setDecryptedFileName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isStoppingShare, setIsStoppingShare] = useState<boolean>(false)
  const [showStopSharingAlert, setShowStopSharingAlert] =
    useState<boolean>(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const isExpired = expireAt ? new Date(expireAt) < new Date() : false
  const iconColor = isExpired ? "text-red-500" : "text-blue-500"
  const icon = <FileText className={iconColor} />
  const label = isExpired ? "Expired" : "Shared File"

  const shareLink = `${window.location.origin}/share/${shareId}`

  useEffect(() => {
    const decryptFileName = async () => {
      if (!privateKey || !originalFileName || !fileNameIV || !keyBase64) {
        setIsLoading(false)
        return
      }

      try {
        const name = await FileNameDecryptor(
          originalFileName,
          fileNameIV,
          keyBase64,
          privateKey
        )
        setDecryptedFileName(name)
      } catch {
        setDecryptedFileName("Encrypted File")
      } finally {
        setIsLoading(false)
      }
    }

    decryptFileName()
  }, [privateKey, originalFileName, fileNameIV, keyBase64])

  const handleStopSharing = async () => {
    try {
      setIsStoppingShare(true)
      console.log("DELETE: ", id, " :: ", sharedFileName)
      await deleteSharedFile(id, sharedFileName)

      console.log("Stopped sharing file:", id)
    } catch {
      toast.error("Oops! Try refreshing the page then Try Again!")
    } finally {
      setIsStoppingShare(false)
      setShowStopSharingAlert(false)
    }
  }

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  const trimmedFileName = trimFilename(decryptedFileName || "Unnamed File")

  if (!privateKey) {
    return (
      <div className="bg-card text-card-foreground relative w-full overflow-hidden rounded-lg border border-dashed p-6 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Lock className="text-muted-foreground h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Loading encryption keys...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "bg-card text-card-foreground relative w-full overflow-hidden rounded-lg border shadow-sm transition-colors duration-200",
          isExpired && "opacity-60"
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
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      "bg-muted/50 transition-colors duration-200"
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

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "flex h-6 items-center gap-1 px-2 py-0 text-xs",
                  isExpired
                    ? "border-red-200 text-red-500"
                    : "border-blue-200 text-blue-500"
                )}
              >
                <DownloadIcon className="h-3 w-3" />
                {downloadCount}/{maxDownloads || "∞"}
              </Badge>

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
                      className="justify-start text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setShowDetailsDialog(true)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setShowStopSharingAlert(true)}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Stop Sharing
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-2 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3
                      className={cn(
                        "cursor-pointer truncate text-sm font-medium",
                        "text-foreground transition-colors duration-200",
                        isLoading && "animate-pulse"
                      )}
                      onClick={() => setShowDetailsDialog(true)}
                    >
                      {isLoading ? "Decrypting..." : trimmedFileName}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {isLoading ? "Decrypting filename..." : decryptedFileName}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "truncate text-xs",
                  "text-muted-foreground transition-colors duration-200"
                )}
              >
                {formatFileSize(Number(fileSize))}
              </span>
            </div>

            <div className="text-muted-foreground text-xs">
              Shared: {format(new Date(createdAt), "MMM d, yyyy")}
            </div>

            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isExpired ? "text-red-500" : "text-amber-500"
              )}
            >
              <Shield className="h-3 w-3" />
              {isExpired ? "Expired" : formatRemainingTime(expireAt)}
            </div>
          </div>
        </div>

        {/* Stop Sharing Alert Dialog */}
        <AlertDialog
          open={showStopSharingAlert}
          onOpenChange={setShowStopSharingAlert}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <Ban className="h-5 w-5" />
                Stop Sharing File
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to stop sharing this file? This will
                revoke access for anyone with the share link.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleStopSharing}
                disabled={isStoppingShare}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isStoppingShare ? (
                  <>
                    <span className="animate-pulse">Stopping</span>
                    <span className="ml-1 flex">
                      <span className="animate-bounce">.</span>
                      <span
                        className="animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      >
                        .
                      </span>
                      <span
                        className="animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      >
                        .
                      </span>
                    </span>
                  </>
                ) : (
                  "Stop Sharing"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Share Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <InfoIcon className="h-5 w-5" />
                Share Details
              </DialogTitle>
              <DialogDescription>
                View and copy sharing information for your file
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-muted rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      "bg-muted/50 transition-colors duration-200",
                      iconColor
                    )}
                  >
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {isLoading ? "Decrypting..." : decryptedFileName}
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      {formatFileSize(Number(fileSize))} · Shared on{" "}
                      {format(new Date(createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Share Link</label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted flex-1 truncate rounded-md px-3 py-2 text-sm">
                      {shareLink}
                    </div>
                    <Link href={shareLink} target="_blank">
                      <Button
                        size="icon"
                        variant="outline"
                        className="relative overflow-hidden rounded-md shadow-md transition-shadow duration-300 hover:shadow-lg"
                      >
                        <ExternalLinkIcon />
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyShareLink}
                      type="button"
                      className="relative overflow-hidden rounded-md shadow-md transition-shadow duration-300 hover:shadow-lg"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.div
                            key="check-icon"
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy-icon"
                            initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <CopyIcon className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 flex items-start gap-2 rounded-md p-3">
                <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                <div>
                  <h4 className="text-sm font-medium">Security Information</h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    This file has been accessed {downloadCount} times
                    {maxDownloads
                      ? ` out of ${maxDownloads} allowed downloads`
                      : ""}
                    .
                    {expireAt && (
                      <>
                        {" "}
                        It will
                        {isExpired ? " expired " : " expire "}
                        {formatRemainingTime(expireAt)}.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  )
}
