import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getS3SignedUrl } from "@/lib/s3";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
        const fileId = searchParams.get("id")
        const preview = searchParams.get("preview") === "true";
        const session = await getServerSession(authOptions)
    
        if(!fileId) return NextResponse.json({ message: "File Id required" }, { status: 400 },)
        if(!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401},)
    
        const userId: string = String(session.user.id)
        const file = await db.file.findUnique({ where: { id: fileId }})
    
        if(!file) return NextResponse.json({ message: "File not Found"}, { status: 404})
        if(file.ownerId !== userId) return NextResponse.json({ message: "Unauthorized"}, { status: 403})

    const downloadUrl = await getS3SignedUrl(file.storageKey, file.originalName, preview);
    return NextResponse.json({ downloadUrl, mimeType: file.mimeType, 
        originalName: file.originalName });
}
