
import React from "react";
import { Card, Descriptions } from "antd";

const CoachDetailPage = () => (
  <Card title="Coach Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Name">Sara Gholami</Descriptions.Item>
      <Descriptions.Item label="Email">sara@armanfit.com</Descriptions.Item>
      <Descriptions.Item label="Role">coach</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default CoachDetailPage;
