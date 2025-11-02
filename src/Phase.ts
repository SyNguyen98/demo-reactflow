export interface Phase {
    id: string,
    name: string,
    description: string,
    previousMilestoneId: string,
    nextMilestoneId: string
}