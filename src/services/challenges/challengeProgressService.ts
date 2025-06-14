import axios from 'axios';


export interface UpdateElementProgressRequest {
  elementId: string;
  completed: boolean;
}

export interface UpdateElementProgressResponse {
  elementId: string;
  completed: boolean;
  challengeStats: {
    total: number;
    completed: number;
    percentage: number;
    isCompleted: boolean;
  };
}

export interface UserProgressResponse {
  id: string;
  user_id: string;
  total_weeks: number;
  completed_weeks: number;
  total_challenges: number;
  completed_challenges: number;
  overall_completion_percentage: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
}

export const updateElementProgress = async (
  challengeId: string,
  data: UpdateElementProgressRequest
): Promise<UpdateElementProgressResponse> => {
  const response = await axios.patch(
    `/api/challenges/${challengeId}/completed`,
    data
  );
  return response.data.data;
};

export const getUserProgress = async (): Promise<UserProgressResponse> => {
  const response = await axios.get(`/api/challenges/progress`);
  return response.data.data;
};