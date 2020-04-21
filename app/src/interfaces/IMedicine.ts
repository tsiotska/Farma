export interface IMedicine {
    id: number;
    name: string;
    image: string;
    releaseForm: string;
    dosage: number;
    manufacturer: string;
    barcode: string;
    mark: number;
    price: number;
    color?: string;
}
