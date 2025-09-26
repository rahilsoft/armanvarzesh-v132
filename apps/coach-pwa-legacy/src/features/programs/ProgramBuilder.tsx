import React, { useState } from 'react';
import { createTemplate, updateDraft, publish, assign } from './api';

export default function ProgramBuilder(){
  const [name, setName] = useState('Strength 4x');
  const [content, setContent] = useState(JSON.stringify({ weeks:4, days:['A','B','Rest','A','B','Rest','Rest'] }, null, 2));
  const [tpl, setTpl] = useState<any>(null);
  const [users, setUsers] = useState('u1,u2');

  const onCreate = async ()=> setTpl(await createTemplate(name, JSON.parse(content)));
  const onUpdate = async ()=> tpl && await updateDraft(tpl.id, { name, content: JSON.parse(content) });
  const onPublish = async ()=> tpl && setTpl({ ...(tpl||{}), ...(await publish(tpl.id)) });
  const onAssign = async ()=> tpl && await assign(tpl.id, users.split(',').map(s=>s.trim()).filter(Boolean));

  return <div style={{ padding:16 }}>
    <h2>Program Builder</h2>
    <input value={name} onChange={e=> setName(e.target.value)} placeholder="Program name" />
    <div>
      <textarea rows={10} cols={60} value={content} onChange={e=> setContent(e.target.value)} />
    </div>
    <div style={{ display:'flex', gap:8 }}>
      <button onClick={onCreate}>Create Draft</button>
      <button onClick={onUpdate} disabled={!tpl || tpl.status==='published'}>Update Draft</button>
      <button onClick={onPublish} disabled={!tpl}>Publish (locks)</button>
    </div>
    <div style={{ marginTop:12 }}>
      <input value={users} onChange={e=> setUsers(e.target.value)} placeholder="u1,u2,..." />
      <button onClick={onAssign} disabled={!tpl}>Assign to Users</button>
    </div>
    <pre>{JSON.stringify(tpl, null, 2)}</pre>
  </div>;
}
