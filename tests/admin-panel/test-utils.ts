
import { render } from "@testing-library/react";

export function renderWithProvider(ui, { providerProps, ...renderOptions } = {}) {
  return render(ui, renderOptions);
}
