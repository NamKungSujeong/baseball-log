import { NextRequest, NextResponse } from "next/server";
import { getStorageUrl } from "@/lib/storage.server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;
  const url = await getStorageUrl(fileId);
  return NextResponse.redirect(url);
}
