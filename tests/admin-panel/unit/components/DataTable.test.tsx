
import React from "react";
import { render, screen } from "@testing-library/react";
import DataTable from "../../../../src/components/Common/DataTable";

describe("Admin DataTable", () => {
  it("renders table with headers", () => {
    render(<DataTable columns={[{title: "Name", dataIndex: "name"}]} dataSource={[]} />);
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
  });
});
