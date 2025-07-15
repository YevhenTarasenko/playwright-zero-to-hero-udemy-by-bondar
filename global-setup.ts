import { expect, request } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = path.resolve(__dirname, "tests/.authSetup/authFiles/user.json");

async function globalSetup() {
    const context = await request.newContext();

    const responseToken = await context.post("https://conduit-api.bondaracademy.com/api/users/login", {
        data: {
            user: {
                email: "yevhentarasenko@gmail.com",
                password: "Qwerty12345%",
            },
        },
    });
    expect(responseToken.status()).toEqual(200);
    const responseBody = await responseToken.json();
    const accessToken = responseBody.user.token;
    expect(accessToken).toBeTruthy();

    let userJson: any;
    if (fs.existsSync(authFile)) {
        userJson = JSON.parse(fs.readFileSync(authFile, "utf-8"));
        userJson.origins[0].localStorage[0].value = accessToken;
    } else {
        userJson = {
            origins: [
                {
                    origin: "https://conduit.bondaracademy.com",
                    localStorage: [
                        {
                            name: "jwt",
                            value: accessToken,
                        },
                    ],
                },
            ],
        };
    }

    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    fs.writeFileSync(authFile, JSON.stringify(userJson, null, 2));

    process.env["ACCESS_TOKEN"] = accessToken;

    const articleResponse = await context.post("https://conduit-api.bondaracademy.com/api/articles/", {
        data: {
            article: {
                title: "PW - Global Likes test article",
                description: "PW - Description",
                body: "PW - Body",
                tagList: [],
            },
        },
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });

    expect(articleResponse.status()).toEqual(201);

    const articleData = await articleResponse.json();
    process.env["SLUGID"] = articleData.article.slug;
}

export default globalSetup;
