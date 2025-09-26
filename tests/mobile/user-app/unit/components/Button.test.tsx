
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "../../../../src/components/Button";

describe("Button (Mobile)", () => {
  it("calls onPress", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Press me</Button>);
    fireEvent.press(getByText("Press me"));
    expect(onPress).toHaveBeenCalled();
  });
});
