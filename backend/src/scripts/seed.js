<<<<<<< HEAD
import "../config/env.js";
import { readStore } from "../services/jsonStore.js";
import { seedAdminFromEnvironment } from "../services/authService.js";
=======
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { USD_TO_INR_RATE, indiaMarketPriceFromUsd } from "../utils/currency.js";

const run = async () => {
    await mongoose.connect(env.mongoUri, { dbName: env.mongoDatabase });

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME?.trim().toLowerCase() || "admin";
    if (Boolean(email) !== Boolean(password)) {
        throw new Error("Set both ADMIN_EMAIL and ADMIN_PASSWORD to create an admin account.");
    }
    if (email && password.length < 8) {
        throw new Error("ADMIN_PASSWORD must contain at least 8 characters.");
    }

    if (email) {
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin && existingAdmin.role !== "admin") {
            throw new Error("ADMIN_EMAIL already belongs to a non-admin account; choose another email.");
        }
        if (!existingAdmin) {
            if (await User.exists({ username })) {
                throw new Error("ADMIN_USERNAME is already in use; choose another username.");
            }
            await User.create({
                username,
                email,
                passwordHash: await bcrypt.hash(password, 12),
                role: "admin",
            });
            console.info("Admin account created from environment credentials.");
        }
    } else {
        console.info("Admin account creation skipped; no admin credentials configured.");
    }

    if (await Product.countDocuments() === 0) {
        const response = await fetch("https://dummyjson.com/products?limit=0");
        if (!response.ok) throw new Error(`Product seed source returned HTTP ${response.status}.`);
        const { products } = await response.json();
        const categoryIds = new Map();

        for (const name of [...new Set(products.map((product) => product.category))]) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const category = await Category.findOneAndUpdate(
                { slug },
                { $setOnInsert: { name: slug.replaceAll("-", " "), slug } },
                { new: true, upsert: true },
            );
            categoryIds.set(name, category._id);
        }

        await Product.insertMany(products.map((product) => ({
            title: product.title,
            description: product.description,
            brand: product.brand ?? "",
            category: categoryIds.get(product.category),
            price: indiaMarketPriceFromUsd(product.price, product.category),
            stock: product.stock,
            thumbnail: product.thumbnail,
            images: product.images ?? [],
            rating: product.rating ?? 0,
            discountPercentage: product.discountPercentage ?? 0,
            warrantyInformation: product.warrantyInformation ?? "",
            shippingInformation: product.shippingInformation ?? "",
            availabilityStatus: product.availabilityStatus ?? "In Stock",
            reviews: (product.reviews ?? []).map((review) => ({
                reviewerName: review.reviewerName,
                reviewerEmail: review.reviewerEmail,
                rating: review.rating,
                comment: review.comment,
                date: review.date,
            })),
        })));
        const database = mongoose.connection.db;
        try {
            await database.createCollection("schema_migrations");
        } catch (error) {
            if (error.codeName !== "NamespaceExists") throw error;
        }
        await database.collection("schema_migrations").updateOne(
            { _id: "india-market-estimates-inr-v4" },
            {
                $setOnInsert: {
                    exchangeRate: USD_TO_INR_RATE,
                    appliedAt: new Date(),
                    seededInInr: true,
                    pricingModel: "category-market-estimate",
                },
            },
            { upsert: true },
        );
        console.info(`Imported ${products.length} products and their categories.`);
    } else {
        console.info("Product collection is not empty; skipping catalog import.");
    }
};
>>>>>>> 77346cf80669f40e7cdd4994e406d12c62e56b63

try {
  const adminCreated = await seedAdminFromEnvironment();
  const { categories, products } = readStore();
  console.info(`JSON data ready: ${products.length} products and ${categories.length} categories.`);
  if (adminCreated) console.info("Admin account created from environment credentials.");
  else if (!process.env.ADMIN_EMAIL) console.info("Admin account creation skipped; no admin credentials configured.");
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
}
