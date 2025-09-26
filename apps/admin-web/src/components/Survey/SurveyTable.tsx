
import React from "react";
import { Table } from "antd";

const SurveyTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Question", dataIndex: "question" }
  ]} dataSource={[]} />
);

export default SurveyTable;
