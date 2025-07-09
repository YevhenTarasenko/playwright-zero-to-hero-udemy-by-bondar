import { expect, test as setup } from "@playwright/test";

setup("create new article", async ({ request }) => {
    const articleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
        data: {
            article: {
                title: "PW - Likes test article",
                description: "PW - Description",
                body: "PW - Body",
                tagList: [],
            },
        },
    });
    expect(articleResponse.status()).toEqual(201);

    const articleData = await articleResponse.json();
    const articleSlug = articleData.article.slug;
    process.env["SLUGID"] = articleSlug;
});
