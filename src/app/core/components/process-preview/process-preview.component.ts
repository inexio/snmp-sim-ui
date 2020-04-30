import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";
import { Process } from "../../interfaces/process.interface";
import { Router } from "@angular/router";

@Component({
    selector: "app-process-preview",
    templateUrl: "./process-preview.component.html",
    styleUrls: ["./process-preview.component.css"],
})
export class ProcessPreviewComponent implements OnInit {
    /**
     * Process object to display stats for
     */
    @Input() public process: Process;

    constructor(public router: Router) {}

    ngOnInit(): void {
        this.process.last_update = moment(this.process.last_update).format("LLL");
    }
}
