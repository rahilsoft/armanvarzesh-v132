
import React from "react";
import { render, screen } from "@testing-library/react-native";
import DashboardScreen from "../../../../src/screens/DashboardScreen";

describe("Coach DashboardScreen", () => {
  it("renders coach dashboard", () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/Dashboard/i)).toBeTruthy();
  });
});
