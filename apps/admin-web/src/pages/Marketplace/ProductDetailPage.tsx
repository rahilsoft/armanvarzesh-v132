
import React from "react";
import { Card, Descriptions } from "antd";

const ProductDetailPage = () => (
  <Card title="Product Details">
    <Descriptions column={1}>
      <Descriptions.Item label="Title">Protein Bar</Descriptions.Item>
      <Descriptions.Item label="Price">30,000 Toman</Descriptions.Item>
      {/* ...more details */}
    </Descriptions>
  </Card>
);

export default ProductDetailPage;
