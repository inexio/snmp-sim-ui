import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Engine } from "../../interfaces/engine.interface";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateTagComponent } from "../create-tag/create-tag.component";

@Component({
    selector: "app-create-endpoint",
    templateUrl: "./create-endpoint.component.html",
    styleUrls: ["./create-endpoint.component.css"],
})
export class CreateEndpointComponent implements OnInit {
    /**
     * Array of Engine ids that will be preselected
     */
    @Input() public preselectedEngines?: number[] = [];

    /**
     * Array of Tag ids that will be preselected
     */
    @Input() public preselectedTags?: number[] = [];

    public availableProtocols: string[] = ["udpv4"];

    /**
     * Form including Engine details
     */
    public endpointForm: { name: string; address: string; protocol: "udpv4" } = {
        name: "",
        address: "",
        protocol: "udpv4",
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
     * Array of available Engines to choose from
     */
    public availableEngines: Engine[] = [];

    /**
     * Array of selected Engines the Endpoint will be added to
     */
    public selectedEngines: number[] = [];

    /**
     * Status of the http request creating the Endpoint
     */
    public createEndpointStatus: "idle" | "pending" | "success" | "error" = "idle";

    /**
     * Current step in Endpoint creation process, used in the NzStepsComponent
     */
    public createEndpointStep = 0;

    constructor(
        private management: ManagementService,
        private drawerRef: NzDrawerRef,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        // Get list of available Tags
        this.getAvailableTags();

        // Get list of available Labs
        this.getAvailableEngines();

        // Preselect labs if any were specified
        this.selectedEngines = this.selectedEngines.concat(this.preselectedEngines || []);

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
    public getAvailableEngines(): void {
        this.management.getEngines().subscribe({
            next: (engines) => {
                this.availableEngines = engines;
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
    public createEndpoint(): void {
        this.createEndpointStatus = "pending";
        this.createEndpointStep = 0;

        // Create Agent
        this.management.createEndpoint(this.endpointForm).subscribe({
            next: (endpoint) => {
                this.createEndpointStep = 1;

                // Add Tags to Agent
                this.management.attachTags("endpoint", this.selectedTags, endpoint.id).subscribe({
                    next: () => {
                        this.createEndpointStep = 2;

                        // Add Agent to Labs
                        this.management.addEndpointsToEngines([endpoint.id], this.selectedEngines).subscribe({
                            next: () => {
                                this.createEndpointStatus = "success";
                                this.createEndpointStep = 5;

                                setTimeout(() => {
                                    this.close();
                                }, 3000);
                            },
                            error: (error) => {
                                this.createEndpointStatus = "error";
                                console.error(error);
                            },
                        });
                    },
                    error: (error) => {
                        this.createEndpointStatus = "error";
                        console.log(error);
                    },
                });
            },
            error: (error) => {
                this.createEndpointStatus = "error";
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
