import { Component } from "@angular/core";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent {
    public quickAccess = [
        {
            title: "Labs",
            icon: "assets/images/icons/lab.svg",
            routerLink: "/manage/labs",
            category: "Manage",
        },
        {
            title: "Agents",
            icon: "assets/images/icons/agent.svg",
            routerLink: "/manage/agents",
            category: "Manage",
        },
        {
            title: "Engines",
            icon: "assets/images/icons/engine.svg",
            routerLink: "/manage/engines",
            category: "Manage",
        },
        {
            title: "Endpoints",
            icon: "assets/images/icons/endpoint.svg",
            routerLink: "/manage/endpoints",
            category: "Manage",
        },
        {
            title: "Users",
            icon: "assets/images/icons/user.svg",
            routerLink: "/manage/users",
            category: "Manage",
        },
        {
            title: "Record Files",
            icon: "assets/images/icons/recordfile.svg",
            routerLink: "/manage/record-files",
            category: "Manage",
        },
        {
            title: "Tags",
            icon: "assets/images/icons/tag.svg",
            routerLink: "/manage/tags",
            category: "Manage",
        },
        {
            title: "Processes",
            icon: "assets/images/icons/processes.svg",
            routerLink: "/metrics/processes",
            category: "Metrics",
        },
        {
            title: "Consoles",
            icon: "assets/images/icons/console.svg",
            routerLink: "/metrics/consoles",
            category: "Metrics",
        },
        // {
        //     title: "Packets",
        //     icon: "assets/images/icons/packets.svg",
        //     routerLink: "/metrics/packets",
        //     category: "Metrics",
        // },
    ];
}
