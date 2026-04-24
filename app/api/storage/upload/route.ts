import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/storage.server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileId = await uploadToStorage(
    buffer,
    file.name || "photo.jpg",
    file.type || "image/jpeg",
  );
  return NextResponse.json({ fileId });
}
