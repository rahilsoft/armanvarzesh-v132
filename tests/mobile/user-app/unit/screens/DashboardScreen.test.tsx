
import React from "react";
import { render, screen } from "@testing-library/react-native";
import DashboardScreen from "../../../../src/screens/DashboardScreen";

describe("DashboardScreen (Mobile)", () => {
  it("renders dashboard title", () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/Dashboard/i)).toBeTruthy();
  });
});
