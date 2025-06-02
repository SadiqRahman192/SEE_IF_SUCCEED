import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/AuthContext"; // Fixed path (removed ./)
import { toast } from "sonner";

interface NavigationProps {
  currentView: string;
  setCurrentView(view: string): void;
}

export default function Navigation({
  currentView,
  setCurrentView,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");


      
      setCurrentView("home");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
      navigate("/signin"); // Redirect even on error
    }
  };

  const handleNavigation = (path: string, view: string) => {
    navigate(path);
    setCurrentView(view);
    setIsMenuOpen(false); // Close mobile menu
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation("/", "home")}
          >
            <Calendar className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold text-foreground">
              EventMaster Pro
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("/", "home")}
              className={`text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "home" ? "text-green-500" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/#features", "features")}
              className={`text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "features" ? "text-green-500" : ""
              }`}
            >
              Features
            </button>
            <button
              onClick={() => handleNavigation("/dashboard", "dashboard")}
              className={`text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "dashboard" ? "text-green-500" : ""
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation("/allevents", "allevents")}
              className={`text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "allevents" ? "text-green-500" : ""
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => handleNavigation("/pricing", "pricing")}
              className={`text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "pricing" ? "text-green-500" : ""
              }`}
            >
              Pricing
            </button>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="outline" size="sm">
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => handleNavigation("/signin", "signin")}
                  variant="outline"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => handleNavigation("/signup", "signup")}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <button
              onClick={() => handleNavigation("/", "home")}
              className={`block text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "home" ? "text-green-500" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/#features", "features")}
              className={`block text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "features" ? "text-green-500" : ""
              }`}
            >
              Features
            </button>
            <button
              onClick={() => handleNavigation("/dashboard", "dashboard")}
              className={`block text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "dashboard" ? "text-green-500" : ""
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation("/allevents", "allevents")}
              className={`block text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "allevents" ? "text-green-500" : ""
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => handleNavigation("/pricing", "pricing")}
              className={`block text-foreground/70 hover:text-green-500 transition-colors ${
                currentView === "pricing" ? "text-green-500" : ""
              }`}
            >
              Pricing
            </button>
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-foreground"
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => handleNavigation("/signin", "signin")}
                    variant="outline"
                    className="w-full text-foreground"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleNavigation("/signup", "signup")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
