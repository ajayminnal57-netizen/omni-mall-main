import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-white">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-9 px-5 py-10 sm:grid-cols-2 sm:px-8 sm:py-12 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-12">
                <div>
                    <Link href="/" aria-label="Omni Mall home" className="inline-flex">
                        <Image
                            src="/images/brand-logo.png"
                            alt="Omni Mall"
                            width={120}
                            height={64}
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                        Thoughtful finds for a home with personality.
                    </p>
                </div>

                <nav aria-label="Shop" className="flex flex-col items-start gap-3">
                    <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Shop</h2>
                    <Link href="/product" className="text-sm text-white/80 transition hover:text-white">All products</Link>
                    <Link href="/cart" className="text-sm text-white/80 transition hover:text-white">Shopping cart</Link>
                </nav>

                <nav aria-label="Account" className="flex flex-col items-start gap-3">
                    <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Account</h2>
                    <Link href="/auth/login" className="text-sm text-white/80 transition hover:text-white">Log in</Link>
                    <Link href="/auth/signup" className="text-sm text-white/80 transition hover:text-white">Create account</Link>
                </nav>
            </div>

            <div className="border-t border-white/15">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
                    <span>© Omni Mall. All rights reserved.</span>
                    <span>Made for spaces that feel like you.</span>
                </div>
            </div>
        </footer>
    );
}