
import React from 'react';
import { fetchProducts } from '../services/api';
import Header from '../component/common/Header';
import ProductCatalog from '../component/product/ProductCatalog';

const Page = async ({ searchParams }) => {
    const params = await searchParams;
    let products = [];
    let loadError = false;

    try {
        products = await fetchProducts();
    } catch (error) {
        console.error('Failed to load product catalog:', error);
        loadError = true;
    }

    return (
        <>
            <div className="bg-gray-950">
                <Header />

                <div className="min-h-screen bg-amber-50 px-4 py-10 sm:px-8 sm:py-14">
                    <header className="mx-auto mb-8 w-full max-w-7xl sm:mb-10">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                            The collection
                        </p>

                        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                            Find your next favorite piece.
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                            Explore thoughtful finds for every corner of your home.
                        </p>
                    </header>

                    <ProductCatalog products={products} initialQuery={params?.q ?? ""} initialCategory={params?.category ?? ""} loadError={loadError} />
                </div>
            </div>
        </>
    );
};

export default Page;
