import React, { useState } from 'react';
import { Button, Card, Input, Table } from '@arman/ui-components';

export default function UIDemo() {
  const [name, setName] = useState('');
  const data = [{ id: 1, name: 'علی' }, { id: 2, name: 'ندا' }];
  return (
    <div className="container">
      <Card title="نمونه اجزای UI">
        <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
          <Input placeholder="نام شما" value={name} onChange={e=>setName(e.target.value)} />
          <Button onClick={()=>alert(name || 'خالی')}>ارسال</Button>
          <Button variant="ghost">دکمه شبح</Button>
        </div>
      </Card>
      <div style={{ height: 16 }} />
      <Card title="جدول نمونه">
        <Table data={data} columns={[{key:'id', header:'شناسه'}, {key:'name', header:'نام'}]} />
      </Card>
    </div>
  );
}
