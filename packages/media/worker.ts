// Simple media "transcoder" mock
export async function transcode(file: File, target:'image'|'audio'|'video'){
  await new Promise(r=> setTimeout(r, 120));
  // pretend we converted and return a blob URL placeholder
  return { url: URL.createObjectURL(file), kind: target, duration: target==='audio'||target==='video'? 3.2 : undefined };
}
