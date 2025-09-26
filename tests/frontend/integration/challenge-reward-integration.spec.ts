
import { render, screen } from "@testing-library/react";
import ChallengeList from "../../../src/components/Challenge/ChallengeList";
import RewardList from "../../../src/components/Reward/RewardList";

describe("Challenge-Reward Integration", () => {
  it("shows challenge and reward lists together", () => {
    render(
      <>
        <ChallengeList />
        <RewardList />
      </>
    );
    expect(screen.getByText(/Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Reward/i)).toBeInTheDocument();
  });
});
