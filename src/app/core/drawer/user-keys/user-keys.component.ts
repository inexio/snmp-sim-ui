import { Component, Input } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { User } from "../../interfaces/user.interface";

@Component({
    selector: "app-user-keys",
    templateUrl: "./user-keys.component.html",
    styleUrls: ["./user-keys.component.css"],
})
export class UserKeysComponent {
    /**
     * User object containing keys to display
     */
    @Input() public user: User;

    constructor(private message: NzMessageService) {}

    /**
     * Copies given string to clipboard and shows success message
     * @param text String to copy to clipboard
     */
    public copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
        this.message.success("Copied to clipboard!");
    }
}
