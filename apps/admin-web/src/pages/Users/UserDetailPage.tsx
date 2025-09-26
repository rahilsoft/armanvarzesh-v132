
import React from "react";
import { Card, Descriptions } from "antd";

const UserDetailPage = () => (
  <Card title="User Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Name">Ali Ahmadi</Descriptions.Item>
      <Descriptions.Item label="Email">ali@armanfit.com</Descriptions.Item>
      <Descriptions.Item label="Role">user</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default UserDetailPage;
