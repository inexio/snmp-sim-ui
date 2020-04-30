import { Tag } from "./tag.interface";

export interface Endpoint {
    id: number;
    name: string;
    protocol: "udpv4" | "udpv6";
    address: string;
    tags: Tag[];
}
