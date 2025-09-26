import React from 'react';
import { Button, Card, Input, Table } from '@arman/ui-components';

export default function UIDemo() {
  const data = [{ id: 1, title: 'نمونه ۱' }, { id: 2, title: 'نمونه ۲' }];
  return <div className="container">
    <Card title="اجزای مشترک UI">
      <div style={{ display:'flex', gap: 12 }}>
        <Input placeholder="جستجو..." />
        <Button>جستجو</Button>
        <Button variant="ghost">پاک‌سازی</Button>
      </div>
    </Card>
    <div style={{ height: 16 }} />
    <Card title="جدول">
      <Table data={data} columns={[{key:'id', header:'شناسه'}, {key:'title', header:'عنوان'}]} />
    </Card>
  </div>;
}
