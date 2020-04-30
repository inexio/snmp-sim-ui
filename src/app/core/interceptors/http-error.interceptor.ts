import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private notification: NzNotificationService) {}

    /**
     * Custom Error Handler
     * @param request HttpRequest object
     * @param next HttpHandler
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Get request path from full url
                const path = request.url.match(/https?:\/\/[^\/]+\/([^?]+)/)[1];

                // Different handling for client side requests
                if (error.error instanceof ErrorEvent) {
                    this.notification.create("error", "Error making request. (Client Side)", error.error.message);
                    return throwError(error.error.message);
                } else {
                    this.notification.create(
                        "error",
                        `Error making ${request.method} request.`,
                        `${request.method} request <span class="code">/${path}</span> failed with error code ${error.status}.<div class="code">${error.error.message}</div>`,
                        {
                            nzDuration: 0, // Doesn't disappear until user clicks it away
                        },
                    );
                    return throwError(`Response Status ${error.status}: ${error.message}`);
                }
            }),
        );
    }
}
