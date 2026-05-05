import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search } from "lucide-react";

export function DashboardLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button className="size-9 rounded-md hover:bg-muted grid place-items-center text-muted-foreground">
              <Search className="size-4" />
            </button>
            <button className="size-9 rounded-md hover:bg-muted grid place-items-center text-muted-foreground relative">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
            </button>
            <div className="size-9 rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] grid place-items-center text-primary-foreground text-sm font-semibold">
              H
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}