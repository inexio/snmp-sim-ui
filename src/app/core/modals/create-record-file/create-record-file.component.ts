import { Component } from "@angular/core";
import { UploadFile, UploadFilter } from "ng-zorro-antd";

@Component({
    selector: "app-create-record-file",
    templateUrl: "./create-record-file.component.html",
    styleUrls: ["./create-record-file.component.css"],
})
export class CreateRecordFileComponent {
    public file: UploadFile;
    public path: string;
    public originalPath: string;

    public filters: UploadFilter[] = [
        {
            name: "type",
            fn: (fileList: UploadFile[]) => {
                console.log("Filtering");
                const filterFiles = fileList.filter((file) => file.name.toLowerCase().endsWith(".snmprec"));
                console.log(filterFiles);
                if (filterFiles.length !== fileList.length) {
                    console.log("Some files were removed");
                    return filterFiles;
                }
                return fileList;
            },
        },
    ];

    selectFile = (file: UploadFile): boolean => {
        this.file = file;
        this.path = `${this.originalPath}/${this.file.name}`;
        return false;
    };
}
