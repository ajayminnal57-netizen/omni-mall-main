import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const run = async () => {
    await mongoose.connect(env.mongoUri, { dbName: env.mongoDatabase });

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (Boolean(email) !== Boolean(password)) {
        throw new Error("Set both ADMIN_EMAIL and ADMIN_PASSWORD to create an admin account.");
    }
    if (email && password.length < 12) {
        throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
    }

    if (email) {
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin && existingAdmin.role !== "admin") {
            throw new Error("ADMIN_EMAIL already belongs to a non-admin account; choose another email.");
        }
        if (!existingAdmin) {
            await User.create({
                username: "omni-admin",
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
            price: product.price,
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
        console.info(`Imported ${products.length} products and their categories.`);
    } else {
        console.info("Product collection is not empty; skipping catalog import.");
    }
};

try {
    await run();
} catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
