"use client";
import { signOut } from "@/app/actions/auth.action";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    router.refresh();
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
