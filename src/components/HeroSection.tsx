import { Search, MapPin, Layers } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="relative w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24 lg:py-32">

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-center justify-between">

        {/* Left Text */}
        <div className="text-center md:text-left max-w-3xl space-y-2 z-10 px-2">
          <h3 className="text-[#6DFFFF] text-3xl sm:text-[38px] md:text-[44px] font-['Caveat',sans-serif] font-bold">
            Find Your Next Experience
          </h3>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
            Discover & Promote <br /> Upcoming Event
          </h2>
        </div>

        {/* Right Images (still hidden/commented) */}
        <div className="relative flex-1 hidden md:block">
          {/* Uncomment and adjust when using images */}
        </div>
      </div>

      {/* Search Box */}
      <div className="mt-12 sm:mt-14 md:mt-16 mb-16 sm:mb-18 md:mb-20 max-w-5xl w-full">
        <div className="mt-30 bg-white p-3 rounded-2xl shadow-lg flex flex-col md:flex-row items-stretch overflow-hidden">

          {/* Search Event */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
            <Search className="text-indigo-500 w-6 h-6 sm:w-7 sm:h-7" />
            <input
              type="text"
              placeholder="Search Event"
              className="w-full outline-none text-gray-700 text-sm sm:text-base"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
            <MapPin className="text-indigo-500 w-6 h-6 sm:w-7 sm:h-7" />
            <select className="w-full outline-none text-gray-500 bg-transparent cursor-pointer text-sm sm:text-base">
              <option>Search Location</option>
              <option>Chicago</option>
              <option>Texas</option>
              <option>New Jersey</option>
              <option>Florida</option>
              <option>California</option>
              <option>Washington</option>
              <option>New Mexico</option>
              <option>New York</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 border-b md:border-b-0 md:border-r cursor-pointer">
            <Layers className="text-indigo-500 w-6 h-6 sm:w-7 sm:h-7" />
            <select className="w-full outline-none text-gray-500 bg-transparent cursor-pointer text-sm sm:text-base">
              <option>Category</option>
              <option>Education & Training</option>
              <option>Fashion & Beauty</option>
              <option>Food Fair & Drinks</option>
              <option>Health & Wellness</option>
              <option>Industrial Engineering</option>
              <option>Sport & Travel</option>
              <option>Travel & Tourism</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex justify-end px-4 py-3 w-full md:flex-1">
            <button className="w-full md:w-auto flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 transition px-3 py-3 cursor-pointer">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
