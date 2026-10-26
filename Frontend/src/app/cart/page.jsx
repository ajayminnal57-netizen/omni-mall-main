"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Header from "../component/common/Header";
import {
    getCartSnapshot,
    parseCartSnapshot,
    removeFromCart,
    setCartItemQuantity,
    subscribeToCart,
} from "../services/cart";

const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

export default function CartPage() {
    const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => "[]");
    const items = parseCartSnapshot(snapshot);

    const updateQuantity = (item, quantity) => {
        setCartItemQuantity(item.id, quantity);
    };

    const removeItem = (productId) => {
        removeFromCart(productId);
    };

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#f4f1eb] text-stone-950">
            <div className="bg-gray-950">
                <Header />
            </div>

            <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
                <div className="mb-9 border-b border-stone-300 pb-6 sm:mb-12">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Your selection</p>
                    <h1 className="text-3xl font-medium sm:text-5xl">Shopping cart</h1>
                    <p className="mt-3 text-sm text-stone-600">
                        {`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
                    </p>
                </div>

                {items.length === 0 ? (
                    <section className="flex min-h-64 flex-col items-start justify-center border-y border-stone-300 py-12">
                        <i className="fa-solid fa-bag-shopping mb-5 text-3xl text-stone-500" aria-hidden="true" />
                        <h2 className="text-2xl font-medium">Your cart is empty</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                            Find something that feels like you and it will be waiting here.
                        </p>
                        <Link
                            href="/product"
                            className="mt-6 inline-flex items-center gap-3 bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
                        >
                            Explore the collection
                            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                        </Link>
                    </section>
                ) : (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
                        <section aria-label="Cart items" className="divide-y divide-stone-300 border-y border-stone-300">
                            {items.map((item) => (
                                <article key={item.id} className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-6">
                                    <Link href={`/product/${item.id}`} className="flex aspect-square items-center justify-center bg-white p-3">
                                        <img src={item.thumbnail} alt={item.title} className="max-h-full max-w-full object-contain" />
                                    </Link>

                                    <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div className="min-w-0">
                                            <p className="text-xs capitalize text-stone-500">{item.category || "Selected design"}</p>
                                            <Link href={`/product/${item.id}`} className="mt-1 block font-medium leading-snug hover:underline">
                                                {item.title}
                                            </Link>
                                            <p className="mt-2 text-sm text-stone-600">{formatPrice(item.price)} each</p>
                                        </div>

                                        <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end sm:gap-3">
                                            <div className="flex h-10 items-center border border-stone-300" aria-label={`Quantity for ${item.title}`}>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, item.quantity - 1)}
                                                    className="grid size-10 place-items-center text-stone-700 transition hover:bg-stone-200"
                                                    aria-label={`Decrease ${item.title} quantity`}
                                                >
                                                    <i className="fa-solid fa-minus text-xs" aria-hidden="true" />
                                                </button>
                                                <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, item.quantity + 1)}
                                                    disabled={item.quantity >= (item.stock ?? Infinity)}
                                                    className="grid size-10 place-items-center text-stone-700 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
                                                    aria-label={`Increase ${item.title} quantity`}
                                                >
                                                    <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="grid size-9 place-items-center text-stone-500 transition hover:text-red-700"
                                                    aria-label={`Remove ${item.title} from cart`}
                                                >
                                                    <i className="fa-regular fa-trash-can" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>

                        <aside className="h-fit border-t border-stone-300 pt-5 lg:border-t-0 lg:pt-0">
                            <h2 className="text-xl font-medium">Order summary</h2>
                            <div className="mt-6 flex justify-between border-b border-stone-300 pb-4 text-sm">
                                <span className="text-stone-600">Subtotal</span>
                                <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
                            </div>
                            <p className="mt-4 text-xs leading-5 text-stone-500">Shipping and taxes are calculated at checkout.</p>
                            <Link
                                href="/checkout"
                                className="mt-7 flex w-full items-center justify-center gap-3 bg-gray-950 px-6 py-4 text-sm font-medium text-white transition hover:bg-stone-700"
                            >
                                Continue to checkout
                                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                            </Link>
                            <Link href="/product" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-950">
                                <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
                                Continue shopping
                            </Link>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}