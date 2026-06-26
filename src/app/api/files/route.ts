import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getS3SignedUrl } from "@/lib/s3";

export async function GET(req: Request) {
    try{
        const session = await getServerSession(authOptions)
        if(!session || !session.user){
            return NextResponse.json(
                { message: "Unauthorized" }, { status: 401 }
            )
        }
        const userId = session.user.id
        const files = await db.file.findMany({ where: { ownerId: userId }})

        const links = await Promise.all(
            files.map(async (file) => {
                const url = await getS3SignedUrl(file.storageKey, file.originalName)
                return {
                    ...file,
                    downloadUrl: url,
                }
            })
        )
        return  NextResponse.json(
            { files: links },
            { status: 200 },
        )
    } catch(err){
        console.error("Getting error", err)
        return NextResponse.json(
            {message: "error fetching documents"},
            {status: 500}
        )
    }
}