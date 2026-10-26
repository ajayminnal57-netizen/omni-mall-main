"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "./api";
import { getCartOwner, readCart, replaceCart, setCartOwner, subscribeToCart } from "./cart";

const AuthContext = createContext(null);
const apiCartItems = () => readCart()
    .filter((item) => /^[a-f\d]{24}$/i.test(String(item.id)))
    .map((item) => ({ productId: String(item.id), quantity: item.quantity }));

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = user?._id ? String(user._id) : null;

    useEffect(() => {
        let active = true;
        apiRequest("/auth/me")
            .then((data) => {
                if (active) setUser(data.user);
            })
            .catch(() => {
                if (active) setUser(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!userId) return undefined;
        let active = true;
        let updatingFromServer = false;
        let writeQueue = Promise.resolve();

        const synchronizeCart = async () => {
            const isGuestCart = !getCartOwner();
            const data = isGuestCart
                ? await apiRequest("/cart/sync", {
                    method: "POST",
                    body: JSON.stringify({ items: apiCartItems() }),
                })
                : await apiRequest("/cart");
            if (!active) return;
            updatingFromServer = true;
            setCartOwner(userId);
            replaceCart(data.items);
            updatingFromServer = false;
        };

        let unsubscribe;
        synchronizeCart()
            .then(() => {
                if (!active) return;
                unsubscribe = subscribeToCart(() => {
                    if (updatingFromServer) return;
                    writeQueue = writeQueue.then(() => apiRequest("/cart", {
                        method: "PUT",
                        body: JSON.stringify({ items: apiCartItems() }),
                    })).catch((error) => console.error("Unable to save the cart:", error));
                });
            })
            .catch((error) => console.error("Unable to synchronize the cart:", error));

        return () => {
            active = false;
            unsubscribe?.();
        };
    }, [userId]);

    const signIn = async (credentials) => {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
        setUser(data.user);
        return data.user;
    };

    const signUp = async (details) => {
        const data = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(details),
        });
        setUser(data.user);
        return data.user;
    };

    const signOut = async () => {
        await apiRequest("/auth/logout", { method: "POST" });
        setUser(null);
    };

    const updateProfile = async (profile) => {
        const data = await apiRequest("/auth/me", {
            method: "PATCH",
            body: JSON.stringify(profile),
        });
        setUser(data.user);
        return data.user;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider.");
    return context;
}
