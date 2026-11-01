import mongoose from "mongoose";
import { env } from "../config/env.js";
import {
    indiaMarketPriceFromInr,
    indiaMarketPriceFromUsd,
    USD_TO_INR_RATE,
} from "../utils/currency.js";

const migrationId = "india-market-estimates-inr-v4";
const previousCurrencyMigrationIds = ["usd-prices-to-inr-v1", "usd-prices-to-inr-v3"];
const legacyMarketMigrationId = "usd-prices-to-india-market-inr-v2";

const run = async () => {
    await mongoose.connect(env.mongoUri, { dbName: env.mongoDatabase });

    const database = mongoose.connection.db;
    const migrations = database.collection("schema_migrations");
    try {
        await database.createCollection("schema_migrations");
    } catch (error) {
        if (error.codeName !== "NamespaceExists") throw error;
    }

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            if (await migrations.findOne({ _id: migrationId }, { session })) {
                console.info("India-market pricing was already applied; skipping.");
                return;
            }

            const previousCurrencyMigration = await migrations.findOne(
                { _id: { $in: previousCurrencyMigrationIds } },
                { session },
            );
            const legacyMarketMigration = await migrations.findOne({ _id: legacyMarketMigrationId }, { session });
            const productRecords = await database.collection("products").aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "categoryRecord",
                    },
                },
                { $unwind: "$categoryRecord" },
                { $project: { price: 1, category: "$categoryRecord.slug" } },
            ], { session }).toArray();
            const productCount = await database.collection("products").countDocuments({}, { session });
            if (productCount === 0) {
                throw new Error("No products found; seed the catalog before running this migration.");
            }
            if (productRecords.length !== productCount) {
                throw new Error("Some products do not have a category; no prices were changed.");
            }
            const productUpdates = productRecords.map(({ _id, price, category }) => ({
                updateOne: {
                    filter: { _id },
                    update: {
                        $set: {
                            price: legacyMarketMigration
                                ? price
                                : previousCurrencyMigration
                                    ? indiaMarketPriceFromInr(price, category)
                                    : indiaMarketPriceFromUsd(price, category),
                        },
                    },
                },
            }));
            const products = productUpdates.length
                ? await database.collection("products").bulkWrite(productUpdates, { session })
                : { modifiedCount: 0 };

            let orders = { modifiedCount: 0 };
            if (!previousCurrencyMigration && !legacyMarketMigration) {
                orders = await database.collection("orders").updateMany(
                    {},
                    [{
                        $set: {
                            items: {
                                $map: {
                                    input: "$items",
                                    as: "item",
                                    in: {
                                        $let: {
                                            vars: {
                                                unitPriceCents: { $round: [{ $multiply: ["$$item.unitPriceCents", USD_TO_INR_RATE] }, 0] },
                                            },
                                            in: {
                                                $mergeObjects: [
                                                    "$$item",
                                                    {
                                                        unitPriceCents: "$$unitPriceCents",
                                                        lineTotalCents: { $multiply: ["$$unitPriceCents", "$$item.quantity"] },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                            shippingCents: { $round: [{ $multiply: ["$shippingCents", USD_TO_INR_RATE] }, 0] },
                            taxCents: { $round: [{ $multiply: ["$taxCents", USD_TO_INR_RATE] }, 0] },
                        },
                    }, {
                        $set: {
                            subtotalCents: { $sum: "$items.lineTotalCents" },
                        },
                    }, {
                        $set: {
                            totalCents: { $add: ["$subtotalCents", "$shippingCents", "$taxCents"] },
                        },
                    }],
                    { session },
                );
            }

            await migrations.insertOne({
                _id: migrationId,
                exchangeRate: USD_TO_INR_RATE,
                appliedAt: new Date(),
                pricingModel: "category-market-estimate",
            }, { session });
            console.info(
                `Applied India-market estimates to ${products.modifiedCount} product prices; converted ${orders.modifiedCount} historical orders to INR.`,
            );
        });
    } finally {
        await session.endSession();
    }
};

try {
    await run();
} catch (error) {
    console.error("USD-to-INR migration failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
