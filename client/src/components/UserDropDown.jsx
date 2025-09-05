import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UserDropDown = () => {
  const navigate = useNavigate();
  const username = Cookies.get("username") || "User";

  const handleClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear session cookies
    Cookies.remove("accessToken");
    Cookies.remove("username");
    navigate("/login");
  };

  return (
    <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200">
      <DropdownMenu>
        <DropdownMenuTrigger>{username}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleClick("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick("/userblogs")}>
            My Blogs
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick("/support")}>
            Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick("/newsletter")}>
            Subscription
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="font-bold text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropDown;
