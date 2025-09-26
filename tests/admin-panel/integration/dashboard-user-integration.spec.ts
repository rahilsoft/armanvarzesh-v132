
import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../../../../src/pages/DashboardPage";
import UserListPage from "../../../../src/pages/UserListPage";

describe("Admin Dashboard-User Integration", () => {
  it("shows dashboard and user list together", () => {
    render(<DashboardPage />);
    render(<UserListPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/User List/i)).toBeInTheDocument();
  });
});
