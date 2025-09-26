
import { render } from "@testing-library/react-native";

export function renderWithProvider(ui, { providerProps, ...renderOptions } = {}) {
  return render(ui, renderOptions);
}
