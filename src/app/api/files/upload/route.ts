import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: Request) {
    try{
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File || null

        if (!file) {
            return NextResponse.json(
                { message: "No file provided." }, 
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const storageKey = await uploadToS3(buffer, file.name, file.type)
        const fileRecord = await db.file.create({
            data: {
                ownerId: session.user.id,
                originalName: file.name,
                storageKey: storageKey,
                mimeType: file.type,
                size: file.size, 
            },
        })

        return NextResponse.json(
            {message: "file successfully uploaded"},
            {status: 201}
        )

    } catch (err){
        console.error("Upload error:", err);
        return NextResponse.json(
            { message: "Error during file upload" },
            { status: 500 }
        )
    }


}