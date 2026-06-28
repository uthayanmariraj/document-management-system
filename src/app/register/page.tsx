"use client";

import { useState } from "react"
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterResponse{
    message: string;
    userId?: string;
}

export default function Register(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpw, setConfirmpw] = useState("")
    const [error, setError] = useState("")
    const [registered, setRegistered] = useState(false)

    const handleSubmit = async(e: React.SubmitEvent) => {
        e.preventDefault()
        setError("")
        setRegistered(false)
        if (!(confirmpw === password)){
            setError("Passwords do not match")
            return
        }
        try {
            const response = await fetch("/api/auth/register",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                })
            })
            const data: RegisterResponse = await response.json()
            if (!response.ok) {
                setError(data.message || "Something went wrong.");
            }
            else {
                setRegistered(true);
                setName("");
                setEmail("");
                setPassword("");
                setConfirmpw("");
            }
        } catch {
            setError("Failed to connect to server")
        }


    }
    return (
        <div>
            {registered ? (
                <div>
                <p>Registration successful! Your account has been created.</p>
                <p>
                    <Link href="/login" className="underline text-blue-600 hover:text-blue-800">
                    Click here to log in
                    </Link>
                </p>
                </div>
            ) : (
                <div>
                {error && <p>{error}</p>}
                <p>Already have an account? <Link href  ="/login" className = "underline text-blue-600 hover:text-blue-800"> Log in</Link></p>
                <form onSubmit={handleSubmit}>
                    <p className="title">Name:</p>
                    <Input 
                    type="text" 
                    placeholder="name" 
                    value={name} 
                    onChange={(e) => {setName(e.target.value)}}
                    />
                    
                    <p className="title">Email:</p>
                    <Input 
                    type="text" 
                    placeholder="eMail" 
                    value={email} 
                    onChange={(e) => {setEmail(e.target.value)}}
                    />
                    
                    <p className="title">Password:</p>
                    <Input 
                    type="password" 
                    placeholder="password" 
                    value={password} 
                    onChange={(e) => {setPassword(e.target.value)}}
                    />

                    <p className="title">Confirm Password:</p>
                    <Input 
                    type="password" 
                    placeholder="re enter password" 
                    value={confirmpw} 
                    onChange={(e) => {setConfirmpw(e.target.value)}}
                    />
                    
                    <Button type="submit">
                    Submit
                    </Button>
                </form>
                </div>
            )}
        </div>
    )
}