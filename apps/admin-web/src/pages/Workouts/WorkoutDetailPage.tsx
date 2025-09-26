
import React from "react";
import { Card, Descriptions } from "antd";

const WorkoutDetailPage = () => (
  <Card title="Workout Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Title">HIIT Cardio</Descriptions.Item>
      <Descriptions.Item label="Duration">45 min</Descriptions.Item>
      <Descriptions.Item label="User">Ali Ahmadi</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default WorkoutDetailPage;
