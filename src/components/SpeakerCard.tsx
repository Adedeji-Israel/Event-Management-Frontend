// import React from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const SpeakerCard = ({ id, image, author, role }) => {
    return (
        <Card>
            <div className="rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
                {/* Profile Image */}
                <Link to={`/speakers/${id}`}>
                    <img
                        src={image}
                        alt={author}
                        className="w-24 h-24 object-cover rounded-full mb-4"
                    />
                </Link>

                {/* Name */}
                <Link to={`/speakers/${id}`}>
                    <h3 className="text-2xl font-bold mb-1 text-gray-900 hover:text-[#2F2F89] transition">{author}</h3>
                </Link>

                {/* Role */}
                <p className="text-gray-500 text-md mb-4">{role}</p>

                {/* Social Links */}
                <div className="flex gap-1">
                    <Link to={`/speakers/authors/social-media`} className="p-2 border rounded-full border-[#2F2F89] text-[#2F2F89] hover:text-[#FFFFFF] hover:bg-[#2F2F89] transition">
                        <FaFacebookF className="w-5 h-5" />
                    </Link>

                    <Link to={`/speakers/authors/social-media`} className="p-2 border rounded-full border-[#2F2F89] text-[#2F2F89] hover:text-[#FFFFFF] hover:bg-[#2F2F89] transition">
                        <FaTwitter className="w-5 h-5" />
                    </Link>

                    <Link to={`/speakers/authors/social-media`} className="p-2 border rounded-full border-[#2F2F89] text-[#2F2F89] hover:text-[#FFFFFF] hover:bg-[#2F2F89] transition">
                        <FaLinkedinIn className="w-5 h-5" />
                    </Link>

                    <Link to={`/speakers/authors/social-media`} className="p-2 border rounded-full border-[#2F2F89] text-[#2F2F89] hover:text-[#FFFFFF] hover:bg-[#2F2F89] transition">
                        <FaInstagram className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default SpeakerCard;
