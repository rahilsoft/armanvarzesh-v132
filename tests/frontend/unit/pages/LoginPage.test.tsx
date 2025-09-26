
import React from "react";
import { render, screen } from "@testing-library/react";
import LoginPage from "../../../src/pages/LoginPage";

describe("LoginPage", () => {
  it("renders login card", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
