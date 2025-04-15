import { getChallengeQuestion } from "@/services/user/groups/challenges/getAllChalengeQuestion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ChallengeElement {
  id: string;
  challenge_id: string;
  questions: string;
  description: string;
  points: number;
  order: number;
  day_number: number;
  created_at: string;
  updated_at: string;
}

export const useGetAllChallengesElements = (
  groupId: string,
  challengeId: string
) => {
  return useQuery({
    queryKey: ["challenge-elements", groupId, challengeId],
    queryFn: async () => getChallengeQuestion({group_id: groupId, challengeId}),
  });
};
