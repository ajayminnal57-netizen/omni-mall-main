"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../component/common/Header";
import { useAuth } from "../services/AuthProvider";
import { apiRequest } from "../services/api";

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

const loadDashboard = async () => {
    const [summary, orderData] = await Promise.all([
        apiRequest("/admin/summary"),
        apiRequest("/admin/orders"),
    ]);
    return { summary, orders: orderData.orders };
};

export default function AdminPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [dashboard, setDashboard] = useState(null);
    const [pageError, setPageError] = useState("");
    const [updatingOrder, setUpdatingOrder] = useState("");
    const [dataLoading, setDataLoading] = useState(true);
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (loading || !isAdmin) return undefined;
        let active = true;
        loadDashboard()
            .then((data) => { if (active) setDashboard(data); })
            .catch((error) => { if (active) setPageError(error.message); })
            .finally(() => { if (active) setDataLoading(false); });
        return () => { active = false; };
    }, [isAdmin, loading]);

    const updateOrderStatus = async (orderId, status) => {
        setPageError("");
        setUpdatingOrder(orderId);
        try {
            await apiRequest(`/admin/orders/${orderId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            setDashboard((current) => ({
                ...current,
                orders: current.orders.map((order) => order._id === orderId ? { ...order, status } : order),
            }));
        } catch (error) {
            setPageError(error.message);
        } finally {
            setUpdatingOrder("");
        }
    };

    const logOut = async () => {
        await signOut();
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen bg-[#f4f1eb] text-stone-950">
            <div className="bg-gray-950"><Header /></div>
            <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
                {loading ? (
                    <p className="border-y border-stone-300 py-8 text-sm text-stone-600" role="status">Checking your session...</p>
                ) : !user ? (
                    <section className="border-y border-stone-300 py-12">
                        <h1 className="text-3xl font-medium">Admin sign-in required</h1>
                        <Link href="/auth/login" className="mt-6 inline-flex bg-gray-950 px-6 py-3 text-sm font-medium text-white">Log in</Link>
                    </section>
                ) : !isAdmin ? (
                    <section className="border-y border-stone-300 py-12">
                        <h1 className="text-3xl font-medium">Administrator access required</h1>
                        <p className="mt-3 text-sm text-stone-600">This account does not have administrator permissions.</p>
                        <Link href="/account" className="mt-6 inline-flex border border-stone-400 px-6 py-3 text-sm font-medium">Go to your account</Link>
                    </section>
                ) : (
                    <>
                        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-stone-300 pb-6">
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Omni Mall</p>
                                <h1 className="text-3xl font-medium sm:text-5xl">Admin dashboard</h1>
                                <p className="mt-3 text-sm text-stone-600">Signed in as {user.username}</p>
                            </div>
                            <button type="button" onClick={logOut} className="border border-stone-400 px-5 py-3 text-sm transition hover:border-stone-950">Log out</button>
                        </header>

                        {pageError && <p className="mb-6 border-y border-red-300 py-3 text-sm text-red-800" role="alert">{pageError}</p>}

                        {dataLoading ? (
                            <p className="border-y border-stone-300 py-8 text-sm text-stone-600" role="status">Loading dashboard...</p>
                        ) : dashboard && (
                            <>
                                <section aria-label="Store summary" className="grid grid-cols-2 border-y border-stone-300 sm:grid-cols-4">
                                    {[
                                        ["Active products", dashboard.summary.products],
                                        ["Customers", dashboard.summary.customers],
                                        ["Orders", dashboard.summary.orders],
                                        ["Recorded revenue", formatPrice(dashboard.summary.revenueCents)],
                                    ].map(([label, value]) => (
                                        <div key={label} className="border-b border-r border-stone-300 px-4 py-5 last:border-r-0 sm:border-b-0 sm:px-6">
                                            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{label}</p>
                                            <p className="mt-2 text-2xl font-medium tabular-nums">{value}</p>
                                        </div>
                                    ))}
                                </section>

                                <section className="mt-12">
                                    <div className="mb-5 flex items-baseline justify-between border-b border-stone-300 pb-4">
                                        <h2 className="text-xl font-medium">Orders</h2>
                                        <span className="text-sm text-stone-500">Latest {dashboard.orders.length}</span>
                                    </div>
                                    {dashboard.orders.length ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                                                <thead>
                                                    <tr className="border-b border-stone-300 text-xs uppercase tracking-wider text-stone-500">
                                                        <th className="py-3 pr-4 font-medium">Order</th>
                                                        <th className="py-3 pr-4 font-medium">Customer</th>
                                                        <th className="py-3 pr-4 font-medium">Placed</th>
                                                        <th className="py-3 pr-4 font-medium">Total</th>
                                                        <th className="py-3 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-stone-200">
                                                    {dashboard.orders.map((order) => (
                                                        <tr key={order._id}>
                                                            <td className="py-4 pr-4 font-medium">{order._id.slice(-8).toUpperCase()}</td>
                                                            <td className="py-4 pr-4">{order.user?.username || order.shippingAddress.name}</td>
                                                            <td className="py-4 pr-4 text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                            <td className="py-4 pr-4 tabular-nums">{formatPrice(order.totalCents)}</td>
                                                            <td className="py-4">
                                                                <select
                                                                    value={order.status}
                                                                    disabled={updatingOrder === order._id || ["cancelled", "delivered"].includes(order.status)}
                                                                    onChange={(event) => updateOrderStatus(order._id, event.target.value)}
                                                                    aria-label={`Status for order ${order._id.slice(-8)}`}
                                                                    className="border border-stone-300 bg-white px-2 py-2 capitalize disabled:bg-stone-100"
                                                                >
                                                                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="border-y border-stone-200 py-8 text-sm text-stone-600">No orders yet.</p>
                                    )}
                                </section>
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}