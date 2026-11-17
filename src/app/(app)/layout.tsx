import { logout } from "@/features/auth";
import { Routes } from "@/lib/routes";
import { requireSession } from "@/lib/session";
import { site } from "@/lib/site";
import { NavLink } from "@/ui/components/layout/NavLink";
import { ThemeToggle } from "@/ui/components/theme/ThemeToggle";
import { Button } from "@/ui/primitives/button";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  await requireSession();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="hidden font-medium sm:inline">{site.name}</span>
          <nav className="flex items-center gap-1">
            <NavLink href={Routes.dashboard}>Dashboard</NavLink>
            <NavLink href={Routes.customers}>Customers</NavLink>
            <NavLink href={Routes.orders}>Orders</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
