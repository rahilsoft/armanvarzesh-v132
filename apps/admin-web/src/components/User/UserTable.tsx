
import React from "react";
import { Table } from "antd";

const UserTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" }
  ]} dataSource={[]} />
);

export default UserTable;
