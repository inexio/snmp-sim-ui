import { Component, OnInit } from "@angular/core";
import { NzDrawerService } from "ng-zorro-antd";
import { CreateAgentComponent } from "../../../core/drawer/create-agent/create-agent.component";
import { Agent } from "../../../core/interfaces/agents.interface";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-agents",
    templateUrl: "./agents.component.html",
    styleUrls: ["./agents.component.css"],
})
export class AgentsComponent implements OnInit {
    public agents: Agent[] = [];

    constructor(private management: ManagementService, private drawer: NzDrawerService) {}

    ngOnInit(): void {
        this.updateAgents();
    }

    /**
     * Gets list of all available Agents
     */
    public updateAgents(): void {
        this.management.getAgents().subscribe({
            next: (agents) => {
                this.agents = agents;
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new Agent
     */
    public openCreateAgentDrawer(): void {
        const drawerRef = this.drawer.create<CreateAgentComponent, any, string>({
            nzTitle: "Create New Agent",
            nzContent: CreateAgentComponent,
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.updateAgents();
        });
    }
}
