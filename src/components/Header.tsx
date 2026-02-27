import Logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    const menuItems = [
        { name: "HOME", path: "/home", type: "link" },
        {
            name: "EVENTS",
            path: "/events",
            type: "dropdown",
            items: [
                { name: "ALL EVENTS", path: "/events" },
                { name: "SINGLE EVENT", path: "/event/single" },
            ],
        },
        {
            name: "VENDOR",
            path: "/vendor",
            type: "dropdown",
            items: [
                { name: "VENDOR LIST", path: "/vendor/list" },
                { name: "SINGLE VENDOR", path: "/vendor/single" },
            ],
        },
        {
            name: "PAGES",
            path: "/pages",
            type: "dropdown",
            items: [
                { name: "ABOUT US", path: "/about-us" },
                { name: "FAQS", path: "/pages/faqs" },
                { name: "PRIVACY POLICY", path: "/pages/privacy-policy" },
                { name: "404", path: "/pages/404" },
            ],
        },
        {
            name: "BLOG",
            path: "/blogs",
            type: "dropdown",
            items: [
                { name: "BLOGS", path: "/blogs" },
                { name: "SINGLE BLOG", path: "/blog/single" },
            ],
        },
        { name: "CONTACT", path: "/contact", type: "link" },
    ];

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };

    return (
        <header className="w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
                {/* Logo - Responsive sizing */}
                <Link to="/" className="flex items-center">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-32 md:w-32 lg:w-40 xl:w-50 2xl:w-54 transition-all duration-300"
                    />
                </Link>

                {/* Desktop Navigation - Responsive spacing and sizing */}
                <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-4 2xl:space-x-6 font-semibold">
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className="relative group"
                            onMouseLeave={() => setDesktopDropdown(null)}
                        >
                            {item.type === "link" ? (
                                <Link
                                    to={item.path}
                                    className="px-2 py-1.5 lg:px-3 lg:py-2 text-white hover:text-gray-300 transition-colors text-sm lg:text-base"
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() =>
                                            setDesktopDropdown(
                                                desktopDropdown === item.name ? null : item.name
                                            )
                                        }
                                        className="flex items-center gap-0.5 lg:gap-1 px-2 py-1.5 lg:px-3 lg:py-2 text-white hover:text-gray-300 transition-colors text-sm lg:text-base"
                                    >
                                        {item.name}
                                        <ChevronDown
                                            className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 ${desktopDropdown === item.name ? "rotate-180" : ""
                                                } lg:group-hover:rotate-180`}
                                        />
                                    </button>

                                    {/* Dropdown */}
                                    <div
                                        className={`
                      absolute left-0 top-full z-50 mt-1 lg:mt-2 w-40 lg:w-48 bg-white
                      rounded-md lg:rounded-lg shadow-lg lg:shadow-xl border border-gray-100
                      opacity-0 invisible -translate-y-2
                      transition-all duration-300 ease-out
                      lg:group-hover:opacity-100
                      lg:group-hover:visible
                      lg:group-hover:translate-y-0
                      ${desktopDropdown === item.name
                                                ? "opacity-100 visible translate-y-0"
                                                : ""
                                            }
                    `}
                                    >
                                        <ul className="py-1 lg:py-2">
                                            {item.items?.map((subItem) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        to={subItem.path}
                                                        className="block px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Desktop CTA Button */}
                <Button
                    asChild
                    variant="ghost"
                    className="hidden md:inline-flex px-4 py-5 text-sm font-bold text-white border-2 border-white hover:bg-white hover:text-[#36358F] transition-colors duration-300 active:scale-95">
                    <Link to="/auth/signup">GET STARTED</Link>
                </Button>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50" aria-label="Open menu">
                    <Menu className="w-8 h-8 text-white" />
                </button>

                {/* Desktop CTA Button - Responsive sizing */}
                {/* <Button
                    asChild
                    variant="ghost"
                    className="hidden md:inline-flex py-5 md:py-2 md:px-2 md:text-sm text-white text-md font-bold border-2 border-white hover:bg-white hover:text-[#36358F] transition-all duration-600">
                    <Link to="/auth/signup">GET STARTED</Link>
                </Button> */}

                {/* Mobile Hamburger Button */}
                {/* <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6 text-white" />
                </button> */}
            </div>

            {/* Mobile Menu Overlay and Panel */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Semi-transparent Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                            onClick={closeMobileMenu}
                        />

                        {/* Mobile Menu Panel - Slides from LEFT with transparent background */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed top-0 left-0 h-full w-full z-50 md:hidden"
                            style={{
                                background: "inherit"
                            }}
                        >
                            {/* Backdrop blur to make text readable while showing background */}
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

                            <div className="h-full flex flex-col relative">
                                {/* Mobile Menu Content with semi-transparent layers */}
                                <div className="flex-1 flex flex-col">
                                    {/* Top Section with Logo and Close - Semi-transparent */}
                                    <div className="px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/20">
                                        <div className="flex items-center justify-between">
                                            <Link to="/" onClick={closeMobileMenu}>
                                                <img
                                                    src={Logo}
                                                    alt="Logo"
                                                    className="w-32"
                                                />
                                            </Link>
                                            <button
                                                onClick={closeMobileMenu}
                                                className="p-2"
                                                aria-label="Close menu"
                                            >
                                                <X className="w-8 h-8 text-white" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Navigation Items - Takes full remaining height */}
                                    <div className="flex-1 overflow-y-auto px-6 py-8">
                                        <nav className="space-y-1">
                                            {menuItems.map((item) => (
                                                <div key={item.name} className="border-b border-white/20 last:border-b-0">
                                                    {item.type === "link" ? (
                                                        <Link
                                                            to={item.path}
                                                            onClick={closeMobileMenu}
                                                            className="block py-4 text-lg font-semibold text-white hover:text-gray-200 transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            <div className="flex justify-between items-center py-4">
                                                                <Link
                                                                    to={item.path}
                                                                    onClick={closeMobileMenu}
                                                                    className="text-lg font-semibold text-white hover:text-gray-200 transition-colors"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        setActiveDropdown(
                                                                            activeDropdown === item.name ? null : item.name
                                                                        )
                                                                    }
                                                                    className="p-2"
                                                                >
                                                                    <ChevronDown
                                                                        className={`w-5 h-5 transition-transform text-white ${activeDropdown === item.name ? "rotate-180" : ""
                                                                            }`}
                                                                    />
                                                                </button>
                                                            </div>

                                                            <AnimatePresence>
                                                                {activeDropdown === item.name && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="pl-4 pb-4 space-y-2">
                                                                            {item.items?.map((sub) => (
                                                                                <Link
                                                                                    key={sub.name}
                                                                                    to={sub.path}
                                                                                    onClick={closeMobileMenu}
                                                                                    className="block py-2 text-gray-200 hover:text-white transition-colors"
                                                                                >
                                                                                    {sub.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* CTA Button at Bottom */}
                                    <div className="px-6 py-6 border-t border-white/20 bg-white/10 backdrop-blur-md">
                                        <Button
                                            asChild
                                            className="w-full bg-[#36358F] hover:bg-[#2a2970] text-white font-bold py-3 text-lg"
                                        >
                                            <Link to="/auth/signup" onClick={closeMobileMenu}>
                                                GET STARTED
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
