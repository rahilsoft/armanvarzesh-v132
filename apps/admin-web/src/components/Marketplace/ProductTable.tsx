
import React from "react";
import { Table } from "antd";

const ProductTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Title", dataIndex: "title" },
    { title: "Price", dataIndex: "price" }
  ]} dataSource={[]} />
);

export default ProductTable;
