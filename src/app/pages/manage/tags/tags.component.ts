import { Component, OnInit } from "@angular/core";
import { NzDrawerService, NzMessageService, NzModalService } from "ng-zorro-antd";
import { CreateTagComponent } from "../../../core/drawer/create-tag/create-tag.component";
import { Tag } from "../../../core/interfaces/tag.interface";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-tags",
    templateUrl: "./tags.component.html",
    styleUrls: ["./tags.component.css"],
})
export class TagsComponent implements OnInit {
    /**
     * Local list of Tags, used for cross referencing
     */
    public tags: Tag[];

    /**
     * Parsed list of Tags so it can be displayed in the collapse component
     */
    public panels: any[];

    /**
     * List of available tag colors to choose from
     */
    public tagColors: string[] = [
        "red",
        "volcano",
        "orange",
        "gold",
        "lime",
        "green",
        "cyan",
        "blue",
        "geekblue",
        "purple",
        "magenta",
    ];

    constructor(
        private management: ManagementService,
        private modalService: NzModalService,
        private message: NzMessageService,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        // Update List of tags
        this.getTags();
    }

    /**
     * Gets List of all Tags, parses them into needed format to display
     */
    public getTags(): void {
        this.management.getTags().subscribe({
            next: (tags) => {
                console.log("Tags:", tags);
                this.tags = tags;
                this.panels = tags.map((tag) => {
                    return {
                        active: false,
                        disabled: false,
                        name: tag.name,
                        customStyle: {
                            background: "#ffffff",
                            "border-radius": "4px",
                            "margin-bottom": "20px",
                        },
                        tag,
                    };
                });
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    /**
     * Opens a modal making the user confirm the deletion of given tag
     * @param tagId Id of the tag to delete
     */
    public deleteTag(tagId: number): void {
        // Show confirmation dialog
        this.modalService.confirm({
            nzTitle: "Confirm Tag Deletion",
            nzContent:
                "Are you sure you want to delete this Tag? If you delete the tag, it will be removed from all connected Labs, Agents, Engines, Endpoints, and Users.",
            nzOkText: "Delete",
            nzOkType: "danger",
            nzOnOk: () => {
                const pendingMessage = this.message.loading("Deleting Tag...").messageId;

                this.management.deleteTag(tagId).subscribe({
                    next: () => {
                        this.message.remove(pendingMessage);
                        this.message.create("success", "Tag deleted!");
                        this.getTags();
                    },
                    error: (error) => {
                        this.message.remove(pendingMessage);
                        this.message.create("error", "Error deleting Tag!");
                        console.error(error);
                    },
                });
            },
            nzCancelText: "Cancel",
        });
    }

    /**
     * Opens a modal where the user can create a new tag
     */
    public createNewTag(): void {
        const drawerRef = this.drawer.create<CreateTagComponent, { type: string }, string>({
            nzTitle: "Create New Tag",
            nzContent: CreateTagComponent,
            nzWidth: "350px",
        });

        // Update tags after a new one was created
        drawerRef.afterClose.subscribe((tag) => {
            if (tag) {
                this.getTags();
            }
        });
    }
}
