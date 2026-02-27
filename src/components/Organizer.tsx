// import React from 'react'
import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import { Link } from "react-router-dom"
import OrganizersGrid from "./OrganizerGrid"

const Organizer = () => {
    return (
        <section className="w-full py-10 bg-[#F3F0FB]">
            <div className="max-w-6xl m-auto space-y-8">
                <div className="text-center">
                    <h3 className="text-[32px] text-[#FE2676] font-['Caveat',sans-serif] font-bold">Organizers</h3>
                    <h1 className="text-[#283746] text-[46px] font-bold">Featured Organizers</h1>
                </div>
                <div className="p-4">
                    <OrganizersGrid /> 
                </div>
                <div className="flex justify-center items-center">
                    <Button asChild variant="ghost" className="text-[#36358F] text-lg font-bold rounded-sm border-2 border-[#36358F] hover:text-white hover:bg-[#36358F] transition-colors duration-600 !px-6 !py-6">
                        <Link to="/all-organizer/" className="flex items-center gap-3">
                            SEE MORE ORGANIZER
                            <MoveRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Organizer
