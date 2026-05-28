import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var _fjPgPool: Pool | undefined;
}

function getPool(): Pool {
  if (!globalThis._fjPgPool) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("POSTGRES_URL environment variable is required");
    }
    const useSsl =
      process.env.PGSSLMODE === "require" ||
      /sslmode=require/i.test(connectionString) ||
      /\.vercel-storage\.com/.test(connectionString) ||
      /\.neon\.tech/.test(connectionString);
    globalThis._fjPgPool = new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }
  return globalThis._fjPgPool!;
}

export async function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<QueryResult<T>> {
  let text = "";
  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) text += `$${i + 1}`;
  }
  return getPool().query<T>(text, values as unknown[]);
}

export function pgTextArrayLiteral(values: string[]): string {
  const escaped = values.map(
    (v) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
  );
  return `{${escaped.join(",")}}`;
}
