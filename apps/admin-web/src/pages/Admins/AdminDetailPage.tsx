
import React from "react";
import { Card, Descriptions } from "antd";

const AdminDetailPage = () => (
  <Card title="Admin Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Name">Hussein Emami</Descriptions.Item>
      <Descriptions.Item label="Email">hussein@armanfit.com</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default AdminDetailPage;
