import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { URL } from "node:url";
import { defineConfig } from "vitest/config";

// Tests read the repo's root .env (copied from .env.example). Variables that
// are already set, e.g. by CI, win over the file.
const rootEnv = new URL("../../.env", import.meta.url);
if (existsSync(rootEnv)) {
  loadEnvFile(rootEnv);
}

export default defineConfig({});
