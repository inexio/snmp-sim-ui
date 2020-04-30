import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NzDrawerService } from "ng-zorro-antd";
import { AddAgentComponent } from "../../../core/drawer/add-agent/add-agent.component";
import { AddEndpointComponent } from "../../../core/drawer/add-endpoint/add-endpoint.component";
import { AddEngineComponent } from "../../../core/drawer/add-engine/add-engine.component";
import { AddUserComponent } from "../../../core/drawer/add-user/add-user.component";
import { CreateAgentComponent } from "../../../core/drawer/create-agent/create-agent.component";
import { CreateEndpointComponent } from "../../../core/drawer/create-endpoint/create-endpoint.component";
import { CreateEngineComponent } from "../../../core/drawer/create-engine/create-engine.component";
import { CreateUserComponent } from "../../../core/drawer/create-user/create-user.component";
import { Agent } from "../../../core/interfaces/agents.interface";
import { Engine } from "../../../core/interfaces/engine.interface";
import { Lab } from "../../../core/interfaces/lab.interface";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-lab",
    templateUrl: "./lab.component.html",
    styleUrls: ["./lab.component.css"],
})
export class LabComponent implements OnInit {
    public params: Params;

    public labId: string;
    public lab: Lab;

    public expandedAgent: Agent;
    public expandedEngine: Engine;

    constructor(
        public management: ManagementService,
        private route: ActivatedRoute,
        private drawer: NzDrawerService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // Subscribe to Route parameter changes (when Agent/Engine is clicked/expanded)
        this.route.params.subscribe((params) => {
            // Update params inside component
            this.params = params;

            // Get lab, open
            this.getLab(false).then((lab: Lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Gets the full lab by the labId given in Route
     * @param force Optional parameter, if true, will make a new Http request, otherwise resolve stored/cached lab
     */
    public getLab(force?: boolean): Promise<Lab> {
        return new Promise((resolve, reject) => {
            if (this.lab && !force) {
                resolve(this.lab);
            } else {
                this.management.getLab(this.params.labId).subscribe({
                    next: (lab) => {
                        this.lab = lab;
                        resolve(lab);
                    },
                    error: (err) => {
                        console.error(err);
                        reject("Error getting Lab");
                    },
                });
            }
        });
    }

    public expandFromRoute(lab: Lab): void {
        if (this.params.agentId) {
            const agent = lab.agents.find((a) => a.id === Number(this.params.agentId));
            this.expandedAgent = agent;

            if (this.params.engineId) {
                const engine = agent.engines.find((e) => e.id === Number(this.params.engineId));
                this.expandedEngine = engine;
            }
        }
    }

    /**
     * "Expands" an Agent showing its Engines, does so by redirecting to Route containing id of Agent to open
     * @param agent Agent object containing the id of the Agent
     */
    public expandAgent(agent: Agent): void {
        this.router.navigate([`manage/labs/${this.lab.id}/${agent.id}`]);
    }

    /**
     * "Expands" an Engine showing its Endpoints and Users, does so by redirecting to Route containing id of parent
     * Agent and Id of Engine to open
     * @param engine Engine object containing the id of the Engine
     */
    public expandEngine(engine: Engine): void {
        this.router.navigate([`manage/labs/${this.lab.id}/${this.expandedAgent.id}/${engine.id}`]);
    }

    /**
     * Opens a drawer where a user can create a new Agent
     */
    public openCreateAgentDrawer(): void {
        const drawerRef = this.drawer.create<CreateAgentComponent, any, string>({
            nzTitle: "Create New Agent",
            nzContent: CreateAgentComponent,
            nzContentParams: {
                preselectedLabs: [this.lab.id],
            },
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Opens a drawer where a user can add existing Agents
     */
    public openAddAgentDrawer(): void {
        const drawerRef = this.drawer.create<AddAgentComponent, any, string>({
            nzTitle: "Add Existing Agents",
            nzContent: AddAgentComponent,
            nzContentParams: {
                lab: this.lab,
            },
            nzWidth: "350px",
        });

        /**
         * Update current Agent data after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Opens a drawer where a user can create a new Engine
     */
    public openCreateEngineDrawer(): void {
        const drawerRef = this.drawer.create<CreateEngineComponent, any, string>({
            nzTitle: "Create New Engine",
            nzContent: CreateEngineComponent,
            nzContentParams: {
                preselectedAgents: [this.expandedAgent.id],
            },
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Opens a drawer where a user can create a new Engine
     */
    public openAddEngineDrawer(): void {
        const drawerRef = this.drawer.create<AddEngineComponent, any, string>({
            nzTitle: "Add Existing Engines",
            nzContent: AddEngineComponent,
            nzContentParams: {
                agent: this.expandedAgent,
            },
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Opens a drawer where a user can create a new Endpoint
     */
    public openCreateEndpointDrawer(): void {
        const drawerRef = this.drawer.create<CreateEndpointComponent, any, string>({
            nzTitle: "Create New Endpoint",
            nzContent: CreateEndpointComponent,
            nzContentParams: {
                preselectedEngines: [this.expandedEngine.id],
            },
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Opens a drawer where a user can create a new Endpoint
     */
    public openCreateUserDrawer(): void {
        const drawerRef = this.drawer.create<CreateUserComponent, any, string>({
            nzTitle: "Create New User",
            nzContent: CreateUserComponent,
            nzContentParams: {
                preselectedEngines: [this.expandedEngine.id],
            },
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Opens a drawer where the user can add Endpoints to Engine
     */
    public openAddEndpointDrawer(): void {
        const drawerRef = this.drawer.create<AddEndpointComponent, any, string>({
            nzTitle: "Add existing Endpoints",
            nzContent: AddEndpointComponent,
            nzContentParams: {
                engine: this.expandedEngine,
            },
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }

    /**
     * Opens a drawer where the user can add Users to Engine
     */
    public openAddUserDrawer(): void {
        const drawerRef = this.drawer.create<AddUserComponent, any, string>({
            nzTitle: "Add existing Users",
            nzContent: AddUserComponent,
            nzContentParams: {
                engine: this.expandedEngine,
            },
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab(true).then((lab) => {
                this.expandFromRoute(lab);
            });
        });
    }
}
