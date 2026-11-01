"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Header from "../component/common/Header";
import { useAuth } from "../services/AuthProvider";
import { apiRequest } from "../services/api";
import {
    clearCart,
    getCartSnapshot,
    parseCartSnapshot,
    subscribeToCart,
} from "../services/cart";
import {
    formatInr,
    formatInrPaise,
    SHIPPING_FEE_INR,
    SHIPPING_THRESHOLD_INR,
} from "../services/currency";

export default function CheckoutPage() {
    const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => "[]");
    const items = parseCartSnapshot(snapshot);
    const [order, setOrder] = useState(null);
    const [submitError, setSubmitError] = useState("");
    const { user, loading } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ values: { name: user?.username ?? "", email: user?.email ?? "" } });
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal >= SHIPPING_THRESHOLD_INR || subtotal === 0 ? 0 : SHIPPING_FEE_INR;
    const estimatedTax = subtotal * 0.08;

    const placeOrder = async (values) => {
        setSubmitError("");
        try {
            const data = await apiRequest("/orders", {
                method: "POST",
                body: JSON.stringify({
                    items: items.map((item) => ({ productId: String(item.id), quantity: item.quantity })),
                    shippingAddress: values,
                }),
            });
            const created = data.order;
            setOrder({
                name: created.shippingAddress.name,
                email: created.shippingAddress.email,
                items: created.items.map((item) => ({
                    id: String(item.product),
                    title: item.title,
                    quantity: item.quantity,
                    price: item.unitPriceCents / 100,
                })),
                totalCents: created.totalCents,
                reference: `OM-${created._id.slice(-8).toUpperCase()}`,
            });
            clearCart();
        } catch (error) {
            setSubmitError(error.message);
        }
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
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Order confirmed</p>
                        <h1 className="mt-2 text-3xl font-medium sm:text-4xl">Thank you, {order.name}.</h1>
                        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-stone-600">
                            Your order {order.reference} has been submitted. Payment is not collected by this storefront.
                        </p>
                        <p className="mt-4 text-sm text-stone-600">Confirmation contact: {order.email}</p>
                        <div className="mx-auto mt-8 max-w-md divide-y divide-stone-200 border-y border-stone-300 text-left">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                                    <span>{item.title} × {item.quantity}</span>
                                    <span>{formatInr(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between py-4 font-semibold">
                                <span>Estimated total</span>
                                <span>{formatInrPaise(order.totalCents)}</span>
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
                            <p className="mt-3 text-sm text-stone-600">Add delivery details to place your order.</p>
                        </header>

                        {items.length === 0 ? (
                            <section className="flex min-h-64 flex-col items-start justify-center border-y border-stone-300 py-12">
                                <h2 className="text-2xl font-medium">Your cart is empty</h2>
                                <p className="mt-2 text-sm text-stone-600">Add a piece to your cart before checking out.</p>
                                <Link href="/product" className="mt-6 rounded-3xl bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700">
                                    Explore the collection
                                </Link>
                            </section>
                        ) : loading ? (
                            <p className="border-y border-stone-300 py-8 text-sm text-stone-600" role="status">Checking your account...</p>
                        ) : !user ? (
                            <section className="border-y border-stone-300 py-10">
                                <h2 className="text-2xl font-medium">Sign in to place your order</h2>
                                <p className="mt-2 text-sm text-stone-600">Your cart will stay here while you sign in or create an account.</p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link href="/auth/login" className="bg-gray-950 px-6 py-3 text-sm font-medium text-white">Log in</Link>
                                    <Link href="/auth/signup" className="border border-stone-400 px-6 py-3 text-sm font-medium">Create account</Link>
                                </div>
                            </section>
                        ) : (
                            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
                                <form onSubmit={handleSubmit(placeOrder)} className="space-y-6">
                                    <section className="space-y-4">
                                        <h2 className="text-xl font-medium">Contact details</h2>
                                        <label className="block text-sm text-stone-700">
                                            Full name
                                            <input autoComplete="name" {...register("name", { required: "Enter your full name." })} className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                            {errors.name && <span className="mt-1 block text-xs text-red-700">{errors.name.message}</span>}
                                        </label>
                                        <label className="block text-sm text-stone-700">
                                            Email address
                                            <input type="email" autoComplete="email" {...register("email", { required: "Enter your email address." })} className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                            {errors.email && <span className="mt-1 block text-xs text-red-700">{errors.email.message}</span>}
                                        </label>
                                    </section>

                                    <section className="space-y-4 border-t border-stone-300 pt-6">
                                        <h2 className="text-xl font-medium">Delivery address</h2>
                                        <label className="block text-sm text-stone-700">
                                            Street address
                                            <input autoComplete="street-address" {...register("address", { required: "Enter your street address." })} className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                            {errors.address && <span className="mt-1 block text-xs text-red-700">{errors.address.message}</span>}
                                        </label>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="block text-sm text-stone-700">
                                                City
                                                <input autoComplete="address-level2" {...register("city", { required: "Enter your city." })} className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                                {errors.city && <span className="mt-1 block text-xs text-red-700">{errors.city.message}</span>}
                                            </label>
                                            <label className="block text-sm text-stone-700">
                                                Postal code
                                                <input autoComplete="postal-code" {...register("postalCode", { required: "Enter your postal code." })} className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-stone-700" />
                                                {errors.postalCode && <span className="mt-1 block text-xs text-red-700">{errors.postalCode.message}</span>}
                                            </label>
                                        </div>
                                    </section>

                                    {submitError && <p className="border-l-2 border-red-600 pl-4 text-sm leading-6 text-red-800" role="alert">{submitError}</p>}
                                    <p className="border-l-2 border-stone-400 pl-4 text-sm leading-6 text-stone-600">
                                        Payment is not collected. Your order and stock reservation are recorded in your account.
                                    </p>
                                    <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-3 bg-gray-950 px-6 py-4 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                                        {isSubmitting ? "Submitting order..." : "Place order"}
                                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                                    </button>
                                </form>

                                <aside className="h-fit border-t border-stone-300 pt-5 lg:border-t-0 lg:pt-0">
                                    <h2 className="text-xl font-medium">Order summary</h2>
                                    <div className="mt-5 divide-y divide-stone-200 border-y border-stone-300">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between gap-4 py-4 text-sm">
                                                <span className="text-stone-700">{item.title} × {item.quantity}</span>
                                                <span className="shrink-0 font-medium">{formatInr(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 space-y-3 border-b border-stone-300 pb-5 text-sm">
                                        <div className="flex justify-between"><span className="text-stone-600">Subtotal</span><span>{formatInr(subtotal)}</span></div>
                                        <div className="flex justify-between"><span className="text-stone-600">Shipping</span><span>{shipping === 0 ? "Free" : formatInr(shipping)}</span></div>
                                        <div className="flex justify-between"><span className="text-stone-600">Estimated tax</span><span>{formatInr(estimatedTax)}</span></div>
                                    </div>
                                    <div className="mt-5 flex justify-between font-semibold">
                                        <span>Total</span><span>{formatInr(subtotal + shipping + estimatedTax)}</span>
                                    </div>
                                    <p className="mt-3 text-xs leading-5 text-stone-500">Final totals are recalculated from current product prices and stock when submitted.</p>
                                </aside>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
