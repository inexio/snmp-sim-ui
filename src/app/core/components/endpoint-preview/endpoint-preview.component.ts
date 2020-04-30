import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzDrawerService, NzMessageService, NzModalService } from "ng-zorro-antd";
import { AttachTagsComponent } from "../../drawer/attach-tags/attach-tags.component";
import { Endpoint } from "../../interfaces/endpoint.interface";
import { ManagementService } from "../../services/management/management.service";

@Component({
    selector: "app-endpoint-preview",
    templateUrl: "./endpoint-preview.component.html",
    styleUrls: ["./endpoint-preview.component.css"],
})
export class EndpointPreviewComponent implements OnInit {
    /**
     * Endpoint as given through input from engine data
     */
    @Input() public endpoint: Endpoint;

    /**
     * Request status of endpoint update request,
     * default is success since full endpoint is already given at init
     */
    public endpointRequestStatus: "idle" | "pending" | "success" | "error" = "success";

    /**
     * Set up new Event Emitter emitting when Endpoint was deleted
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
        if (this.endpoint.tags.length > 0 && !this.endpoint.tags[0].meta) {
            this.endpoint.tags = this.management.parseTags(this.endpoint.tags);
        }
    }

    /**
     * Copies given string to clipboard and shows success message
     * @param text String to copy to clipboard
     */
    public copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
        this.message.success("Successfully copied to clipboard!");
    }

    /**
     * Updates engine information
     */
    public updateEndpoint() {
        this.endpointRequestStatus = "pending";
        this.management.getEndpoint(this.endpoint.id).subscribe({
            next: (endpoint) => {
                this.endpointRequestStatus = "success";
                this.endpoint = endpoint;
            },
            error: (error) => {
                this.endpointRequestStatus = "error";
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
                type: "endpoint",
                attachedTags: this.endpoint.tags,
                targetId: this.endpoint.id,
                targetName: this.endpoint.name,
            },
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.updateEndpoint();
        });
    }

    /**
     * Opens a modal making the user confirm the deletion of this Endpoint
     */
    public deleteEndpoint(): void {
        // Show confirmation dialog
        this.modal.confirm({
            nzTitle: "Confirm Endpoint Deletion",
            nzContent: `Are you sure you want to delete Endpoint "${this.endpoint.name}"?`,
            nzOkText: "Delete",
            nzOkType: "danger",
            nzOnOk: () => {
                const pendingMessage = this.message.loading("Deleting Endpoint...").messageId;

                this.management.deleteEndpoint(this.endpoint.id).subscribe({
                    next: () => {
                        this.message.remove(pendingMessage);
                        this.message.create("success", "Endpoint deleted!");
                        this.delete.emit("Endpoint deleted");
                    },
                    error: (error) => {
                        this.message.remove(pendingMessage);
                        this.message.create("error", "Error deleting Endpoint!");
                        console.error(error);
                    },
                });
            },
            nzCancelText: "Cancel",
        });
    }
}
