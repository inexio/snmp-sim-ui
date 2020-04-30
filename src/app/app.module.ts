import "reflect-metadata";
import "../polyfills";

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

import { AppRoutingModule } from "./app-routing.module";

/**
 * Angular Translations
 */
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppComponent } from "./app.component";

/**
 * Ant Design
 */
import { NgApexchartsModule } from "ng-apexcharts";
import {
    NzAlertModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzDividerModule,
    NzDropDownModule,
    NzEmptyModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzModalModule,
    NzNotificationModule,
    NzNotificationService,
    NzPopoverModule,
    NzSelectModule,
    NzSkeletonModule,
    NzStatisticModule,
    NzSwitchModule,
    NzTagModule,
    NzTreeModule,
    NzPaginationModule,
} from "ng-zorro-antd";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { CanActivateRouteGuard } from "./core/guards/auth.guard";
import { HttpErrorInterceptor } from "./core/interceptors/http-error.interceptor";
import { IconsProviderModule } from "./icons-provider.module";
import { HomeComponent } from "./pages/home/home.component";
import { AgentsComponent } from "./pages/manage/agents/agents.component";
import { EndpointsComponent } from "./pages/manage/endpoints/endpoints.component";
import { EnginesComponent } from "./pages/manage/engines/engines.component";
import { LabComponent } from "./pages/manage/lab/lab.component";
import { LabsComponent } from "./pages/manage/labs/labs.component";
import { RecordFilesComponent } from "./pages/manage/record-files/record-files.component";
import { TagsComponent } from "./pages/manage/tags/tags.component";
import { UsersComponent } from "./pages/manage/users/users.component";
import { SearchComponent } from "./pages/search/search.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { WelcomeComponent } from "./pages/welcome/welcome.component";
import { ConsolesComponent } from "./pages/metrics/consoles/consoles.component";
import { ProcessesComponent } from "./pages/metrics/processes/processes.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LabsComponent,
        SearchComponent,
        SettingsComponent,
        LabComponent,
        TagsComponent,
        RecordFilesComponent,
        WelcomeComponent,
        AgentsComponent,
        EnginesComponent,
        EndpointsComponent,
        UsersComponent,
        ConsolesComponent,
        ProcessesComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        IconsProviderModule,
        NzLayoutModule,
        NzMenuModule,
        NzButtonModule,
        NzIconModule,
        NzBreadCrumbModule,
        NzCardModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        HttpClientModule,
        ReactiveFormsModule,
        NzFormModule,
        NzMessageModule,
        NzCollapseModule,
        NzTagModule,
        NzNotificationModule,
        NzModalModule,
        NzDividerModule,
        NzCheckboxModule,
        NzSkeletonModule,
        NzTreeModule,
        NzDropDownModule,
        NzStatisticModule,
        NzAlertModule,
        NgApexchartsModule,
        NzEmptyModule,
        NzSwitchModule,
        NzPopoverModule,
        NzPaginationModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
            deps: [NzNotificationService],
        },
        CanActivateRouteGuard,
    ],
    bootstrap: [AppComponent],
    entryComponents: [],
})
export class AppModule {}
