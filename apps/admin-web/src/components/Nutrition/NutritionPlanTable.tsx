
import React from "react";
import { Table } from "antd";

const NutritionPlanTable = () => (
  <Table columns={[
    { title: "ID", dataIndex: "id" },
    { title: "Title", dataIndex: "title" },
    { title: "Calories", dataIndex: "calories" }
  ]} dataSource={[]} />
);

export default NutritionPlanTable;
