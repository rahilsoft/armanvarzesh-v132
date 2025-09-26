
import React from "react";
import { Table } from "antd";

const WalletTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "User", dataIndex: "user" },
    { title: "Balance", dataIndex: "balance" }
  ]} dataSource={[]} />
);

export default WalletTable;
