
import React from "react";
import { Card, Descriptions } from "antd";

const PaymentDetailPage = () => (
  <Card title="Payment Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Amount">450,000 Toman</Descriptions.Item>
      <Descriptions.Item label="User">Ali Ahmadi</Descriptions.Item>
      <Descriptions.Item label="Status">Paid</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default PaymentDetailPage;
