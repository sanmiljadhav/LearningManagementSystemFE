import { Menu, School } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DarkMode from "../../DarkMode";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function Navbar() {

  
  

  const {user} = useSelector(store => store.auth)

  console.log("USER IScc", user)
  const [logoutUser, {data, isSuccess}] = useLogoutUserMutation()
  const navigate = useNavigate()

  const logoutHandler = async () =>{

    await logoutUser()
    navigate("/login")

  }

  useEffect(()=>{

    if(isSuccess){
      toast.success(data.message || "User Loggedout successfully")
    }

  },[isSuccess])
  
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-learning
          </h1>
        </div>
        {/* User icons and dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* <Button variant="outline">Open</Button> */}
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem><Link to="my-learning">My Learning</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to="profile">Edit Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick = {logoutHandler}>Logout</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {user.role == "instructor" && <DropdownMenuItem><Link to="admin">Dashboard</Link></DropdownMenuItem>}

                

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div>
              <Button variant="outline" onClick = {()=>navigate("/login")}>Login</Button>
              <Button onClick = {()=>navigate("/login")}>Signup</Button>
            </div>
          )}

          <DarkMode />
        </div>
      </div>
      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
        <MobileNavbar />
      </div>
    </div>
  );
}

const MobileNavbar = () => {
    const role = "instructor"
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className = "rounded-full bg-gray-200 hover:bg-gray-200"><Menu/></Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="my-4">
          <SheetTitle>E-Learning</SheetTitle>
          <SheetDescription>
            Make your own LMS
          </SheetDescription>
        </SheetHeader>

        <DarkMode/>
       <nav className="flex flex-col space-y-4 mt-4">
        <span>My Learning</span>
        <span>Edit Profile</span>
        <span>Logout</span>
       </nav>

       {role === "instructor" && (<SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Dashboard</Button>
          </SheetClose>
        </SheetFooter>)}
        
      </SheetContent>
    </Sheet>
  );
};
