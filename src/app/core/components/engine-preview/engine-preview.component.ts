import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzDrawerService, NzMessageService, NzModalService } from "ng-zorro-antd";
import { AttachTagsComponent } from "../../drawer/attach-tags/attach-tags.component";
import { Engine } from "../../interfaces/engine.interface";
import { ManagementService } from "../../services/management/management.service";

@Component({
    selector: "app-engine-preview",
    templateUrl: "./engine-preview.component.html",
    styleUrls: ["./engine-preview.component.css"],
})
export class EnginePreviewComponent implements OnInit {
    /**
     * Engine as given through input from agent data
     */
    @Input() public engine: Engine;

    /**
     * Boolean if engine is currently expanded
     */
    @Input() public expanded = false;

    /**
     * Set up new Event Emitter emitting when user "opens"/clicks agent
     * to see available endpoints and users
     */
    @Output() public expand: EventEmitter<Engine> = new EventEmitter();

    /**
     * Set up new Event Emitter emitting when Engine was deleted
     */
    @Output() public delete: EventEmitter<string> = new EventEmitter();

    /**
     * Request status of engine update request,
     * default is success since full engine is already given at init
     */
    public engineRequestStatus: "idle" | "pending" | "success" | "error" = "success";

    constructor(
        private drawer: NzDrawerService,
        private modal: NzModalService,
        private message: NzMessageService,
        private management: ManagementService,
    ) {}

    ngOnInit(): void {
        // Parse tags if they havent been parsed already
        if (this.engine.tags[0] && !this.engine.tags[0].meta) {
            this.engine.tags = this.management.parseTags(this.engine.tags);
        }
    }

    /**
     * Emits an even containing this agent so the LabComponent can display its engines
     */
    public expandEngine(): void {
        this.expand.emit(this.engine);
    }

    /**
     * Updates engine information
     */
    public updateEngine() {
        this.engineRequestStatus = "pending";
        this.management.getEngine(this.engine.id).subscribe({
            next: (engine) => {
                this.engineRequestStatus = "success";
                this.engine = engine;
            },
            error: (error) => {
                this.engineRequestStatus = "error";
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
                type: "engine",
                attachedTags: this.engine.tags,
                targetId: this.engine.id,
                targetName: this.engine.name,
            },
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.updateEngine();
        });
    }

    /**
     * Opens a modal making the user confirm the deletion of this agent
     */
    public deleteEngine(): void {
        // Show confirmation dialog
        this.modal.confirm({
            nzTitle: "Confirm Engine Deletion",
            nzContent: `Are you sure you want to delete Engine "${this.engine.name}"?`,
            nzOkText: "Delete",
            nzOkType: "danger",
            nzOnOk: () => {
                const pendingMessage = this.message.loading("Deleting Engine...").messageId;

                this.management.deleteEngine(this.engine.id).subscribe({
                    next: () => {
                        this.message.remove(pendingMessage);
                        this.message.create("success", "Engine deleted!");
                        this.delete.emit("Engine deleted");
                    },
                    error: (error) => {
                        this.message.remove(pendingMessage);
                        this.message.create("error", "Error deleting Engine!");
                        console.error(error);
                    },
                });
            },
            nzCancelText: "Cancel",
        });
    }
}
