
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../../src/components/Common/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
  it("calls onClick", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Test</Button>);
    fireEvent.click(screen.getByText("Test"));
    expect(handleClick).toHaveBeenCalled();
  });
});
