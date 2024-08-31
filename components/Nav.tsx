"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'

const Nav = ({userId} : {userId: string}) => {
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      console.log("HERE")
      await logoutAccount();
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Error logging out: ", error);
    }
  }

  return (
    <div>
      {userId && (
        <Button onClick={logoutHandler}>Logout</Button>
      )}
    </div>
  )
}

export default Nav