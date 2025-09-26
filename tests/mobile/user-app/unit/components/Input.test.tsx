
import React from "react";
import { render } from "@testing-library/react-native";
import Input from "../../../../src/components/Input";

describe("Input (Mobile)", () => {
  it("renders input placeholder", () => {
    const { getByPlaceholderText } = render(<Input placeholder="Username" />);
    expect(getByPlaceholderText("Username")).toBeTruthy();
  });
});
