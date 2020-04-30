import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Agent } from "../../interfaces/agents.interface";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateTagComponent } from "../create-tag/create-tag.component";

@Component({
    selector: "app-create-engine",
    templateUrl: "./create-engine.component.html",
    styleUrls: ["./create-engine.component.css"],
})
export class CreateEngineComponent implements OnInit {
    /**
     * Array of Agent ids that will be preselected
     */
    @Input() public preselectedAgents?: number[] = [];

    /**
     * Array of Tag ids that will be preselected
     */
    @Input() public preselectedTags?: number[] = [];

    /**
     * Form including Agent details
     */
    public engineForm: { name: string; engine_id: string } = {
        name: "",
        engine_id: "auto",
    };

    /**
     * Array of available Tags to choose from
     */
    public availableTags: Tag[] = [];

    /**
     * Array of selected Tags that will be added to the Engine
     */
    public selectedTags: number[] = [];

    /**
     * Array of available Labs to choose from
     */
    public availableAgents: Agent[] = [];

    /**
     * Array of selected Labs the Agent will be added to
     */
    public selectedAgents: number[] = [];

    /**
     * Status of the http request creating the Engine
     */
    public createEngineStatus: "idle" | "pending" | "success" | "error" = "idle";

    /**
     * Current step in Engine creation process, used in the NzStepsComponent
     */
    public createEngineStep = 0;

    constructor(
        private management: ManagementService,
        private drawerRef: NzDrawerRef,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        // Get list of available Tags
        this.getAvailableTags();

        // Get list of available Labs
        this.getAvailableLabs();

        // Preselect labs if any were specified
        this.selectedAgents = this.selectedAgents.concat(this.preselectedAgents || []);

        // Preselect tags if any were specified
        this.selectedTags = this.selectedTags.concat(this.preselectedTags || []);
    }

    /**
     * Gets list of all available Tags
     */
    public getAvailableTags(): void {
        this.management.getTags().subscribe({
            next: (tags) => {
                this.availableTags = tags;
            },
        });
    }

    /**
     * Gets list of all available Labs
     */
    public getAvailableLabs(): void {
        this.management.getAgents().subscribe({
            next: (agents) => {
                this.availableAgents = agents;
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new tag
     */
    public createNewTag(): void {
        this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) + 175;
        const drawerRef = this.drawer.create<CreateTagComponent, { type: string }, string>({
            nzTitle: "Create New Tag",
            nzContent: CreateTagComponent,
            nzWidth: "350px",
        });

        // Update tags after a new one was created
        drawerRef.afterClose.subscribe((tag) => {
            this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) - 175;
            if (tag) {
                this.getAvailableTags();
            }
        });
    }

    /**
     * Create an Engine, attach Tags to it, add Engine to Agents
     */
    public createEngine(): void {
        this.createEngineStatus = "pending";
        this.createEngineStep = 0;

        // Create Agent
        this.management.createEngine(this.engineForm).subscribe({
            next: (engine) => {
                this.createEngineStep = 1;

                // Add Tags to Agent
                this.management.attachTags("engine", this.selectedTags, engine.id).subscribe({
                    next: () => {
                        this.createEngineStep = 2;

                        // Add Agent to Labs
                        this.management.addEnginesToAgents([engine.id], this.selectedAgents).subscribe({
                            next: () => {
                                this.createEngineStatus = "success";
                                this.createEngineStep = 5;

                                setTimeout(() => {
                                    this.close();
                                }, 3000);
                            },
                            error: (error) => {
                                this.createEngineStatus = "error";
                                console.error(error);
                            },
                        });
                    },
                    error: (error) => {
                        this.createEngineStatus = "error";
                        console.log(error);
                    },
                });
            },
            error: (error) => {
                this.createEngineStatus = "error";
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
