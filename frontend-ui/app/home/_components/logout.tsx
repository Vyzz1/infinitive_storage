"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
