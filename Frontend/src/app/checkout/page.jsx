"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Header from "../component/common/Header";
import {
    clearCart,
    getCartSnapshot,
    parseCartSnapshot,
    subscribeToCart,
} from "../services/cart";

const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

export default function CheckoutPage() {
    const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => "[]");
    const items = parseCartSnapshot(snapshot);
    const [order, setOrder] = useState(null);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8.95;
    const estimatedTax = subtotal * 0.08;

    const placeDemoOrder = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const confirmation = {
            name: formData.get("name"),
            email: formData.get("email"),
            items,
            total: subtotal + shipping + estimatedTax,
            reference: `OM-${Date.now().toString().slice(-8)}`,
        };
        setOrder(confirmation);
        clearCart();
    };

    return (
        <div className="min-h-screen bg-[#f4f1eb] text-stone-950">
            <div className="bg-gray-950">
                <Header />
            </div>

            <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
                {order ? (
                    <section className="mx-auto max-w-2xl border-y border-stone-300 py-10 text-center sm:py-16">
                        <span className="mx-auto grid size-14 place-items-center rounded-full bg-green-100 text-xl text-green-800">
                            <i className="fa-solid fa-check" aria-hidden="true" />
                        </span>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Demo checkout</p>
                        <h1 className="mt-2 text-3xl font-medium sm:text-4xl">Thank you, {order.name}.</h1>
                        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-stone-600">
                            Your sample order {order.reference} is ready. This storefront is a demo, so no payment was taken and no order was sent.
                        </p>
                        <p className="mt-4 text-sm text-stone-600">Confirmation contact: {order.email}</p>
                        <div className="mx-auto mt-8 max-w-md divide-y divide-stone-200 border-y border-stone-300 text-left">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                                    <span>{item.title} × {item.quantity}</span>
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between py-4 font-semibold">
                                <span>Estimated total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                        <Link href="/product" className="mt-8 inline-flex items-center gap-3 rounded-3xl bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700">
                            Continue shopping
                            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                        </Link>
                    </section>
                ) : (
                    <>
                        <header className="mb-9 border-b border-stone-300 pb-6 sm:mb-12">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Almost yours</p>
                            <h1 className="text-3xl font-medium sm:text-5xl">Checkout</h1>
                            <p className="mt-3 text-sm text-stone-600">Add delivery details to preview your order.</p>
                        </header>

                        {items.length === 0 ? (
                            <section className="flex min-h-64 flex-col items-start justify-center border-y border-stone-300 py-12">
                                <h2 className="text-2xl font-medium">Your cart is empty</h2>
                                <p className="mt-2 text-sm text-stone-600">Add a piece to your cart before checking out.</p>
                                <Link href="/product" className="mt-6 rounded-3xl bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700">
                                    Explore the collection
                                </Link>
                            </section>
                        ) : (
                            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
                                <form onSubmit={placeDemoOrder} className="space-y-6">
                                    <section className="space-y-4">
                                        <h2 className="text-xl font-medium">Contact details</h2>
                                        <label className="block text-sm text-stone-700">
                                            Full name
                                            <input name="name" autoComplete="name" required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                        </label>
                                        <label className="block text-sm text-stone-700">
                                            Email address
                                            <input name="email" type="email" autoComplete="email" required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                        </label>
                                    </section>

                                    <section className="space-y-4 border-t border-stone-300 pt-6">
                                        <h2 className="text-xl font-medium">Delivery address</h2>
                                        <label className="block text-sm text-stone-700">
                                            Street address
                                            <input name="address" autoComplete="street-address" required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                        </label>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="block text-sm text-stone-700">
                                                City
                                                <input name="city" autoComplete="address-level2" required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                            </label>
                                            <label className="block text-sm text-stone-700">
                                                Postal code
                                                <input name="postalCode" autoComplete="postal-code" required className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                            </label>
                                        </div>
                                    </section>

                                    <p className="border-l-2 border-stone-400 pl-4 text-sm leading-6 text-stone-600">
                                        Demo checkout only. No payment details are collected, and this form does not create a real order.
                                    </p>
                                    <button type="submit" className="flex w-full items-center justify-center gap-3 bg-gray-950 px-6 py-4 text-sm font-medium text-white transition hover:bg-stone-700 sm:w-auto">
                                        Place demo order
                                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                                    </button>
                                </form>

                                <aside className="h-fit border-t border-stone-300 pt-5 lg:border-t-0 lg:pt-0">
                                    <h2 className="text-xl font-medium">Order summary</h2>
                                    <div className="mt-5 divide-y divide-stone-200 border-y border-stone-300">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between gap-4 py-4 text-sm">
                                                <span className="text-stone-700">{item.title} × {item.quantity}</span>
                                                <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 space-y-3 border-b border-stone-300 pb-5 text-sm">
                                        <div className="flex justify-between"><span className="text-stone-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                                        <div className="flex justify-between"><span className="text-stone-600">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                                        <div className="flex justify-between"><span className="text-stone-600">Estimated tax</span><span>{formatPrice(estimatedTax)}</span></div>
                                    </div>
                                    <div className="mt-5 flex justify-between font-semibold">
                                        <span>Total</span><span>{formatPrice(subtotal + shipping + estimatedTax)}</span>
                                    </div>
                                    <p className="mt-3 text-xs leading-5 text-stone-500">Demo estimate only. Shipping is free on orders over $100; tax is estimated at 8%.</p>
                                </aside>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
