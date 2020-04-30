import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzDrawerService, NzMessageService, NzModalService } from "ng-zorro-antd";
import { AttachTagsComponent } from "../../drawer/attach-tags/attach-tags.component";
import { UserKeysComponent } from "../../drawer/user-keys/user-keys.component";
import { User } from "../../interfaces/user.interface";
import { ManagementService } from "../../services/management/management.service";

@Component({
    selector: "app-user-preview",
    templateUrl: "./user-preview.component.html",
    styleUrls: ["./user-preview.component.css"],
})
export class UserPreviewComponent implements OnInit {
    /**
     * User as given through input from engine data
     */
    @Input() public user: User;

    /**
     * Request status of user update request,
     * default is success since full user is already given at init
     */
    public userRequestStatus: "idle" | "pending" | "success" | "error" = "success";

    /**
     * Set up new Event Emitter emitting when User was deleted
     */
    @Output() public delete: EventEmitter<string> = new EventEmitter();

    constructor(
        private message: NzMessageService,
        private drawer: NzDrawerService,
        private modal: NzModalService,
        private management: ManagementService,
    ) {}

    ngOnInit(): void {
        // Parse tags if they havent been parsed already
        if (this.user.tags.length > 0 && !this.user.tags[0].meta) {
            this.user.tags = this.management.parseTags(this.user.tags);
        }
    }

    /**
     * Copies given string to clipboard and shows success message
     * @param text String to copy to clipboard
     */
    public copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
        this.message.success("Copied to clipboard!");
    }

    /**
     * Updates engine information
     */
    public updateUser() {
        this.userRequestStatus = "pending";
        this.management.getUser(this.user.id).subscribe({
            next: (user) => {
                this.userRequestStatus = "success";
                this.user = user;
            },
            error: (error) => {
                this.userRequestStatus = "error";
                console.error(error);
            },
        });
    }

    /**
     * Opens a drawer where the user can edit the tags of the given Agent
     */
    public openEditTagsDrawer() {
        const drawerRef = this.drawer.create<AttachTagsComponent, any, string>({
            nzTitle: "Edit Tags",
            nzContent: AttachTagsComponent,
            nzWidth: "350px",
            nzContentParams: {
                type: "user",
                attachedTags: this.user.tags,
                targetId: this.user.id,
                targetName: this.user.name,
            },
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.updateUser();
        });
    }

    /**
     * Opens a drawer containing the Users Auth and Priv. keys
     */
    public openKeysDrawer() {
        this.drawer.create<UserKeysComponent, any, string>({
            nzTitle: "Auth Keys",
            nzContent: UserKeysComponent,
            nzWidth: "350px",
            nzContentParams: {
                user: this.user,
            },
        });
    }

    /**
     * Opens a modal making the user confirm the deletion of this agent
     */
    public deleteUser(): void {
        // Show confirmation dialog
        this.modal.confirm({
            nzTitle: "Confirm User Deletion",
            nzContent: `Are you sure you want to delete User "${this.user.name}"?`,
            nzOkText: "Delete",
            nzOkType: "danger",
            nzOnOk: () => {
                const pendingMessage = this.message.loading("Deleting User...").messageId;

                this.management.deleteUser(this.user.id).subscribe({
                    next: () => {
                        this.message.remove(pendingMessage);
                        this.message.create("success", "User deleted!");
                        this.delete.emit("User deleted");
                    },
                    error: (error) => {
                        this.message.remove(pendingMessage);
                        this.message.create("error", "Error deleting User!");
                        console.error(error);
                    },
                });
            },
            nzCancelText: "Cancel",
        });
    }
}
