import { Injectable } from "@angular/core";
import * as moment from "moment";

interface LoggedPart {
    string: string;
    style: string;
}

@Injectable({
    providedIn: "root",
})
export class LoggerService {
    public config = {
        showTimestamp: false,
        prefix: [
            {
                string: "[order service]",
                style: "color: unset;",
            },
            {
                string: " ",
                style: "color: unset;",
            },
        ],
    };

    public prefixes = {
        success: [
            {
                string: "✔️ ",
                style: "color: #98C379;",
            },
            {
                string: "success",
                style: "color: #98C379; text-decoration: underline;",
            },
            {
                string: "   ",
                style: "color: unset;",
            },
        ],
        error: [
            {
                string: "× ",
                style: "color: #E06C75;",
            },
            {
                string: "error",
                style: "color: #E06C75; text-decoration: underline;",
            },
            {
                string: "     ",
                style: "color: unset;",
            },
        ],
        warning: [
            {
                string: "⚠️ ",
                style: "color: #E5C07B;",
            },
            {
                string: "warning",
                style: "color: #E5C07B; text-decoration: underline;",
            },
            {
                string: "   ",
                style: "color: unset;",
            },
        ],
        await: [
            {
                string: "… ",
                style: "color: #56B6C2;",
            },
            {
                string: "awaiting",
                style: "color: #56B6C2; text-decoration: underline;",
            },
            {
                string: "  ",
                style: "color: unset;",
            },
        ],
        start: [
            {
                string: "► ",
                style: "color: #98C379;",
            },
            {
                string: "start",
                style: "color: #98C379; text-decoration: underline;",
            },
            {
                string: "     ",
                style: "color: unset;",
            },
        ],
        pause: [
            {
                string: "‖ ",
                style: "color: #E5C07B;",
            },
            {
                string: "pause",
                style: "color: #E5C07B; text-decoration: underline;",
            },
            {
                string: "     ",
                style: "color: unset;",
            },
        ],
        debug: [
            {
                string: "● ",
                style: "color: #61AFEF;",
            },
            {
                string: "debug",
                style: "color: #61AFEF; text-decoration: underline;",
            },
            {
                string: "     ",
                style: "color: unset;",
            },
        ],
        info: [
            {
                string: "i ",
                style: "color: #61AFEF;",
            },
            {
                string: "info",
                style: "color: #61AFEF; text-decoration: underline;",
            },
            {
                string: "      ",
                style: "color: unset;",
            },
        ],
        fatal: [
            {
                string: "◆ ",
                style: "color: #E06C75;",
            },
            {
                string: "fatal",
                style: "color: #E06C75; text-decoration: underline;",
            },
            {
                string: "     ",
                style: "color: unset;",
            },
        ],
    };

    constructor() {
        this.success("Woop!", { true: false });
        this.error("Woop!", { true: false });
        this.warning("Woop!", { true: false });
        this.await("Woop!", { true: false });
        this.start("Woop!", { true: false });
        this.pause("Woop!", { true: false });
        this.debug("Woop!", { true: false });
        this.info("Woop!", { true: false }); // (◕‿-｡)
        this.fatal(new Error("I'm sorry. :("));
    }

    private joinParts(input: LoggedPart[]): string[] {
        let base = "";
        const styles = [];

        input.map((part) => {
            base += `%c${part.string}`;
            styles.push(part.style);
        });

        return [base].concat(styles);
    }

    private logType(
        type: "success" | "error" | "warning" | "await" | "start" | "pause" | "debug" | "info" | "fatal",
        ...input: any
    ): void {
        let parts = this.prefixes[type];

        if (this.config.showTimestamp) {
            parts.unshift({
                string: `[${moment().format("LTS")}] `,
                style: "color: unset;",
            });
        }

        if (this.config.prefix) {
            parts = this.config.prefix.concat(parts);
        }

        if (input.length === 1) {
            console.log(...this.joinParts(parts), input[0]);
        } else {
            console.log(...this.joinParts(parts), ...input);
        }
    }

    public log(...data: any): void {
        console.log(...data);
    }

    public success(...data: any): void {
        this.logType("success", ...data);
    }

    public error(...data: any): void {
        this.logType("error", ...data);
    }

    public warning(...data: any): void {
        this.logType("warning", ...data);
    }

    public warn(...data: any): void {
        this.logType("warning", ...data);
    }

    public await(...data: any): void {
        this.logType("await", ...data);
    }

    public start(...data: any): void {
        this.logType("start", ...data);
    }

    public pause(...data: any): void {
        this.logType("pause", ...data);
    }

    public debug(...data: any): void {
        this.logType("debug", ...data);
    }

    public info(...data: any): void {
        this.logType("info", ...data);
    }

    public fatal(...data: any): void {
        this.logType("fatal", ...data);
    }
}
