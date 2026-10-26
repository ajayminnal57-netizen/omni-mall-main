"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getCartSnapshot, parseCartSnapshot, subscribeToCart } from "../../services/cart";

const Header = () => {
    const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => "[]");
    const itemCount = parseCartSnapshot(snapshot).reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="relative z-20 flex w-full items-center justify-around px-3 py-4 text-white sm:px-5 sm:py-5 md:px-8">
            <Link href="/" aria-label="Omni Mall home" className="brand m-auto flex shrink-0 items-center justify-center">
                <Image
                    src="/images/brand-logo.png"
                    alt="Omni Mall"
                    width={120}
                    height={64}
                    className="w-[20vw] max-w-[120px] min-w-[65px] scale-110 px-2 sm:w-[15vw] sm:scale-125 sm:px-4 md:w-[12vw] md:scale-[1.6] md:px-5"
                />
            </Link>

            <form action="/product" role="search" className="flex w-[70vw] min-w-0 flex-1 justify-center px-2 sm:px-3 md:w-[70vw] md:flex-none">
                <div className="flex w-full min-w-0 items-center rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-md sm:p-2 sm:py-1">
                    <button type="submit" aria-label="Search products" className="shrink-0 p-1">
                        <i className="fa-solid fa-magnifying-glass p-2 text-[14px]" aria-hidden="true" />
                    </button>
                    <input
                        type="search"
                        name="q"
                        placeholder="Search products"
                        aria-label="Search products"
                        className="w-full min-w-0 border-0 bg-transparent px-2 text-sm font-bold capitalize text-amber-100 outline-0 placeholder:text-amber-100/70 sm:px-4 sm:text-base"
                    />
                </div>
            </form>

            <nav aria-label="Account and shopping" className="nav-actions flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
                <Link
                    href="/auth/login"
                    aria-label="Your account"
                    className="flex size-9 items-center justify-center rounded-full border border-black/20 bg-black/30 text-amber-50 backdrop-blur-md transition hover:bg-white hover:text-gray-800 sm:size-11"
                >
                    <i className="fa-regular fa-circle-user" aria-hidden="true" />
                </Link>
                <Link
                    href="/cart"
                    aria-label={`Shopping cart${itemCount ? `, ${itemCount} items` : ""}`}
                    className="relative flex size-9 items-center justify-center rounded-full border border-black/20 bg-black/30 text-amber-50 backdrop-blur-md transition hover:bg-white hover:text-gray-800 sm:size-11"
                >
                    <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
                    {itemCount > 0 && (
                        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-red-100 text-[11px] font-semibold text-gray-950">
                            {itemCount > 99 ? "99+" : itemCount}
                        </span>
                    )}
                </Link>
            </nav>
        </header>
    );
};

export default Header;
