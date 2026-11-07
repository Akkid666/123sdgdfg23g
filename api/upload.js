import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

export const config = { api: { bodyParser: false } };

async function readBody(request, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("FILE_TOO_LARGE");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }
  try {
    const encodedName = request.headers["x-file-name"];
    if (!encodedName) return response.status(400).json({ error: "Missing X-File-Name header" });
    let originalName;
    try { originalName = decodeURIComponent(encodedName); }
    catch { originalName = encodedName; }
    originalName = originalName.split(/[\\\\/]/).pop().replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120);
    if (!originalName || originalName === "." || originalName === "..") {
      return response.status(400).json({ error: "Invalid filename" });
    }
    const body = await readBody(request, 4 * 1024 * 1024);
    if (!body.length) return response.status(400).json({ error: "The file is empty" });
    const pathname = `uploads/${Date.now()}-${randomUUID()}-${originalName}`;
    const blob = await put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      contentType: request.headers["content-type"] || "application/octet-stream"
    });
    return response.status(201).json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    if (error.message === "FILE_TOO_LARGE") {
      return response.status(413).json({ error: "Maximum upload size is 4 MB" });
    }
    return response.status(500).json({ error: "Upload failed. Check that Vercel Blob is connected." });
  }
}
