
import React from "react";
import { Table } from "antd";

const RewardTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Title", dataIndex: "title" },
    { title: "XP", dataIndex: "xp" }
  ]} dataSource={[]} />
);

export default RewardTable;
