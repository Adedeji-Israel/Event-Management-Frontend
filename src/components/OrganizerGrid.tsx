// import React from 'react'
import OrganizerCard from "@/components/OrganizerCard"

import ImageOne from "@/assets/images/organizer_logo_1.png"
import ImageTwo from "@/assets/images/organizer_logo_2.png"
import ImageThree from "@/assets/images/organizer_logo_3.png"
import ImageFour from "@/assets/images/organizer_logo_4.png"
import ImageFive from "@/assets/images/organizer_logo_5.png"
import ImageSix from "@/assets/images/organizer_logo_6.png"

const OrganizersGrid = () => {

    const organizers = [
        {
            id: 1,
            image: ImageOne,
            title: "Healthcare Center",
            event: "0 Event",
            location: "Manitoba, Canada"
        },
        {
            id: 2,
            image: ImageTwo,
            title: "Info Connect",
            event: "0 Event",
            location: "Iowa, United States (US)"
        },
        {
            id: 3,
            image: ImageThree,
            title: "Enterprising Women",
            event: "0 Event",
            location: "British Columbia, Canada"
        },
        {
            id: 4,
            image: ImageFour,
            title: "Key Media",
            event: "0 Event",
            location: "Russia"
        },
        {
            id: 5,
            image: ImageFive,
            title: "Sigma Music",
            event: "0 Event",
            location: "Danube, Serbia"
        },
        {
            id: 6,
            image: ImageSix,
            title: "Worldex Company",
            event: "0 Event",
            location: "Georgia, United States (US)"
        }
    ]

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizers.map((organizer) => (
                <div key={organizer.id} className="h-full">
                    <OrganizerCard {...organizer} />
                </div>
            ))}
        </div>
    );
}

export default OrganizersGrid
