
import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationItem from "../../../src/components/Notification/NotificationItem";

describe("NotificationItem", () => {
  it("shows notification text", () => {
    render(<NotificationItem text="Hello!" />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
