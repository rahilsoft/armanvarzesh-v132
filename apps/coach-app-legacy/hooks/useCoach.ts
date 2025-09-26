
import { useContext } from "react";
import { CoachContext } from "@context/CoachContext";

export default function useCoach() {
  return useContext(CoachContext);
}
