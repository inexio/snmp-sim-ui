import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Agent } from "../../interfaces/agents.interface";
import { Lab } from "../../interfaces/lab.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateAgentComponent } from "../create-agent/create-agent.component";

@Component({
    selector: "app-add-agent",
    templateUrl: "./add-agent.component.html",
    styleUrls: ["./add-agent.component.css"],
})
export class AddAgentComponent implements OnInit {
    @Input() public lab: Lab;

    /**
     * Statu of the http request/s adding Agents to Lab
     */
    public addAgentsStatus: "idle" | "pending" | "success" | "error" = "idle";

    public selectedAgents: number[] = [];
    public availableAgents: Agent[] = [];

    constructor(
        private management: ManagementService,
        private drawerRef: NzDrawerRef,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        this.getAvailableAgents();
    }

    public getAvailableAgents(): void {
        this.management.getAgents().subscribe({
            next: (agents) => {
                this.availableAgents = agents.filter((agent) => {
                    return !this.lab.agents.some((a) => a.id === agent.id);
                });
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new Agent
     */
    public createNewAgent(): void {
        this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) + 175;
        const drawerRef = this.drawer.create<CreateAgentComponent, { type: string }, string>({
            nzTitle: "Create New Agent",
            nzContent: CreateAgentComponent,
            nzWidth: "350px",
        });

        // Update tags after a new one was created
        drawerRef.afterClose.subscribe(() => {
            this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) - 175;
            this.getAvailableAgents();
        });
    }

    public addAgents(): void {
        this.addAgentsStatus = "pending";

        this.management.addAgentsToLabs(this.selectedAgents, [this.lab.id]).subscribe({
            next: () => {
                this.addAgentsStatus = "success";
                this.close();
            },
            error: (error) => {
                this.addAgentsStatus = "error";
                console.error(error);
            },
        });
    }

    /**
     * Closes the current drawer
     */
    public close(): void {
        this.drawerRef.close();
    }
}
