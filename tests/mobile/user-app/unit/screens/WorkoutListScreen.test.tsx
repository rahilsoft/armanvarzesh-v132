
import React from "react";
import { render, screen } from "@testing-library/react-native";
import WorkoutListScreen from "../../../../src/screens/WorkoutListScreen";

describe("WorkoutListScreen (Mobile)", () => {
  it("renders workout list", () => {
    render(<WorkoutListScreen />);
    expect(screen.getByText(/Workout List/i)).toBeTruthy();
  });
});
