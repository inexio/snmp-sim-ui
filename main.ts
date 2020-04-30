/**
 * Import Dependencies
 */
import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

/**
 * Initiate Auto Updater
 */
// tslint:disable-next-line: no-var-requires
require("update-electron-app")({
    repo: "inexio/snmp-sim-ui",
    updateInterval: "1 hour",
});

/**
 * Create new BrowserWindow
 */
let win: BrowserWindow = null;

/**
 * Parse process args
 */
const args = process.argv.slice(1);
const serve = args.some((val) => val === "--serve");

/**
 * Create the BrowserWindow and load Angular
 */
function createWindow(): BrowserWindow {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        titleBarStyle: "hiddenInset",
        webPreferences: {
            nodeIntegration: true,
        },
    });

    if (serve) {
        require("electron-reload")(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        win.loadURL("http://localhost:4200");
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, "dist/index.html"),
                protocol: "file:",
                slashes: true,
            }),
        );
    }

    win.on("closed", () => {
        win = null;
    });

    return win;
}

try {
    app.on("ready", createWindow);

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        if (win === null) {
            createWindow();
        }
    });
} catch (e) {
    // Catch Error
    // throw e;
}
