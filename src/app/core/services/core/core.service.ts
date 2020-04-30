import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { version } from "../../../../../package.json";
import { Connection } from "../../interfaces/connection.interface";
import { ManagementService } from "../management/management.service";
import { MetricsService } from "../metrics/metrics.service";

@Injectable({
    providedIn: "root",
})
export class CoreService {
    /**
     * Boolean if Connections have been validated
     */
    public validated = false;

    /**
     * Current App theme
     */
    public theme: "light" | "dark" = "light";

    /**
     * Current Code theme
     */
    public codeTheme: "light" | "dark" = "light";

    /**
     * Model value of the theme switch, true = light, false = dark
     */
    public themeSwitch = true;

    constructor(private http: HttpClient, private metrics: MetricsService, private management: ManagementService) {
        this.getLatestVersion().subscribe({
            next: (latestVersion) => {
                console.log(latestVersion);
            },
        });
    }

    public changeTheme() {
        this.theme = this.themeSwitch ? "dark" : "light";
        console.log(this.theme);
    }

    /**
     * Toggles embedded code preview theme
     */
    public changeCodeTheme(): void {
        this.codeTheme = this.codeTheme === "dark" ? "light" : "dark";
    }

    public getLatestVersion(): Observable<string> {
        return this.http
            .get<any>(
                "https://raw.githubusercontent.com/inexio/snmp-sim-ui/master/package.json?token=AG46OZWUHPIJVD3Z6VEVLZ26WAA34",
            )
            .pipe(
                map((data) => {
                    if (version === data.version) {
                        console.log("Version matches!");
                    }
                    return data.version;
                }),
            );
    }

    /**
     * Check if a Connection has been previously validated, returns
     * a Promise resolving found connection. Also saves connection
     * inside this.Connection if it is not set yet
     */
    public getStoredConnections(): Promise<{ management: Connection; metrics: Connection }> {
        return new Promise((resolve, reject) => {
            if (this.metrics.connection && this.management.connection) {
                setTimeout(() => {
                    this.validated = true;
                    resolve({
                        management: this.management.connection,
                        metrics: this.metrics.connection,
                    });
                }, 1000);
            } else if (localStorage.getItem("snmp-connections")) {
                const connections: { management: Connection; metrics: Connection } = JSON.parse(
                    localStorage.getItem("snmp-connections"),
                );

                setTimeout(() => {
                    this.management.connection = connections.management;
                    this.metrics.connection = connections.metrics;

                    this.validated = true;
                    resolve({
                        management: this.management.connection,
                        metrics: this.metrics.connection,
                    });
                }, 1000);
            } else {
                setTimeout(() => {
                    reject("No connection found");
                }, 1000);
            }
        });
    }

    /**
     * Store given Connections inside localStorage
     * @param connections Connections object to store in localStorage
     */
    public storeConnections(connections: { management: Connection; metrics: Connection }): void {
        localStorage.setItem("snmp-connections", JSON.stringify(connections));
    }

    /**
     * Remove stored Connections from localStorage and corresponding Service
     */
    public clearConnections(): void {
        this.management.connection = null;
        this.metrics.connection = null;
        this.validated = false;

        localStorage.removeItem("snmp-connections");
    }
}
