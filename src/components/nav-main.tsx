"use client"

import Link from "next/link"
import {
  FilesIcon,
  HouseIcon,
  InfoIcon,
  SquareArrowUpRightIcon,
  StarIcon,
  Upload,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain() {
  return (
    <div className="flex h-full flex-col justify-between">
      {/* Top section - Primary Actions */}
      <SidebarGroup className="gap-y-8">
        <div>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/auth/upload">
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
                  <FilesIcon /> Uploaded files
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarGroup>

      {/* Bottom section - Secondary Pages */}
      <SidebarGroup className="gap-y-2 text-sm opacity-60">
        <SidebarGroupLabel className="text-muted-foreground text-xs">
          Pages
        </SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/">
              <HouseIcon /> Homepage
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/features">
              <StarIcon /> Features
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/about">
              <InfoIcon /> About us
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroup>
    </div>
  )
}
