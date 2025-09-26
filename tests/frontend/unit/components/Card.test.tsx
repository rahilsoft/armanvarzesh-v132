
import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "../../../src/components/Common/Card";

describe("Card", () => {
  it("renders Card content", () => {
    render(<Card>Test Card</Card>);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });
});
