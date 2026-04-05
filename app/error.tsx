"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div style={{ margin: 20, padding: 20, fontFamily: "monospace", background: "#1a1a1a", color: "#ff6b6b", borderRadius: 8 }}>
      <h2 style={{ color: "#ff4444" }}>🚨 Route Error</h2>
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
    </div>
  );
}
