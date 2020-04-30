import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class RouteService {
    public initialRoute: string;

    constructor(private router: Router) {
        /**
         * Listen for route changes to get initial url when page was first loaded,
         * we use this to redirect to after the async auth check
         */
        const initialRouteSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationStart))
            .subscribe(({ url }: NavigationStart) => {
                this.initialRoute = url;

                // Unsubscribe after first event
                initialRouteSubscription.unsubscribe();
            });
    }
}
