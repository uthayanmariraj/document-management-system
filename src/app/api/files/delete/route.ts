import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteFromS3 } from "@/lib/s3";

export async function DELETE(req: Request){
    const { searchParams } = new URL(req.url)
    const fileId = searchParams.get("id")
    const session = await getServerSession(authOptions)

    if(!fileId) return NextResponse.json({ message: "File Id required" }, { status: 400 },)
    if(!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401},)

    const userId: string = String(session.user.id)
    const file = await db.file.findUnique({ where: { id: fileId }})

    if(!file) return NextResponse.json({ message: "File not Found"}, { status: 404})
    if(file.ownerId !== userId) return NextResponse.json({ message: "Unauthorized"}, { status: 403})

    await deleteFromS3(file.storageKey)
    await db.file.delete({ where: { id: fileId }})

    return NextResponse.json({ message: "File successfully deleted" }, { status: 200 },)

}
