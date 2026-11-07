import { list } from "@vercel/blob";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }
  try {
    const result = await list({ prefix: "uploads/" });
    const files = result.blobs.map(({ pathname, url, size, uploadedAt }) => ({
      pathname, url, size, uploadedAt
    })).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return response.status(200).json({ files });
  } catch (error) {
    return response.status(500).json({ error: "Could not list files. Check the Vercel Blob connection." });
  }
}
