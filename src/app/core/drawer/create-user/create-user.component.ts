import { Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { Engine } from "../../interfaces/engine.interface";
import { Tag } from "../../interfaces/tag.interface";
import { ManagementService } from "../../services/management/management.service";
import { CreateTagComponent } from "../create-tag/create-tag.component";

@Component({
    selector: "app-create-user",
    templateUrl: "./create-user.component.html",
    styleUrls: ["./create-user.component.css"],
})
export class CreateUserComponent implements OnInit {
    /**
     * Array of Engine ids that will be preselected
     */
    @Input() public preselectedEngines?: string[] = [];

    /**
     * Array of Tag ids that will be preselected
     */
    @Input() public preselectedTags?: string[] = [];

    /**
     * Array of available `priv_proto` values
     */
    public availablePrivProtocols: string[] = [
        "DES",
        "3DES",
        "AES",
        "AES128",
        "AES192",
        "AES192BLMT",
        "AES256",
        "AES256BLMT",
        "NONE",
    ];

    /**
     * Array of available `auth_proto` values
     */
    public availableAuthProtocols: string[] = ["MD5", "SHA", "SHA224", "SHA256", "SHA384", "SHA512", "NONE"];

    /**
     * Form including User details
     */
    public userForm: {
        user: string;
        name: string;
        auth_key: string;
        auth_proto: "MD5" | "SHA" | "SHA224" | "SHA256" | "SHA384" | "SHA512" | "NONE";
        priv_key: string;
        priv_proto: "DES" | "3DES" | "AES" | "AES128" | "AES192" | "AES192BLMT" | "AES256" | "AES256BLMT" | "NONE";
    } = {
        user: "",
        name: "",
        auth_key: "",
        auth_proto: "NONE",
        priv_key: "",
        priv_proto: "NONE",
    };

    /**
     * Array of available Tags to choose from
     */
    public availableTags: Tag[] = [];

    /**
     * Array of selected Tags that will be added to the Engine
     */
    public selectedTags: string[] = [];

    /**
     * Array of available Engines to choose from
     */
    public availableEngines: Engine[] = [];

    /**
     * Array of selected Engines the Endpoint will be added to
     */
    public selectedEngines: string[] = [];

    /**
     * Status of the http request creating the Endpoint
     */
    public createUserStatus: "idle" | "pending" | "success" | "error" = "idle";

    /**
     * Current step in Endpoint creation process, used in the NzStepsComponent
     */
    public createUserStep = 0;

    constructor(
        private management: ManagementService,
        private drawerRef: NzDrawerRef,
        private drawer: NzDrawerService,
    ) {}

    ngOnInit(): void {
        // Get list of available Tags
        this.getAvailableTags();

        // Get list of available Labs
        this.getAvailableEngines();

        // Preselect labs if any were specified
        this.selectedEngines = this.selectedEngines.concat(this.preselectedEngines || []);

        // Preselect tags if any were specified
        this.selectedTags = this.selectedTags.concat(this.preselectedTags || []);
    }

    /**
     * Gets list of all available Tags
     */
    public getAvailableTags(): void {
        this.management.getTags().subscribe({
            next: (tags) => {
                this.availableTags = tags;
            },
        });
    }

    /**
     * Gets list of all available Labs
     */
    public getAvailableEngines(): void {
        this.management.getEngines().subscribe({
            next: (engines) => {
                this.availableEngines = engines;
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
     * Create a User, attach Tags to it, add User to Engines
     */
    public createUser(): void {
        this.createUserStatus = "pending";
        this.createUserStep = 0;

        const form = this.userForm;
        if (form.auth_proto === "NONE") {
            form.auth_key = null;
        }
        if (form.priv_proto === "NONE") {
            form.priv_key = null;
        }

        // Create User
        this.management.createUser(form).subscribe({
            next: (user) => {
                this.createUserStep = 1;

                // Add Tags to User
                this.management.attachTags("user", this.selectedTags, user.id).subscribe({
                    next: () => {
                        this.createUserStep = 2;

                        // Add Agent to Labs
                        this.management.addUsersToEngines([user.id], this.selectedEngines).subscribe({
                            next: () => {
                                this.createUserStatus = "success";
                                this.createUserStep = 5;

                                setTimeout(() => {
                                    this.close();
                                }, 3000);
                            },
                            error: (error) => {
                                this.createUserStatus = "error";
                                console.error(error);
                            },
                        });
                    },
                    error: (error) => {
                        this.createUserStatus = "error";
                        console.log(error);
                    },
                });
            },
            error: (error) => {
                this.createUserStatus = "error";
                console.error(error);
            },
        });
    }

    /**
     * Closes the current drawer
     */
    public close(): void {
        this.drawerRef.close();
    }
}
