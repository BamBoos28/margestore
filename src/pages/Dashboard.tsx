// pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BottomNavbar from "../components/BottomNavbar";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

/** ====== TYPES ====== */
type Product = {
  id: string;
  nama: string;
  harga: number;
  img: string;
  kategori: string;
  stock: number;
};

const DATA_URL = import.meta.env.VITE_API_DATA_SHEET;

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "all";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));

  /** ====== FETCH & PARSE TSV ====== */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(DATA_URL);
        const text = await res.text();

        const lines = text.trim().split("\n");
        const [, ...rows] = lines; // skip header

        const parsed: Product[] = rows.map((row, idx) => {
          const [name, price, img, category, stock] = row.split("\t");

          return {
            id: `p-${idx}`,
            nama: name.trim(),
            harga: Number(price) || 0,
            img: img.replace("https: //", "https://").trim(),
            kategori: category?.trim() || "Lainnya",
            stock: Number(stock),
          };
        });

        setProducts(parsed);
      } catch (e) {
        console.error("Gagal load data produk", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /** ====== DERIVED DATA ====== */
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.kategori));
    return ["all", ...Array.from(set)];
  }, [products]);

  const itemsPerPage = 8;

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.kategori === category);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  /** ====== UI ====== */
  return (
    <>
      <div className="hidden xl:flex bg-light min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-xl bg-white p-6 text-center shadow">
          <h1 className="text-primary mb-2 text-xl font-semibold">
            Mobile Only
          </h1>
          <p className="text-main text-sm">
            Aplikasi ini hanya dapat digunakan pada perangkat mobile.
            <br />
            Silakan buka kembali menggunakan smartphone.
          </p>
        </div>
      </div>

      <div className="xl:hidden bg-light min-h-screen ">
        <CategorySidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          categories={categories}
          activeCategory={category}
          page={page}
          totalPages={totalPages}
          onSelectCategory={(c) => setSearchParams({ category: c, page: "1" })}
          onChangePage={(p) => setSearchParams({ category, page: String(p) })}
        />

        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="fixed left-2 top-1/2 z-50 -translate-y-1/2 rounded-r-md border-2 border-yellow-300 bg-white/90 px-3 py-2 shadow"
        >
          {sidebarOpen ? "‹" : "›"}
        </button>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-[100px]">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paginated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>

        <BottomNavbar />
      </div>
    </>
  );
}
