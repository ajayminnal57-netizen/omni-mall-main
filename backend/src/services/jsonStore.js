import { randomBytes } from "node:crypto";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const storePath = fileURLToPath(new URL("../../data/store.json", import.meta.url));
let store = JSON.parse(readFileSync(storePath, "utf8"));
const collections = ["categories", "products", "users", "carts", "wishlists", "orders"];

if (collections.some((collection) => !Array.isArray(store[collection]))) {
  throw new Error(`JSON data store must contain array collections: ${collections.join(", ")}.`);
}

export const readStore = () => store;

export const updateStore = (update) => {
  const nextStore = structuredClone(store);
  const result = update(nextStore);
  const temporaryPath = `${storePath}.${process.pid}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify(nextStore, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, storePath);
  store = nextStore;
  return result;
};

export const createId = () => randomBytes(12).toString("hex");
