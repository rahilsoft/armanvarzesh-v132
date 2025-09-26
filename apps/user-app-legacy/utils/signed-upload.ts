export async function uploadWithSignedUrl(apiBase: string, key: string, contentType: string, data: Blob | ArrayBuffer | Uint8Array) {
  const gql = await fetch(`${apiBase}/graphql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: `mutation($input:CreateUploadUrlInput!){ createUploadUrl(input:$input){ uploadUrl key } }`, variables: { input: { key, contentType } } })
  }).then(r=>r.json());
  const url = gql.data?.createUploadUrl?.uploadUrl;
  if (!url) throw new Error('No signed URL');
  await fetch(url, { method: 'PUT', headers: { 'content-type': contentType }, body: data });
  return { key };
}
