import { NavLink, useLocation } from "react-router-dom";
import { Home, Swords, BarChart3, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/practice", label: "Practice", icon: Sparkles },
  { to: "/battle", label: "Battle", icon: Swords },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  // Hide nav on auth/install pages
  if (location.pathname.startsWith("/auth") || location.pathname.startsWith("/install")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto grid max-w-5xl grid-cols-5 px-2 py-2">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs text-muted-foreground",
                isActive && "bg-primary/10 text-foreground"
              )
            }
            end={it.to === "/"}
          >
            <it.icon className="h-5 w-5" />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
