import Image from "next/image";
import Link from "next/link";

const ShopSections = ({ products }) => {
    const categories = [...new Set(products.map((product) => product.category).filter(Boolean))].slice(0, 4);

    return (
        <>
            {categories.length > 0 && (
                <section className="bg-[#f4f1eb] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Browse by category</p>
                                <h2 className="text-3xl font-medium tracking-tight text-stone-950 sm:text-4xl">Find a place to begin.</h2>
                            </div>
                            <Link href="/product" className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-950">
                                View the full collection
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                            {categories.map((category) => {
                                const product = products.find((item) => item.category === category);
                                return (
                                    <Link
                                        key={category}
                                        href={`/product?category=${encodeURIComponent(category)}`}
                                        className="group relative isolate flex aspect-[4/5] items-end overflow-hidden rounded-2xl bg-stone-300 p-4 text-white sm:p-6"
                                    >
                                        <Image
                                            src={product.thumbnail}
                                            alt=""
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="absolute inset-0 -z-20 object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                                        <span className="text-base font-medium capitalize sm:text-xl">{category.replaceAll("-", " ")}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-amber-50 px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">The Omni Mall approach</p>
                        <h2 className="max-w-lg text-3xl font-medium tracking-tight text-stone-950 sm:text-5xl">Good design should feel like home.</h2>
                        <p className="mt-5 max-w-lg text-sm leading-7 text-stone-600 sm:text-base">
                            Explore practical pieces, compare details, and take your time finding something that fits your space and your everyday life.
                        </p>
                        <Link href="/product" className="mt-7 inline-flex items-center gap-3 rounded-3xl bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700">
                            Explore the collection
                            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            ["01", "Considered selection", "A collection you can browse one piece at a time."],
                            ["02", "Product details", "Check ratings, descriptions, delivery information, and availability before you choose."],
                            ["03", "Your cart, your pace", "Keep your picks together and update quantities whenever you like."],
                            ["04", "Easy discovery", "Search the collection or narrow it down by category and price."],
                        ].map(([number, title, description]) => (
                            <article key={number} className="border border-stone-200 bg-white/60 p-5 sm:p-6">
                                <p className="text-xs font-semibold tracking-[0.2em] text-stone-400">{number}</p>
                                <h3 className="mt-4 font-medium text-stone-950">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#e8dfd0] px-5 py-14 sm:px-8 sm:py-16">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-600">A little inspiration goes a long way</p>
                        <h2 className="text-2xl font-medium text-stone-950 sm:text-3xl">Make room for something you love.</h2>
                    </div>
                    <Link href="/product" className="inline-flex w-fit items-center gap-3 rounded-3xl border border-stone-800 px-6 py-3 text-sm font-medium text-stone-950 transition hover:bg-stone-950 hover:text-white">
                        Find your next piece
                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </>
    );
};

export default ShopSections;
