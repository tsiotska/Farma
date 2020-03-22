export interface IWorker {
    id: number;
    name: string;
    avatar: string;
    position: number;

    fired?: Date;
    hired?: Date;
    created?: Date;

    email: string;
    phone: string;
    card: string;
    isVacancy: boolean;
}