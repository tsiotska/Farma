export interface IDoctor {
    id: number;
    name: string;
    LPUId: number;
    FFMCommit: boolean;
    RMCommit: boolean;
    specialty: string;
    workPhone: string;
    mobilePhone: string;
    card: string;
    created: Date;
    confirmed: boolean;
}
