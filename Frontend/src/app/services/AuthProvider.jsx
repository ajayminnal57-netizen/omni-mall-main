"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "./api";
import { readCart, replaceCart, subscribeToCart } from "./cart";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        if (!user) return undefined;
        let active = true;
        let updatingFromServer = false;
        let writeQueue = Promise.resolve();

        const syncGuestCart = async () => {
            const items = readCart().map((item) => ({ productId: String(item.id), quantity: item.quantity }));
            const data = await apiRequest("/cart/sync", {
                method: "POST",
                body: JSON.stringify({ items }),
            });
            if (!active) return;
            updatingFromServer = true;
            replaceCart(data.items);
            updatingFromServer = false;
        };

        syncGuestCart().catch((error) => console.error("Unable to synchronize the cart:", error));

        const unsubscribe = subscribeToCart(() => {
            if (updatingFromServer) return;
            writeQueue = writeQueue.then(() => apiRequest("/cart", {
                method: "PUT",
                body: JSON.stringify({
                    items: readCart().map((item) => ({ productId: String(item.id), quantity: item.quantity })),
                }),
            })).catch((error) => console.error("Unable to save the cart:", error));
        });

        return () => {
            active = false;
            unsubscribe();
        };
    }, [user]);

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
