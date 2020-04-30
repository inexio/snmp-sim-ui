import { Component, OnInit } from "@angular/core";
import { MetricsService } from "../../../core/services/metrics/metrics.service";
import { Process } from "../../../core/interfaces/process.interface";

@Component({
    selector: "app-processes",
    templateUrl: "./processes.component.html",
    styleUrls: ["./processes.component.css"],
})
export class ProcessesComponent implements OnInit {
    /**
     * Running SNMP Processes
     */
    public processes: Process[] = [];

    constructor(private metrics: MetricsService) {}

    ngOnInit(): void {
        this.metrics.getProcesses().subscribe({
            next: (processes) => {
                this.processes = processes;
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
}
