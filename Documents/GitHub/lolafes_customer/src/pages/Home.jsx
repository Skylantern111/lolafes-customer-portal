import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO SECTION - Updated to Black/Deep Gray */}
      <section className="relative bg-linear-to-br from-black via-zinc-900 to-zinc-800 text-white py-24 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            Fresh Laundry, <br />{" "}
            <span className="text-zinc-400">Delivered to You</span>
          </h1>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Skip the hassle. We pick up your dirty laundry, clean it perfectly,
            and deliver it right back to your door — fresh and folded.
          </p>
          <button
            onClick={() => navigate("/place-order")}
            className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-zinc-200 transition flex items-center gap-3 mx-auto"
          >
            Schedule a Pickup <span>→</span>
          </button>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 px-10 max-w-7xl mx-auto text-center">
        <p className="text-black font-bold tracking-widest text-xs uppercase mb-2">
          Our Services
        </p>
        <h2 className="text-4xl font-bold mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            title="Wash & Fold"
            desc="Regular clothes washed, dried, and neatly folded."
            icon="👕"
          />
          <ServiceCard
            title="Wash & Iron"
            desc="Freshly washed and crispy ironed garments."
            icon="💨"
          />
          <ServiceCard
            title="Dry Clean"
            desc="Delicate fabrics handled with professional dry cleaning."
            icon="✨"
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-zinc-50 border-t border-zinc-100 text-center">
        <p className="text-black font-bold tracking-widest text-xs uppercase mb-2">
          Simple Process
        </p>
        <h2 className="text-4xl font-bold mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-10 max-w-7xl mx-auto">
          <Step
            icon="📅"
            num="1"
            title="Schedule"
            desc="Fill out the order form."
          />
          <Step
            icon="🚚"
            num="2"
            title="We Pick Up"
            desc="Our rider collects your laundry."
          />
          <Step
            icon="✨"
            num="3"
            title="We Clean"
            desc="Your clothes are washed with care."
          />
          <Step
            icon="📦"
            num="4"
            title="We Deliver"
            desc="Fresh laundry delivered back."
          />
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, desc, icon }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all text-left">
      <div className="text-4xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ icon, num, title, desc }) {
  return (
    <div>
      {/* Icon background changed to Black */}
      <div className="bg-black w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-xl shadow-zinc-200">
        {icon}
      </div>
      <h4 className="font-bold text-lg mb-2">
        {num}. {title}
      </h4>
      <p className="text-zinc-500 text-sm">{desc}</p>
    </div>
  );
}
