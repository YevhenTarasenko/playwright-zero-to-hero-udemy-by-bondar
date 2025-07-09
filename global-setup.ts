import { expect, request } from "@playwright/test";
import user from "./tests/.authSetup/authFiles/user.json";
import fs from "fs";

async function globalSetup() {
    const authFile = "tests/.authSetup/authFiles/user.json";

    const context = await request.newContext();

    const responseToken = await context.post("https://conduit-api.bondaracademy.com/api/users/login", {
        data: {
            user: {
                email: "yevhentarasenko@gmail.com",
                password: "Qwerty12345%",
            },
        },
    });
    const responseBody = await responseToken.json();
    const accessToken = responseBody.user.token;
    user.origins[0].localStorage[0].value = accessToken;
    fs.writeFileSync(authFile, JSON.stringify(user));

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
            Authorization: `Token ${process.env.ACCESS_TOKEN}`,
        },
    });
    expect(articleResponse.status()).toEqual(201);

    const articleData = await articleResponse.json();
    const articleSlug = articleData.article.slug;
    process.env["SLUGID"] = articleSlug;
}

export default globalSetup;
