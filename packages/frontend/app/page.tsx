import Link from "next/link";

const networks = [
  { name: "MTN", logo: "/mtn.svg", color: "bg-yellow-100" },
  { name: "Telecel", logo: "/Telecel_Group.png", color: "bg-red-100" },
  { name: "AirtelTigo", logo: "/airtel.svg", color: "bg-blue-100" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-sky-700">CelluLite<span className="text-emerald-600"> Data</span></Link>
          <nav className="flex items-center gap-3" aria-label="Account navigation">
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Log in</Link>
            <Link href="/signup" className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700">Create account</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">Fast, reliable data in Ghana</p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">Stay connected without the hassle.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Browse affordable data bundles, pay securely, and send data to any number on MTN, Telecel, or AirtelTigo.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-2xl bg-sky-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700">Get started</Link>
            <Link href="/buy-data" className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700">Browse bundles</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3" aria-label="Supported networks">
            {networks.map((network) => (
              <div key={network.name} className={`flex items-center gap-2 rounded-xl ${network.color} px-3 py-2 text-sm font-semibold text-slate-700`}>
                <img src={network.logo} alt="" className="h-6 w-6 object-contain" />{network.name}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-emerald-500 p-1 shadow-2xl shadow-sky-900/10">
          <div className="rounded-[1.8rem] bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold text-slate-500">Simple from start to finish</p>
            <div className="mt-6 space-y-5">
              {["Choose your network and bundle", "Enter the recipient's number", "Pay securely and track delivery"].map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">{index + 1}</span>
                  <p className="font-semibold text-slate-800">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Your recipient number can be different from the phone number on your account.</div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-3 sm:px-8">
          {[{ title: "Affordable bundles", text: "Find a plan that fits your budget." }, { title: "Secure payments", text: "Your payment is verified before processing." }, { title: "Track every order", text: "Keep your purchase history in one place." }].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-5"><h2 className="font-bold text-slate-900">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></div>
          ))}
        </div>
      </section>
    </main>
  );
}
