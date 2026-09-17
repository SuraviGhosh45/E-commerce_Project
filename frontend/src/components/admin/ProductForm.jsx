import { useEffect, useState } from "react";
import {
  FiImage,
  FiUpload,
  FiX,
  FiSave,
  FiLoader,
} from "react-icons/fi";

const ProductForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");

  const categories = [
    "Electronics",
    "Fashion",
    "Accessories",
    "Home & Living",
  ];

  // ==================================================
  // LOAD / RESET FORM
  // ==================================================

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      category: initialData?.category || "Electronics",
      price:
        initialData?.price !== undefined &&
        initialData?.price !== null
          ? initialData.price
          : "",
      stock:
        initialData?.stock !== undefined &&
        initialData?.stock !== null
          ? initialData.stock
          : "",
      description: initialData?.description || "",
      image: null,
    });

    setImagePreview(initialData?.image || "");
    setFormError("");
  }, [initialData]);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError(
        "Please select a valid image file."
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setFormError(
        "Image size must be less than 5 MB."
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview((oldPreview) => {
      if (oldPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }

      return previewUrl;
    });

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setFormError("");
  };

  // ==================================================
  // REMOVE IMAGE
  // ==================================================

  const removeImage = () => {
    setImagePreview((oldPreview) => {
      if (oldPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }

      return "";
    });

    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setFormError("");
  };

  // ==================================================
  // CLEANUP OBJECT URL
  // ==================================================

  useEffect(() => {
    return () => {
      setImagePreview((currentPreview) => {
        if (currentPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }

        return currentPreview;
      });
    };
  }, []);

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const name = formData.name.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();

    const numericPrice = Number(formData.price);
    const numericStock = Number(formData.stock);

    if (!name) {
      setFormError("Product name is required.");
      return;
    }

    if (!category) {
      setFormError("Product category is required.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setFormError("Please enter a valid product price.");
      return;
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setFormError(
        "Stock must be a valid non-negative whole number."
      );
      return;
    }

    if (!description) {
      setFormError("Product description is required.");
      return;
    }

    // Image is required only when creating.
    if (!initialData && !(formData.image instanceof File)) {
      setFormError(
        "Please select a product image."
      );
      return;
    }

    const productData = {
      name,
      category,
      price: numericPrice,
      stock: numericStock,
      description,
      image: formData.image,
    };

    try {
      setFormError("");
      await onSubmit?.(productData);
    } catch (error) {
      console.error(
        "PRODUCT FORM SUBMIT ERROR:",
        error
      );

      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save product."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-[#292929] pb-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227] sm:text-xs">
          {initialData
            ? "Edit Product"
            : "New Product"}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
          {initialData
            ? "Update product information"
            : "Add a new product"}
        </h2>

        <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
          Add the product details, pricing, stock
          and image.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {formError && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {formError}
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <div className="mt-7 space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            Product name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            disabled={loading}
            className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Category / Price / Stock */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-gray-200 outline-none transition focus:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
              disabled={loading}
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              required
              disabled={loading}
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the product..."
            required
            disabled={loading}
            className="w-full resize-none rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Product image
          </label>

          {!imagePreview ? (
            <label
              className={`flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#444] bg-[#0B0B0B] px-6 text-center transition ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-[#C9A227]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-[#C9A227]">
                <FiImage size={21} />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-200">
                Upload product image
              </p>

              <p className="mt-1 text-xs text-gray-600">
                PNG, JPG or WEBP · Max 5 MB
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#292929] px-4 py-2 text-xs text-gray-400">
                <FiUpload size={14} />
                Choose file
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-[#292929] bg-[#0B0B0B]">
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-72 w-full object-cover sm:h-80"
              />

              <button
                type="button"
                onClick={removeImage}
                disabled={loading}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remove image"
              >
                <FiX size={17} />
              </button>
            </div>
          )}

          {initialData && (
            <p className="mt-2 text-xs text-gray-600">
              Leave the current image unchanged or
              select a new image to replace it.
            </p>
          )}
        </div>
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#292929] pt-6 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-[#292929] px-5 py-3.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <FiLoader
                size={17}
                className="animate-spin"
              />
              {initialData
                ? "Updating..."
                : "Creating..."}
            </>
          ) : (
            <>
              <FiSave size={17} />

              {initialData
                ? "Update Product"
                : "Create Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;