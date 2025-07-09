import { expect, test as setup } from "@playwright/test";

setup("Delete the article", async ({ request }) => {
    const deleteArticleResponse = await request.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`,
    );
    expect(deleteArticleResponse.status()).toEqual(204);
});
