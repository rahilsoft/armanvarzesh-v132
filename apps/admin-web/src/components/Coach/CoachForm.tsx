
import React from "react";
import { Form, Input, Button } from "antd";

const CoachForm = () => (
  <Form layout="vertical">
    <Form.Item label="Name" name="name">
      <Input />
    </Form.Item>
    <Form.Item label="Email" name="email">
      <Input />
    </Form.Item>
    <Form.Item>
      <Button type="primary">Save</Button>
    </Form.Item>
  </Form>
);

export default CoachForm;
