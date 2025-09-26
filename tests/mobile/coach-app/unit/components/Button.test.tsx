
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "../../../../src/components/Button";

describe("Coach Button", () => {
  it("calls onPress", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Press</Button>);
    fireEvent.press(getByText("Press"));
    expect(onPress).toHaveBeenCalled();
  });
});
