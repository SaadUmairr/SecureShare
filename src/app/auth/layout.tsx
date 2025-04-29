import { AppSidebar } from '@/components/app-sidebar';
import ThemeToggler from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserContextProvider } from '@/context/user.context';
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
              <p className="whitespace-nowrap">Secure Share</p>
            </div>

            <div className="ml-auto">
              <ThemeToggler />
            </div>
          </header>
          <div className="px-4 py-2">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </UserContextProvider>
  );
}
