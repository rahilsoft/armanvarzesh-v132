import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/adminAuth';

/** Clears the admin token and returns to the login page. */
export function LogoutButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        logout();
        navigate('/login', { replace: true });
      }}
    >
      خروج
    </Button>
  );
}

export default LogoutButton;
