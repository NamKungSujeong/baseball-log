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
  const url = `${process.env.DB_API_BASE}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Access-Key": process.env.DB_ACCESS_KEY!,
      "X-Secret-Key": process.env.DB_SECRET_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Database query failed");
  }
  return res.json();
}
