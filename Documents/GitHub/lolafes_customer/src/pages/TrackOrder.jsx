import React, { useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Enforce 11-digit number format
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (phone.length !== 11) {
      alert("Please enter a valid 11-digit phone number.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setOrders([]);

    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("customer_phone", "==", phone));
      const querySnapshot = await getDocs(q);

      const fetchedOrders = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });

      // Sort orders from newest to oldest based on created_at
      fetchedOrders.sort((a, b) => {
        const dateA = a.created_at?.toMillis() || 0;
        const dateB = b.created_at?.toMillis() || 0;
        return dateB - dateA;
      });

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to colorize order statuses
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "pending")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "processing" || s === "washing")
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (s === "ready" || s === "completed")
      return "bg-green-100 text-green-800 border-green-200";
    if (s === "cancelled") return "bg-red-100 text-red-800 border-red-200";
    return "bg-zinc-100 text-zinc-800 border-zinc-200";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* HEADER & SEARCH BOX */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 text-center">
          <div className="w-16 h-16 bg-[#E0F7FA] text-[#006064] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#006064] mb-2">
            Track Your Order
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            Enter the phone number you used to place your order.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="text"
              className="flex-1 p-4 rounded-2xl bg-[#F8FAFC] border-2 border-zinc-100 outline-none text-zinc-700 font-bold text-center md:text-left tracking-widest focus:border-[#006064] transition-colors"
              placeholder="09XX XXX XXXX"
              value={phone}
              onChange={handlePhoneChange}
            />
            <button
              type="submit"
              disabled={isLoading || phone.length !== 11}
              className="px-8 py-4 rounded-2xl bg-[#006064] text-white font-bold shadow-lg shadow-cyan-900/10 transition-all hover:bg-[#004D40] disabled:bg-zinc-200 disabled:shadow-none"
            >
              {isLoading ? "Searching..." : "Track"}
            </button>
          </form>
        </section>

        {/* RESULTS AREA */}
        {hasSearched && !isLoading && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-800 px-4">
              Found {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
              for {phone}
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white p-10 rounded-[2.5rem] text-center shadow-sm border border-zinc-100">
                <p className="text-zinc-400 font-medium">
                  No orders found for this number.
                </p>
                <p className="text-xs text-zinc-300 mt-2">
                  Make sure you typed the exact number used during checkout.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-8 rounded-4xl shadow-sm border border-zinc-100"
                >
                  {/* ORDER HEADER */}
                  <div className="flex flex-wrap justify-between items-center border-b border-zinc-100 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">
                        Order Number
                      </p>
                      <p className="text-xl font-black text-zinc-800 tracking-wider">
                        {order.order_number}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-widest ${getStatusBadge(order.status)}`}
                    >
                      {order.status || "Pending"}
                    </div>
                  </div>

                  {/* NOTE: Address is intentionally omitted here for privacy */}

                  {/* ORDER SUMMARY */}
                  <div className="bg-[#F8FAFC] p-6 rounded-2xl space-y-4 mb-6">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                      Services Summary
                    </p>
                    {order.services &&
                      order.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-zinc-600 font-medium">
                            {service.service_name}{" "}
                            <span className="text-zinc-400">
                              x{service.quantity}
                            </span>
                          </span>
                          <span className="font-bold text-zinc-800">
                            ₱{service.subtotal?.toFixed(2)}
                          </span>
                        </div>
                      ))}

                    <div className="pt-4 border-t border-zinc-200 flex justify-between items-center">
                      <span className="font-bold text-zinc-800">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-black text-[#006064]">
                        ₱
                        {order.total_amount?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* SCHEDULE DETAILS */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-zinc-100">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Target Pickup
                      </p>
                      <p className="font-bold text-zinc-800">
                        {order.pickup_date || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-zinc-100">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Payment Method
                      </p>
                      <p className="font-bold text-zinc-800">
                        {order.payment_method || "Cash"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {order.is_paid ? "✅ Paid" : "⏳ Unpaid"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
