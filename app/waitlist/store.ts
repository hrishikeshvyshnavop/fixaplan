import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * Waitlist storage: a JSON file in /data (git-ignored).
 * Fine for local dev and a single server. On serverless hosts (e.g. Vercel) the disk is
 * read-only / not shared, so swap addSignup() for a database or email-list API call.
 */

export type Signup = {
  email: string;
  name?: string;
  createdAt: string;
};

const FILE = path.join(process.cwd(), "data", "waitlist.json");

async function readAll(): Promise<Signup[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Signup[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

// Writes are queued so two signups at the same moment can't overwrite each other
let queue: Promise<unknown> = Promise.resolve();

/** Adds the signup unless the email is already on the list. Returns its place in line. */
export function addSignup(signup: Signup): Promise<{ position: number; existing: boolean }> {
  const run = queue.then(async () => {
    const all = await readAll();
    const index = all.findIndex((s) => s.email === signup.email);
    if (index !== -1) return { position: index + 1, existing: true };

    all.push(signup);
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(all, null, 2));
    return { position: all.length, existing: false };
  });
  queue = run.catch(() => {});
  return run;
}
