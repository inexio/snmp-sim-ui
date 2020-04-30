import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ChartComponent } from "ng-apexcharts";
import { NzDrawerService, NzMessageService, NzModalService } from "ng-zorro-antd";
import { AttachTagsComponent } from "../../drawer/attach-tags/attach-tags.component";
import { Lab } from "../../interfaces/lab.interface";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";

@Component({
    selector: "app-lab-preview",
    templateUrl: "./lab-preview.component.html",
    styleUrls: ["./lab-preview.component.css"],
})
export class LabPreviewComponent implements OnInit {
    @ViewChild("chart") public chart: ChartComponent;

    @Input() public lab: Lab;

    public chartOptions: Partial<any>;

    public labPowerRequest: "idle" | "pending" | "success" | "error" = "idle";

    public labRestartRequest: "idle" | "pending" | "success" | "error" = "idle";

    public tags: Tag[] = [];

    @Output() public delete: EventEmitter<Lab> = new EventEmitter();

    constructor(
        public router: Router,
        private message: NzMessageService,
        private modal: NzModalService,
        private drawer: NzDrawerService,
        private management: ManagementService,
    ) {
        this.chartOptions = {
            series: [],
            chart: {
                height: 150,
                type: "area",
                stroke: {
                    curve: "smooth",
                },
                sparkline: {
                    enabled: true,
                },
            },
            xaxis: {
                categories: [],
            },
            yaxis: {
                // min: 0,
            },
        };
    }

    ngOnInit(): void {
        // Generate random data for graphs until metrics endpoint is working
        this.addRandomData(75, 100);
        this.addRandomData(50, 75);
    }

    public getLab(): void {
        this.management.getLab(this.lab.id).subscribe({
            next: (lab) => {
                this.lab = lab;
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    public switchPower(): void {
        this.labPowerRequest = "pending";
        const pendingMessage = this.message.loading(`Powering Lab ${this.lab.power === "on" ? "off" : "on"}...`)
            .messageId;

        this.management.powerLab(this.lab.id, this.lab.power === "on" ? "off" : "on").subscribe({
            next: (lab) => {
                this.lab = lab;
                this.labPowerRequest = "success";

                // Update loading message
                this.message.remove(pendingMessage);
                this.message.create("success", `Lab powered ${this.lab.power}!`);
            },
            error: (error) => {
                console.error(error);
                this.labPowerRequest = "error";

                // Update loading message
                this.message.remove(pendingMessage);
                this.message.create("success", `Error powering Lab ${this.lab.power === "on" ? "off" : "on"}!`);
            },
        });
    }

    public restartLab(): void {
        const loadingMessage = this.message.loading(`Restarting Lab...`).messageId;
        this.labRestartRequest = "pending";

        this.management.restartLab(this.lab.id).subscribe({
            next: (lab) => {
                this.lab = lab;

                this.message.remove(loadingMessage);
                this.message.create("success", "Restarted Lab!");
                this.labRestartRequest = "success";
            },
            error: () => {
                this.message.remove(loadingMessage);
                this.message.create("error", "Error restarting Lab");
                this.labRestartRequest = "error";
            },
        });
    }

    /**
     * Temporary method to generate some random chart data
     */
    public addRandomData(min: number, max: number): void {
        const series = {
            name: "Packets/m",
            data: [],
        };
        const categories = [];

        for (let i = 0; i < 25; i++) {
            series.data.push(Math.floor(Math.random() * (max - min + 1)) + min);
            categories.push(
                `${moment()
                    .add(i, "minutes")
                    .format("L")} ${moment()
                    .add(i, "minutes")
                    .format("LT")}`,
            );
        }

        this.chartOptions.series.push(series);
        this.chartOptions.xaxis.categories = categories;
    }

    /**
     * Opens a modal making the user confirm deletion of Lab
     * @param lab Lab object to delete
     */
    public deleteLab(): void {
        // Show confirmation dialog
        this.modal.confirm({
            nzTitle: "Confirm Lab Deletion",
            nzContent: `Are you sure you want to delete the lab "${this.lab.name}"? If you delete the tag, it will be removed from all connected Labs, Agents, Engines, Endpoints, and Users.`,
            nzOkText: "Delete",
            nzOkType: "danger",
            nzOnOk: () => {
                const pendingMessage = this.message.loading("Deleting Lab...").messageId;

                this.management.deleteLab(this.lab.id).subscribe({
                    next: () => {
                        this.message.remove(pendingMessage);
                        this.message.create("success", "Lab deleted!");
                        this.delete.emit(this.lab);
                    },
                    error: (error) => {
                        this.message.remove(pendingMessage);
                        this.message.create("error", "Error deleting Lab!");
                        console.error(error);
                    },
                });
            },
            nzCancelText: "Cancel",
        });
    }

    /**
     * Opens a drawer where the user can edit Tags attached to Lab
     */
    public editTags() {
        const drawerRef = this.drawer.create<AttachTagsComponent, any, string>({
            nzTitle: "Edit Tags",
            nzContent: AttachTagsComponent,
            nzWidth: "350px",
            nzContentParams: {
                type: "lab",
                attachedTags: this.lab.tags,
                targetId: this.lab.id,
                targetName: this.lab.name,
            },
        });

        /**
         * Get updated Lab with new Tags
         */
        drawerRef.afterClose.subscribe(() => {
            this.getLab();
        });
    }
}
