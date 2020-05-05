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

    ffmConfirm?: boolean;
    rmConfirm?: boolean;
    confirmed?: boolean;

    lpu?: number;
    lpuName: string;
}
