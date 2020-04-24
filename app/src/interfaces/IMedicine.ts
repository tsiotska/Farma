export interface IMedicine {
    id: number;
    image: string;

    name: string;
    releaseForm: string;
    dosage: number;
    manufacturer: string;
    barcode: string;
    mark: number;
    price: number;

    color?: string;
}
