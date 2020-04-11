/**
 * Interface for Round using id, score, course, rating, slope, and date played
 */
export interface Round {
    id: string;
    score: number;
    course: string;
    rating: number;
    slope: number;
    date: string;
}