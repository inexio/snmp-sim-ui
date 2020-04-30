import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Observable, of, zip } from "rxjs";
import { map } from "rxjs/operators";
import { ManagementService } from "../../core/services/management/management.service";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
    public query = "";
    public allObjects: any[] = [];

    constructor(private http: HttpClient, private management: ManagementService) {}

    ngOnInit(): void {
        this.getAvailableObjects().subscribe({
            next: (data) => {
                data.map((d) => {
                    this.allObjects.push(d);
                });
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    public getAvailableObjects(): Observable<any> {
        const resources: string[] = [
            "/snmpsim/mgmt/v1/endpoints",
            "/snmpsim/mgmt/v1/users",
            "/snmpsim/mgmt/v1/engines",
            "/snmpsim/mgmt/v1/agents",
            "/snmpsim/mgmt/v1/labs",
        ];
        const requests: Observable<any>[] = [];

        resources.map((resource) => {
            requests.push(
                this.http
                    .get<any>(this.management.getRequestUrl(resource), {
                        headers: this.management.getAuthHeaders(),
                        withCredentials: true,
                    })
                    .pipe(
                        map((objects: any) => {
                            return objects.map((object) => {
                                object.tags = this.management.parseTags(object.tags);
                                return object;
                            });
                        }),
                    ),
            );
        });

        return requests.length === 0 ? of(null) : zip(...requests).pipe();
    }
}
