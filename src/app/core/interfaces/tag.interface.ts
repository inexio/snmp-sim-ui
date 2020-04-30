export interface Tag {
    name: string;
    description: any;
    id: number;
    meta?: {
        color: string;
        description: string;
    };
    tag?: Tag;
}
