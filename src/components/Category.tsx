// import React from 'react'
import CategorySection from "@/components/CategorySection" 
import CategoryBackgroundImage from "@/assets/images/category_shape.png"

const Category = () => {
    return (
        <section className="w-full py-15 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `linear-gradient(rgba(75, 34, 166, 0.9), rgba(75, 34, 166, 0.9)), url(${CategoryBackgroundImage})`, backgroundColor: "#4B22A6", }}>
            <div className="max-w-6xl m-auto space-y-8">
                <div className="text-center">
                    <h3 className="text-[34px] text-white font-['Caveat',sans-serif] font-bold">Category</h3>
                    <h1 className="text-white text-[50px] font-bold">Browser By Category</h1>
                </div>
                <div className="p-4">
                    <CategorySection />
                </div>
            </div>
        </section>
    )
}

export default Category
