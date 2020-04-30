import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzDrawerService, NzMessageService, NzModalService } from "ng-zorro-antd";
import { AttachTagsComponent } from "../../drawer/attach-tags/attach-tags.component";
import { Agent } from "../../interfaces/agents.interface";
import { ManagementService } from "../../services/management/management.service";

@Component({
    selector: "app-agent-preview",
    templateUrl: "./agent-preview.component.html",
    styleUrls: ["./agent-preview.component.css"],
})
export class AgentPreviewComponent implements OnInit {
    /**
     * "mini" Agent containing basic agent information such as
     * id, name and array of engines
     */
    @Input() public agentPreview: any;

    /**
     * Boolean if agent is currently expanded
     */
    @Input() public expanded = false;

    /**
     * Set up new Event Emitter emitting when user "opens"/clicks agent
     * to see available Engines
     */
    @Output() public expand: EventEmitter<Agent> = new EventEmitter();

    /**
     * Set up new Event Emitter emitting when agent was deleted
     */
    @Output() public delete: EventEmitter<string> = new EventEmitter();

    /**
     * Full Agent with all its information, as received from its own API request
     */
    @Input() public agent: Agent;

    /**
     * Request status of full agent request
     */
    public agentRequestStatus: "idle" | "pending" | "success" | "error" = "idle";

    constructor(
        private message: NzMessageService,
        private drawer: NzDrawerService,
        private modal: NzModalService,
        private management: ManagementService,
    ) {}

    ngOnInit(): void {
        /**
         * Get complete Agent if it isnt given as input already
         */
        if (!this.agent) {
            this.updateAgent();
        }
    }

    /**
     * Updates current agent
     */
    public updateAgent(): void {
        this.agentRequestStatus = "pending";
        this.management.getAgent(this.agent ? this.agent.id : this.agentPreview.id).subscribe({
            next: (agent) => {
                this.agentRequestStatus = "success";
                this.agent = agent;
            },
            error: () => {
                this.agentRequestStatus = "error";
            },
        });
    }

    /**
     * Emits an even containing this agent so the LabComponent can display its engines
     */
    public expandAgent(): void {
        this.expand.emit(this.agent);
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
     * Opens a drawer where the user can edit the tags of the given Agent
     */
    public openEditTagsDrawer() {
        const drawerRef = this.drawer.create<AttachTagsComponent, { value: string }, string>({
            nzTitle: "Edit Tags",
            nzContent: AttachTagsComponent,
            nzWidth: "350px",
            nzContentParams: {
                // @ts-ignore
                type: "agent",
                attachedTags: this.agent.tags,
                targetId: this.agent.id,
                targetName: this.agent.name,
            },
        });

        /**
         * Update current agentdata after tags were edited
         */
        drawerRef.afterClose.subscribe(() => {
            this.updateAgent();
        });
    }

    /**
     * Opens a modal making the user confirm the deletion of this agent
     */
    public deleteAgent(): void {
        // Show confirmation dialog
        this.modal.confirm({
            nzTitle: "Confirm Agent Deletion",
            nzContent: `Are you sure you want to delete agent "${this.agent.name}"?`,
            nzOkText: "Delete",
            nzOkType: "danger",
            nzOnOk: () => {
                const pendingMessage = this.message.loading("Deleting Agent...").messageId;

                this.management.deleteAgent(this.agent.id).subscribe({
                    next: () => {
                        this.message.remove(pendingMessage);
                        this.message.create("success", "Agent deleted!");
                        this.delete.emit("Agent deleted");
                    },
                    error: (error) => {
                        this.message.remove(pendingMessage);
                        this.message.create("error", "Error deleting Agent!");
                        console.error(error);
                    },
                });
            },
            nzCancelText: "Cancel",
        });
    }
}
