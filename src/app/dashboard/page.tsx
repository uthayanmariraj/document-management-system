"use client";

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function Dashboard(){
  return(
    <div>
      <p>dashboard functionalities will be added</p>
      <Link href ="/upload">LINK TO UPLOADS PAGE</Link>
      <Button 
        onClick={() => signOut({ callbackUrl: "/login" })} 
        className="uppercase tracking-widest text-xs"
      >
        Log Out
      </Button>
    </div>
  )
}