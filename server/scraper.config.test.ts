import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AdminUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const adminUser: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("scraper.config", () => {
  it("should list scraper configs (public access)", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.scraper.listConfigs();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create scraper config (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const configData = {
      enterpriseName: "Test Enterprise",
      region: "heilongjiang",
      grainType: "corn",
      officialWebsite: "https://example.com",
      monitoringUrl: "https://example.com/prices",
      updateFrequency: "daily" as const,
    };

    const result = await caller.scraper.createConfig(configData);

    expect(result).toBeDefined();
  });

  it("should deny scraper config creation for non-admin users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const configData = {
      enterpriseName: "Test Enterprise",
      region: "heilongjiang",
      grainType: "corn",
      officialWebsite: "https://example.com",
      monitoringUrl: "https://example.com/prices",
      updateFrequency: "daily" as const,
    };

    try {
      await caller.scraper.createConfig(configData);
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should validate URL format for officialWebsite", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const configData = {
      enterpriseName: "Test Enterprise",
      region: "heilongjiang",
      grainType: "corn",
      officialWebsite: "not-a-valid-url",
      monitoringUrl: "https://example.com/prices",
      updateFrequency: "daily" as const,
    };

    try {
      await caller.scraper.createConfig(configData);
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid URL");
    }
  });

  it("should validate updateFrequency enum", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const configData = {
      enterpriseName: "Test Enterprise",
      region: "heilongjiang",
      grainType: "corn",
      officialWebsite: "https://example.com",
      monitoringUrl: "https://example.com/prices",
      updateFrequency: "invalid" as any,
    };

    try {
      await caller.scraper.createConfig(configData);
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid option");
    }
  });
});
