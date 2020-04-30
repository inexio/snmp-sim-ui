import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Agent } from "../../interfaces/agents.interface";
import { Engine } from "../../interfaces/engine.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateEngineComponent } from "../create-engine/create-engine.component";

@Component({
    selector: "app-add-engine",
    templateUrl: "./add-engine.component.html",
    styleUrls: ["./add-engine.component.css"],
})
export class AddEngineComponent implements OnInit {
    /**
     * Agent to add Engines to
     */
    @Input() public agent: Agent;

    /**
     * Status of the http request/s adding Engines to Agent
     */
    public addEnginesStatus: "idle" | "pending" | "success" | "error" = "idle";

    public selectedEngines: number[] = [];
    public availableEngines: Engine[] = [];

    constructor(
        private management: ManagementService,
        private drawerRef: NzDrawerRef,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        this.getAvailableEngines();
    }

    public getAvailableEngines(): void {
        this.management.getEngines().subscribe({
            next: (engines) => {
                this.availableEngines = engines.filter((engine) => {
                    return !this.agent.engines.some((e) => e.id === engine.id);
                });
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new tag
     */
    public createNewEngine(): void {
        this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) + 175;
        const drawerRef = this.drawer.create<CreateEngineComponent, { type: string }, string>({
            nzTitle: "Create New Engine",
            nzContent: CreateEngineComponent,
            nzWidth: "350px",
        });

        // Update tags after a new one was created
        drawerRef.afterClose.subscribe(() => {
            this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) - 175;
            this.getAvailableEngines();
        });
    }

    public addEngines(): void {
        this.addEnginesStatus = "pending";

        this.management.addEnginesToAgents(this.selectedEngines, [this.agent.id]).subscribe({
            next: () => {
                this.addEnginesStatus = "success";
                this.close();
            },
            error: (error) => {
                this.addEnginesStatus = "error";
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
