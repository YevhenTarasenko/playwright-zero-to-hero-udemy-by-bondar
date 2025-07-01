import { test as setup } from "@playwright/test";
import user from "./authFiles/user.json";
import fs from "fs";

const authFile = "tests/.authSetup/authFiles/user.json";

setup("authentication", async ({ page, request }) => {
    // authentication via WEB
    // await page.goto("https://conduit.bondaracademy.com/");

    // await page.getByText("Sign in").click();
    // await page.getByRole("textbox", { name: "Email" }).fill("yevhentarasenko@gmail.com");
    // await page.getByRole("textbox", { name: "Password" }).fill("Qwerty12345%");
    // await page.getByRole("button").click();
    // await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");

    // await page.context().storageState({ path: authFile });

    // authentication via API
    const response = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
        data: {
            user: {
                email: "yevhentarasenko@gmail.com",
                password: "Qwerty12345%",
            },
        },
    });
    const responseBody = await response.json();
    const accessToken = responseBody.user.token;
    user.origins[0].localStorage[0].value = accessToken;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env["ACCESS_TOKEN"] = accessToken;
});
