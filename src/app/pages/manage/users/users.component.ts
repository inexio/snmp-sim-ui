import { Component, OnInit } from "@angular/core";
import { NzDrawerService } from "ng-zorro-antd";
import { CreateUserComponent } from "../../../core/drawer/create-user/create-user.component";
import { User } from "../../../core/interfaces/user.interface";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
    /**
     * Array of users to display
     */
    public users: User[] = [];

    constructor(private management: ManagementService, private drawer: NzDrawerService) {}

    ngOnInit(): void {
        this.updateUsers();
    }

    public updateUsers(): void {
        this.management.getUsers().subscribe({
            next: (users) => {
                this.users = users;
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new User
     */
    public openCreateUserDrawer(): void {
        const drawerRef = this.drawer.create<CreateUserComponent, any, string>({
            nzTitle: "Create New User",
            nzContent: CreateUserComponent,
            nzWidth: "350px",
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            console.log("Closed");
        });
    }
}
