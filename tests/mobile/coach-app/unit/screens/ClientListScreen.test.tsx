
import React from "react";
import { render, screen } from "@testing-library/react-native";
import ClientListScreen from "../../../../src/screens/ClientListScreen";

describe("ClientListScreen", () => {
  it("renders client list", () => {
    render(<ClientListScreen />);
    expect(screen.getByText(/Client List/i)).toBeTruthy();
  });
});
