'use client';

import { FilesIcon, SquareArrowUpRightIcon, Upload } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="upload">
              <Upload /> Upload Files
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <a href="shared">
            <SidebarMenuButton>
              <SquareArrowUpRightIcon /> shared files
            </SidebarMenuButton>
          </a>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <a href="files">
            <SidebarMenuButton>
              <FilesIcon />
              uploaded files
            </SidebarMenuButton>
          </a>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
