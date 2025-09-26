
import React from "react";
import { Table } from "antd";

const ChallengeTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Title", dataIndex: "title" },
    { title: "Participants", dataIndex: "participants" }
  ]} dataSource={[]} />
);

export default ChallengeTable;
