"use client"

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { FileWithPath } from "react-dropzone"

export interface ExtendedFile extends FileWithPath {
  retentionTime?: string
}

interface FilesContextProp {
  contextFiles: ExtendedFile[]
  setContextFiles: Dispatch<SetStateAction<ExtendedFile[]>>
}

const FilesContext = createContext<FilesContextProp | null>(null)

export const FilesContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [contextFiles, setContextFiles] = useState<ExtendedFile[]>([])

  return (
    <FilesContext.Provider value={{ contextFiles, setContextFiles }}>
      {children}
    </FilesContext.Provider>
  )
}

export const useFilesContext = () => {
  const context = useContext(FilesContext)
  if (!context) {
    throw new Error(
      "useFilesContext must be used within a FilesContextProvider"
    )
  }
  return context
}
