
import React from 'react';
import Link from 'next/link';

const ProductCard = ({ product }) => {
    return (
        <Link href={`/product/${product.id}`} className="block">
            <article className="card m-auto flex h-96 w-72 shrink-0 flex-col justify-between bg-amber-50 p-4 transition duration-200 hover:-translate-y-2">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    className="h-64 w-full object-contain"
                />

                <h4 className="line-clamp-1 w-full text-center text-sm font-medium text-gray-950">
                    {product.title}
                </h4>
            </article>
        </Link>
    );
};

export default ProductCard;
