
import React from 'react';
import { fetchProduct } from '@/app/services/api';
import Header from '@/app/component/common/Header';
import ProductDetailCard from '@/app/component/product/ProductDetailCard';
import ReviewComments from '@/app/component/product/ReviewComments';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

const Page = async ({ params }) => {
    await connection();
    const { pid } = await params;

    let product;

    try {
        product = await fetchProduct(pid);
    } catch (error) {
        console.error('Failed to load product details:', error);
        throw error;
    }

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
