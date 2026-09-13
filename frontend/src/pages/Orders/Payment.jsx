
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiLock,
  FiShield,
} from "react-icons/fi";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutData = location.state;

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    checkoutData?.paymentMethod || "razorpay"
  );

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  /*
    Frontend-only fallback data.
    Later this will come from the real checkout/payment flow.
  */
  const items = checkoutData?.items || [];

  const subtotal =
    checkoutData?.subtotal ??
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

  const shipping = checkoutData?.shipping ?? (subtotal >= 100 ? 0 : 10);

  const total =
    checkoutData?.total ?? subtotal + shipping;

  const customer = checkoutData?.customer || {
    fullName: "Guest Customer",
    email: "customer@example.com",
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = (e) => {
    e.preventDefault();

    setProcessing(true);

    /*
      Frontend-only payment simulation.

      Later:
      1. Create order
      2. Create Razorpay order
      3. Open Razorpay checkout
      4. Verify payment with backend
    */

    setTimeout(() => {
      navigate("/order-success", {
        state: {
          orderId: `VD-${Date.now()}`,
          customer,
          items,
          subtotal,
          shipping,
          total,
          paymentMethod,
        },
      });
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">

      {/* ================= HEADER ================= */}
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
              Review your order and select your preferred payment method.
            </p>
          </div>

        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">

        <form onSubmit={handlePayment}>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

            {/* ================= PAYMENT FORM ================= */}
            <div className="space-y-6">

              {/* Payment methods */}
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
                      Choose how you want to pay for this order.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">

                  {/* Razorpay */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      paymentMethod === "razorpay"
                        ? "border-[#C9A227] bg-[#0B0B0B]"
                        : "border-[#292929] bg-[#0B0B0B] hover:border-[#555]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-[#C9A227]"
                    />

                    <div className="flex flex-1 items-center justify-between gap-4">

                      <div>
                        <p className="text-sm font-medium text-white">
                          Online Payment
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          UPI, cards, wallets and net banking
                        </p>
                      </div>

                      <span className="rounded-md border border-[#C9A227]/40 px-2 py-1 text-[10px] uppercase tracking-wider text-[#C9A227]">
                        Online
                      </span>

                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      paymentMethod === "cod"
                        ? "border-[#C9A227] bg-[#0B0B0B]"
                        : "border-[#292929] bg-[#0B0B0B] hover:border-[#555]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-[#C9A227]"
                    />

                    <div className="flex flex-1 items-center justify-between gap-4">

                      <div>
                        <p className="text-sm font-medium text-white">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          Pay when your order arrives
                        </p>
                      </div>

                      <span className="rounded-md border border-[#292929] px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">
                        COD
                      </span>

                    </div>
                  </label>

                </div>
              </section>

              {/* Card preview/form */}
              {paymentMethod === "razorpay" && (
                <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-lg font-semibold">
                        Card details
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                        Demo card form for the frontend.
                      </p>
                    </div>

                    <FiLock
                      size={18}
                      className="text-[#C9A227]"
                    />

                  </div>

                  <div className="mt-6 space-y-5">

                    {/* Card number */}
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="mb-2 block text-sm font-medium text-gray-200"
                      >
                        Card number
                      </label>

                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        inputMode="numeric"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      {/* Expiry */}
                      <div>
                        <label
                          htmlFor="expiry"
                          className="mb-2 block text-sm font-medium text-gray-200"
                        >
                          Expiry date
                        </label>

                        <input
                          id="expiry"
                          name="expiry"
                          type="text"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          placeholder="MM / YY"
                          className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                        />
                      </div>

                      {/* CVV */}
                      <div>
                        <label
                          htmlFor="cvv"
                          className="mb-2 block text-sm font-medium text-gray-200"
                        >
                          CVV
                        </label>

                        <input
                          id="cvv"
                          name="cvv"
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="•••"
                          className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                        />
                      </div>

                    </div>

                    {/* Card name */}
                    <div>
                      <label
                        htmlFor="cardName"
                        className="mb-2 block text-sm font-medium text-gray-200"
                      >
                        Name on card
                      </label>

                      <input
                        id="cardName"
                        name="cardName"
                        type="text"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="Enter name on card"
                        autoComplete="cc-name"
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>

                  </div>

                </section>
              )}

              {/* COD info */}
              {paymentMethod === "cod" && (
                <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

                  <div className="rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/5 p-5">

                    <div className="flex gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                        <FiCheck size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Cash on Delivery selected
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-gray-500">
                          You'll pay for the order when it is delivered to
                          your address.
                        </p>
                      </div>

                    </div>

                  </div>

                </section>
              )}

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
                      Your payment information is protected. This frontend
                      currently simulates the payment process.
                    </p>
                  </div>

                </div>

              </section>

            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <aside className="h-fit rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6 lg:sticky lg:top-24">

              <h2 className="text-lg font-semibold">
                Order summary
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Review before payment
              </p>

              {/* Items */}
              <div className="mt-6 max-h-[320px] space-y-4 overflow-y-auto pr-1">

                {items.map((item) => (
                  <div
                    key={item.id}
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
                        ${(item.price * item.quantity).toFixed(2)}
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
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="text-gray-200">
                    {shipping === 0
                      ? "Free"
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#292929] pt-6">

                <span className="font-medium">
                  Total
                </span>

                <span className="text-2xl font-semibold text-[#C9A227]">
                  ${total.toFixed(2)}
                </span>

              </div>

              <button
                type="submit"
                disabled={processing}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-4 text-sm font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing
                  ? "Processing..."
                  : paymentMethod === "cod"
                    ? "Place Order"
                    : "Pay Securely"}

                {!processing && <FiArrowRight size={17} />}
              </button>

              <Link
                to="/checkout"
                className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-gray-500 transition hover:text-[#C9A227]"
              >
                <FiArrowLeft size={15} />
                Back to checkout
              </Link>

            </aside>

          </div>

        </form>
      </section>

    </main>
  );
};

export default Payment;

