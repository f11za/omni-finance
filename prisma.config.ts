import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // added ?connect_timeout=30 to give the network a chance to breathe
    url: process.env.DATABASE_URL + "?connect_timeout=30",
  },
});