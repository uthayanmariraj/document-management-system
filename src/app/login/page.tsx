"use client";

interface LoginResponse {
  message: string;
  userId?: string;
}

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  const handleSubmit = async(e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if(result?.error){
        setError(result.error || "Invalid email or password.");
        setLoading(false);
      }
      else{
        router.push('/dashboard')
        router.refresh()
      }

    } catch(err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div>{loggedIn ? (<p>huhsiudh</p>) : (
    <div>
      {error && <p>{error}</p>}
      <p>Dont have an account? <Link href = "/register" className = "under line text-blue-600 hover:text-blue-800"> Sign up</Link> </p>
      <form onSubmit = {handleSubmit}>
        <p>Email:</p>
        <Input type="text" value = {email} onChange = {(e) => {setEmail(e.target.value)}}/>
        <p>Password:</p>
        <Input type="password" value = {password} onChange = {(e) => {setPassword(e.target.value)}}/>
        <Button>SUBMIT</Button>
      </form>
    </div>
    )}</div>
  )
}
