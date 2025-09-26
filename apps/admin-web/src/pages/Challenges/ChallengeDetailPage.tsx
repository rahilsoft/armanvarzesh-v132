
import React from "react";
import { Card, Descriptions } from "antd";

const ChallengeDetailPage = () => (
  <Card title="Challenge Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Title">Spring Challenge</Descriptions.Item>
      <Descriptions.Item label="Participants">52</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default ChallengeDetailPage;
