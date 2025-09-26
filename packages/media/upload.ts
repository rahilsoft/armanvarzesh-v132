const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
export async function upload(file: File){
  if(MODE==='mock'){
    await new Promise(r=> setTimeout(r, 100));
    const url = URL.createObjectURL(file);
    return { url, id: 'up_'+Math.random().toString(36).slice(2), size: file.size, type: file.type };
  }else{
    // replace with real multipart upload
    const form = new FormData(); form.append('file', file);
    const res = await fetch('/api/bff/media/upload', { method:'POST', body: form });
    if(!res.ok) throw new Error('Upload failed');
    return await res.json();
  }
}
