export interface IMedicine {
    id: number;
    name: string;
    image: string;
    releaseForm: string;
    dosage: number;
    manufacturer: string;
    bonus: number;
    price: number;
    color?: string;
}
