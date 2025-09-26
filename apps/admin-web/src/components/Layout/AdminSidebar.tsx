
import React from "react";
import { Menu } from "antd";
import { adminRoutes } from "../../routes/adminRoutes";

const AdminSidebar = () => (
  <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
    {adminRoutes.map(r => (
      <Menu.Item key={r.path}>{r.label}</Menu.Item>
    ))}
  </Menu>
);

export default AdminSidebar;
