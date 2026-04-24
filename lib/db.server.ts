// 서버 전용 DB 헬퍼 — 클라이언트에서 절대 import 금지

export function escapeStr(value: string): string {
  return value.replace(/'/g, "''");
}

export function sqlStr(value: string | null | undefined): string {
  if (value == null) return "NULL";
  return `'${escapeStr(value)}'`;
}

export function sqlNum(value: number | null | undefined): string {
  if (value == null) return "NULL";
  return String(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function dbQuery(query: string): Promise<any> {
  console.log("[dbQuery] DB_API_BASE:", process.env.DB_API_BASE ?? "UNDEFINED");
  console.log("[dbQuery] DB_ACCESS_KEY:", process.env.DB_ACCESS_KEY ? "SET" : "UNDEFINED");
  console.log("[dbQuery] DB_SECRET_KEY:", process.env.DB_SECRET_KEY ? "SET" : "UNDEFINED");
  console.log("[dbQuery] query:", query);
  const url = `${process.env.DB_API_BASE}/query`;
  console.log("[dbQuery] fetch URL:", url);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "X-Access-Key": process.env.DB_ACCESS_KEY!,
        "X-Secret-Key": process.env.DB_SECRET_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
  } catch (fetchErr) {
    console.error("[dbQuery] fetch threw:", fetchErr);
    throw fetchErr;
  }
  console.log("[dbQuery] response status:", res.status);
  if (!res.ok) {
    const err = await res.json();
    console.error("[dbQuery] error response:", err);
    throw new Error(err.message ?? "Database query failed");
  }
  const data = await res.json();
  console.log("[dbQuery] success, keys:", Object.keys(data));
  return data;
}
