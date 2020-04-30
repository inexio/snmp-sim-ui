import { Engine } from "./engine.interface";
import { Selector } from "./selector.interface";
import { Tag } from "./tag.interface";

export interface Agent {
    id: number;
    name: string;
    data_dir: string;
    engines: Engine[];
    selectors: Selector[];
    tags: Tag[];
}
