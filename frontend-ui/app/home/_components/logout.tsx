"use client";
import { signOut } from "@/app/actions/auth.action";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import React from "react";

export default function Logout() {
  const handleLogout = async () => {
    console.log("Logging out...");
    await signOut();
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="text-destructive focus:text-destructive cursor-pointer"
    >
      <LogOut className="mr-2 size-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
