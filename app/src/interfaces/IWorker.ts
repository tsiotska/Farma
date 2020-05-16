export interface IWorker {
    id: number;
    name: string;
    image: string;

    position: number;

    fired?: Date;
    hired?: Date;
    created?: Date;
    region?: number;
    city: number;

    email: string;
    mobilePhone: string;
    workPhone: string;
    card: string;
    isVacancy: boolean;
}
