
import React from 'react';
import { fetchProducts } from '@/app/services/api';
import Header from '@/app/component/common/Header';
import ProductDetailCard from '@/app/component/product/ProductDetailCard';
import ReviewComments from '@/app/component/product/ReviewComments';
import { notFound } from 'next/navigation';

const Page = async ({ params }) => {
    const { pid } = await params;

    let products = [];

    try {
        products = await fetchProducts();
    } catch (error) {
        console.error('Failed to load product details:', error);
        throw error;
    }

    const product = products.find(
        (item) => String(item.id) === String(pid)
    );

    if (!product) {
        notFound();
    }

    return (
        <>
            <div className="min-h-screen bg-amber-50">
                <div className="bg-gray-950">
                    <Header />
                </div>
                <ProductDetailCard product={product} />
                <ReviewComments reviews={product.reviews} />
            </div>
        </>
    );
};

export default Page;
