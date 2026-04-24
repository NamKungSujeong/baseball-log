"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body style={{ margin: 0, padding: 20, fontFamily: "monospace", background: "#1a1a1a", color: "#ff6b6b" }}>
        <h2 style={{ color: "#ff4444" }}>🚨 Global Error (Root Layout)</h2>
        <pre style={{ background: "#2a2a2a", padding: 16, borderRadius: 8, overflowX: "auto", color: "#ffa0a0", fontSize: 13 }}>
          {JSON.stringify(
            {
              digest: error.digest,
              message: error.message,
              name: error.name,
              stack: error.stack,
            },
            null,
            2
          )}
        </pre>
        <p style={{ color: "#aaa", fontSize: 12 }}>
          더 자세한 로그: <a href="/debug" style={{ color: "#6af" }}>/debug</a>
        </p>
      </body>
    </html>
  );
}
