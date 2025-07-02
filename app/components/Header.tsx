import { Link } from "@remix-run/react";
import { useState } from "react";
import {
  FaBell,
  FaCog,
  FaSearch,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface HeaderProps {
  currentPage?:
    | "dashboard"
    | "products"
    | "inventory"
    | "transactions"
    | "reports";
  userName?: string;
  userRole?: "admin" | "staff";
  onLogout?: () => void;
}

const Header = ({
  currentPage = "dashboard",
  userName = "John Doe",
  userRole = "staff",
  onLogout,
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      console.log("Logging out...");
      // You can implement your logout logic here
    }
  };

  const navigationItems = [
    { key: "dashboard", label: "Dashboard", href: "/dashboard" },
    { key: "products", label: "Products", href: "/products" },
    { key: "inventory", label: "Inventory", href: "/inventory" },
    { key: "transactions", label: "Transactions", href: "/transactions" },
    { key: "reports", label: "Reports", href: "/reports" },
  ];

  const isActivePage = (pageKey: string) => currentPage === pageKey;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            >
              Inventrix
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-10 space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`px-1 pb-4 text-sm font-medium transition-colors duration-200 ${
                    isActivePage(item.key)
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Search, Notifications, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <FaBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <FaUser className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-700">
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {userRole}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    role="button"
                    tabIndex={0}
                    aria-label="Close user menu"
                    onClick={() => setIsUserMenuOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setIsUserMenuOpen(false);
                      }
                    }}
                  ></div>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Signed in as{" "}
                      <span className="font-medium">{userName}</span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaCog className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActivePage(item.key)
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Mobile User Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <FaUser className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {userName}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {userRole}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
