
import React from "react";
import { render, screen } from "@testing-library/react-native";
import ProfileScreen from "../../../../src/screens/ProfileScreen";

describe("ProfileScreen (Mobile)", () => {
  it("renders profile name", () => {
    render(<ProfileScreen />);
    expect(screen.getByText(/Profile/i)).toBeTruthy();
  });
});
