'use client';

import { FilesIcon, SquareArrowUpRightIcon, Upload } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="upload">
              <Upload /> Upload Files
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/auth/shared">
            <SidebarMenuButton>
              <SquareArrowUpRightIcon /> Shared files
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/auth/files">
            <SidebarMenuButton>
              <FilesIcon />
              Uploaded files
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
