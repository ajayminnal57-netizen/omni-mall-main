import { fetchProducts } from "./services/api";
import Hero from "./component/home/Hero";
import Category from "./component/home/Category";
import ImageGalary from "./component/home/ImageGalary";
import ShopSections from "./component/home/ShopSections";

export default async function Home() {
  let products = [];

  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Failed to load homepage products:", error);
  }

  return (
    <>
      <Hero />
      <Category products={products} />
      <ImageGalary products={products} />
      <ShopSections products={products} />
    </>
  );
}
