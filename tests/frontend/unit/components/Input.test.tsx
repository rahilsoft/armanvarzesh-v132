
import React from "react";
import { render, screen } from "@testing-library/react";
import Input from "../../../src/components/Common/Input";

describe("Input", () => {
  it("renders input field", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });
});
