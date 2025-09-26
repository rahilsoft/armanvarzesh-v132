
import React from "react";
import { Table } from "antd";

const PaymentTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "User", dataIndex: "user" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Status", dataIndex: "status" }
  ]} dataSource={[]} />
);

export default PaymentTable;
