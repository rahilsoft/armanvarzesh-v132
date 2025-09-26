
import React from "react";
import { render, screen } from "@testing-library/react";
import UserListPage from "../../../../src/pages/UserListPage";

describe("UserListPage", () => {
  it("renders user list page", () => {
    render(<UserListPage />);
    expect(screen.getByText(/User List/i)).toBeInTheDocument();
  });
});
