import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCreditCard,
  FiLock,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const checkoutData = location.state;

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const paymentMethod =
    checkoutData?.paymentMethod || "razorpay";

  const items = checkoutData?.items || [];

  const customer = checkoutData?.customer || {
    fullName: "",
    email: "",
    phone: "",
  };

  /*
    These values are only used for displaying the
    checkout summary.

    IMPORTANT:
    The backend calculates the actual payable amount
    from MongoDB when the Razorpay order is created.
  */
  const subtotal =
    checkoutData?.subtotal ??
    items.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

  const shipping =
    checkoutData?.shipping ??
    (subtotal >= 100 ? 0 : 10);

  const total =
    checkoutData?.total ??
    subtotal + shipping;

  const address = checkoutData?.address || {
    fullname: customer.fullName || "",
    street: "",
    city: "",
    zipCode: "",
    country: "India",
  };

  // ==========================================
  // Missing checkout session
  // ==========================================
  if (!checkoutData || !items.length) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#292929] bg-[#151515] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
            <FiAlertCircle size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
            Payment session not found
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Please return to checkout and try again.
          </p>

          <Link
            to="/cart"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
          >
            <FiArrowLeft size={16} />
            Back to Cart
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // Load Razorpay checkout script
  // ==========================================
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        existingScript.addEventListener("load", () =>
          resolve(true)
        );

        existingScript.addEventListener("error", () =>
          resolve(false)
        );

        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ==========================================
  // Razorpay payment
  // ==========================================
  const handleRazorpayPayment = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      /*
        IMPORTANT:

        We only send:
        - productId
        - quantity

        We DO NOT send:
        - price
        - totalAmount

        The backend gets the real prices from MongoDB.
      */
      const paymentItems = items.map((item) => ({
        productId: item.id || item._id,
        quantity: Number(item.quantity),
      }));

      // ==========================================
      // 1. Ask backend to create Razorpay order
      // ==========================================
      const response = await api.post("/payment/order", {
        items: paymentItems,
      });

      const razorpayOrder = response.data?.order;

      if (!razorpayOrder) {
        throw new Error(
          "Unable to create Razorpay order."
        );
      }

      /*
        This is the amount calculated by the backend
        from MongoDB.
      */
      const serverTotal =
        Number(response.data?.amount) ||
        Number(razorpayOrder.amount) / 100;

      // ==========================================
      // 2. Load Razorpay Checkout
      // ==========================================
      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay failed to load. Please try again."
        );
      }

      // ==========================================
      // 3. Open Razorpay
      // ==========================================
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Vendora",

        description: "Vendora Order",

        order_id: razorpayOrder.id,

        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },

        theme: {
          color: "#C9A227",
        },

        handler: async (paymentResponse) => {
          try {
            setError("");

            /*
              ========================================
              4. Verify payment
              ========================================

              Again, we only send product IDs and
              quantities.

              Backend independently calculates:

              product prices
              stock
              subtotal
              shipping
              total
            */
            const verifyResponse = await api.post(
              "/payment/verify",
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,

                items: paymentItems,

                address,
              }
            );

            console.log(
              "Payment verification response:",
              verifyResponse.data
            );

            const createdOrder =
              verifyResponse.data?.order;

            if (!createdOrder) {
              throw new Error(
                "Payment verified, but order was not returned."
              );
            }

            // ==========================================
            // 5. Payment + order successful
            // ==========================================
            navigate("/order-success", {
              state: {
                orderId: createdOrder._id,
                order: createdOrder,
                customer,
                items,
                subtotal,
                shipping,
                total: serverTotal,
                paymentMethod: "razorpay",
                paymentId:
                  paymentResponse.razorpay_payment_id,
              },
              replace: true,
            });
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setError(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed."
            );

            setProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on("payment.failed", (paymentError) => {
        console.error(
          "Razorpay payment failed:",
          paymentError
        );

        setError(
          paymentError?.error?.description ||
            "Payment failed. Please try again."
        );

        setProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay payment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );

      setProcessing(false);
    }
  };

  // ==========================================
  // Submit
  // ==========================================
  const handlePayment = (e) => {
    e.preventDefault();

    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* Header */}
      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#C9A227]"
          >
            <FiArrowLeft size={16} />
            Back to Checkout
          </Link>

          <div className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
              Secure payment
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Complete your payment.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Your order will only be created after successful
              payment verification.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">
        <form onSubmit={handlePayment}>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Payment */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiCreditCard size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Payment method
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Complete your payment securely using Razorpay.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-[#C9A227] bg-[#0B0B0B] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#151515] text-[#C9A227]">
                      <FiCreditCard size={18} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Razorpay
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Cards, wallets and net banking
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiShield size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Secure payment
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-gray-500">
                      Razorpay securely handles your payment details.
                      Vendora does not store your card information.
                    </p>
                  </div>
                </div>
              </section>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <aside className="h-fit rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">
                Order summary
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {items.length}{" "}
                {items.length === 1
                  ? "product"
                  : "products"}
              </p>

              <div className="mt-6 max-h-[320px] space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="flex gap-3"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#292929] bg-[#0B0B0B]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-gray-200">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#C9A227]">
                        ₹
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-[#292929] pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="text-gray-200">
                    ₹{Number(subtotal).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="text-gray-200">
                    {shipping === 0
                      ? "Free"
                      : `₹${Number(shipping).toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#292929] pt-6">
                <span className="font-medium">
                  Total
                </span>

                <span className="text-2xl font-semibold text-[#C9A227]">
                  ₹{Number(total).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-4 text-sm font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing
                  ? "Processing..."
                  : "Pay Securely"}

                {!processing && (
                  <FiArrowRight size={17} />
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#292929] pt-5 text-xs text-gray-600">
                <FiLock size={14} />
                Secure payment powered by Razorpay
              </div>
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Payment;