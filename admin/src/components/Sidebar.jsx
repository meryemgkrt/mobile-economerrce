import { useUser } from "@clerk/clerk-react";
import { Link,useLocation } from "react-router";
import {NAVIGATION} from "./Navbar";
import { ShoppingBagIcon } from "lucide-react";


function Sidebar() {
  const location = useLocation();
  const {user} =useUser();

  
  return (
    <div>
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay">

        </label>
        <div className="p-4 w-full ">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBagIcon className="w-6 h-6 text-primary-content"/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Sidebar
