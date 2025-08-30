import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useNavigate } from 'react-router-dom';

const UserDropDown = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };


  return (
    <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200">
      <DropdownMenu>
        <DropdownMenuTrigger>User</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick('/userblogs')}>My Blogs</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick('/support')}>Support</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClick('/newsletter')}>Subscription</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-bold" onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropDown;
