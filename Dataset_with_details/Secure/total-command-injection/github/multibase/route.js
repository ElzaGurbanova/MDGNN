import { execFile } from "child_process";
import util from "util";
import { NextResponse } from "next/server";
import path from "path";

const execFilePromise = util.promisify(execFile);

export async function POST(request) {
  try {
    const { query } = await request.json();
    const q = typeof query === 'string' ? query : '';

    // Build absolute path to the Deno script
    const scriptPath = path.join(
      process.cwd(),
      "..",
      "musicgen",
      "01_getNews",
      "index.js",
    );

    console.log("Executing Deno script with query:", q);
    console.log("Script path:", scriptPath);

    // Call deno without a shell; pass args as array
    const { stdout, stderr } = await execFilePromise(
      "deno",
      ["run", "-A", scriptPath, "--query", q],
      {
        env: {
          ...process.env,
          PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
        },
        windowsHide: true,
      }
    );

    if (stderr && stderr.trim()) {
      console.error("Deno script error:", stderr);
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    console.log("Deno script executed successfully");
    return NextResponse.json({ result: stdout });
  } catch (error) {
    console.error("Error executing Deno script:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

