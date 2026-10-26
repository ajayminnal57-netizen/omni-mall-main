import Image from 'next/image';
import Link from 'next/link';

const ImageGalary = ({ products }) => {
    const featuredProducts = products.slice(0, 3);

    return (
        <section className="w-full bg-[#f4f1eb] px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                            Thoughtfully chosen
                        </p>
                        <h2 className="max-w-xl text-3xl font-medium tracking-tight text-stone-900 sm:text-5xl">
                            Pieces that make a space.
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-6 text-stone-600 sm:text-base">
                        A closer look at the details, materials, and silhouettes worth bringing home.
                    </p>
                </div>

                <div className="grid auto-rows-[minmax(280px,1fr)] grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                    {featuredProducts.map((product, index) => (
                        <Link
                            href={`/product/${product.id}`}
                            aria-label={`View ${product.title}`}
                            key={product.id}
                            className={`gallery-card group relative isolate flex min-h-[340px] overflow-hidden rounded-[1.75rem] bg-stone-900 p-6 text-white shadow-sm transition-shadow duration-500 hover:shadow-xl sm:p-8 ${
                                index === 0 ? 'md:row-span-2 md:min-h-[580px]' : 'md:min-h-[280px]'
                            }`}
                        >
                            <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                loading="lazy"
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 60vw"
                                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/15 to-black/5" />

                            <div className="mt-auto flex w-full items-end justify-between gap-5">
                                <div className="max-w-xl">
                                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                                        {product.category || 'Selected design'} <span className="px-1">/</span> 0{index + 1}
                                    </p>
                                    <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
                                        {product.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-2 max-w-lg text-sm leading-6 text-white/75">
                                        {product.description}
                                    </p>
                                </div>
                                <span
                                    aria-hidden="true"
                                    className="mb-1 flex size-11 shrink-0 items-center justify-center rounded-full border border-white/50 text-lg transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-stone-900"
                                >
                                    ↗
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ImageGalary
