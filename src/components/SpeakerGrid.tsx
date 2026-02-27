// import React from 'react'
// import SpeakerCard from "@/components/SpeakerCard"
import SpeakerCard from "@/components/SpeakerCard"

import ImageOne from "@/assets/images/speaker_1.jpg"
import ImageTwo from "@/assets/images/speaker_2.jpg"
import ImageThree from "@/assets/images/speaker_3.jpg"
import ImageFour from "@/assets/images/speaker_4.jpg"
import ImageFive from "@/assets/images/speaker_5.jpg"
import ImageSix from "@/assets/images/speaker_6.jpg"
import ImageSeven from "@/assets/images/speaker_7.jpg"
import ImageEight from "@/assets/images/speaker_8.jpg"

const SpeakersGrid = () => {

    const speakers = [
        {
            id: 1,
            image: ImageOne,
            author: "Vick Robel",
            role: "Chief Disrupter at Un"
        },
        {
            id: 2,
            image: ImageTwo,
            author: "Stephen Addis",
            role: "CEO at addis"
        },
        {
            id: 3,
            image: ImageThree,
            author: "Sandra Aamodt",
            role: "CEO at addis"
        },
        {
            id: 4,
            image: ImageFour,
            author: "Mosh Hamedani",
            role: "Software Engineer"
        },
        {
            id: 5,
            image: ImageFive,
            author: "Mike Addis",
            role: "CEO at Amazon"
        },
        {
            id: 6,
            image: ImageSix,
            author: "Marc Abrahams",
            role: "Editor at Improbable"
        },
        {
            id: 7,
            image: ImageSeven,
            author: "Leyla Acaroglu",
            role: "CEO at addis"
        },
        {
            id: 8,
            image: ImageEight,
            author: "John Duo",
            role: "Producer"
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {speakers.map((speaker) => (
                <div key={speaker.id} className="w-full">
                    <SpeakerCard {...speaker} />
                </div>
            ))}
        </div>
    );
}

export default SpeakersGrid
