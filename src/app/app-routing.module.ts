import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanActivateRouteGuard } from "./core/guards/auth.guard";
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
import { ConsolesComponent } from "./pages/metrics/consoles/consoles.component";
import { ProcessesComponent } from "./pages/metrics/processes/processes.component";

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: HomeComponent,
    },
    {
        path: "settings",
        component: SettingsComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "search",
        component: SearchComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/labs",
        component: LabsComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/labs/:labId",
        component: LabComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/labs/:labId/:agentId",
        component: LabComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/labs/:labId/:agentId/:engineId",
        component: LabComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/tags",
        component: TagsComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/record-files",
        component: RecordFilesComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/agents",
        component: AgentsComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/engines",
        component: EnginesComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/endpoints",
        component: EndpointsComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "manage/users",
        component: UsersComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "metrics/processes",
        component: ProcessesComponent,
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "metrics/consoles",
        redirectTo: "metrics/processes",
        canActivate: [CanActivateRouteGuard],
    },
    {
        path: "metrics/consoles/:id",
        component: ConsolesComponent,
        canActivate: [CanActivateRouteGuard],
    },

    /**
     * Not found rewrite
     */
    {
        path: "**",
        redirectTo: "/",
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
