import { Component } from "@angular/core";
import * as save from "file-saver";
import { NzMessageService } from "ng-zorro-antd";
import { CoreService } from "../../services/core/core.service";

@Component({
    selector: "app-record-file-preview",
    templateUrl: "./record-file-preview.component.html",
    styleUrls: ["./record-file-preview.component.css"],
})
export class RecordFilePreviewComponent {
    /**
     * File name
     */
    public name = "";

    /**
     * Full file path
     */
    public path = "";

    /**
     * File contents
     */
    public content = "";

    constructor(public core: CoreService, private message: NzMessageService) {}

    /**
     * Copies file contents to clipboard
     */
    public copyContentToClipboard() {
        navigator.clipboard.writeText(this.content);
        this.message.success("Successfully copied file contents to clipboard!");
    }

    /**
     * Downloads file in browser, opens download prompt in Electron
     */
    public downloadFile() {
        const blob = new Blob([this.content], { type: "text/plain;charset=utf-8" });
        save.saveAs(blob, this.name);
        this.message.success("File downloaded!");
    }
}
