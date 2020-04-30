import { Component, OnInit } from "@angular/core";
import { NzDrawerService } from "ng-zorro-antd";
import { CreateLabComponent } from "../../../core/drawer/create-lab/create-lab.component";
import { Lab } from "../../../core/interfaces/lab.interface";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-labs",
    templateUrl: "./labs.component.html",
    styleUrls: ["./labs.component.css"],
})
export class LabsComponent implements OnInit {
    /**
     * Array of labs to display
     */
    public labs: Lab[] = [];

    constructor(public management: ManagementService, private drawer: NzDrawerService) {}

    ngOnInit(): void {
        this.getLabs();
    }

    /**
     * Get list of all available labs
     */
    public getLabs(): void {
        this.management.getLabs().subscribe({
            next: (labs) => {
                this.labs = labs;
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new lab
     */
    public openCreateLabDrawer(): void {
        const drawerRef = this.drawer.create<CreateLabComponent, any, string>({
            nzTitle: "Create New Lab",
            nzContent: CreateLabComponent,
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            console.log("Closed");
        });
    }
}
