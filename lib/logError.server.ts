// 서버 전용 — 에러를 DB에 기록
export async function logError(context: string, error: unknown): Promise<void> {
  const message = error instanceof Error
    ? `${error.message}\n${error.stack ?? ""}`
    : String(error);

  try {
    await fetch(
      `${process.env.DB_API_BASE}/query`,
      {
        method: "POST",
        headers: {
          "X-Access-Key": process.env.DB_ACCESS_KEY!,
          "X-Secret-Key": process.env.DB_SECRET_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `INSERT INTO debug_logs (context, message) VALUES ('${context.replace(/'/g, "''")}', '${message.replace(/'/g, "''")}')`,
        }),
      }
    );
  } catch {
    // logError 자체가 실패해도 무시
  }
}
