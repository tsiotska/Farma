export interface ILPU {
    id: number;
    name: string;
    type: string;
    region: number;
    oblast: string;
    city: string;
    address: string;
    phone1: string;
    phone2: string;

    FFMCommit?: boolean;
    RMCommit?: boolean;
    confirmed?: boolean;
    deleted?: boolean;

    lpu?: number;
    lpuName: string;
}
