import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { useNavigate } from 'react-router-dom'
import { useNavigationHandler } from '@/hooks/NavigateHook'


const UserDropDown = () => {

    const handleClick = useNavigationHandler();

    return (
        <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200">
            <DropdownMenu>
                {/* add user icon here later */}
                <DropdownMenuTrigger>User</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>My Comments</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> handleClick('/support')}>Support</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> handleClick('/newsletter')}>Subscription</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='font-bold'>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}

export default UserDropDown