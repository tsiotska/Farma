export interface IDoctor {
    id: number;
    name: string;
    LPUId: number;
    LPUName: string;
    FFMCommit: boolean;
    RMCommit: boolean;
    specialty: string;
    position: string;
    workPhone: string;
    mobilePhone: string;
    card: string;
    created: Date;
    confirmed: boolean;
    deposit: number;
    deleted?: boolean;

    address?: string;
    city?: string;
    mp_user: number;
}
