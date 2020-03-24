export interface IUserCredentials {
    email: string;
    password: string;
}

export interface IUser {
    id: number;
    name: string;
    position: number;
    avatar: string;
    doctorsCount?: number;
    pharmacyCount?: number;

    region?: string[];
    level?: string;
    city?: string;
}
