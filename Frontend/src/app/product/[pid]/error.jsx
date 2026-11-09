"use client";

export default function ProductError({ error, reset }) {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center bg-amber-50 px-5 text-center">
            <h1 className="text-2xl font-medium text-stone-950">We couldn’t load this product</h1>
            <p className="mt-3 max-w-lg text-sm text-stone-600">
                {error.message || "The product service is unavailable right now. Please try again."}
            </p>
            <button type="button" onClick={reset} className="mt-6 bg-gray-950 px-6 py-3 text-sm font-medium text-white">
                Try again
            </button>
        </main>
    );
}
