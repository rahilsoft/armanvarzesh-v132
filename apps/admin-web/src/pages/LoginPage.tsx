import React, { useState } from 'react';
import { Alert, Button, Card, Form, Input } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AdminLoginError, LOGIN_ERROR_MESSAGES, adminLogin, resolveApiBase, safeRedirect, storeToken } from '../api/adminAuth';
import { useRoles } from '../rbac/useRoles';

type Values = { username: string; password: string };

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useRoles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const target = safeRedirect((location.state as { from?: string } | null)?.from);

  if (isAuthenticated) return <Navigate to={target} replace />;

  const onFinish = async (values: Values) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await adminLogin(resolveApiBase({
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string | undefined,
        VITE_GRAPHQL_API: import.meta.env.VITE_GRAPHQL_API as string | undefined,
      }), values);
      storeToken(token);
      navigate(target, { replace: true });
    } catch (e) {
      setError(e instanceof AdminLoginError ? e.message : LOGIN_ERROR_MESSAGES.server);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Card title="ورود به پنل مدیریت" style={{ minWidth: 320 }}>
        <Form<Values> layout="vertical" onFinish={onFinish} disabled={loading}>
          {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} role="alert" />}
          <Form.Item
            label="نام کاربری"
            name="username"
            rules={[
              { required: true, message: 'نام کاربری را وارد کنید' },
              { min: 3, message: 'نام کاربری باید حداقل ۳ نویسه باشد' },
            ]}
          >
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item
            label="رمز عبور"
            name="password"
            rules={[
              { required: true, message: 'رمز عبور را وارد کنید' },
              { min: 6, message: 'رمز عبور باید حداقل ۶ نویسه باشد' },
            ]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              ورود
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
