
import React from "react";
import { Table } from "antd";

const CoachTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" }
  ]} dataSource={[]} />
);

export default CoachTable;
