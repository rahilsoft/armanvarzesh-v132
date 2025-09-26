
import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../../../src/pages/DashboardPage";

describe("DashboardPage", () => {
  it("renders dashboard title", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});
