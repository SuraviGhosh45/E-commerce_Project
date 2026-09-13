import { useMemo, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

import DataTable from "../../components/admin/DataTable";
import ProductForm from "../../components/admin/ProductForm";
import productsData from "../../data/product";

const ProductAdmin = () => {
  const [products, setProducts] = useState(productsData);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Accessories",
    "Home & Living",
  ];

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleCreateProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      price: Number(productData.price),
      stock: Number(productData.stock),
      rating: 0,
      reviews: 0,
    };

    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);

    setShowForm(false);
  };

  const handleUpdateProduct = (productData) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              ...productData,
              price: Number(productData.price),
              stock: Number(productData.stock),
            }
          : product
      )
    );

    setEditingProduct(null);
    setShowForm(false);
  };

  const handleDeleteProduct = (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== productId
      )
    );
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
  };

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (product) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#292929] bg-[#151515]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-white">
              {product.name}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              #{product.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (product) => (
        <span className="text-gray-400">
          {product.category}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (product) => (
        <span className="font-semibold text-[#C9A227]">
          ${Number(product.price).toFixed(2)}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (product) => (
        <span
          className={
            product.stock <= 10
              ? "font-medium text-red-400"
              : "text-gray-300"
          }
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (product) => (
        <span className="text-gray-400">
          {product.rating || "—"}
        </span>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Product Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create, update and manage products in your store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="flex w-fit items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
          >
            <FiPlus size={17} />
            Add Product
          </button>

        </div>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <section className="mb-6">

          <ProductForm
            initialData={editingProduct}
            onSubmit={
              editingProduct
                ? handleUpdateProduct
                : handleCreateProduct
            }
            onCancel={handleCancelForm}
          />

        </section>
      )}

      {/* ================= SUMMARY ================= */}
      <section className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Total Products
          </p>

          <p className="mt-3 text-2xl font-semibold">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Low Stock
          </p>

          <p className="mt-3 text-2xl font-semibold text-red-400">
            {
              products.filter(
                (product) => product.stock <= 10
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Categories
          </p>

          <p className="mt-3 text-2xl font-semibold text-[#C9A227]">
            {new Set(products.map((product) => product.category)).size}
          </p>
        </div>

      </section>

      {/* ================= FILTERS ================= */}
      <section className="mt-6 rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-md">

            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227]"
            />

          </div>

          {/* Category + reset */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-gray-300 outline-none transition focus:border-[#C9A227]"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category === "All"
                    ? "All Categories"
                    : category}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] px-4 py-3.5 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              <FiRefreshCw size={15} />
              Reset
            </button>

          </div>

        </div>

      </section>

      {/* ================= TABLE ================= */}
      <section className="mt-6">

        <DataTable
          columns={columns}
          data={filteredProducts}
          emptyMessage="No products match your filters."
          actions={(product) => (
            <>
              <button
                type="button"
                onClick={() => handleEdit(product)}
                title="Edit product"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
              >
                <FiEdit2 size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteProduct(product.id)}
                title="Delete product"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                <FiTrash2 size={15} />
              </button>
            </>
          )}
        />

      </section>

    </main>
  );
};

export default ProductAdmin;
