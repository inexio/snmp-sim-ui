import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Endpoint } from "../../interfaces/endpoint.interface";
import { Engine } from "../../interfaces/engine.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateEndpointComponent } from "../create-endpoint/create-endpoint.component";

@Component({
    selector: "app-add-endpoint",
    templateUrl: "./add-endpoint.component.html",
    styleUrls: ["./add-endpoint.component.css"],
})
export class AddEndpointComponent implements OnInit {
    /**
     * Engine selected Endpoints will be added to
     */
    @Input() public engine: Engine;

    /**
     * Status of the http request/s adding Engines to Agent
     */
    public addEndpointsStatus: "idle" | "pending" | "success" | "error" = "idle";

    public selectedEndpoints: number[] = [];
    public availableEndpoints: Endpoint[] = [];

    constructor(
        private management: ManagementService,
        private drawerRef: NzDrawerRef,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        this.getAvailableEndpoints();
        console.log(this);
    }

    public getAvailableEndpoints(): void {
        this.management.getEndpoints().subscribe({
            next: (endpoints) => {
                this.availableEndpoints = endpoints.filter((endpoint) => {
                    return !this.engine.endpoints.some((e) => e.id === endpoint.id);
                });
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new Endpoint
     */
    public createNewEndpoint(): void {
        this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) + 175;
        const drawerRef = this.drawer.create<CreateEndpointComponent, { type: string }, string>({
            nzTitle: "Create New Endpoint",
            nzContent: CreateEndpointComponent,
            nzWidth: "350px",
        });

        // Update available Endpoints after a new one was created
        drawerRef.afterClose.subscribe(() => {
            this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) - 175;
            this.getAvailableEndpoints();
        });
    }

    /**
     * Adds selected Endpoints to Engine
     */
    public addEndpoints(): void {
        this.addEndpointsStatus = "pending";

        this.management.addEndpointsToEngines(this.selectedEndpoints, [this.engine.id]).subscribe({
            next: () => {
                this.addEndpointsStatus = "success";
                this.close();
            },
            error: (error) => {
                this.addEndpointsStatus = "error";
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
