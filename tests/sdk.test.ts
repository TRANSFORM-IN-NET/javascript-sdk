import { expect, test } from "vitest";
import { encodeURI } from "js-base64";
import TransformIn from "../src";
import { generateRandomNumberBetween } from "./utils";

const transformIn = new TransformIn({
  api_key: process.env.API_KEY,
  project_id: process.env.PROJECT_ID,
});

test("should return status ok when checking health", async () => {
  const response = await transformIn.checkHealth();
  expect(response.status).toBe("ok");
});

test("should return info about the svg image", async () => {
  const response = await transformIn.info("https://placehold.co/600x400");
  expect(response.success).toBe(true);
  expect(response.data.ext).toBe("svg");
  expect(response.data.type).toBe("image");
  expect(response.data.width).toBe(600);
  expect(response.data.height).toBe(400);
});

test("should return info about png image", async () => {
  const response = await transformIn.info("https://placehold.co/600x400/png");
  expect(response.success).toBe(true);
  expect(response.data.ext).toBe("png");
});

test("should return info about jpg image", async () => {
  const response = await transformIn.info("https://placehold.co/600x400/jpg");
  expect(response.success).toBe(true);
  expect(response.data.ext).toBe("jpg");
});

test("should return info about website", async () => {
  const response = await transformIn.info("https://example.com");
  expect(response.success).toBe(true);
  expect(response.data.ext).toBe("html");
  expect(response.data.type).toBe("text");
});

test("should return nsfw info about an image", async () => {
  const response = await transformIn.nsfwInfo("https://placehold.co/600x400/jpg");
  expect(response.success).toBe(true);
  expect(response.data.drawing).toBeGreaterThanOrEqual(0);
  expect(response.data.hentai).toBeGreaterThanOrEqual(0);
  expect(response.data.neutral).toBeGreaterThanOrEqual(0);
  expect(response.data.porn).toBeGreaterThanOrEqual(0);
  expect(response.data.sexy).toBeGreaterThanOrEqual(0);
});

test("should return nsfw info about a website", async () => {
  // TODO: implement this
});

test("should return nsfw info about a video", async () => {
  // TODO: implement this
});

test("should prepare transformation", async () => {
  const response = await transformIn.prepareTransformation("https://placehold.co/600x400/jpg", {
    w: generateRandomNumberBetween(0, 200),
    h: generateRandomNumberBetween(0, 200),
    f: "webp",
    q: 70,
  });
  expect(response.success).toBe(true);
  expect(response.data.message).toBe("Transformation is being processed");
});

test("should prepare transformation and await its response", async () => {
  const response = await transformIn.prepareTransformation("https://placehold.co/600x400/jpg", {
    w: generateRandomNumberBetween(0, 200),
    h: generateRandomNumberBetween(0, 200),
    f: "webp",
    q: 70,
  }, true);
  expect(response.success).toBe(true);
  expect(response.data.message).toBe("Transformation processed");
});

test("should generate correct transformation URL", () => {
  const transformIn = new TransformIn({
    api_key: "test-api-key",
    project_id: "test-project-id",
  });

  const url = "https://placehold.co/600x400/jpg";
  const options = {
    w: 100,
    h: 100,
    f: "webp",
    q: 70,
  };

  const result = transformIn.url(url, options);
  const expectedBase64 = encodeURI(url);
  expect(result).toBe(`http://localhost:8055/transformation/test-project-id/test-api-key/${expectedBase64}/w:100,h:100,f:webp,q:70`);
});

test("should throw error for invalid URL", () => {
  const transformIn = new TransformIn({
    api_key: "test-api-key",
    project_id: "test-project-id",
  });

  expect(() => transformIn.url("invalid-url", { w: 100 })).toThrow("Invalid URL");
});

test("should generate URL with empty options", () => {
  const transformIn = new TransformIn({
    api_key: "test-api-key",
    project_id: "test-project-id",
  });

  const url = "https://placehold.co/600x400/jpg";
  const result = transformIn.url(url, {});
  const expectedBase64 = encodeURI(url);
  expect(result).toBe(`http://localhost:8055/transformation/test-project-id/test-api-key/${expectedBase64}`);
});
