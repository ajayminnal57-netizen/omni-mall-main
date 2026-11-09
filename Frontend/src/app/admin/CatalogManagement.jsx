"use client";

import { useEffect, useState } from "react";
import { apiRequest, fetchManageableProducts } from "../services/api";

const blankProduct = {
    title: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    thumbnail: "",
};
const blankCategory = { name: "", slug: "", description: "" };

export default function CatalogManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productForm, setProductForm] = useState(blankProduct);
    const [categoryForm, setCategoryForm] = useState(blankCategory);
    const [editingProduct, setEditingProduct] = useState("");
    const [editingCategory, setEditingCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;
        Promise.all([fetchManageableProducts(), apiRequest("/products/categories")])
            .then(([loadedProducts, categoryData]) => {
                if (!active) return;
                setProducts(loadedProducts);
                setCategories(categoryData.categories);
            })
            .catch((loadError) => {
                if (active) setError(loadError.message);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

    const saveProduct = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");
        const payload = {
            ...productForm,
            price: Number(productForm.price),
            stock: Number(productForm.stock),
        };
        try {
            const result = editingProduct
                ? await apiRequest(`/admin/products/${editingProduct}`, { method: "PATCH", body: JSON.stringify(payload) })
                : await apiRequest("/admin/products", { method: "POST", body: JSON.stringify(payload) });
            setProducts((current) => editingProduct
                ? current.map((item) => item.id === result.product.id ? result.product : item)
                : [result.product, ...current]);
            setMessage(editingProduct ? "Product updated." : "Product created.");
            setEditingProduct("");
            setProductForm(blankProduct);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const saveCategory = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");
        try {
            const result = editingCategory
                ? await apiRequest(`/admin/categories/${editingCategory}`, { method: "PATCH", body: JSON.stringify(categoryForm) })
                : await apiRequest("/admin/categories", { method: "POST", body: JSON.stringify(categoryForm) });
            setCategories((current) => editingCategory
                ? current.map((item) => item._id === result.category._id ? result.category : item)
                : [...current, result.category].sort((left, right) => left.name.localeCompare(right.name)));
            setMessage(editingCategory ? "Category updated." : "Category created.");
            setEditingCategory("");
            setCategoryForm(blankCategory);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const archiveProduct = async (product) => {
        setError("");
        setMessage("");
        try {
            await apiRequest(`/admin/products/${product.id}/archive`, { method: "PATCH" });
            setProducts((current) => current.filter((item) => item.id !== product.id));
            setMessage("Product archived.");
            if (editingProduct === product.id) {
                setEditingProduct("");
                setProductForm(blankProduct);
            }
        } catch (archiveError) {
            setError(archiveError.message);
        }
    };

    const archiveCategory = async (category) => {
        setError("");
        setMessage("");
        try {
            await apiRequest(`/admin/categories/${category._id}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: false }),
            });
            setCategories((current) => current.filter((item) => item._id !== category._id));
            setMessage("Category archived.");
        } catch (archiveError) {
            setError(archiveError.message);
        }
    };

    return (
        <section className="mt-12">
            <header className="mb-5 border-b border-stone-300 pb-4">
                <h2 className="text-xl font-medium">Catalog management</h2>
                <p className="mt-1 text-sm text-stone-500">Create, edit, and archive products and categories.</p>
            </header>
            {error && <p className="mb-4 border-y border-red-300 py-3 text-sm text-red-800" role="alert">{error}</p>}
            {message && <p className="mb-4 border-y border-green-300 py-3 text-sm text-green-800" role="status">{message}</p>}

            <div className="grid gap-10 lg:grid-cols-2">
                <div>
                    <h3 className="mb-4 text-lg font-medium">{editingProduct ? "Edit product" : "Add product"}</h3>
                    <form onSubmit={saveProduct} className="grid gap-3">
                        <input aria-label="Product title" placeholder="Title" required maxLength={160} value={productForm.title} onChange={(event) => setProductForm({ ...productForm, title: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                        <textarea aria-label="Product description" placeholder="Description" required maxLength={5000} rows={3} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                        <input aria-label="Brand" placeholder="Brand (optional)" maxLength={100} value={productForm.brand} onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                        <select aria-label="Product category" required value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} className="border border-stone-300 bg-white px-3 py-2">
                            <option value="">Select category</option>
                            {categories.map((category) => <option key={category._id} value={category.slug}>{category.name}</option>)}
                        </select>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input aria-label="Price in INR" type="number" placeholder="Price (INR)" min="0" max="1000000" step="0.01" required value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                            <input aria-label="Stock" type="number" placeholder="Stock" min="0" max="1000000" step="1" required value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                        </div>
                        <input aria-label="Thumbnail URL" type="url" placeholder="Thumbnail URL" required maxLength={2048} value={productForm.thumbnail} onChange={(event) => setProductForm({ ...productForm, thumbnail: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                        <div className="flex gap-3">
                            <button disabled={saving || categories.length === 0} className="bg-gray-950 px-4 py-2 text-sm text-white disabled:opacity-60">{saving ? "Saving..." : editingProduct ? "Save product" : "Create product"}</button>
                            {editingProduct && <button type="button" onClick={() => { setEditingProduct(""); setProductForm(blankProduct); }} className="border border-stone-400 px-4 py-2 text-sm">Cancel</button>}
                        </div>
                    </form>

                    <h3 className="mb-3 mt-8 text-lg font-medium">Products</h3>
                    {loading ? <p role="status" className="text-sm text-stone-600">Loading catalog...</p> : (
                        <ul className="divide-y divide-stone-200 border-y border-stone-300">
                            {products.map((product) => (
                                <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                                    <span>{product.title}</span>
                                    <span className="flex gap-3">
                                        <button type="button" className="underline" onClick={() => {
                                            setEditingProduct(product.id);
                                            setProductForm({
                                                title: product.title,
                                                description: product.description,
                                                brand: product.brand ?? "",
                                                category: product.category ?? "",
                                                price: String(product.price),
                                                stock: String(product.stock),
                                                thumbnail: product.thumbnail,
                                            });
                                        }}>Edit</button>
                                        <button type="button" className="text-red-700 underline" onClick={() => archiveProduct(product)}>Archive</button>
                                    </span>
                                </li>
                            ))}
                            {!products.length && !loading && <li className="py-4 text-sm text-stone-600">No active products.</li>}
                        </ul>
                    )}
                </div>

                <div>
                    <h3 className="mb-4 text-lg font-medium">{editingCategory ? "Edit category" : "Add category"}</h3>
                    <form onSubmit={saveCategory} className="grid gap-3">
                        <input aria-label="Category name" placeholder="Name" required maxLength={80} value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                        <input aria-label="Category slug" placeholder="Slug (e.g. home-decor)" required maxLength={90} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={categoryForm.slug} onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value.toLowerCase() })} className="border border-stone-300 bg-white px-3 py-2" />
                        <textarea aria-label="Category description" placeholder="Description (optional)" maxLength={500} rows={3} value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} className="border border-stone-300 bg-white px-3 py-2" />
                        <div className="flex gap-3">
                            <button disabled={saving} className="bg-gray-950 px-4 py-2 text-sm text-white disabled:opacity-60">{saving ? "Saving..." : editingCategory ? "Save category" : "Create category"}</button>
                            {editingCategory && <button type="button" onClick={() => { setEditingCategory(""); setCategoryForm(blankCategory); }} className="border border-stone-400 px-4 py-2 text-sm">Cancel</button>}
                        </div>
                    </form>
                    <h3 className="mb-3 mt-8 text-lg font-medium">Categories</h3>
                    <ul className="divide-y divide-stone-200 border-y border-stone-300">
                        {categories.map((category) => (
                            <li key={category._id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                                <span>{category.name}</span>
                                <span className="flex gap-3">
                                    <button type="button" className="underline" onClick={() => {
                                        setEditingCategory(category._id);
                                        setCategoryForm({ name: category.name, slug: category.slug, description: category.description ?? "" });
                                    }}>Edit</button>
                                    <button type="button" className="text-red-700 underline" onClick={() => archiveCategory(category)}>Archive</button>
                                </span>
                            </li>
                        ))}
                        {!categories.length && !loading && <li className="py-4 text-sm text-stone-600">No active categories.</li>}
                    </ul>
                </div>
            </div>
        </section>
    );
}
