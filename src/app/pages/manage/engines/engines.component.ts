import { Component, OnInit } from "@angular/core";
import { NzDrawerService } from "ng-zorro-antd";
import { CreateEngineComponent } from "../../../core/drawer/create-engine/create-engine.component";
import { Engine } from "../../../core/interfaces/engine.interface";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-engines",
    templateUrl: "./engines.component.html",
    styleUrls: ["./engines.component.css"],
})
export class EnginesComponent implements OnInit {
    public engines: Engine[] = [];

    constructor(private management: ManagementService, private drawer: NzDrawerService) {}

    ngOnInit(): void {
        this.updateEngines();
    }

    public updateEngines(): void {
        this.management.getEngines().subscribe({
            next: (engines) => {
                this.engines = engines;
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new Engine
     */
    public openCreateEngineDrawer(): void {
        const drawerRef = this.drawer.create<CreateEngineComponent, any, string>({
            nzTitle: "Create New Engine",
            nzContent: CreateEngineComponent,
            nzWidth: "350px",
        });

        drawerRef.afterClose.subscribe(() => {
            this.updateEngines();
        });
    }
}
