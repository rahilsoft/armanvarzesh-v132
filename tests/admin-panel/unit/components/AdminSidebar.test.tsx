
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminSidebar from "../../../../src/components/Layout/AdminSidebar";

describe("AdminSidebar", () => {
  it("renders sidebar", () => {
    render(<AdminSidebar />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
