
import React from "react";
import { Form, Input, Button } from "antd";

const ChallengeForm = () => (
  <Form layout="vertical">
    <Form.Item label="Title" name="title">
      <Input />
    </Form.Item>
    <Form.Item label="Description" name="description">
      <Input.TextArea />
    </Form.Item>
    <Form.Item>
      <Button type="primary">Save</Button>
    </Form.Item>
  </Form>
);

export default ChallengeForm;
