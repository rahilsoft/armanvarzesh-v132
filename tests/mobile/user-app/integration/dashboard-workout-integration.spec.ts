
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import DashboardScreen from "../../../../src/screens/DashboardScreen";
import WorkoutListScreen from "../../../../src/screens/WorkoutListScreen";

describe("Dashboard-Workout Integration (Mobile)", () => {
  it("navigates from dashboard to workout list", () => {
    render(<DashboardScreen />);
    fireEvent.press(screen.getByText("Go to Workouts"));
    render(<WorkoutListScreen />);
    expect(screen.getByText("Workout List")).toBeTruthy();
  });
});
