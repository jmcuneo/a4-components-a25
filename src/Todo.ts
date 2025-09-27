export interface Todo{
    id: number;
    task: string;
    priority: string;
    createDate: Date;
    suggestedDeadline: Date;
    isComplete: boolean;
}