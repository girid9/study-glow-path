import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import BottomNav from "@/layout/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppShell() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-xl bg-primary/10 ring-1 ring-primary/20")} />
            <div className="leading-tight">
              <div className="text-sm font-semibold">StudyGlow</div>
              <div className="text-[11px] text-muted-foreground">{title}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

function getTitle(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/practice")) return "Practice";
  if (pathname.startsWith("/battle")) return "Battle";
  if (pathname.startsWith("/stats")) return "Stats";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/subject")) return "Learn";
  return "Study";
}
