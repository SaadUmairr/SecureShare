import Link from "next/link"
import { fetchAllSharedFiles } from "@/actions/file"
import { auth } from "@/auth"
import { KeyPairContextProvider } from "@/context/keypair.context"
import { UserContextProvider } from "@/context/user.context"
import { UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Redirect } from "@/components/redirect"
import { SharedFilesClient } from "@/components/shared-files"

export default async function Shared() {
  const googleID = await auth().then((session) => session?.user.googleID)
  if (!googleID) return <Redirect to="/" label="UNAUTHENTICATED" />

  const records = await fetchAllSharedFiles(googleID)

  return (
    <UserContextProvider>
      <KeyPairContextProvider>
        <div className="space-y-6">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Your Shared Files
          </h2>

          {(records.length > 0 &&
            records.map((record) => (
              <div
                key={record.id}
                className="grid sm:grid-cols-1 md:grid-cols-4"
              >
                {record.originalFile?.fileNameIV &&
                  record.originalFile.fileName &&
                  record.originalFile.symmetricKey && (
                    <SharedFilesClient
                      key={record.id}
                      id={record.id}
                      createdAt={record.createdAt}
                      downloadCount={record.downloadCount}
                      maxDownloads={record.maxDownloads}
                      expireAt={record.expireAt}
                      sharedFileName={record.sharedFileName}
                      shareId={record.shareId}
                      fileNameIV={record.originalFile?.fileNameIV}
                      fileSize={record.fileSize}
                      iv={record.iv}
                      originalFileName={record.originalFile?.fileName}
                      keyBase64={record.originalFile?.symmetricKey}
                    />
                  )}
              </div>
            ))) || (
            <div className="flex w-full flex-col gap-4 text-center">
              <p>No files shared, shared files will show here</p>
              <Link href="/auth/upload">
                <Button variant="outline">
                  <UploadIcon /> Upload Files
                </Button>
              </Link>
            </div>
          )}
        </div>
      </KeyPairContextProvider>
    </UserContextProvider>
  )
}
