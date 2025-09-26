
import React from "react";
import { Row, Col, Card, Statistic } from "antd";

const DashboardPage = () => (
  <div style={{ padding: 32 }}>
    <h2>Admin Dashboard</h2>
    <Row gutter={16}>
      <Col span={6}><Card><Statistic title="Users" value={1200} /></Card></Col>
      <Col span={6}><Card><Statistic title="Coaches" value={42} /></Card></Col>
      <Col span={6}><Card><Statistic title="Payments" value={734} /></Card></Col>
      <Col span={6}><Card><Statistic title="Active Challenges" value={9} /></Card></Col>
    </Row>
    {/* ... more dashboard charts and widgets */}
  </div>
);

export default DashboardPage;
