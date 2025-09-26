
import React from "react";
import { Card, Form, Input, Button } from "antd";

const LoginPage = () => (
  <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
    <Card title="Admin Login" style={{ minWidth: 300 }}>
      <Form layout="vertical">
        <Form.Item label="Email" name="email">
          <Input type="email" autoComplete="email" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Login</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>
);

export default LoginPage;
