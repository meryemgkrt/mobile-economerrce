import { useUser } from "@clerk/clerk-react";
import { lİNK,useLocation } from "react-router";
import {NAVİGATION} from "./Navbar";

function Sidebar() {
  const location = useLocation();
  const {user} =useUser();

  console.log("user",user);
  return (
    <div>
        Sidebar
    </div>
  )
}

export default Sidebar
