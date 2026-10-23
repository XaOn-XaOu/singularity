import { connect } from "node:net";
import { Client } from "pg";
import { describe, expect, it } from "vitest";

// Checks that `pnpm services:up` gives us what .env.example promises.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(
      `${name} is not set. Copy .env.example to .env at the repo root.`,
    );
  }
  return value;
}

async function firstRow(connectionString: string, sql: string) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const result = await client.query<Record<string, unknown>>(sql);
    return result.rows[0];
  } finally {
    await client.end();
  }
}

// Resolves with the server's first line, without sending any mail.
function smtpGreeting(host: string, port: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = connect({ host, port });
    socket.once("data", (chunk) => {
      socket.end("QUIT\r\n");
      resolve(chunk.toString());
    });
    socket.once("error", reject);
  });
}

describe("local services", () => {
  it("Postgres answers select 1 on DATABASE_URL", async () => {
    const row = await firstRow(requireEnv("DATABASE_URL"), "select 1 as one");
    expect(row).toEqual({ one: 1 });
  });

  it("TEST_DATABASE_URL points at singularity_test", async () => {
    const row = await firstRow(
      requireEnv("TEST_DATABASE_URL"),
      "select current_database() as name",
    );
    expect(row).toEqual({ name: "singularity_test" });
  });

  it("Mailpit serves its inbox page on MAILPIT_URL", async () => {
    const response = await fetch(requireEnv("MAILPIT_URL"));
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Mailpit");
  });

  it("Mailpit accepts SMTP connections on SMTP_HOST:SMTP_PORT", async () => {
    const greeting = await smtpGreeting(
      requireEnv("SMTP_HOST"),
      Number(requireEnv("SMTP_PORT")),
    );
    expect(greeting).toMatch(/^220 /);
  });
});
