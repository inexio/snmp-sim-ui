import { Tag } from "./tag.interface";

export interface User {
    id: number;
    name: string;
    auth_key: string;
    auth_proto: string;
    priv_key: string;
    priv_proto: string;
    user: User;
    tags: Tag[];
}
