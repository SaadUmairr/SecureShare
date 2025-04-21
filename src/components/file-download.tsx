'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getFileTypeInfo } from './file-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface FileCardProps {
  file: File;
  disabled?: boolean;
}
export function FileDownloadCard({ file, disabled }: FileCardProps) {
  const { icon, color, label } = getFileTypeInfo(file);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'bg-card text-card-foreground relative w-full overflow-hidden rounded-lg border shadow-sm transition-colors duration-200',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <div className="p-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    'bg-muted/50 transition-colors duration-200',
                    color,
                    disabled && 'opacity-50',
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
        </div>
      </div>
    </motion.div>
  );
}
