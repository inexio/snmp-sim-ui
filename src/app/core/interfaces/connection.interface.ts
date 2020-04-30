export interface Connection {
    protocol: "https" | "http";
    address: string;
    port: number;
    authentication: {
        type: "basic";
        enabled: boolean;
        username: string;
        password: string;
    };
    isValid?: boolean;
}
