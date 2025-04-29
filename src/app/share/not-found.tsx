'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertCircle, FileIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-slate-600">
              <AlertCircle className="h-6 w-6" />
              File Not Found
            </CardTitle>
            <CardDescription>
              This file doesn&apos;t exist or has been permanently deleted
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-4 pb-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <FileIcon className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-muted-foreground text-center">
              The file you&apos;re looking for is no longer available on our
              servers.
            </p>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              It may have been deleted by the owner or expired.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Badge
              variant="outline"
              className="border-slate-200 text-slate-500"
            >
              File Unavailable
            </Badge>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
