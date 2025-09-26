
import React from "react";
import { Card, Descriptions } from "antd";

const NutritionPlanDetailPage = () => (
  <Card title="Nutrition Plan Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Title">Fat Loss Diet</Descriptions.Item>
      <Descriptions.Item label="Calories">1800</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default NutritionPlanDetailPage;
