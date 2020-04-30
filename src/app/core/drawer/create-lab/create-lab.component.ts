import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateTagComponent } from "../create-tag/create-tag.component";

@Component({
    selector: "app-create-lab",
    templateUrl: "./create-lab.component.html",
    styleUrls: ["./create-lab.component.css"],
})
export class CreateLabComponent implements OnInit {
    public labForm: { name: string } = {
        name: "",
    };

    public selectedTag: Tag;

    public availableTags: Tag[] = [];

    public createLabStatus: "idle" | "pending" | "success" | "error" = "idle";

    constructor(
        private management: ManagementService,
        private drawer: NzDrawerService,
        private drawerRef: NzDrawerRef<any>,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.getAvailableTags();
    }

    /**
     * Gets a list of all available tags and filters out currently applied tags
     */
    public getAvailableTags(): void {
        this.management.getTags().subscribe({
            next: (tags) => {
                this.availableTags = tags;
            },
        });
    }

    public selectTag(tag: Tag): void {
        this.selectedTag = tag;
        this.availableTags = this.availableTags.filter((t) => t.id !== tag.id);
    }

    public deselectTag(tag: Tag): void {
        this.selectedTag = undefined;
        this.availableTags.push(tag);
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

    public createLab(): void {
        this.createLabStatus = "pending";
        this.management.createLab(this.labForm).subscribe({
            next: (lab) => {
                this.createLabStatus = "success";
                this.router.navigate([`/manage/labs/${lab.id}`]);
                this.drawerRef.close();
            },
            error: (error) => {
                this.createLabStatus = "error";
                console.error(error);
            },
        });
    }

    /**
     * Closes the current drawer
     */
    public cancel(): void {
        this.drawerRef.close();
    }
}
