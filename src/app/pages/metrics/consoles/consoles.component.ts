import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MetricsService } from "../../../core/services/metrics/metrics.service";
import { ConsolePage } from "../../../core/interfaces/console-page.interface";
import * as moment from "moment";

@Component({
    selector: "app-consoles",
    templateUrl: "./consoles.component.html",
    styleUrls: ["./consoles.component.css"],
})
export class ConsolesComponent implements OnInit {
    @ViewChild("console", { static: false }) console: ElementRef<any>;

    /**
     * Id of the process to display Console outputs for
     */
    public processId: number;

    /**
     * Array of ConsolePages to display
     */
    public pages: ConsolePage[] = [];

    /**
     * Array of text bodies of given Console Pages
     */
    public consolePages: string[] = [];

    /**
     * String when the last pages were fetched
     */
    public lastUpdate: moment.Moment;

    /**
     * Complete console text
     */
    public completeText: string;

    constructor(private route: ActivatedRoute, private metrics: MetricsService) {
        this.route.params.subscribe((params) => {
            this.processId = params.id;
        });
    }

    ngOnInit(): void {
        // Get all available ConsolePages for this Process
        this.getPages();
    }

    public getPages(): void {
        this.consolePages = [];

        this.metrics.getConsolePages(this.processId).subscribe({
            next: (pages) => {
                this.lastUpdate = moment();

                this.consolePages = pages.map((p) => p.text);
                setTimeout(() => {
                    this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
                }, 500);
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
}
