import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import categories from "@/components/CategoryData";

const CategorySection = () => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    return (
        <div className="relative w-full pb-10">

            {/* Left Arrow */}
           <button
                className={`custom-prev absolute left-1 top-1/2 -translate-y-1/2 z-10 
                    w-12 h-12 flex items-center justify-center rounded-full 
                    bg-purple-700 text-white shadow-lg hover:bg-purple-600 transition ${isBeginning ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                disabled={isBeginning}
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Swiper Carousel */}
            <div className="w-full">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    slidesPerView={6}
                    slidesPerGroup={1}
                    spaceBetween={20}
                    loop={false}
                    speed={1500}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                        reverseDirection: false,
                    }}
                    navigation={{
                        nextEl: ".custom-next",
                        prevEl: ".custom-prev",
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1, slidesPerGroup: 1 },
                        480: { slidesPerView: 2, slidesPerGroup: 1 },
                        640: { slidesPerView: 3, slidesPerGroup: 1 },
                        768: { slidesPerView: 4, slidesPerGroup: 1 },
                        1024: { slidesPerView: 5, slidesPerGroup: 1 },
                        1280: { slidesPerView: 6, slidesPerGroup: 1 },
                    }}
                    onReachBeginning={() => {
                        setIsBeginning(true);
                        setIsEnd(false);
                    }}
                    onReachEnd={() => {
                        setIsEnd(true);
                        setIsBeginning(false);
                    }}
                    onSlideChange={(swiper) => {
                        if (!swiper.isBeginning && !swiper.isEnd) {
                            setIsBeginning(false);
                            setIsEnd(false);
                        }
                    }}
                >
                    {categories.map((category, i) => (
                        <SwiperSlide key={i}>
                            <CategoryCard {...category} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        {/* Right Arrow */}
            <button
                className={`custom-next absolute right-1 top-1/2 -translate-y-1/2 z-10 
                    w-12 h-12 flex items-center justify-center rounded-full 
                    bg-purple-700 text-white shadow-lg hover:bg-purple-600 transition ${isEnd ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                disabled={isEnd}
            >
            <ArrowRight className="w-6 h-6" />
        </button>
        </div>
    );
};

export default CategorySection;
