
import React from "react";
import { Form, Input, Button } from "antd";

const NutritionPlanForm = () => (
  <Form layout="vertical">
    <Form.Item label="Title" name="title">
      <Input />
    </Form.Item>
    <Form.Item label="Calories" name="calories">
      <Input />
    </Form.Item>
    <Form.Item>
      <Button type="primary">Save</Button>
    </Form.Item>
  </Form>
);

export default NutritionPlanForm;
