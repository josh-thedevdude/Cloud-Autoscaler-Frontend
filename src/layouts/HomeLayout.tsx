import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Zap,
  Menu,
  X,
  Layers,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, Outlet } from "react-router"
import { useAuth } from "@/contexts/AuthContext"

export default function HomeLayout() {
  const pathname = window.location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { logout } = useAuth()

  const isClustersActive = pathname === "/clusters" || pathname.startsWith("/clusters")

  return (
    <div className="min-h-screen bg-background lg:max-w-[80%] m-auto">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/clusters" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-1">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden font-semibold text-foreground sm:inline-block">
              Autoscaler
            </span>
          </Link>

          {/* Global Navigation - Only Clusters */}
          <nav className="hidden items-center gap-1 lg:flex lg:flex-1 lg:justify-end">
            <Link
              to="/clusters"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isClustersActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Layers className="h-4 w-4" />
              Clusters
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* User Menu */}
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 cursor-pointer">
              <div className="h-6 w-6 rounded-full bg-chart-1 flex items-center justify-center text-xs font-medium text-primary-foreground">
                A
              </div>
              <span className="text-sm text-foreground">Admin</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex gap-2 text-destructive hover:bg-transparent hover:text-destructive cursor-pointer"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-border px-4 py-3 lg:hidden">
            <div className="grid gap-1">
              <Link
                to="/clusters"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isClustersActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Layers className="h-4 w-4" />
                Clusters
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}