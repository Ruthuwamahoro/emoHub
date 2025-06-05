export interface AssessmentAnswer {
    questionId: string;
    selectedOption: string;
}

export interface AssessmentSubmissionRequest {
    answers: AssessmentAnswer[];
}