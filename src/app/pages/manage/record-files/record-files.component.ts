import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import * as save from "file-saver";
import {
    NzFormatEmitEvent,
    NzMessageService,
    NzModalRef,
    NzModalService,
    NzTreeComponent,
    NzTreeNode,
} from "ng-zorro-antd";
import { CreateRecordFileComponent } from "../../../core/modals/create-record-file/create-record-file.component";
import { RecordFilePreviewComponent } from "../../../core/modals/record-file-preview/record-file-preview.component";
import { ManagementService } from "../../../core/services/management/management.service";

@Component({
    selector: "app-record-files",
    templateUrl: "./record-files.component.html",
    styleUrls: ["./record-files.component.css"],
})
export class RecordFilesComponent implements OnInit {
    @ViewChild("nzTreeComponent", { static: false }) nzTreeComponent: NzTreeComponent;

    /**
     * Search bar value
     */
    public searchValue = "";

    /**
     * Modal reference of file upload modal
     */
    public uploadModal: NzModalRef;

    /**
     * File upload status
     */
    public uploadModalStatus: "idle" | "pending" | "success" | "error" = "idle";

    constructor(
        public management: ManagementService,
        private modalService: NzModalService,
        private message: NzMessageService,
    ) {}

    ngOnInit(): void {
        // Get list of current record files
        this.management.getRecordFiles().subscribe();
    }

    /**
     * Opens or closes given tree node
     * @param data Tree node to open or close
     */
    public openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
        if (data instanceof NzTreeNode) {
            data.isExpanded = !data.isExpanded;
        } else {
            const node = data.node;
            if (node) {
                node.isExpanded = !node.isExpanded;
            }
        }
    }

    /**
     * Highlights searchValue inside given string
     * @param input Input string to highlight search value in
     */
    public getHighlightedString(input: string): string {
        // Return if we get invalid data as input (such as null or undefined)
        if (!input) return;

        const targetString = input.match(new RegExp(this.searchValue, "i"));
        if (!targetString || !targetString[0]) return input;
        return input.replace(new RegExp(this.searchValue, "i"), `<span class="highlighted">${targetString}</span>`);
    }

    /**
     * Opens a dialog making the user confirm file deletion of given file
     * @param node Node of the record file to delete, includes path and name
     */
    public deleteRecordFile(node: NzTreeNode): void {
        const path = node.key
            .split("/")
            .slice(0, node.level + 1)
            .join("/");

        // Show confirmation dialog
        this.modalService.confirm({
            nzTitle: "Confirm File Deletion",
            nzContent: `Are you sure you want to delete the Record File at <span class="code">./${path}</span>?`,
            nzOkText: "Delete",
            nzOkType: "danger",
            nzOnOk: () => {
                const pendingMessage = this.message.loading("Removing File...").messageId;

                this.management.deleteRecordFile(path).subscribe({
                    next: (data) => {
                        this.message.remove(pendingMessage);
                        this.message.create("success", "File removed!");

                        // Update recordFiles
                        this.management.getRecordFiles().subscribe();
                    },
                    error: (err) => {
                        this.message.remove(pendingMessage);
                        this.message.create("error", "Error removing File.");
                    },
                });
            },
            nzCancelText: "Cancel",
        });
    }

    /**
     * Opens a dialog where the user can upload a new file at a given path
     * @param node TreeNode including the base path to upload the file to
     * @param modalFooter Custom footer template so we can make our own http requests
     */
    public openUploadModal(node: NzTreeNode | any, modalFooter: TemplateRef<any>): void {
        console.log(node);
        // Base path to upload the file to
        const path = node.key
            .split("/")
            .slice(0, node.level + 1)
            .join("/");

        // Open modal
        this.uploadModal = this.modalService.create({
            nzClosable: false,
            nzTitle: "Upload new Record File",
            nzContent: CreateRecordFileComponent,
            nzFooter: modalFooter,
        });

        // Set base path inside upload component after modal was opened
        this.uploadModal.afterOpen.subscribe(() => {
            const componentInstance = this.uploadModal.getContentComponent();
            componentInstance.originalPath = `/${path}`;
            componentInstance.path = `/${path}`;
        });
    }

    /**
     * Called when user clicks the upload button in the modals footer, reads
     * content of given file and starts uploading it
     */
    public modalSubmit(): void {
        // Get component instance
        const componentInstance = this.uploadModal.getContentComponent();

        // Get file contents
        const reader = new FileReader();
        reader.onload = () => {
            // Start upload
            this.uploadModalStatus = "pending";
            const pendingMessage = this.message.loading("Uploading File...").messageId;

            this.management.createRecordFile(componentInstance.path, reader.result.toString()).subscribe({
                next: (data) => {
                    this.uploadModal.close();
                    this.uploadModalStatus = "success";
                    this.message.remove(pendingMessage);
                    this.message.create("success", "File uploaded!");

                    // Update recordFiles
                    this.management.getRecordFiles().subscribe();
                },
                error: (err) => {
                    this.uploadModalStatus = "error";
                    this.message.remove(pendingMessage);
                    this.message.create("error", "Error uploading File.");
                },
            });
        };
        reader.readAsText(componentInstance.file);
    }

    /**
     * Called when user closes the modal from inside the footer,
     * closes the modal
     */
    public modalClose(): void {
        this.uploadModal.close();
    }

    /**
     * Downloads RecordFile at given path and saves it to the users machine
     * @param filePath Path of the file to download
     */
    public downloadRecordFile(node: NzTreeNode): void {
        this.management.getRecordFile(node.key).subscribe({
            next: (recordFile) => {
                const blob = new Blob([recordFile.content], { type: "text/plain;charset=utf-8" });
                save.saveAs(blob, recordFile.name);
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    /**
     * Gets Record File contents and then opens modal previewing the file
     * @param node Node containing the file path
     */
    public previewRecordFile(node: NzTreeNode): void {
        this.management.getRecordFile(node.key).subscribe({
            next: (recordFile) => {
                // Open file preview modal
                const modal = this.modalService.create({
                    nzClosable: false,
                    nzTitle: "Record File Preview",
                    nzContent: RecordFilePreviewComponent,
                    nzFooter: [
                        {
                            label: "Close",
                            onClick: () => {
                                modal.close();
                            },
                        },
                    ],
                    nzBodyStyle: {
                        width: "1000px",
                        maxWidth: "100%",
                    },
                    nzStyle: {
                        width: "1000px",
                        maxWidth: "75%",
                    },
                });

                // Set file name, path and content in preview component
                modal.afterOpen.subscribe(() => {
                    const componentInstance = modal.getContentComponent();
                    componentInstance.name = recordFile.name;
                    componentInstance.path = node.key;
                    componentInstance.content = recordFile.content;
                });
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
}
