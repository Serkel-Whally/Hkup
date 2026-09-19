"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
	House,
	Diamond,
	ArrowLeftRight,
	WalletCards,
	User,
	Headset,
	Settings,
	LogOut,
	Bell,
	Search,
	ArrowRight,
	Menu,
	ChevronDown,
} from "lucide-react";
import WalletCard from "./wallet-card";
import BundleCard from "./bundle-card";
import TransactionItem from "./transaction-item";
import NavigationDrawer from "./navigation-drawer";
import MobileBottomNavigation from "./mobile-bottom-navigation";
import { CheckoutPage } from "@/app/checkout/checkout-form";
import AnnouncementPopup from "./announcement-popup";
import { toast } from "sonner";
import { getStoredNotifications } from "@/app/lib/notifications";

export function DashboardShell({ children, active = "/dashboard", hideNavigation = false }: any) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [userName, setUserName] = useState("Customer");
	const [announcementUnreadCount, setAnnouncementUnreadCount] = useState(0);
	const profileRef = useRef<HTMLDivElement | null>(null);
	
	const getActive = () => {
		if (pathname === "/dashboard") return "/dashboard";
		if (pathname === "/buy-data") return "/buy-data";
		if (pathname === "/transactions") return "/transactions";
		if (pathname === "/wallet") return "/wallet";
		if (pathname === "/profile") return "/profile";
		if (pathname === "/notifications") return "/notifications";
		if (pathname === "/settings") return "/settings";
		if (pathname === "/security") return "/security";
		if (pathname === "/support") return "/support";
		return active;
	};

	const currentActive = getActive();
	const shouldHideHeader = hideNavigation || pathname.startsWith("/transactions/");
	const shouldHideBottomNavigation = hideNavigation;

	const redirectToLogin = useCallback((targetPath = pathname) => {
		router.replace(`/login?next=${encodeURIComponent(targetPath)}`);
	}, [pathname, router]);

	useEffect(() => {
		const updateUnreadCount = () => {
			setAnnouncementUnreadCount(getStoredNotifications().filter((notification) => notification.unread).length);
		};

		updateUnreadCount();
		let isMounted = true;

		const onNotificationsUpdated = () => {
			updateUnreadCount();
		};

		window.addEventListener("cellulite-notifications-updated", onNotificationsUpdated);

		const loadUser = () => {
			if (!isMounted) return;
			const nextName = session?.user?.name || session?.user?.email || "Customer";
			setUserName(nextName);
		};

		loadUser();

		return () => {
			isMounted = false;
			window.removeEventListener("cellulite-notifications-updated", onNotificationsUpdated);
		};
	}, [pathname, redirectToLogin, session]);

	async function logout() {
		await signOut({ callbackUrl: "/login" });
		toast.success("Logged out", { description: "You have been signed out securely." });
	}

	useEffect(() => {
		if (!profileOpen) return;

		function closeOnOutsideClick(event: MouseEvent) {
			if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
				setProfileOpen(false);
			}
		}

		document.addEventListener("mousedown", closeOnOutsideClick);
		return () => document.removeEventListener("mousedown", closeOnOutsideClick);
	}, [profileOpen]);

	return (
		<div className="min-h-screen flex bg-slate-50 text-slate-900 overflow-x-hidden">
			{/* Sidebar (desktop) */}
			<aside className="hidden md:flex h-screen sticky top-0 flex-col w-56 shrink-0 overflow-y-auto bg-white border-r border-slate-100">
				<div className="px-6 py-5 flex items-center gap-3">
					<Image src="/logo.png" alt="CelluLite Data" width={180} height={60} className="w-[180px] h-auto" style={{ height: 'auto' }} />
					<div className="text-sm font-semibold"><span className="text-cyan-500"></span></div>
				</div>

				<nav className="px-3 py-4 flex-1" aria-label="Main navigation">
					<ul className="space-y-1">
					<NavItem label="Dashboard" icon={<House size={18} />} href="/dashboard" active={currentActive === "/dashboard"} />
					<NavItem label="Buy Data" icon={<Diamond size={18} />} href="/buy-data" active={currentActive === "/buy-data"} />
					<NavItem label="Transactions" icon={<ArrowLeftRight size={18} />} href="/transactions" active={currentActive === "/transactions"} />
					<NavItem label="Wallet" icon={<WalletCards size={18} />} href="/wallet" active={currentActive === "/wallet"} />
					</ul>

					<div className="mt-6 mb-2 px-2 text-xs font-medium text-slate-400">BUY DATA</div>
					<ul className="space-y-1 px-2">
						<NetworkItem label="MTN" />
						<NetworkItem label="Telecel" />
						<NetworkItem label="AirtelTigo" />
					</ul>

					<div className="mt-6 mb-2 px-2 text-xs font-medium text-slate-400">ACCOUNT</div>
					<ul className="space-y-1 px-2">
						<NavItem label="Profile" icon={<User size={18} />} href="/profile" active={currentActive === "/profile"} />
						<NavItem label="Support" icon={<Headset size={18} />} href="/support" active={currentActive === "/support"} />
					</ul>
				</nav>

				<div className="px-4 py-4">
					<div className="border-t border-slate-100 pt-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Link href="/settings" className={`p-2 rounded-md hover:bg-slate-50 ${currentActive === "/settings" ? "bg-sky-50 text-sky-600" : "text-slate-700"}`} aria-label="Settings"><Settings size={18} /></Link>
							<button type="button" onClick={logout} className="p-2 rounded-md hover:bg-slate-50" aria-label="Logout"><LogOut size={18} /></button>
						</div>
					</div>

					<div className="mt-4 bg-cyan-50 rounded-lg p-3 flex gap-3 items-start">
						<div className="p-2 bg-white rounded-full">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
						</div>
						<div className="text-xs">
							<div className="font-semibold">Join our WhatsApp</div>
							<div className="text-slate-500">Get updates, offers and important notices</div>
							<button className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded bg-white text-sky-600 text-sm shadow-sm">Join Now</button>
						</div>
					</div>
				</div>
			</aside>

			<NavigationDrawer open={drawerOpen} activePath={currentActive} onClose={() => setDrawerOpen(false)} />

			{/* Main content area */}
			<div className="flex-1 w-full max-w-full">
				{!shouldHideHeader && (
					<header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-10 border-b border-slate-100 bg-white sticky top-0 z-30">
						<div className="flex items-center gap-4 flex-1 min-w-0">
							<button className="md:hidden p-2 rounded-md hover:bg-slate-50" onClick={() => setDrawerOpen(true)} aria-label="Open menu" title="Open navigation menu"><Menu size={22} /></button>
							<div className="md:hidden flex-1 min-w-0 flex justify-center">
								<Image src="/logo.png" alt="CelluLite Data" width={140} height={48} className="h-12 w-auto" priority style={{ width: 'auto' }} />
							</div>
							<div className="hidden md:block w-full md:max-w-[520px]"><SearchBar /></div>
						</div>

						<div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
							<Link href="/notifications" className="relative p-2 rounded-md hover:bg-slate-50" aria-label="Notifications">
								<Bell size={22} />
								{announcementUnreadCount > 0 ? (
									<span role="status" aria-label={`${announcementUnreadCount} unread announcements`} className="absolute -top-0.5 -right-0.5 bg-sky-600 text-white text-[9px] font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-0.5">{announcementUnreadCount > 9 ? "9+" : announcementUnreadCount}</span>
								) : null}
							</Link>

							<div ref={profileRef} className="hidden md:flex relative items-center gap-2 max-w-[220px]">
								<div className="text-sm text-slate-800 font-medium truncate">{userName}</div>
								<div className="text-xs text-slate-500">Premium</div>
								<button
									type="button"
									onClick={() => setProfileOpen((open) => !open)}
									aria-expanded={profileOpen}
									aria-haspopup="menu"
									aria-label="Open account menu"
									className="flex items-center gap-1 rounded-full p-1 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
								>
									<span className="rounded-full overflow-hidden" style={{ flex: '0 0 auto' }}><Image src="/logo.png" alt="Avatar" width={34} height={34} /></span>
									<ChevronDown size={15} className={`text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
								</button>
								{profileOpen && (
									<div className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-slate-100 bg-white p-1 shadow-lg" role="menu">
										<Link href="/dashboard" role="menuitem" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Dashboard</Link>
										<Link href="/buy-data" role="menuitem" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Buy Data</Link>
										<Link href="/transactions" role="menuitem" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Transactions</Link>
										<Link href="/wallet" role="menuitem" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Wallet</Link>
										<Link href="/profile" role="menuitem" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
									</div>
								)}
							</div>
						</div>
					</header>
				)}

				<main id="main-content" tabIndex={-1} className="w-full max-w-full px-4 pb-24 pt-6 md:px-10 md:py-8 md:pb-8 md:min-h-[calc(100vh-5rem)]">
					{children}
				</main>
				{!shouldHideBottomNavigation && <MobileBottomNavigation activePath={currentActive} />}
				<AnnouncementPopup />
			</div>
		</div>
	);
}

function NavItem({ label, icon, href, active }: any) {
	return (
		<li>
			<Link href={href || '#'} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${active ? 'bg-sky-50 text-sky-600' : 'text-slate-700 hover:bg-slate-50'}`}>
				<span className={`p-0.5`} aria-hidden>{icon}</span>
				<span>{label}</span>
			</Link>
		</li>
	);
}

function NetworkItem({ label }: any) {
	return (
		<li>
			<button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-50 text-slate-700">
				<div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold">{label[0]}</div>
				<div>{label}</div>
			</button>
		</li>
	);
}

function SearchBar() {
	return (
		<div className="relative">
			<input aria-label="Search anything" placeholder="Search anything..." className="w-full rounded-full border border-slate-100 px-4 py-3 pr-11 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-200" />
			<div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"><Search /></div>
		</div>
	);
}
''
export function DashboardHome() {
	const router = useRouter();
	const { data: session } = useSession();
	type DashboardOrder = {
		id: string;
		network: string;
		bundleSize: string;
		recipientPhone: string;
		amount: string;
		paymentStatus: string;
		deliveryStatus: string;
		createdAt: string;
	};

	const [checkoutDetails, setCheckoutDetails] = useState<{
		network: string;
		bundleId: string;
		size: string;
		validity: string;
		price: string;
	} | null>(null);
	const [greeting, setGreeting] = useState("Good morning");
	const [userName, setUserName] = useState("your account");
	const [walletBalance, setWalletBalance] = useState("GH₵ 0.00");
	const [orders, setOrders] = useState<DashboardOrder[]>([]);
	const [popularBundles, setPopularBundles] = useState<any[]>([]);

	useEffect(() => {
		const hour = new Date().getHours();
		setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
	}, []);

	useEffect(() => {
		const loadProfile = () => {
			if (!session?.user) {
				setUserName("your account");
				setWalletBalance("GH₵ 0.00");
				setOrders([]);
				return;
			}

			setUserName((session.user as any)?.full_name || session.user.name || session.user.email || "your account");
			setWalletBalance("GH₵ 0.00");
			setOrders([]);
		};

		const loadPopularBundles = async () => {
			try {
				const response = await fetch("/api/bundles", { cache: "no-store" });
				if (!response.ok) return;
				const payload = await response.json();
				const bundles = Array.isArray(payload?.bundles) ? payload.bundles : [];
				setPopularBundles(
					bundles
						.filter((bundle: any) => bundle?.popular)
						.slice(0, 6)
						.map((bundle: any) => ({
							...bundle,
							price: `GH₵ ${Number(bundle.price ?? 0).toFixed(2)}`,
							validity: bundle.validity || "30 Days Validity",
						}))
				);
			} catch {
				setPopularBundles([]);
			}
		};

		void loadProfile();
		void loadPopularBundles();
	}, [session]);

	const transactions = orders.slice(0, 4).map((order) => ({
		id: order.id,
		network: order.network,
		bundle: `${order.bundleSize} Data Bundle`,
		recipient: order.recipientPhone,
		amount: typeof order.amount === "string" && order.amount.startsWith("GH₵") ? order.amount : `GH₵ ${String(order.amount ?? "0.00")}`,
		datetime: new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt)),
		status: String(order.paymentStatus ?? "").toUpperCase() === "FAILED" || String(order.deliveryStatus ?? "").toUpperCase() === "FAILED" ? "Failed" : String(order.paymentStatus ?? "").toUpperCase() === "PAID" && String(order.deliveryStatus ?? "").toUpperCase() === "DELIVERED" ? "Successful" : "Processing",
	}));

	const handlePopularBundleSelect = (bundle: any) => {
		const networkMap: Record<string, string> = {
			MTN: "mtn",
			Telecel: "telecel",
			"AirtelTigo": "airtel",
		};
		const networkId = networkMap[bundle?.network] || "mtn";
		const checkoutBundle = {
			network: networkId,
			bundleId: String(bundle.id),
			size: bundle.size,
			validity: bundle.validity || "30 Days Validity",
			price: bundle.price,
		};

		if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
			setCheckoutDetails(checkoutBundle);
			return;
		}

		router.push(
			`/checkout?network=${networkId}&bundle=${encodeURIComponent(bundle.id)}&size=${encodeURIComponent(bundle.size)}&validity=${encodeURIComponent(checkoutBundle.validity)}&price=${encodeURIComponent(bundle.price)}`
		);
	};

	return (
		<div className="w-full space-y-6 md:space-y-8">
			{/* Welcome Section */}
			<section className="relative">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<h1 className="text-2xl md:text-3xl font-semibold text-slate-900">{greeting}, {userName} <span aria-hidden>👋</span></h1>
						<p className="text-sm md:text-base text-slate-600 mt-2">What would you like to do today?</p>
					</div>
					<div className="hidden md:block flex-shrink-0 opacity-50"><Image src="/globe.svg" alt="" width={100} height={100} aria-hidden /></div>
				</div>
			</section>

			{/* Wallet Section */}
			<section className="w-full">
				<WalletCard amount={walletBalance} onFund={() => router.push("/wallet")} />
			</section>

			{/* Buy Data Section */}
			<section className="w-full">
				<div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg md:text-xl font-semibold text-slate-900">Buy Data</h2>
						<Link href="/buy-data" className="text-sm text-sky-600 hover:text-sky-700 font-medium">View all networks</Link>
					</div>
					<div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
						<div className="min-w-[132px] snap-start sm:min-w-[160px] md:min-w-0"><NetworkCard name="MTN" accent="yellow" /></div>
						<div className="min-w-[132px] snap-start sm:min-w-[160px] md:min-w-0"><NetworkCard name="Telecel" accent="red" /></div>
						<div className="min-w-[132px] snap-start sm:min-w-[160px] md:min-w-0"><NetworkCard name="AirtelTigo" accent="rose" /></div>
					</div>
				</div>
			</section>



			{/* Popular Bundles Section */}
			<section className="w-full">
				<div className="flex items-center justify-between mb-4 px-0">
					<h3 className="text-lg md:text-xl font-semibold text-slate-900">Popular Bundles</h3>
					<Link href="/buy-data" className="text-sm font-medium text-sky-600 hover:text-sky-700">View all</Link>
				</div>
				{popularBundles.length > 0 ? (
					<div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
						{popularBundles.map((bundle) => (
							<BundleCard key={bundle.id} bundle={bundle} onSelect={handlePopularBundleSelect} />
						))}
					</div>
				) : (
					<p className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">No popular bundles are active right now.</p>
				)}
			</section>

			{/* Recent Transactions Section */}
			<section className="w-full">
				<div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg md:text-xl font-semibold text-slate-900">Recent Transactions</h3>
						<Link href="/transactions" className="text-sm font-medium text-sky-600 hover:text-sky-700">View all</Link>
					</div>
					{transactions.length > 0 ? <ul className="space-y-3" role="list">
						{transactions.map((t) => (
							<TransactionItem key={t.id} transaction={t} href="/transactions" />
						))}
					</ul> : <p className="py-6 text-sm text-slate-500">No transactions yet.</p>}
				</div>
			</section>

			{/* Promotional CTA Section */}
			<section className="w-full">
				<div className="bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
					<div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white/20 rounded-xl flex items-center justify-center">
						<Image src="/Hero.png" alt="" width={100} height={100} className="w-20 md:w-24 h-auto" aria-hidden />
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-xl md:text-2xl font-semibold text-white">Data in Seconds.</h2>
						<h2 className="text-xl md:text-2xl font-semibold text-white">Anytime, Anywhere.</h2>
						<p className="text-sm md:text-base text-white/90 mt-2">Fast, reliable and affordable data bundles across all major networks in Ghana.</p>
					</div>
					<Link href="/buy-data" className="flex-shrink-0 inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg bg-white text-sky-600 font-medium hover:bg-slate-50 transition">Buy Data Now <ArrowRight size={18} aria-hidden /></Link>
				</div>
			</section>
			{checkoutDetails ? <CheckoutPage modal details={checkoutDetails} onClose={() => setCheckoutDetails(null)} /> : null}
		</div>
	);
}

