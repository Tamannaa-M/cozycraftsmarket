
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailComponent from "@/components/products/ProductDetail";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <ProductDetailComponent productId={id} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
