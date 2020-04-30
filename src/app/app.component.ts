import { Component } from "@angular/core";
import { NzModalService } from "ng-zorro-antd";
import { AppConfig } from "../environments/environment";
import { ElectronService } from "./core/services";
import { CoreService } from "./core/services/core/core.service";
import { ManagementService } from "./core/services/management/management.service";
import { MetricsService } from "./core/services/metrics/metrics.service";
import { RouteService } from "./core/services/route/route.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    /**
     * Boolean if menu is collapsed
     */
    public isCollapsed = true;

    constructor(
        private modalService: NzModalService,
        private routeService: RouteService,
        public electron: ElectronService,
        public core: CoreService,
        public management: ManagementService,
        public metrics: MetricsService,
    ) {
        console.log("Initial Route:", this.routeService.initialRoute);

        // Output debug information in console
        if (electron.isElectron) {
            console.log("> DESKTOP MODE");
            console.log("Application Config:", AppConfig);
            console.log("Process Environment:", process.env);
            console.log("Electron `ipcRenderer`", electron.ipcRenderer);
            console.log("Node `childProcess`", electron.childProcess);
        } else {
            console.log("> WEB MODE");
            console.log("Application Config:", AppConfig);
        }
    }

    /**
     * Open a modal confirming clearing of stored Connections
     */
    public openExitModal(): void {
        this.modalService.confirm({
            nzTitle: "Confirm Log Out",
            nzContent:
                "Are you sure you want to log out? You will be forced to re-do the Setup after confirming.<br><br>",
            nzOkText: "Log Out",
            nzOkType: "danger",
            nzOnOk: () => {
                this.core.clearConnections();
            },
            nzCancelText: "Cancel",
        });
    }
}
