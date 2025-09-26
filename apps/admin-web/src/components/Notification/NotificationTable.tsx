
import React from "react";
import { Table } from "antd";

const NotificationTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Text", dataIndex: "text" },
    { title: "Created At", dataIndex: "createdAt" }
  ]} dataSource={[]} />
);

export default NotificationTable;
