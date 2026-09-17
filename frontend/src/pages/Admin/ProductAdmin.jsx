import { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

import DataTable from "../../components/admin/DataTable";
import ProductForm from "../../components/admin/ProductForm";
import api from "../../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // NORMALIZE BACKEND PRODUCT
  // ==================================================

  const normalizeProduct = (product) => {
    const id = product?._id || product?.id;

    return {
      ...product,

      id,

      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "Uncategorized",

      price: Number(product?.price) || 0,
      stock: Number(product?.stock) || 0,

      rating: Number(product?.ratings) || 0,
      reviews: Number(product?.numReviews) || 0,

      // Backend stores the S3 object key.
      // Browser loads the image through our backend endpoint.
      image: id
        ? `${API_BASE_URL}/products/${id}/image`
        : "",
    };
  };

  // ==================================================
  // FETCH PRODUCTS FROM BACKEND
  // ==================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      const backendProducts =
        response.data?.products || [];

      setProducts(
        backendProducts.map(normalizeProduct)
      );
    } catch (error) {
      console.error(
        "FETCH ADMIN PRODUCTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==================================================
  // CATEGORIES
  // ==================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ].sort();

    return ["All", ...uniqueCategories];
  }, [products]);

  // ==================================================
  // FILTER PRODUCTS
  // ==================================================

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name
          ?.toLowerCase()
          .includes(query) ||
        product.category
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  // ==================================================
  // CREATE PRODUCT
  // ==================================================

  const handleCreateProduct = async (productData) => {
    try {
      setActionLoading(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "name",
        String(productData.name || "").trim()
      );

      formData.append(
        "description",
        String(productData.description || "").trim()
      );

      formData.append(
        "price",
        String(productData.price ?? "")
      );

      formData.append(
        "category",
        String(productData.category || "").trim()
      );

      formData.append(
        "stock",
        String(productData.stock ?? "")
      );

      // ProductForm should provide an actual File object.
      if (productData.image instanceof File) {
        formData.append("image", productData.image);
      } else {
        throw new Error(
          "Please select a product image."
        );
      }

      await api.post("/products", formData);

      // Re-fetch from MongoDB so the UI reflects
      // what is actually stored in the backend.
      await fetchProducts();

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error(
        "CREATE PRODUCT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==================================================
  // UPDATE PRODUCT
  // ==================================================

  const handleUpdateProduct = async (productData) => {
    if (!editingProduct?.id) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "name",
        String(productData.name || "").trim()
      );

      formData.append(
        "description",
        String(productData.description || "").trim()
      );

      formData.append(
        "price",
        String(productData.price ?? "")
      );

      formData.append(
        "category",
        String(productData.category || "").trim()
      );

      formData.append(
        "stock",
        String(productData.stock ?? "")
      );

      // Only send image when the admin selected
      // a NEW file.
      if (productData.image instanceof File) {
        formData.append("image", productData.image);
      }

      await api.put(
        `/products/${editingProduct.id}`,
        formData
      );

      await fetchProducts();

      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==================================================
  // DELETE PRODUCT
  // ==================================================

  const handleDeleteProduct = async (productId) => {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await api.delete(`/products/${productId}`);

      await fetchProducts();
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==================================================
  // EDIT
  // ==================================================

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setError("");
  };

  // ==================================================
  // CANCEL FORM
  // ==================================================

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setError("");
  };

  // ==================================================
  // RESET FILTERS
  // ==================================================

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
  };

  // ==================================================
  // TABLE COLUMNS
  // ==================================================

  const columns = [
    {
      key: "name",
      label: "Product",

      render: (product) => (
        <div className="flex min-w-[240px] items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#292929] bg-[#151515]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-600">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-white">
              {product.name}
            </p>

            <p className="mt-1 max-w-[170px] truncate text-xs text-gray-600">
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
          ₹{Number(product.price).toLocaleString("en-IN")}
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
          {product.rating > 0
            ? product.rating.toFixed(1)
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">
      {/* =================================================
          HEADER
      ================================================= */}

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
              Create, update and manage products
              stored in your store database.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading || actionLoading}
              className="flex w-fit items-center gap-2 rounded-xl border border-[#292929] px-4 py-3 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw
                size={16}
                className={
                  loading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
                setError("");
              }}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
            >
              <FiPlus size={17} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

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
            loading={actionLoading}
          />
        </section>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

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
            {Math.max(categories.length - 1, 0)}
          </p>
        </div>
      </section>

      {/* =================================================
          FILTERS
      ================================================= */}

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
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227]"
            />
          </div>

          {/* Category + reset */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
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

      {/* =================================================
          TABLE
      ================================================= */}

      <section className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-[#292929] bg-[#151515] px-6 py-12 text-center">
            <FiRefreshCw
              size={22}
              className="mx-auto animate-spin text-[#C9A227]"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading products...
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredProducts}
            emptyMessage="No products match your filters."
            actions={(product) => (
              <>
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  disabled={actionLoading}
                  title="Edit product"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiEdit2 size={15} />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteProduct(product.id)
                  }
                  disabled={actionLoading}
                  title="Delete product"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={15} />
                </button>
              </>
            )}
          />
        )}
      </section>
    </main>
  );
};

export default ProductAdmin;