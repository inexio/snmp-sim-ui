export interface Process {
    changes: number;
    console_pages: {
        count: number;
        last_update: string;
    };
    cpu: number;
    endpoints: {
        count: number;
    };
    exits: number;
    files: number;
    id: number;
    last_update: string;
    memory: number;
    path: string;
    runtime: number;
    supervisor: {
        hostname: string;
        id: number;
        watch_dir: string;
    };
    update_interval: number;
}
