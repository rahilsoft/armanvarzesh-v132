
import { render, screen } from "@testing-library/react";
import DashboardPage from "../../../src/pages/DashboardPage";
import { ChallengeContextProvider } from "../../../src/context/ChallengeContext";
import { RewardContextProvider } from "../../../src/context/RewardContext";

describe("Dashboard Integration", () => {
  it("renders dashboard with challenges and rewards", () => {
    render(
      <ChallengeContextProvider>
        <RewardContextProvider>
          <DashboardPage />
        </RewardContextProvider>
      </ChallengeContextProvider>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Reward/i)).toBeInTheDocument();
  });
});
