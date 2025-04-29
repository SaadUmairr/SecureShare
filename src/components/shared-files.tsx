'use client';

import { fetchAllSharedFiles } from '@/actions/file';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/user.context';
import { FileShare } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function SharedFiles() {
  const { googleID } = useUser();
  const [records, setRecords] = useState<FileShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!googleID) return;
      setLoading(true);
      try {
        const response = await fetchAllSharedFiles(googleID);
        setRecords(response);
      } catch (error) {
        toast.error(`Error fetching shared files: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [googleID]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Shared Files</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
              <CardFooter className="border-t px-4 py-3">
                <div className="flex w-full items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Shared Files</h2>
        <Card className="border border-dashed">
          <CardContent className="px-6 py-8 text-center text-gray-500">
            <p>No shared files found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Shared Files</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
        {records.map((record, index) => {
          const timeLeft = formatDistanceToNow(record.expireAt);
          const isExpiringSoon =
            timeLeft.includes('hour') || timeLeft.includes('minute');

          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                {/* add decryption filename util */}
                {/* <CardTitle>{record.originalName}</CardTitle> */}
              </CardHeader>
              <CardContent className="relative px-4 py-2">
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`text-xs ${isExpiringSoon ? 'text-orange-500' : 'text-gray-500'}`}
                  >
                    {timeLeft} left
                  </span>

                  <Link
                    href={`/share/${record.shareId}`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"

                    // aria-label={`Open shared link for ${record.originalName}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
