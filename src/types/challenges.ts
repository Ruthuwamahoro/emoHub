interface CreateChallengesInterface {
    title: string;
    description: string;
    image: string;
    total_points: number;
    start_date: string;
    end_date: string;
    questions: Array<{
        question: string;
        description: string;
        points: number;
        order: number;
        notes: string;
    }>;
}

interface CreateChallengesInterfaceAllInputs {
    group_id: string;
    challengesFields: CreateChallengesInterface;
}