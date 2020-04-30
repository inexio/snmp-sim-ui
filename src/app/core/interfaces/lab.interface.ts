import { Agent } from "./agents.interface";
import { Tag } from "./tag.interface";

export interface Lab {
    id: number;
    agents: Agent[];
    name: string;
    power: "on" | "off";
    tags: Tag[];
}
