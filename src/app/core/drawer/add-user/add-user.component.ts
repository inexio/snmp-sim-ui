import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Engine } from "../../interfaces/engine.interface";
import { User } from "../../interfaces/user.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateUserComponent } from "../create-user/create-user.component";

@Component({
    selector: "app-add-user",
    templateUrl: "./add-user.component.html",
    styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
    /**
     * Engine selected Users will be added to
     */
    @Input() public engine: Engine;

    /**
     * Status of the http request/s adding Users to Engine
     */
    public addUsersStatus: "idle" | "pending" | "success" | "error" = "idle";

    public selectedUsers: (string | number)[] = [];
    public availableUsers: User[] = [];

    constructor(
        private management: ManagementService,
        private drawerRef: NzDrawerRef,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        this.getAvailableUsers();
        console.log(this);
    }

    public getAvailableUsers(): void {
        this.management.getUsers().subscribe({
            next: (users) => {
                this.availableUsers = users.filter((user) => {
                    return !this.engine.users.some((u) => u.id === user.id);
                });
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new User
     */
    public createNewUser(): void {
        this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) + 175;
        const drawerRef = this.drawer.create<CreateUserComponent, { type: string }, string>({
            nzTitle: "Create New User",
            nzContent: CreateUserComponent,
            nzWidth: "350px",
        });

        // Update available Users after a new one was created
        drawerRef.afterClose.subscribe(() => {
            this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) - 175;
            this.getAvailableUsers();
        });
    }

    /**
     * Adds selected Endpoints to Engine
     */
    public addUsers(): void {
        this.addUsersStatus = "pending";

        this.management.addUsersToEngines(this.selectedUsers, [this.engine.id]).subscribe({
            next: () => {
                this.addUsersStatus = "success";
                this.close();
            },
            error: (error) => {
                this.addUsersStatus = "error";
                console.error(error);
            },
        });
    }

    /**
     * Closes the current drawer
     */
    public close(): void {
        this.drawerRef.close();
    }
}
