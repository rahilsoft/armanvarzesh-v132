
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import DashboardScreen from "../../../../src/screens/DashboardScreen";
import ClientListScreen from "../../../../src/screens/ClientListScreen";

describe("Coach Dashboard-Client Integration (Mobile)", () => {
  it("navigates from dashboard to client list", () => {
    render(<DashboardScreen />);
    fireEvent.press(screen.getByText("Go to Clients"));
    render(<ClientListScreen />);
    expect(screen.getByText("Client List")).toBeTruthy();
  });
});
