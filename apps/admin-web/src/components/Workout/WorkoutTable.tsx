
import React from "react";
import { Table } from "antd";

const WorkoutTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Title", dataIndex: "title" },
    { title: "Duration", dataIndex: "duration" }
  ]} dataSource={[]} />
);

export default WorkoutTable;
