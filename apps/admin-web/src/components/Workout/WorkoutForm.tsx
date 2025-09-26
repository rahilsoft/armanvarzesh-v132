
import React from "react";
import { Form, Input, Button } from "antd";

const WorkoutForm = () => (
  <Form layout="vertical">
    <Form.Item label="Title" name="title">
      <Input />
    </Form.Item>
    <Form.Item label="Duration" name="duration">
      <Input />
    </Form.Item>
    <Form.Item>
      <Button type="primary">Save</Button>
    </Form.Item>
  </Form>
);

export default WorkoutForm;
