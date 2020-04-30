import { Component } from "@angular/core";
import { NzDrawerRef, NzMessageService } from "ng-zorro-antd";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";

@Component({
    selector: "app-create-tag",
    templateUrl: "./create-tag.component.html",
    styleUrls: ["./create-tag.component.css"],
})
export class CreateTagComponent {
    /**
     * List of available color presets
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

    /**
     * Selected color, defaulting to blue
     */
    public color = "blue";

    /**
     * Given tag name
     */
    public name = "";

    /**
     * Given tag description
     */
    public description: string;

    /**
     * Request status of the tag creation
     */
    public createTagStatus: "idle" | "pending" | "error" | "success" = "idle";

    constructor(
        private drawerRef: NzDrawerRef<Tag>,
        private management: ManagementService,
        private message: NzMessageService,
    ) {}

    /**
     * Create a new tag with given information
     */
    public createTag(): void {
        this.createTagStatus = "pending";
        this.management
            .createTag({
                name: this.name,
                meta: {
                    description: this.description,
                    color: this.color,
                },
            })
            .subscribe({
                next: (tag) => {
                    this.createTagStatus = "success";
                    this.drawerRef.close(tag);
                    this.message.create("success", "Tag created!");
                },
                error: (error) => {
                    console.error(error);
                    this.createTagStatus = "error";
                    this.message.create("error", "Error creating Tag!");
                },
            });
    }

    /**
     * Cancel and close drawer
     */
    public cancel(): void {
        this.drawerRef.close(null);
    }
}
