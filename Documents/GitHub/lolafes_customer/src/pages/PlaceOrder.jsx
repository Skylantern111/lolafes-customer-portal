import React, { useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

const SERVICE_PRICES = {
  "Wash & Fold": 65.25,
  "Wash & Iron": 85.0,
  "Dry Clean": 120.0,
  "Iron Only": 50.0,
  Beddings: 95.0,
  "Mixed Load": 75.0,
};

export default function PlaceOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    pickupDate: "",
    pickupTime: "Morning",
    deliveryDate: "",
    deliveryTime: "Afternoon",
    paymentMethod: "Cash on Delivery",
    specialInstructions: "",
  });

  const [quantities, setQuantities] = useState(
    Object.keys(SERVICE_PRICES).reduce((acc, s) => ({ ...acc, [s]: 0 }), {}),
  );

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) setFormData({ ...formData, phone: value });
  };

  const isContactValid =
    formData.fullName.trim() !== "" && formData.phone.length === 11;
  const hasItems = Object.values(quantities).some((q) => q > 0);
  const totalAmount = Object.entries(quantities).reduce(
    (sum, [name, qty]) => sum + SERVICE_PRICES[name] * qty,
    0,
  );

 const handleSubmit = async () => {
  if (!isContactValid || !hasItems || isSubmitting) return;
  setIsSubmitting(true);
  
  // Debug Log: Check what data we are sending
  console.log("DEBUG: Starting submission for:", formData.fullName);
  console.log("DEBUG: Payload Preview:", {
    total: totalAmount,
    items: Object.entries(quantities).filter(([_, q]) => q > 0)
  });

  try {
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Attempt 1: Customer Record
    console.log("DEBUG: Attempting to check/save customer...");
    const customerRef = collection(db, "customers");
    const q = query(customerRef, where("phone", "==", formData.phone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("DEBUG: New customer detected. Creating record...");
      await addDoc(customerRef, {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        created_at: serverTimestamp(),
      });
    }

    // Attempt 2: Order Record
    console.log("DEBUG: Attempting to save order...");
    const scheduleNotes = `
------------------------
--- SCHEDULE DETAILS ---
PICKUP: ${formData.pickupDate} (${formData.pickupTime})
DELIVERY: ${formData.deliveryDate} (${formData.deliveryTime})
------------------------`;

    await addDoc(collection(db, "orders"), {
      customer_name: formData.fullName.trim(),
      customer_phone: formData.phone.trim(),
      customer_address: formData.address.trim(),
      order_number: orderNum,
      status: "pending",
      total_amount: Number(totalAmount),
      payment_method: formData.paymentMethod,
      is_paid: false,
      services: Object.entries(quantities)
        .filter(([_, q]) => q > 0)
        .map(([n, q]) => ({ service_name: n, quantity: q, subtotal: q * SERVICE_PRICES[n] })),
      notes: scheduleNotes,
      created_at: serverTimestamp(),
      source: "customer_portal"
    });

    console.log("DEBUG: Order Successful:", orderNum);
    setShowSuccess(orderNum);

  } catch (error) {
    // Detailed error logging
    console.error("CRITICAL ERROR DURING SUBMISSION:");
    console.error("Code:", error.code);     // e.g., 'permission-denied'
    console.error("Message:", error.message); 
    
    if (error.code === 'permission-denied') {
      alert("FIREBASE ERROR: Your security rules are blocking this submission. Please check your Firestore Rules tab.");
    } else {
      alert("ERROR: " + error.message);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: FORM SECTIONS */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. CUSTOMER INFO */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#006064] mb-6 flex items-center gap-2">
              👤 Customer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Juan Dela Cruz"
              />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                  Phone (11 digits) *
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-[#F8FAFC] border-none outline-none font-medium"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="09123456789"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Address *"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Street, Barangay, City"
                />
              </div>
            </div>
          </section>

          {/* 2. SERVICES */}
          <section
            className={`bg-white p-8 rounded-[2.5rem] border border-zinc-100 transition-opacity ${!isContactValid ? "opacity-40 pointer-events-none" : ""}`}
          >
            <h2 className="text-xl font-bold text-[#006064] mb-6">
              🧺 Select Services
            </h2>
            <div className="space-y-4">
              {Object.entries(SERVICE_PRICES).map(([name, price]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-5 rounded-2xl bg-[#FBFDFE] border border-zinc-100"
                >
                  <div>
                    <p className="font-bold">{name}</p>
                    <p className="text-sm text-[#006064]">
                      ₱{price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-white border p-1 rounded-xl shadow-sm">
                    <button
                      onClick={() =>
                        setQuantities({
                          ...quantities,
                          [name]: Math.max(0, quantities[name] - 1),
                        })
                      }
                      className="w-8 h-8 font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold">
                      {quantities[name]}
                    </span>
                    <button
                      onClick={() =>
                        setQuantities({
                          ...quantities,
                          [name]: quantities[name] + 1,
                        })
                      }
                      className="w-8 h-8 font-bold text-[#006064]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. SCHEDULING */}
          <section
            className={`bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-opacity ${!hasItems ? "opacity-40 pointer-events-none" : ""}`}
          >
            <h2 className="text-xl font-bold text-[#006064] mb-6">
              📅 Scheduling
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest">
                  Pickup Date
                </p>
                <input
                  type="date"
                  className="w-full p-4 rounded-xl bg-[#F8FAFC] border-none outline-none"
                  value={formData.pickupDate}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupDate: e.target.value })
                  }
                />
                <div className="grid grid-cols-3 gap-2">
                  {["Morning", "Afternoon", "Evening"].map((slot) => (
                    <button
                      key={slot}
                      onClick={() =>
                        setFormData({ ...formData, pickupTime: slot })
                      }
                      className={`py-2 text-[10px] rounded-lg border transition ${formData.pickupTime === slot ? "bg-[#E0F7FA] border-[#006064] text-[#006064] font-bold" : "border-zinc-100 text-zinc-400"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest">
                  Delivery Date
                </p>
                <input
                  type="date"
                  className="w-full p-4 rounded-xl bg-[#F8FAFC] border-none outline-none"
                  value={formData.deliveryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryDate: e.target.value })
                  }
                />
                <div className="grid grid-cols-3 gap-2">
                  {["Morning", "Afternoon", "Evening"].map((slot) => (
                    <button
                      key={slot}
                      onClick={() =>
                        setFormData({ ...formData, deliveryTime: slot })
                      }
                      className={`py-2 text-[10px] rounded-lg border transition ${formData.deliveryTime === slot ? "bg-[#E0F7FA] border-[#006064] text-[#006064] font-bold" : "border-zinc-100 text-zinc-400"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. PAYMENT */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#006064] mb-6">
              💵 Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["Cash on Delivery", "GCash", "Bank Transfer"].map((method) => (
                <button
                  key={method}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: method })
                  }
                  className={`p-4 rounded-2xl border-2 transition-all text-xs font-bold ${formData.paymentMethod === method ? "border-[#006064] bg-[#E0F7FA] text-[#006064]" : "border-zinc-100 text-zinc-400"}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* SUMMARY SIDEBAR */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#006064] mb-6">
              🧾 Summary
            </h2>
            <div className="space-y-4 mb-6">
              {Object.entries(quantities)
                .filter(([_, q]) => q > 0)
                .map(([n, q]) => (
                  <div key={n} className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      {n} x{q}
                    </span>
                    <span className="font-bold">
                      ₱{(SERVICE_PRICES[n] * q).toFixed(2)}
                    </span>
                  </div>
                ))}
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-bold">Total:</span>
                <span className="text-2xl font-black text-[#006064]">
                  ₱
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <textarea
              className="w-full p-4 rounded-xl bg-[#F8FAFC] border-none text-xs h-24 mb-6 outline-none"
              placeholder="Special instructions..."
              value={formData.specialInstructions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialInstructions: e.target.value,
                })
              }
            />
            <button
              onClick={handleSubmit}
              disabled={!isContactValid || !hasItems || isSubmitting}
              className="w-full py-5 rounded-2xl bg-[#006064] text-white font-bold disabled:bg-zinc-100"
            >
              {isSubmitting ? "Processing..." : "Place Order Now"}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            orderNumber={showSuccess}
            onClose={() => window.location.reload()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        className="w-full p-4 rounded-xl bg-[#F8FAFC] border-none outline-none font-medium"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function SuccessModal({ orderNumber, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-[#E0F7FA] text-[#006064] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ✅
        </div>
        <h2 className="text-2xl font-black text-[#006064] mb-2">
          Order Placed!
        </h2>
        <p className="text-zinc-500 text-sm mb-6">Your order number is:</p>
        <div className="bg-[#F8FAFC] py-4 rounded-2xl border-2 border-dashed border-zinc-200 text-2xl font-black text-zinc-800 mb-8 tracking-widest">
          {orderNumber}
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl bg-black text-white font-bold"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}
