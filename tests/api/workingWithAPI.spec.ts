import test, { expect, request } from "@playwright/test";
import tags from "../../src/test-data/tags.json";

test.beforeEach(async ({ page }) => {
    await page.route("*/**/api/tags", async (route) => {
        await route.fulfill({
            body: JSON.stringify(tags),
        });
    });

    await page.goto("https://conduit.bondaracademy.com/");
    await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");

    await page.getByText("Sign in").click();
    await page.getByRole("textbox", { name: "Email" }).fill("yevhentarasenko@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("Qwerty12345%");
    await page.getByRole("button").click();
});

test("Check article after mocking", async ({ page }) => {
    await page.route("*/**/api/articles*", async (route) => {
        const response = await route.fetch();
        const responseBody = await response.json();
        responseBody.articles[0].title = "This is a mock test title";
        responseBody.articles[0].description = "This is a mock description";

        await route.fulfill({
            body: JSON.stringify(responseBody),
        });
    });

    await page.getByText("Global Feed").click();

    await expect(page.locator(".navbar-brand")).toHaveText("conduit");

    await expect(page.locator("app-article-list h1").first()).toContainText("This is a mock test title");
    await expect(page.locator("app-article-list p").first()).toContainText("This is a mock description");
});

test("create article from list", async ({ page, request }) => {
    // log in
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

    // create a article
    const articleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
        data: {
            article: {
                title: "PW - Title",
                description: "PW - Description",
                body: "PW - Body",
                tagList: [],
            },
        },
        headers: {
            authorization: `Token ${accessToken}`,
        },
    });
    const articleData = await articleResponse.json();
    const articleSlug = articleData.article.slug;

    expect(articleResponse.status()).toEqual(201);

    // Delete article using APi
    const deleteArticleResponse = await request.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`,
        {
            headers: {
                authorization: `Token ${accessToken}`,
            },
        },
    );
    expect(deleteArticleResponse.status()).toEqual(204);

    // Delete article from UI
    // await page.getByText("Global Feed").click();
    // await page.getByText("PW - Title").click();
    // await page.getByRole("button", { name: "Delete Article" }).first().click();
    // await page.getByText("Global Feed").click();
    // await expect(page.locator("app-article-list h1").first()).not.toContainText("PW - Title");
});

test("create an article and delete", async ({ page, request }) => {
    //create an article
    await page.getByText("New Article").click();
    await page.getByRole("textbox", { name: "Article Title" }).fill("PW is awesome");
    await page.getByRole("textbox", { name: "What's this article about?" }).fill("PW this is article about");
    await page
        .getByRole("textbox", { name: "Write your article (in markdown)" })
        .fill("We like to use PW for automation");
    await page.getByRole("button", { name: "Publish Article" }).click();

    //get slugID
    const articleResponse = await page.waitForResponse("https://conduit-api.bondaracademy.com/api/articles/");
    const articleResponseBody = await articleResponse.json();
    const slugID = articleResponseBody.article.slug;
    await expect(page.locator("app-article-page h1")).toContainText("PW is awesome");

    //check the article on Global Feed
    await page.getByText("Home").click();
    await page.getByText("Global Feed").click();
    await expect(page.locator("app-article-list h1").first()).toContainText("PW is awesome");

    //get accessToken
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

    //delete article
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
        headers: { authorization: `Token ${accessToken}` },
    });
    expect(deleteArticleResponse.status()).toEqual(204);
});