function NetworkCard({ name, accent }: any) {
	const logoMap: any = {
		'MTN': '/mtn.svg',
		'Telecel': '/Telecel_Group.png',
		'AirtelTigo': '/airtel.svg',
	};

	const bgMap: any = {
		'MTN': 'bg-yellow-50',
		'Telecel': 'bg-red-50',
		'AirtelTigo': 'bg-rose-50',
	};

	const networkMap: Record<string, string> = {
		"MTN": "mtn",
		"Telecel": "telecel",
		"AirtelTigo": "airtel",
	};
	
	const networkId = networkMap[name] || name.toLowerCase();

		return (
			<Link href={`/buy-data?network=${networkId}`} className="group flex min-h-[132px] min-w-0 flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md sm:min-h-[148px] sm:p-3 md:min-h-[176px] md:p-4">
				<div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${bgMap[name] || 'bg-slate-50'} ring-1 ring-black/5 sm:h-14 sm:w-14 md:h-20 md:w-20`}>
					<Image 
						src={logoMap[name]} 
						alt={`${name} logo`} 
						width={48} 
						height={48} 
						className="h-9 w-9 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12"
					/>
				</div>
			<div className="min-w-0 text-center">
				<div className="truncate text-sm font-semibold text-slate-900 md:text-base">{name}</div>
				<div className="mt-1 text-[11px] text-slate-500">Browse bundles</div>
				</div>
			<span aria-hidden="true" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-sky-100 group-hover:text-sky-700">
				<ArrowRight size={18} />
			</span>
		</Link>
	);
}


 