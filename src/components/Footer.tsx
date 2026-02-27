import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Send } from 'lucide-react';
import Logo from "@/assets/images/logo.png"
import AppStore from "@/assets/images/app_store.png"
import GooglePlay from "@/assets/images/google_play.png"

const Footer = () => {
    return (
        <section
            className="w-full py-10"
            style={{
                background:
                    "linear-gradient(to right, #501A73 0%, #6A4FE0 50%, #432FB8 100%)",
            }}
        >
            {/* ✅ Make container responsive */}
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row p-6 gap-8 text-white">
                
                {/* Left block */}
                <div className="flex flex-col gap-6 w-full lg:w-2/5">
                    <Link to={`/eventplace/home`}>
                        <img
                            src={Logo}
                            alt="eventplace-logo"
                            className="w-32 sm:w-48 md:w-60 lg:w-72 h-auto object-contain"
                        />
                    </Link>
                    <p className="text-md">
                        Whether you want to host a single or multi-events, EventPlace is your best choice.
                    </p>
                    <h1 className="text-xl font-bold">DOWNLOAD APP:</h1>
                    <div className="flex gap-3">
                        <img src={AppStore} alt="app-store-image" className="w-28 sm:w-32" />
                        <img src={GooglePlay} alt="google-play-image" className="w-28 sm:w-32" />
                    </div>
                </div>

                {/* Right block */}
                <div className="w-full lg:w-3/5">
                    <div className="flex flex-col md:flex-row flex-wrap gap-10 justify-between items-start border-b border-gray-400 pb-8">
                        {/* Follow Us */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-lg">FOLLOW US:</h3>
                            <div className="flex gap-2">
                                {[
                                    <FaFacebookF />,
                                    <FaTwitter />,
                                    <FaLinkedinIn />,
                                    <FaInstagram />,
                                ].map((icon, i) => (
                                    <Link
                                        key={i}
                                        to={`/speakers/authors/social-media`}
                                        className="p-2 border rounded-full border-white text-white hover:text-[#FFFFFF] hover:bg-[#2F2F89] transition"
                                    >
                                        {icon}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Subscribe */}
                        <div className="flex flex-col gap-4 w-full sm:w-auto">
                            <h3 className="font-semibold text-lg">SUBSCRIBE</h3>
                            <div className="bg-white border rounded-sm flex gap-2 items-center">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    id="ema"
                                    className="bg-[#674DDD] text-white p-3 rounded-l-sm outline-none w-full sm:w-auto"
                                />
                                <button className="bg-white rounded-r-sm cursor-pointer px-4">
                                    <Send className="w-5 h-5 text-[#432FB8]" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Links */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-6 mt-6 justify-between items-start">
                        {/* Events Info */}
                        <div>
                            <h3 className="font-bold text-xl">Events Info</h3>
                            <ul className="text-gray-300 mt-4 flex flex-col gap-1">
                                {["All Events", "Featured Events", "Up Coming Events"].map((item, i) => (
                                    <Link
                                        key={i}
                                        to={`/eventplace`}
                                        className="w-fit after:block after:h-[2px] after:bg-gray-400 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                                    >
                                        <li>{item}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>

                        {/* Useful Link */}
                        <div>
                            <h3 className="font-bold text-xl">Useful Link</h3>
                            <ul className="text-gray-300 mt-4 flex flex-col gap-1">
                                {["Home", "About", "Events"].map((item, i) => (
                                    <Link
                                        key={i}
                                        to={`/eventplace`}
                                        className="w-fit after:block after:h-[2px] after:bg-gray-400 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                                    >
                                        <li>{item}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>

                        {/* Help */}
                        <div>
                            <h3 className="font-bold text-xl">Looking For Help</h3>
                            <ul className="text-gray-300 mt-4 flex flex-col gap-1">
                                {["FAQs", "Privacy", "Terms"].map((item, i) => (
                                    <Link
                                        key={i}
                                        to={`/eventplace`}
                                        className="w-fit after:block after:h-[2px] after:bg-gray-400 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                                    >
                                        <li>{item}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Footer
