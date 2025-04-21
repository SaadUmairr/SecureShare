import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserContextProvider } from '@/context/user.context';
export default function AuthLoading() {
  return (
    <UserContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
              <p>Secure Share</p>
            </div>
            <div className="flex items-center gap-2 px-4">
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
              <p>Loading</p>
            </div>
          </header>
          {/* {children} */}
        </SidebarInset>
      </SidebarProvider>
    </UserContextProvider>
  );
}
