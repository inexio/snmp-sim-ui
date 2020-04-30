import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NzTreeNode } from "ng-zorro-antd";
import { Observable, of, zip } from "rxjs";
import { delay, map, switchMap } from "rxjs/operators";
import { Agent } from "../../interfaces/agents.interface";
import { Connection } from "../../interfaces/connection.interface";
import { Endpoint } from "../../interfaces/endpoint.interface";
import { Engine } from "../../interfaces/engine.interface";
import { Lab } from "../../interfaces/lab.interface";
import { RecordFile } from "../../interfaces/recordFile.interface";
import { Tag } from "../../interfaces/tag.interface";
import { User } from "../../interfaces/user.interface";

@Injectable({
    providedIn: "root",
})
export class ManagementService {
    /**
     * Connection object for performing HTTP Requests
     */
    public connection: Connection;

    /**
     * Raw Record Files
     */
    public recordFiles: RecordFile[];

    /**
     * Parsed Tree of RecordFiles
     */
    public recordFileTree: NzTreeNode[];

    constructor(private http: HttpClient) {
        console.log(this);
    }

    // General Methods

    /**
     * Helper method to determine if given string is stringified json object
     * @param str Target string
     */
    public isObject(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Returns request url for given connection
     * @param path Path to add to the base url
     */
    public getRequestUrl(path: string): string {
        const baseUrl = `${this.connection.protocol}://${this.connection.address}:${this.connection.port}`;
        const parsedPath = path.startsWith("/") ? path : `/${path}`;
        return baseUrl + parsedPath;
    }

    /**
     * Returns a HttpHeaders object containing Authentication header for current connection
     */
    public getAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        if (this.connection.authentication.enabled) {
            headers = headers.append(
                "Authorization",
                `Basic ${btoa(
                    `${this.connection.authentication.username}:${this.connection.authentication.password}`,
                )}`,
            );
        }

        return headers;
    }

    /**
     * Performs a sample HTTP request against the management endpoint to validate the given connection object
     * @param connection Connection object to perform request with
     */
    public validateConnection(connection: Connection): Observable<Connection> {
        return this.http
            .get<Lab[]>(`${connection.protocol}://${connection.address}:${connection.port}/snmpsim/mgmt/v1/labs`, {
                headers: connection.authentication.enabled
                    ? new HttpHeaders({
                          Authorization: `Basic ${btoa(
                              `${connection.authentication.username}:${connection.authentication.password}`,
                          )}`,
                      })
                    : null,
                withCredentials: true,
            })
            .pipe(
                map(() => {
                    connection.isValid = true;
                    return connection;
                }),
                delay(1000),
            );
    }

    // Tags

    /**
     * Get a list of all available Tags
     */
    public getTags(): Observable<Tag[]> {
        return this.http
            .get<Tag[]>(this.getRequestUrl("/snmpsim/mgmt/v1/tags"), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((tags) => {
                    return this.parseTags(tags);
                }),
            );
    }

    /**
     * Split Tag description into own meta object containing Tag color and description
     */
    public parseTags(tags: Tag[]): Tag[] {
        return tags.map((tag) => {
            // If description is a stringified object
            if (this.isObject(tag.description)) {
                const desc = JSON.parse(tag.description);
                tag.meta = {
                    color: desc.color,
                    description: desc.description,
                };
                return tag;
            } else {
                tag.meta = {
                    color: "blue",
                    description: tag.description,
                };
                return tag;
            }
        });
    }

    /**
     * Parse a single Tag
     * @param tag Single Tag to parse
     */
    public parseTag(tag: Tag): Tag {
        return this.parseTags([tag])[0];
    }

