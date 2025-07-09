import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";

require("dotenv").config();

export default defineConfig<TestOptions>({
    timeout: 40000,
    globalTimeout: undefined,
    workers: 10,

    testDir: "tests",
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
            testMatch: "tests/.authSetup/authSetup.ts",
        },
        {
            name: "regression",
            testIgnore: ["autoWaiting.spec.ts", "likesCounter.spec.ts"],
            testMatch: "**/*.spec.ts",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "tests/.authSetup/authFiles/user.json",
            },
            dependencies: ["setup"],
        },
        {
            name: "firefox-autoWaiting",
            testMatch: "tests/web/autoWaiting.spec.ts",
            use: {
                ...devices["Desktop Firefox"],
            },
        },
        {
            name: "articleSetup",
            testMatch: "newArticle.setup.ts",
            dependencies: ["setup"],
            teardown: "articleCleanUp",
        },
        {
            name: "articleCleanUp",
            testMatch: "articleCleanUp.setup.ts",
        },
        {
            name: "likeCounter",
            testMatch: "likesCounter.spec.ts",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "tests/.authSetup/authFiles/user.json",
            },
            dependencies: ["articleSetup"],
        },

        // {
        //     name: "usePageObjects",
        //     testMatch: "usePageObjects.spec.ts",
        //     use: {
        //         video: {
        //             mode: "off",
        //             size: {
        //                 width: 1920,
        //                 height: 1080,
        //             },
        //         },
        //     },
        // },
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
