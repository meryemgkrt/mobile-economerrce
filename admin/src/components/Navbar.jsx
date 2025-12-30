import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router";


import { ClipboardListIcon, PanelLeftIcon, HomeIcon, ShoppingCartIcon, UserIcon } from "lucide-react"

export const NAVIGATION = [
  { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className='size-5' /> },
  { name: "Products", path: "/products", icon: <ClipboardListIcon className='size-5' /> },
  { name: "Orders", path: "/orders", icon: <ShoppingCartIcon className='size-5' /> },
  { name: "Customers", path: "/customer", icon: <UserIcon className='size-5' /> },
]
function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer" className="btn btn-square btn-ghost" aria-label="open sidebar">
        <PanelLeftIcon className="size-5" />
      </label>
      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">
          {NAVIGATION.find(nav => nav.path === location.pathname)?.name || "Dashboard"}
        </h1>
      </div>
      <div className="mr-5">
        <UserButton afterSignOutUrl="/login" />
      </div>
    </div>
  )
}
export default Navbar;
