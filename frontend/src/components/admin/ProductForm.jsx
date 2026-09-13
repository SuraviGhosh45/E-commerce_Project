import { useState } from "react";
import {
  FiImage,
  FiUpload,
  FiX,
  FiSave,
} from "react-icons/fi";

const ProductForm = ({
  initialData = null,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "Electronics",
    price: initialData?.price || "",
    stock: initialData?.stock || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
  });

  const [imagePreview, setImagePreview] = useState(
    initialData?.image || ""
  );

  const categories = [
    "Electronics",
    "Fashion",
    "Accessories",
    "Home & Living",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const removeImage = () => {
    setImagePreview("");

    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7"
    >
      {/* Header */}
      <div className="border-b border-[#292929] pb-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227] sm:text-xs">
          {initialData ? "Edit Product" : "New Product"}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
          {initialData
            ? "Update product information"
            : "Add a new product"}
        </h2>

        <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
          Add the product details, pricing, stock and image.
        </p>
      </div>

      {/* Form */}
      <div className="mt-7 space-y-6">

        {/* Product name */}
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
            className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
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
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-gray-200 outline-none transition focus:border-[#C9A227]"
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
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
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
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              required
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
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
            className="w-full resize-none rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
          />
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Product image
          </label>

          {!imagePreview ? (
            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#444] bg-[#0B0B0B] px-6 text-center transition hover:border-[#C9A227]">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-[#C9A227]">
                <FiImage size={21} />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-200">
                Upload product image
              </p>

              <p className="mt-1 text-xs text-gray-600">
                PNG, JPG or WEBP
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#292929] px-4 py-2 text-xs text-gray-400">
                <FiUpload size={14} />
                Choose file
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
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
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition hover:bg-red-500"
                aria-label="Remove image"
              >
                <FiX size={17} />
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#292929] pt-6 sm:flex-row sm:justify-end">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#292929] px-5 py-3.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
        >
          <FiSave size={17} />

          {initialData
            ? "Update Product"
            : "Create Product"}
        </button>

      </div>
    </form>
  );
};

export default ProductForm;