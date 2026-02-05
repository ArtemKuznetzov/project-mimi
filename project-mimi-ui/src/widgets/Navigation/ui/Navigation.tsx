import type { HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import { NewspaperIcon, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

type NavigationProps = HTMLAttributes<HTMLElement>;

const navItems = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/feed", label: "Feed", icon: NewspaperIcon },
];

export const Navigation = ({ className, ...props }: NavigationProps) => {
  return (
    <>
      <nav
        className={cn(
          "hidden w-full max-w-[260px] rounded-lg border bg-white p-2 shadow-sm transition-shadow duration-200 dark:border-gray-800 dark:bg-gray-900 md:sticky md:top-4 md:block md:self-start md:hover:shadow-md",
          className,
        )}
        aria-label="Main"
        {...props}
      >
        <ul className="flex flex-col gap-2 text-sm">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-background hover:text-foreground hover:shadow-sm",
                    isActive && "bg-background text-foreground shadow-sm font-medium",
                  )
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden"
        aria-label="Main"
      >
        <ul className="flex items-center justify-around py-2 text-xs">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground transition-colors",
                    isActive && "text-foreground",
                  )
                }
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
