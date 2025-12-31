import { useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "./Navbar";
import { ShoppingBagIcon } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <div className="drawer-side z-50">
      {/* Overlay */}
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      />

      {/* Sidebar Content */}
      <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBagIcon className="w-6 h-6 text-primary-content" />
            </div>
            <span className="text-xl font-bold">Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <ul className="space-y-2 flex-1">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-300"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Info */}
        <div className="pt-4 mt-4 border-t border-base-300">
          <div className="flex items-center gap-3">
            <img
              src={user?.imageUrl}
              alt={user?.name || "User Avatar"}
              className="w-10 h-10 rounded-full shrink-0 border-2 "
            />
            <div className="flex flex-col overflow-hidden flex-1">
              <p className="font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs opacity-60 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;