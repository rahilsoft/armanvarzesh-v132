
import React from "react";
import { render, screen } from "@testing-library/react-native";
import PlanBuilderScreen from "../../../../src/screens/PlanBuilderScreen";

describe("PlanBuilderScreen", () => {
  it("renders plan builder", () => {
    render(<PlanBuilderScreen />);
    expect(screen.getByText(/Plan Builder/i)).toBeTruthy();
  });
});
