export interface Challenge {
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }
  
export interface WeeklyCard {
    id: string;
    weekNumber: number;
    startDate: string;
    endDate: string;
    theme: string;
    challenges: Challenge[];
  }