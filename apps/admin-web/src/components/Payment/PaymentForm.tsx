
import React from "react";
import { Form, Input, Button } from "antd";

const PaymentForm = () => (
  <Form layout="vertical">
    <Form.Item label="User" name="user">
      <Input />
    </Form.Item>
    <Form.Item label="Amount" name="amount">
      <Input />
    </Form.Item>
    <Form.Item>
      <Button type="primary">Save</Button>
    </Form.Item>
  </Form>
);

export default PaymentForm;
