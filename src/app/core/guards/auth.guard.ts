import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ManagementService } from "../services/management/management.service";
import { MetricsService } from "../services/metrics/metrics.service";

@Injectable()
export class CanActivateRouteGuard implements CanActivate {
    constructor(private router: Router, private management: ManagementService, private metrics: MetricsService) {}

    /**
     * Returns a boolean if a Route can be accessed, does so by checking if both management and metrics connections are set
     */
    public canActivate(): boolean {
        if (this.management.connection && this.metrics.connection) {
            return true;
        } else {
            this.router.navigate(["/"]);
            return false;
        }
    }
}
