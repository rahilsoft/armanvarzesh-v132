
import React from "react";
import { render, screen } from "@testing-library/react-native";
import Card from "../../../../src/components/Card";

describe("Coach Card", () => {
  it("renders Card content", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText(/Card Content/i)).toBeTruthy();
  });
});
