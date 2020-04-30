import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { zip } from "rxjs";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateTagComponent } from "../create-tag/create-tag.component";

@Component({
    selector: "app-attach-tags",
    templateUrl: "./attach-tags.component.html",
    styleUrls: ["./attach-tags.component.css"],
})
export class AttachTagsComponent implements OnInit {
    /**
     * Type of the object we're adding/removing tags to, used to determine the request type
     */
    @Input() public type: "lab" | "agent" | "engine" | "endpoint" | "user";

    /**
     * Id of the Lab, Agent, Engine, ... to add/remove tags to/from
     */
    @Input() public targetId: number | string;

    /**
     * Name of the target object, just for display purposes
     */
    @Input() public targetName: string;

    /**
     * Array of Tags already applied to the given Lab, Agent, Engine, ...,
     * this shall not be edited
     */
    @Input() public attachedTags: Tag[] = [];

    /**
     * Status of the http requests adding/removing tags
     */
    public updateTagsStatus: "idle" | "pending" | "success" | "error" = "idle";

    /**
     * Array of Tag ids that are selected, model of the select component
     */
    public selectedTags: (number | string)[] = [];

    /**
     * Array of available Tags to add/remove
     */
    public availableTags: Tag[] = [];

    constructor(
        private management: ManagementService,
        private drawer: NzDrawerService,
        private drawerRef: NzDrawerRef<any>,
    ) {}

    ngOnInit(): void {
        // Get list of available Tags to choose from
        this.getAvailableTags();
    }

    /**
     * Gets a list of all available tags and filters out currently applied tags
     */
    public getAvailableTags(): void {
        this.management.getTags().subscribe({
            next: (tags) => {
                this.availableTags = tags;
                this.selectedTags = this.attachedTags.map((tag) => tag.id);
            },
        });
    }

    /**
     * Attach newly selected Tags, remove deselected Tags
     */
    public updateTags(): void {
        const tagsToAdd = this.availableTags
            .filter((available) => {
                return (
                    !this.attachedTags.some((applied) => applied.id === available.id) &&
                    this.selectedTags.some((selected) => selected === available.id)
                );
            })
            .map((tag) => tag.id);

        const tagsToRemove = this.availableTags
            .filter((available) => {
                return (
                    this.attachedTags.some((applied) => applied.id === available.id) &&
                    !this.selectedTags.some((selected) => selected === available.id)
                );
            })
            .map((tag) => tag.id);

        this.updateTagsStatus = "pending";

        zip(
            this.management.attachTags(this.type, tagsToAdd, this.targetId),
            this.management.detachTags(this.type, tagsToRemove, this.targetId),
        ).subscribe({
            next: () => {
                this.updateTagsStatus = "success";
                this.close();
            },
            error: (error) => {
                this.updateTagsStatus = "error";
                console.error(error);
            },
        });
    }

    /**
     * Opens a drawer where the user can create a new tag
     */
    public createNewTag(): void {
        this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) + 175;
        const drawerRef = this.drawer.create<CreateTagComponent, { type: string }, string>({
            nzTitle: "Create New Tag",
            nzContent: CreateTagComponent,
            nzWidth: "350px",
        });

        // Update tags after a new one was created
        drawerRef.afterClose.subscribe((tag) => {
            this.drawerRef.nzOffsetX = Number(this.drawerRef.nzOffsetX) - 175;
            if (tag) {
                this.getAvailableTags();
            }
        });
    }

    /**
     * Closes the current drawer
     */
    public close(): void {
        this.drawerRef.close();
    }
}
