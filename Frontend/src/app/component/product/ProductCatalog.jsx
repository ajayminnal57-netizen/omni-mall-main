"use client";

import { useMemo, useState } from "react";
import ProductCard from "../common/ProductCard";

const ProductCatalog = ({ products, initialQuery = "", initialCategory = "", loadError = false }) => {
    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState("featured");

    const categories = useMemo(
        () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
        [products],
    );

    const visibleProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const filtered = products.filter((product) => {
            const matchesQuery = !normalizedQuery || [
                product.title,
                product.description,
                product.brand,
                product.category,
            ].some((value) => value?.toLowerCase().includes(normalizedQuery));
            return matchesQuery && (!category || product.category === category);
        });

        if (sort === "price-low") return filtered.sort((left, right) => left.price - right.price);
        if (sort === "price-high") return filtered.sort((left, right) => right.price - left.price);
        if (sort === "rating") return filtered.sort((left, right) => right.rating - left.rating);
        return filtered;
    }, [category, products, query, sort]);

    return (
        <>
            {loadError && (
                <p className="mx-auto mb-6 w-full max-w-7xl border-y border-red-200 py-4 text-sm text-red-800" role="alert">
                    We couldn’t load the collection. Refresh the page to try again.
                </p>
            )}
            <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4 border-y border-stone-300 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2" aria-label="Filter by category">
                    <button
                        type="button"
                        onClick={() => setCategory("")}
                        aria-pressed={!category}
                        className={`rounded-full border px-4 py-2 text-sm transition ${!category ? "border-gray-950 bg-gray-950 text-white" : "border-stone-300 text-stone-700 hover:border-gray-950"}`}
                    >
                        All
                    </button>
                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setCategory(category === item ? "" : item)}
                            aria-pressed={category === item}
                            className={`rounded-full border px-4 py-2 text-sm capitalize transition ${category === item ? "border-gray-950 bg-gray-950 text-white" : "border-stone-300 text-stone-700 hover:border-gray-950"}`}
                        >
                            {item.replaceAll("-", " ")}
                        </button>
                    ))}
                </div>
                <label className="flex items-center gap-3 text-sm text-stone-600">
                    Sort by
                    <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="rounded-md border border-stone-300 bg-transparent px-3 py-2 text-stone-950 outline-none focus:ring-2 focus:ring-stone-500"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: low to high</option>
                        <option value="price-high">Price: high to low</option>
                        <option value="rating">Top rated</option>
                    </select>
                </label>
            </div>

            <p className="mx-auto mb-5 w-full max-w-7xl text-sm text-stone-600" aria-live="polite">
                {visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}
                {query && <> matching “{query}”</>}
            </p>

            {loadError ? null : visibleProducts.length > 0 ? (
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {visibleProducts.map((product) => (
                        <div key={product.id} className="min-w-0 [&>.card]:w-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mx-auto flex min-h-64 w-full max-w-7xl flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-medium text-stone-950">No pieces found</h2>
                    <p className="mt-2 text-sm text-stone-600">Try another search or clear your category filter.</p>
                    <button
                        type="button"
                        onClick={() => { setQuery(""); setCategory(""); }}
                        className="mt-5 border border-stone-400 px-5 py-2 text-sm transition hover:bg-gray-950 hover:text-white"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </>
    );
};

export default ProductCatalog;
