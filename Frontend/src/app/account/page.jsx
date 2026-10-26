"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Header from "../component/common/Header";
import { useAuth } from "../services/AuthProvider";
import { apiRequest } from "../services/api";

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function AccountPage() {
    const { user, loading, signOut, updateProfile } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [ordersLoading, setOrdersLoading] = useState(true);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ values: { username: user?.username ?? "" } });

    useEffect(() => {
        if (!user) return;
        let active = true;
        apiRequest("/orders")
            .then((data) => { if (active) setOrders(data.orders); })
            .catch((error) => { if (active) setMessage(error.message); })
            .finally(() => { if (active) setOrdersLoading(false); });
        return () => { active = false; };
    }, [user]);

    const saveProfile = async ({ username }) => {
        setMessage("");
        try {
            await updateProfile({ username });
            setMessage("Profile updated.");
        } catch (error) {
            setError("username", { message: error.message });
        }
    };

    const logOut = async () => {
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f1eb] text-stone-950">
            <div className="bg-gray-950"><Header /></div>
        
            <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
                {loading ? (
                    <p className="border-y border-stone-300 py-8 text-sm text-stone-600" role="status">Loading your account...</p>
                ) : !user ? (
                    <section className="border-y border-stone-300 py-12">
                        <h1 className="text-3xl font-medium">Sign in to your account</h1>
                        <p className="mt-3 text-sm text-stone-600">Your profile and order history are available after signing in.</p>
                        <Link href="/auth/login" className="mt-6 inline-flex bg-gray-950 px-6 py-3 text-sm font-medium text-white">Log in</Link>
                    </section>
                ) : (
                    <>
                        <header className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-stone-300 pb-6">
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Your account</p>
                                <h1 className="text-3xl font-medium sm:text-5xl">Hello, {user.username}.</h1>
                                <p className="mt-3 text-sm text-stone-600">{user.email}</p>
                            </div>
                            <button type="button" onClick={logOut} className="border border-stone-400 px-5 py-3 text-sm transition hover:border-stone-950">Log out</button>
                        </header>

                        <div className="grid gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <section>
                                <h2 className="text-xl font-medium">Profile</h2>
                                <form onSubmit={handleSubmit(saveProfile)} className="mt-5 space-y-4">
                                    <label className="block text-sm text-stone-700">
                                        Username
                                        <input {...register("username", { required: "Username is required", minLength: { value: 3, message: "Use at least 3 characters." } })} className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 outline-none focus:border-stone-700" />
                                    </label>
                                    {errors.username && <p className="text-sm text-red-700" role="alert">{errors.username.message}</p>}
                                    <button type="submit" disabled={isSubmitting} className="bg-gray-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{isSubmitting ? "Saving..." : "Save profile"}</button>
                                </form>
                            </section>

                            <section>
                                <div className="flex items-baseline justify-between border-b border-stone-300 pb-4">
                                    <h2 className="text-xl font-medium">Order history</h2>
                                    <span className="text-sm text-stone-500">{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
                                </div>
                                {message && <p className="mt-4 text-sm text-stone-700" role="status">{message}</p>}
                                {ordersLoading ? (
                                    <p className="py-8 text-sm text-stone-600" role="status">Loading orders...</p>
                                ) : orders.length ? (
                                    <div className="divide-y divide-stone-200">
                                        {orders.map((order) => (
                                            <article key={order._id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                                                <div>
                                                    <p className="font-medium">Order {order._id.slice(-8).toUpperCase()}</p>
                                                    <p className="mt-1 text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{money(order.totalCents)}</p>
                                                    <p className="mt-1 text-xs capitalize text-stone-500">{order.status}</p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-sm text-stone-600">Your completed checkouts will appear here.</p>
                                )}
                            </section>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