    /**
     * Create a new Tag
     * @param tag Tag object containing name and meta
     */
    public createTag(tag: { name: string; meta: { color: string; description: string } }): Observable<Tag> {
        // Stringify tag meta
        const tagBody = {
            name: tag.name,
            description: JSON.stringify(tag.meta),
        };

        return this.http.post<Tag>(this.getRequestUrl("/snmpsim/mgmt/v1/tags"), tagBody, {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Delete a Tag
     * @param tag Id of the Tag to delete
     */
    public deleteTag(tag: number): Observable<any> {
        return this.http.delete<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/tags/${tag}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Attach multiple Tags to a given Object
     * @param type Type of the Object to attach Tags to
     * @param tags Array of Tag ids to attach to Object
     * @param targetId Id of the Object to attach Tags to
     */
    public attachTags(
        type: "lab" | "agent" | "engine" | "endpoint" | "user",
        tags: (string | number)[],
        targetId: number | string,
    ): Observable<Tag[]> {
        const requests: Observable<Tag>[] = [];
        tags.map((tag) => {
            requests.push(
                this.http
                    .put<Tag>(
                        this.getRequestUrl(`/snmpsim/mgmt/v1/tags/${tag}/${type}/${targetId}`),
                        {},
                        {
                            headers: this.getAuthHeaders(),
                            withCredentials: true,
                        },
                    )
                    .pipe(
                        map((tag) => {
                            return this.parseTag(tag);
                        }),
                    ),
            );
        });

        return requests.length === 0 ? of(null) : zip(...requests).pipe(delay(1500));
    }

    /**
     * Detach multiple Tags from a given Object
     * @param type Type of the Object to detach Tags from
     * @param tags Array of Tag Ids to detach
     * @param targetId Id of the Object to detach Tags from
     */
    public detachTags(
        type: "lab" | "agent" | "engine" | "endpoint" | "user",
        tags: (string | number)[],
        targetId: number | string,
    ): Observable<Tag[]> {
        const requests: Observable<Tag>[] = [];
        tags.map((tag) => {
            requests.push(
                this.http
                    .delete<Tag>(this.getRequestUrl(`/snmpsim/mgmt/v1/tags/${tag}/${type}/${targetId}`), {
                        headers: this.getAuthHeaders(),
                        withCredentials: true,
                    })
                    .pipe(
                        map((tag) => {
                            return this.parseTag(tag);
                        }),
                    ),
            );
        });

        return requests.length === 0 ? of(null) : zip(...requests).pipe(delay(1500));
    }

    // Labs

    /**
     * Get a list of all available Labs
     */
    public getLabs(): Observable<Lab[]> {
        return this.http
            .get<Lab[]>(this.getRequestUrl("/snmpsim/mgmt/v1/labs"), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((labs) => {
                    return labs.map((lab) => {
                        lab.tags = this.parseTags(lab.tags);
                        return lab;
                    });
                }),
            );
    }

    /**
     * Get details for given labId
     * @param lab Id of the Lab to get details for
     */
    public getLab(lab: number): Observable<Lab> {
        return this.http
            .get<Lab>(this.getRequestUrl(`/snmpsim/mgmt/v1/labs/${lab}`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((lab) => {
                    lab.tags = this.parseTags(lab.tags);
                    return lab;
                }),
            );
    }

    /**
     * Create a new Lab with given name
     * @param lab Lab object containing Lab name
     */
    public createLab(lab: { name: string }): Observable<Lab> {
        return this.http
            .post<Lab>(this.getRequestUrl(`/snmpsim/mgmt/v1/labs`), lab, {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((lab) => {
                    lab.tags = this.parseTags(lab.tags);
                    return lab;
                }),
            );
    }

    /**
     * Delete a Lab, Objects inside of Lab still exist
     * @param labId Id of the Lab to delete
     */
    public deleteLab(lab: number): Observable<any> {
        return this.http.delete<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/labs/${lab}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Change the power state of a Lab
     * @param lab Id of the lab to change the power state for
     * @param onOrOff New power state of the Lab, either "on" or "off"
     */
    public powerLab(lab: number, onOrOff: "on" | "off"): Observable<Lab> {
        return this.http
            .put<Lab>(this.getRequestUrl(`/snmpsim/mgmt/v1/labs/${lab}/power/${onOrOff}`), null, {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                delay(1000),
                map((lab) => {
                    lab.tags = this.parseTags(lab.tags);
                    return lab;
                }),
            );
    }

    /**
     * Restart a Lab, turning its power off and on
     * @param lab Id of the Lab to restart
     */
    public restartLab(labId: number | string): Observable<Lab> {
        return this.http
            .put<Lab>(this.getRequestUrl(`/snmpsim/mgmt/v1/labs/${labId}/power/off`), null, {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                switchMap(() => {
                    return this.http.put<Lab>(this.getRequestUrl(`/snmpsim/mgmt/v1/labs/${labId}/power/on`), null, {
                        headers: this.getAuthHeaders(),
                        withCredentials: true,
                    });
                }),
            );
    }

    // Record Files

    /**
     * Gets a list of all RecordFiles, parses them into a NzNodeTree
     * Get a list of all available RecordFiles, parse them into a NzNodeTree
     */
    public getRecordFiles(): Observable<NzTreeNode[]> {
        return this.http
            .get<RecordFile[]>(this.getRequestUrl(`/snmpsim/mgmt/v1/recordings`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((recordFiles) => {
                    this.recordFiles = recordFiles;
                    this.recordFileTree = this.createTreeFromRecordFiles(recordFiles);
                    return this.recordFileTree;
                }),
            );
    }

    /**
     * Get details for RecordFile at specified path
     * @param path Path of the RecordFile
     */
    public getRecordFile(path: string): Observable<RecordFile> {
        return this.http
            .get<RecordFile>(this.getRequestUrl(`/snmpsim/mgmt/v1/recordings/${path}`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
                // @ts-ignore
                responseType: "text",
            })
            .pipe(
                map((data) => {
                    return {
                        name: path.split("/").pop(),
                        content: data,
                    };
                }),
            );
    }

    /**
     * Create a Tree structure from given RecordFiles
     * @param recordFiles Array of RecordFiles to transform into Tree
     */
    private createTreeFromRecordFiles(recordFiles: RecordFile[]): NzTreeNode[] {
        const paths = recordFiles.map((r) => {
            return r.path.split("/");
        });

        // Adapted from http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/
        const tree = [];

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            let currentLevel = tree;
            for (let j = 0; j < path.length; j++) {
                const part = path[j];

                const existingPath = findWhere(currentLevel, "title", part);

                if (existingPath) {
                    currentLevel = existingPath.children;
                } else {
                    const newPart = {
                        title: part,
                        key: path.join("/"),
                        children: [],
                        isLeaf: j === path.length - 1,
                    };

                    currentLevel.push(newPart);
                    currentLevel = newPart.children;
                }
            }
        }
        return tree;

        function findWhere(array: any[], key: string, value: string) {
            // Adapted from https://stackoverflow.com/questions/32932994/findwhere-from-underscorejs-to-jquery
            let t = 0; // t is used as a counter
            while (t < array.length && array[t][key] !== value) {
                t++;
            } // find the index where the id is the as the aValue

            if (t < array.length) {
                return array[t];
            } else {
                return false;
            }
        }
    }

    /**
     * Delete a RecordFile at given path (does not work with folders)
     * @param path Path of the file to delete
     */
    public deleteRecordFile(path: string): Observable<any> {
        return this.http.delete<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/recordings/${path}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Create a new RecordFile at specified path
     * @param path Path to create the file at
     * @param content Plaintext contents of the file
     */
    public createRecordFile(path: string, content: string): Observable<any> {
        return this.http.post<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/recordings/${path}`), content, {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    // Agents

    /**
     * Get a list of all available Agents
     */
    public getAgents(): Observable<Agent[]> {
        return this.http
            .get<Agent[]>(this.getRequestUrl(`/snmpsim/mgmt/v1/agents`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((agents) => {
                    return agents.map((agent) => {
                        agent.tags = this.parseTags(agent.tags);
                        return agent;
                    });
                }),
            );
    }

    /**
     * Get all details for an Agent by its id
     * @param agent Id of the Agent to get
     */
    public getAgent(agent: number): Observable<Agent> {
        return this.http
            .get<Agent>(this.getRequestUrl(`/snmpsim/mgmt/v1/agents/${agent}`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((agent) => {
                    agent.tags = this.parseTags(agent.tags);
                    return agent;
                }),
            );
    }

    /**
     * Create a new Agent
     * @param agent Agent object containing its name and data directory
     */
    public createAgent(agent: { name: string; data_dir: string }): Observable<Agent> {
        return this.http
            .post<Agent>(this.getRequestUrl(`/snmpsim/mgmt/v1/agents`), agent, {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                delay(1000),
                map((agent) => {
                    agent.tags = this.parseTags(agent.tags);
                    return agent;
                }),
            );
    }

    /**
     * Delete an Agent
     * @param agent Id of the Agent to delete
     */
    public deleteAgent(agent: number): Observable<any> {
        return this.http.delete<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/agents/${agent}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Add multiple Agents to multiple Labs
     * @param agents Array of Agent ids to add to Labs
     * @param labs Array of Lab ids to add Agents to
     */
    public addAgentsToLabs(agents: number[], labs: number[]): Observable<any> {
        const requests = [];

        labs.map((lab) => {
            agents.map((agent) => {
                requests.push(
                    this.http.put(
                        this.getRequestUrl(`/snmpsim/mgmt/v1/labs/${lab}/agent/${agent}`),
                        {},
                        {
                            headers: this.getAuthHeaders(),
                            withCredentials: true,
                        },
                    ),
                );
            });
        });

        return requests.length === 0 ? of(null) : zip(...requests).pipe(delay(1500));
    }

    // Engines

    /**
     * Get a list of all available Engines
     */
    public getEngines(): Observable<Engine[]> {
        return this.http
            .get<Engine[]>(this.getRequestUrl(`/snmpsim/mgmt/v1/engines`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((engines) => {
                    return engines.map((engine) => {
                        engine.tags = this.parseTags(engine.tags);
                        return engine;
                    });
                }),
            );
    }

    /**
     * Get details for an Engine
     * @param engine Id of the Engine to get details for
     */
    public getEngine(engine: number): Observable<Engine> {
        return this.http
            .get<Engine>(this.getRequestUrl(`/snmpsim/mgmt/v1/engines/${engine}`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((engine) => {
                    engine.tags = this.parseTags(engine.tags);
                    return engine;
                }),
            );
    }

    /**
     * Create a new Engine
     * @param engine Engine object containing its name and its engine_id
     */
    public createEngine(engine: { name: string; engine_id: string }): Observable<Engine> {
        return this.http
            .post<Engine>(this.getRequestUrl(`/snmpsim/mgmt/v1/engines`), engine, {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((engine) => {
                    engine.tags = this.parseTags(engine.tags);
                    return engine;
                }),
            );
    }

    /**
     * Delete an Engine
     * @param engine Id of the Engine to delete
     */
    public deleteEngine(engine: number): Observable<any> {
        return this.http.delete<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/engines/${engine}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Add multiple Engines to multiple Agents
     * @param engines Array of engine Ids to add to Agents
     * @param agents Array of Agent Ids to add Engines to
     */
    public addEnginesToAgents(engines: number[], agents: number[]): Observable<any> {
        const requests = [];

        agents.map((agent) => {
            engines.map((engine) => {
                requests.push(
                    this.http.put(
                        this.getRequestUrl(`/snmpsim/mgmt/v1/agents/${agent}/engine/${engine}`),
                        {},
                        {
                            headers: this.getAuthHeaders(),
                            withCredentials: true,
                        },
                    ),
                );
            });
        });

        return requests.length === 0 ? of(null) : zip(...requests).pipe(delay(1500));
    }

    // Endpoints

    /**
     * Get a list of all available Endpoints
     */
    public getEndpoints(): Observable<Endpoint[]> {
        return this.http
            .get<Endpoint[]>(this.getRequestUrl(`/snmpsim/mgmt/v1/endpoints`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((endpoints) => {
                    return endpoints.map((endpoint) => {
                        endpoint.tags = this.parseTags(endpoint.tags);
                        return endpoint;
                    });
                }),
            );
    }

    /**
     * Get full Endpoint details by its Id
     * @param endpoint Id of the Endpoint to get details for
     */
    public getEndpoint(endpoint: number): Observable<Endpoint> {
        return this.http
            .get<Endpoint>(this.getRequestUrl(`/snmpsim/mgmt/v1/endpoints/${endpoint}`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((endpoint) => {
                    endpoint.tags = this.parseTags(endpoint.tags);
                    return endpoint;
                }),
            );
    }

    /**
     * Create a new Endpoint
     * @param endpoint Endpoint object containing its name, address, and protocol
     */
    public createEndpoint(endpoint: { name: string; address: string; protocol: string }): Observable<Endpoint> {
        return this.http
            .post<Endpoint>(this.getRequestUrl(`/snmpsim/mgmt/v1/endpoints`), endpoint, {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((endpoint) => {
                    endpoint.tags = this.parseTags(endpoint.tags);
                    return endpoint;
                }),
            );
    }

    /**
     * Delete an Endpoint
     * @param endpoint Id of the Endpoint to delete
     */
    public deleteEndpoint(endpoint: number): Observable<any> {
        return this.http.delete<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/endpoints/${endpoint}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Add multiple Endpoints to multiple Engines
     * @param endpoints Array of Endpoint Ids to add to Engines
     * @param engines Array of Engines Ids to add Endpoints to
     */
    public addEndpointsToEngines(endpoints: number[], engines: number[]): Observable<any> {
        const requests = [];

        engines.map((engine) => {
            endpoints.map((endpoint) => {
                requests.push(
                    this.http.put(
                        this.getRequestUrl(`/snmpsim/mgmt/v1/engines/${engine}/endpoint/${endpoint}`),
                        {},
                        {
                            headers: this.getAuthHeaders(),
                            withCredentials: true,
                        },
                    ),
                );
            });
        });

        return requests.length === 0 ? of(null) : zip(...requests).pipe(delay(1500));
    }

    // Users

    /**
     * Get a list of all available Users
     */
    public getUsers(): Observable<User[]> {
        return this.http
            .get<User[]>(this.getRequestUrl(`/snmpsim/mgmt/v1/users`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((users) => {
                    return users.map((user) => {
                        user.tags = this.parseTags(user.tags);
                        return user;
                    });
                }),
            );
    }

    /**
     * Get full User details by its Id
     * @param user Id of the User to get details for
     */
    public getUser(user: number): Observable<User> {
        return this.http
            .get<User>(this.getRequestUrl(`/snmpsim/mgmt/v1/users/${user}`), {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((user) => {
                    user.tags = this.parseTags(user.tags);
                    return user;
                }),
            );
    }

    /**
     * Create a new User
     * @param user User object as described below
     */
    public createUser(user: {
        user: string;
        name: string;
        auth_key: string;
        auth_proto: string;
        priv_key: string;
        priv_proto: string;
    }): Observable<User> {
        return this.http
            .post<User>(this.getRequestUrl("/snmpsim/mgmt/v1/users"), user, {
                headers: this.getAuthHeaders(),
                withCredentials: true,
            })
            .pipe(
                map((user) => {
                    user.tags = this.parseTags(user.tags);
                    return user;
                }),
            );
    }

    /**
     * Delete a User
     * @param user Id of the User to delete
     */
    public deleteUser(user: number | string): Observable<any> {
        return this.http.delete<any>(this.getRequestUrl(`/snmpsim/mgmt/v1/users/${user}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Add multiple Users to multiple Engines
     * @param users Array of User Ids to add to Engines
     * @param engines Array of Engines Ids to add Users to
     */
    public addUsersToEngines(users: (string | number)[], engines: (string | number)[]): Observable<any> {
        const requests = [];

        engines.map((engine) => {
            users.map((user) => {
                requests.push(
                    this.http.put(
                        this.getRequestUrl(`/snmpsim/mgmt/v1/engines/${engine}/user/${user}`),
                        {},
                        {
                            headers: this.getAuthHeaders(),
                            withCredentials: true,
                        },
                    ),
                );
            });
        });

        return requests.length === 0 ? of(null) : zip(...requests).pipe(delay(1500));
    }
}
