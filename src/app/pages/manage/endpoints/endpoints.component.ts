import { Component, OnInit } from "@angular/core";
import { NzDrawerService } from "ng-zorro-antd";
import { CreateEndpointComponent } from "../../../core/drawer/create-endpoint/create-endpoint.component";
import { Endpoint } from "../../../core/interfaces/endpoint.interface";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-endpoints",
    templateUrl: "./endpoints.component.html",
    styleUrls: ["./endpoints.component.css"],
})
export class EndpointsComponent implements OnInit {
    public endpoints: Endpoint[] = [];

    constructor(private management: ManagementService, private drawer: NzDrawerService) {}

    ngOnInit(): void {
        this.updateEndpoints();
    }

    public updateEndpoints(): void {
        this.management.getEndpoints().subscribe({
            next: (endpoints) => {
                this.endpoints = endpoints;
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new Endpoint
     */
    public openCreateEndpointDrawer(): void {
        const drawerRef = this.drawer.create<CreateEndpointComponent, any, string>({
            nzTitle: "Create New Endpoint",
            nzContent: CreateEndpointComponent,
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.updateEndpoints();
        });
    }
}
