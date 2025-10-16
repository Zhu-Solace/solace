export interface ApiResponse<T> {
    data: T;
    error?: string;
}

export interface Advocate {
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: number;
    phoneNumber: number;
}

export type LoadingState = "idle" | "loading" | "error" | "success";