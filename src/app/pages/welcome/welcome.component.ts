import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { zip } from "rxjs";
import { map } from "rxjs/operators";
import { Connection } from "../../core/interfaces/connection.interface";
import { CoreService } from "../../core/services/core/core.service";
import { ManagementService } from "../../core/services/management/management.service";
import { MetricsService } from "../../core/services/metrics/metrics.service";
import { RouteService } from "../../core/services/route/route.service";

@Component({
    selector: "app-welcome",
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent implements OnInit {
    public currentStep: "loading" | "welcome" | "management" | "metrics" | "review" | "success" = "loading";

    /**
     * Management API Connection
     */
    public managementConnection: Connection = {
        protocol: "https",
        address: "",
        port: null,
        authentication: {
            type: "basic",
            enabled: false,
            username: "",
            password: "",
        },
    };

    /**
     * Metrics API Connection
     */
    public metricsConnection: Connection = {
        protocol: "https",
        address: "",
        port: null,
        authentication: {
            type: "basic",
            enabled: false,
            username: "",
            password: "",
        },
    };

    /**
     * Boolean if Connections are stored in localStorage
     */
    public storeConnection = true;

    /**
     * Boolean if password inputs show uncensored password
     */
    public passwordVisible = false;

    constructor(
        private router: Router,
        private message: NzMessageService,
        private routeService: RouteService,
        private metrics: MetricsService,
        private management: ManagementService,
        private core: CoreService,
    ) {}

    ngOnInit(): void {
        // Check for locally stored connection, display loading skeleton meanwhile
        this.currentStep = "loading";
        this.core
            .getStoredConnections()
            .then((connections) => {
                console.log("Found privously validated Connections:", connections);
                this.router.navigate([this.routeService.initialRoute]);
            })
            .catch(() => {
                console.log("Couldn't find any previously validated Connections");
                this.currentStep = "welcome";
            });
    }

    public goTo(step: "loading" | "welcome" | "management" | "metrics" | "review" | "success"): void {
        this.currentStep = step;

        if (step === "metrics" && !this.metricsConnection.address) {
            this.metricsConnection.address = this.managementConnection.address;
            this.metricsConnection.port = Number(this.managementConnection.port) + 1;
            this.metricsConnection.authentication = this.managementConnection.authentication;
        }
    }

    /**
     * Validate entered Connection details
     */
    public validateConnection(): void {
        // Display loading message
        const pendingMessage = this.message.loading("Validating Connection").messageId;

        // Validate both Management and Metrics Connection
        zip(
            this.management.validateConnection(this.managementConnection),
            this.metrics.validateConnection(this.metricsConnection),
        )
            .pipe(
                map((res) => {
                    return {
                        management: res[0],
                        metrics: res[1],
                    };
                }),
            )
            .subscribe({
                next: (connections) => {
                    this.message.remove(pendingMessage);
                    this.message.create("success", "Connection validated");

                    this.management.connection = connections.management;
                    this.metrics.connection = connections.metrics;

                    if (this.storeConnection) {
                        this.core.storeConnections(connections);
                    }

                    this.currentStep = "success";

                    setTimeout(() => {
                        this.core.validated = true;
                    }, 3000);
                },
                error: (error) => {
                    console.error(error);

                    this.message.remove(pendingMessage);
                    this.message.create("error", "Error validating Connection");

                    this.currentStep = "review";
                },
            });
    }
}
