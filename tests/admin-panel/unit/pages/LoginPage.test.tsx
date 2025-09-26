
import React from "react";
import { render, screen } from "@testing-library/react";
import LoginPage from "../../../../src/pages/LoginPage";

describe("Admin LoginPage", () => {
  it("renders admin login card", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
