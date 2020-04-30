import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { delay, map } from "rxjs/operators";
import { Connection } from "../../interfaces/connection.interface";
import { Process } from "../../interfaces/process.interface";
import { ConsolePage } from "../../interfaces/console-page.interface";

@Injectable({
    providedIn: "root",
})
export class MetricsService {
    /**
     * Connection object for performing HTTP Requests
     */
    public connection: Connection;

    constructor(private http: HttpClient) {}

    /**
     * Returns request url for given connection
     * @param path Path to add to the base url
     */
    public getRequestUrl(path: string): string {
        const baseUrl = `${this.connection.protocol}://${this.connection.address}:${this.connection.port}`;
        const parsedPath = path.startsWith("/") ? path : `/${path}`;
        return baseUrl + parsedPath;
    }

    /**
     * Returns a HttpHeaders object containing Authentication header for current connection
     */
    public getAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        if (this.connection.authentication.enabled) {
            headers = headers.append(
                "Authorization",
                `Basic ${btoa(
                    `${this.connection.authentication.username}:${this.connection.authentication.password}`,
                )}`,
            );
        }

        return headers;
    }

    /**
     * Performs a sample HTTP request against the metrics endpoint to validate the given connection object
     * @param connection Connection object to perform request with
     */
    public validateConnection(connection: Connection): Observable<Connection> {
        return this.http
            .get<any>(
                `${connection.protocol}://${connection.address}:${connection.port}/snmpsim/metrics/v1/activity/packets`,
                {
                    headers: connection.authentication.enabled
                        ? new HttpHeaders({
                              Authorization: `Basic ${btoa(
                                  `${connection.authentication.username}:${connection.authentication.password}`,
                              )}`,
                          })
                        : null,
                    withCredentials: true,
                },
            )
            .pipe(
                map(() => {
                    connection.isValid = true;
                    return connection;
                }),
                delay(1000),
            );
    }

    /**
     * Get a list of all running Processes
     */
    public getProcesses(): Observable<Process[]> {
        return this.http.get<Process[]>(this.getRequestUrl("/snmpsim/metrics/v1/processes"), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }

    /**
     * Get all available ConsolePages for given Process id
     * @param process Id of the process to get ConsolePages for
     */
    public getConsolePages(process: number): Observable<ConsolePage[]> {
        return this.http.get<ConsolePage[]>(this.getRequestUrl(`/snmpsim/metrics/v1/consoles/${process}`), {
            headers: this.getAuthHeaders(),
            withCredentials: true,
        });
    }
}
