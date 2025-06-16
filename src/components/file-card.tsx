"use client"

import React from "react"
import { ExtendedFile } from "@/context/file.context"
import {
  Archive,
  BookOpen,
  Clock,
  File,
  FileJson,
  FileSpreadsheet,
  ImageIcon,
  Mail,
  Music,
  Presentation,
  SquareChevronRight,
  Table,
  Text,
  Video,
  X,
} from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FileCardProps {
  file: ExtendedFile
  onRemove: () => void
  disabled?: boolean
}

interface FileTypeInfo {
  icon: React.ReactNode
  color: string
  label: string
}

// Previous utility functions remain the same
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function trimFilename(filename: string, maxLength: number = 28): string {
  if (filename.length <= maxLength) return filename
  const parts = filename.split(".")
  const extension = parts.pop()
  const name = parts.join(".")
  if (name.length <= maxLength - 4 - (extension ? extension.length + 1 : 0)) {
    return filename
  }
  const trimmedName = name.substring(0, maxLength - 4) + "..._"
  return extension ? `${trimmedName}.${extension}` : trimmedName
}

export const getFileTypeInfo = (file: File): FileTypeInfo => {
  const extension = file.name.split(".").pop()?.toLowerCase()
  const mimeType = file.type.toLowerCase()

  // Image files
  if (mimeType.startsWith("image/")) {
    return {
      icon: <ImageIcon className="h-5 w-5" />,
      color: "text-indigo-600",
      label: `Image File (${mimeType.split("/")[1].toUpperCase()})`,
    }
  }

  // Video files
  if (mimeType.startsWith("video/")) {
    return {
      icon: <Video className="h-5 w-5" />,
      color: "text-purple-600",
      label: `Video File (${mimeType.split("/")[1].toUpperCase()})`,
    }
  }

  // Audio files
  if (mimeType.startsWith("audio/")) {
    return {
      icon: <Music className="h-5 w-5" />,
      color: "text-purple-600",
      label: `Audio File (${mimeType.split("/")[1].toUpperCase()})`,
    }
  }

  // Code files
  const codeExtensions = {
    js: "JavaScript",
    jsx: "React JSX",
    ts: "TypeScript",
    tsx: "React TSX",
    py: "Python",
    java: "Java",
    cpp: "C++",
    c: "C",
    rb: "Ruby",
    php: "PHP",
    go: "Go",
    rs: "Rust",
    swift: "Swift",
    kt: "Kotlin",
  }

  if (extension && extension in codeExtensions) {
    return {
      icon: <SquareChevronRight className="h-5 w-5" />,
      color: "text-emerald-600",
      label: `Code File (${codeExtensions[extension as keyof typeof codeExtensions]})`,
    }
  }

  // Spreadsheet files
  const spreadsheetExtensions = ["xlsx", "xls", "csv", "ods"]
  if (extension && spreadsheetExtensions.includes(extension)) {
    return {
      icon: <FileSpreadsheet className="h-5 w-5" />,
      color: "text-green-600",
      label: "Spreadsheet File",
    }
  }

  // PDF files
  if (extension === "pdf" || mimeType === "application/pdf") {
    return {
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-red-600",
      label: "PDF Document",
    }
  }

  // Presentation files
  const presentationExtensions = ["ppt", "pptx", "key", "odp"]
  if (extension && presentationExtensions.includes(extension)) {
    return {
      icon: <Presentation className="h-5 w-5" />,
      color: "text-orange-600",
      label: "Presentation File",
    }
  }

  // Archive files
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"]
  if (extension && archiveExtensions.includes(extension)) {
    return {
      icon: <Archive className="h-5 w-5" />,
      color: "text-yellow-600",
      label: "Archive File",
    }
  }

  // Database files
  const databaseExtensions = ["sql", "db", "sqlite", "mongodb"]
  if (extension && databaseExtensions.includes(extension)) {
    return {
      icon: <Table className="h-5 w-5" />,
      color: "text-blue-600",
      label: "Database File",
    }
  }

  // JSON files
  if (extension === "json" || mimeType === "application/json") {
    return {
      icon: <FileJson className="h-5 w-5" />,
      color: "text-amber-600",
      label: "JSON File",
    }
  }

  // Email files
  const emailExtensions = ["eml", "msg"]
  if (extension && emailExtensions.includes(extension)) {
    return {
      icon: <Mail className="h-5 w-5" />,
      color: "text-sky-600",
      label: "Email File",
    }
  }

  // Text files
  const textExtensions = ["txt", "md", "rtf", "doc", "docx"]
  if (
    mimeType.startsWith("text/") ||
    (extension && textExtensions.includes(extension))
  ) {
    return {
      icon: <Text className="h-5 w-5" />,
      color: "text-teal-600",
      label: "Text Document",
    }
  }
  return {
    icon: <File className="h-5 w-5" />,
    color: "text-teal-600",
    label: "File",
  }
}
const timeOptions = [
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "2w", label: "2 Weeks" },
  { value: "1m", label: "1 Month" },
]

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onRemove,
  disabled = false,
}) => {
  const [selectedTime, setSelectedTime] = React.useState("1d")
  const trimmedFileName = trimFilename(file.name)
  const { icon, color, label } = getFileTypeInfo(file)
  const isDefaultTime = selectedTime === "1d"

  const handleTimeRetentionChange = (time: string) => {
    setSelectedTime(time)
    file.retentionTime = time
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "bg-card text-card-foreground relative w-full overflow-hidden rounded-lg border shadow-sm transition-colors duration-200",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
        className={cn(
          "absolute top-2 right-2 z-10 rounded-full p-1.5",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-muted focus:ring-ring focus:ring-2 focus:outline-none",
          "transition-all duration-200",
          disabled && "pointer-events-none"
        )}
      >
        <X className="h-4 w-4" />
      </motion.button>

      <div className="p-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    "bg-muted/50 transition-colors duration-200",
                    color,
                    disabled && "opacity-50"
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

          <div className="min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3
                    className={cn(
                      "truncate text-sm font-medium",
                      "text-foreground transition-colors duration-200"
                    )}
                  >
                    {trimmedFileName}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{file.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="mt-1 flex items-center justify-between">
              <span
                className={cn(
                  "truncate text-xs",
                  "text-muted-foreground transition-colors duration-200"
                )}
              >
                {formatFileSize(file.size)}
              </span>

              <div className="flex items-center gap-2">
                {!isDefaultTime && (
                  <span className="text-muted-foreground text-xs">
                    {
                      timeOptions.find((opt) => opt.value === selectedTime)
                        ?.label
                    }
                  </span>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={selectedTime}
                        onValueChange={(e) => handleTimeRetentionChange(e)}
                      >
                        <SelectTrigger className="h-6 w-6 border-0 bg-transparent p-0">
                          <SelectValue asChild>
                            <div className="flex items-center justify-center">
                              <Clock
                                className={cn(
                                  "h-4 w-4 transition-colors duration-200",
                                  isDefaultTime
                                    ? "text-muted-foreground hover:text-foreground"
                                    : "text-amber-500 hover:text-amber-600"
                                )}
                              />
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Set retention period</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FileCard
