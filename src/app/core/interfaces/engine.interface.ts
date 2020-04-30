import { Endpoint } from "./endpoint.interface";
import { Tag } from "./tag.interface";
import { User } from "./user.interface";

export interface Engine {
    id: number;
    name: string;
    engine_id: any;
    endpoints: Endpoint[];
    users: User[];
    tags: Tag[];
}
