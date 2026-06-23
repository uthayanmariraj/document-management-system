"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div>     
      <Button 
        onClick={() => signOut({ callbackUrl: "/login" })}
        >
        Log Out
      </Button>
    </div>
  );
}