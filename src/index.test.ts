import { readFileSync } from "node:fs";
import { request, type RequestOptions } from "node:https";

import { beforeEach, describe, expect, test, vi } from "vitest";

import SlowZone, { VERSION } from "./index.js";

vi.mock("node:https", () => ({
  request: vi.fn(),
}));

const mockRequest = vi.mocked(request);

describe("SlowZone", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  test("VERSION matches package.json", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
    );
    expect(VERSION).toBe(pkg.version);
  });

  test("sends a User-Agent header with the package version", () => {
    const mockReq = { on: vi.fn(), end: vi.fn() } as unknown as ReturnType<
      typeof request
    >;
    mockRequest.mockReturnValue(mockReq);

    const client = new SlowZone({ apiKey: "test-key" });
    void client.getArrivalsForStation(41020);

    expect(mockRequest).toHaveBeenCalledOnce();
    const options = mockRequest.mock.calls[0][0] as RequestOptions;
    expect(options.headers?.["User-Agent"]).toBe(`slow-zone/${VERSION}`);
  });
});
