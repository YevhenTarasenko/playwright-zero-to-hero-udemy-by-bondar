import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";

require("dotenv").config();

export default defineConfig<TestOptions>({
    timeout: 40000,
    globalTimeout: 60000,

    retries: 1,
    reporter: "html",

    use: {
        globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
        baseURL:
            process.env.DEV == "1"
                ? "http://localhost:4200/"
                : process.env.STAGE == "1"
                  ? "http://localhost:4201/"
                  : "http://localhost:4200/",

        trace: "on-first-retry",
        extraHTTPHeaders: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`,
        },
        video: {
            mode: "off",
            size: {
                width: 1920,
                height: 1080,
            },
        },
    },

    projects: [
        {
            name: "setup",
            testMatch: "authSetup.ts",
        },
        {
            name: "chromium",
            timeout: 30000,
            use: { ...devices["Desktop Chrome"], storageState: "tests/.authSetup/authFiles/user.json" },
            dependencies: ["setup"],
        },
        {
            name: "usePageObjects",
            testMatch: "usePageObjects.spec.ts",
            use: {
                video: {
                    mode: "off",
                    size: {
                        width: 1920,
                        height: 1080,
                    },
                },
            },
        },
        // {
        //     name: "dev",
        //     use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:4201/" },
        // },
        // {
        //     name: "stage",
        //     use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:4202/" },
        // },
    ],
});
