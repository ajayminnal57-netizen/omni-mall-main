"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/services/cart";

const ProductDetailCard = ({ product }) => {
    const [imagePreview, setImagePreview] = useState(product.thumbnail);
    const router = useRouter();

    const handleAddToCart = () => {
        addToCart(product);
        router.push("/cart");
    };

    const handleBuyNow = () => {
        addToCart(product);
        router.push("/checkout");
    };

    return (
        <div className="w-full">
            <div className="product-container mx-auto flex max-w-7xl flex-col gap-2 border-b border-gray-300 sm:flex-row sm:items-stretch">
                {/* Product Images */}
                <div className="flex w-full flex-col items-center justify-center bg-amber-50 p-4 sm:w-[38%] sm:p-3 lg:w-[40%]">
                    <img
                        className="h-auto max-h-[300px] w-auto max-w-full object-contain duration-150 hover:-translate-y-2"
                        src={imagePreview}
                        alt={product.title}
                    />

                    <div className="mt-7 grid w-full max-w-[420px] grid-cols-3 gap-1.5 sm:max-w-none">
                        {product.images.map((img, index) => {
                            return (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.title} ${index + 1}`}
                                    onClick={() => setImagePreview(img)}
                                    className="h-20 w-full cursor-pointer border-2 border-gray-450 object-contain p-2 duration-150 hover:-translate-y-1 sm:h-24 md:h-28 lg:h-32"
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Product Information */}
                <div className="flex w-full flex-col justify-center bg-amber-50 p-5 text-gray-950 sm:w-[62%] sm:p-6 md:p-8 lg:p-10">
                    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
                        <div>
                            <p className="text-[0.8rem] capitalize text-gray-400">
                                {product.category}
                            </p>

                            <h1 className="mt-2 text-[1.4rem] font-bold capitalize leading-tight text-gray-950 sm:text-[1.5rem] md:text-[1.6rem]">
                                {product.title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 text-[1rem] text-gray-700">
                            <span>{product.rating}</span>
                            <i className="fa-solid fa-star text-yellow-500"></i>
                        </div>

                        <div className="text-[1.3rem] font-bold capitalize text-gray-950">
                            <span className="mr-2 text-[1rem] font-medium text-red-500">
                                -{product.discountPercentage}%
                            </span>
                            <span>{product.price} $</span>
                        </div>

                        <p className="text-[0.9rem] font-bold capitalize text-gray-800">
                            {product.brand}
                        </p>

                        <p className="text-[0.8rem] capitalize leading-relaxed text-gray-800">
                            {product.description}
                        </p>

                        <div className="flex flex-col gap-3 py-3 font-bold md:flex-row md:gap-6">
                            <span>
                                <i className="fa-solid fa-circle-check"></i>{" "}
                                {product.warrantyInformation}
                            </span>

                            <span>
                                <i className="fa-solid fa-truck-fast"></i>{" "}
                                {product.shippingInformation}
                            </span>
                        </div>

                        <p className="text-[1.3rem] font-bold text-green-800 sm:text-[1.5rem]">
                            {product.availabilityStatus}
                        </p>

                        <div className="mt-2 flex w-full flex-col gap-2 min-[400px]:flex-row">
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                                className="flex w-35 items-center justify-center rounded-3xl bg-gray-950 py-3 text-base font-medium text-white transition hover:-translate-y-1 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-50"
                            >
                                Buy Now
                                <i className="fa-solid fa-arrow-right px-2" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="flex w-35 items-center justify-center rounded-3xl bg-red-100 py-3 text-base font-medium text-gray-950 duration-100 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 sm:w-50"
                            >
                                Add to cart
                                <i className="fa-solid fa-cart-plus px-2" aria-hidden="true" />
                            </button>
                        </div>
                        {product.stock <= 0 && (
                            <p className="text-sm font-medium text-red-700" role="status">This item is currently out of stock.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailCard;