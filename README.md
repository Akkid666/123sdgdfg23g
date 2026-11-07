# Public Vercel File Share

This version has no login, password, user accounts, or database. It uses **Vercel Blob** only to store uploaded files. Uploaded files are public.

## Deploy

1. Create a Vercel project and deploy this folder/repository.
2. In the Vercel project, open **Storage** and create/connect a **Blob** store.
3. Vercel should add `BLOB_READ_WRITE_TOKEN` to the project environment. If not, add the token from the Blob store settings.
4. Redeploy after connecting the store.

Open `/` for the file list and `/upload` to upload through the browser.

## Upload with Windows CMD

Replace the domain and file path:

```cmd
curl -X POST "https://YOUR-PROJECT.vercel.app/api/upload" -H "Content-Type: application/octet-stream" -H "X-File-Name: example.txt" --data-binary "@C:\Users\YourName\Desktop\example.txt"
```

The response contains a public URL for the uploaded file. Refresh `/` to see it listed.

## Limits and privacy

- This sample limits each upload to 4 MB because Vercel Functions have request-size limits.
- There is no authentication: anyone who can reach the site can upload, list, and download files.
- Files are public. Do not upload passwords, private documents, or sensitive information.
- Blob is file storage, not a database. Without some persistent storage service, uploads would not remain available across visitors/deployments.
