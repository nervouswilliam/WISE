export interface User {
    sessionId: string;
    token: string | null;
    username: string;
    role: string;
    image: string;
    createdTime: number;
    expiredTime: number;
}