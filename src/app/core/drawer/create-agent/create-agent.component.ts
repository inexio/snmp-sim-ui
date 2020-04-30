import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Lab } from "../../interfaces/lab.interface";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateTagComponent } from "../create-tag/create-tag.component";

@Component({
    selector: "app-create-agent",
    templateUrl: "./create-agent.component.html",
    styleUrls: ["./create-agent.component.css"],
})
export class CreateAgentComponent implements OnInit {
    /**
     * Array of Lab ids that will be preselected
     */
    @Input() public preselectedLabs?: number[] = [];

    /**
     * Array of Tag ids that will be preselected
     */
    @Input() public preselectedTags?: number[] = [];

    /**
     * Form including Agent details
     */
    public agentForm: { name: string; data_dir: string } = {
        name: "",
        data_dir: "",
    };

    /**
     * Array of available Tags to choose from
     */
    public availableTags: Tag[] = [];

    /**
     * Array of selected Tags that will be added to the Agent
     */
    public selectedTags: number[] = [];

    /**
     * Array of available Labs to choose from
     */
    public availableLabs: Lab[] = [];

    /**
     * Array of selected Labs the Agent will be added to
     */
    public selectedLabs: number[] = [];

    /**
     * Status of the http request creating the Agent
     */
    public createAgentStatus: "idle" | "pending" | "success" | "error" = "idle";

    /**
     * Current step in Agent creation process, used in the NzStepsComponent
     */
    public createAgentStep = 0;

    constructor(
        private management: ManagementService,
        private drawer: NzDrawerService,
        private drawerRef: NzDrawerRef<any>,
    ) {}

    ngOnInit(): void {
        // Get list of available Tags
        this.getAvailableTags();

        // Get list of available Labs
        this.getAvailableLabs();

        // Preselect labs if any were specified
        this.selectedLabs = this.selectedLabs.concat(this.preselectedLabs || []);

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
        this.management.getLabs().subscribe({
            next: (labs) => {
                this.availableLabs = labs;
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
     * Create an Agents, attach Tags to it, add Agent to Labs
     */
    public createAgent(): void {
        this.createAgentStatus = "pending";
        this.createAgentStep = 0;

        // Create Agent
        this.management.createAgent(this.agentForm).subscribe({
            next: (agent) => {
                this.createAgentStep = 1;

                // Add Tags to Agent
                this.management.attachTags("agent", this.selectedTags, agent.id).subscribe({
                    next: () => {
                        this.createAgentStep = 2;

                        // Add Agent to Labs
                        this.management.addAgentsToLabs([agent.id], this.selectedLabs).subscribe({
                            next: () => {
                                this.createAgentStatus = "success";
                                this.createAgentStep = 5;

                                setTimeout(() => {
                                    this.close();
                                }, 3000);
                            },
                            error: (error) => {
                                this.createAgentStatus = "error";
                                console.error(error);
                            },
                        });
                    },
                    error: (error) => {
                        this.createAgentStatus = "error";
                        console.log(error);
                    },
                });
            },
            error: (error) => {
                this.createAgentStatus = "error";
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
