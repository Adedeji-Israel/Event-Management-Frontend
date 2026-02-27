import EventsGrid from "@/components/EventGrid";
import Header from "@/components/Header";

const AllEvents = () => {
    return (
        <div>
            <div className="bg-purple-600">
                <Header />
            </div>
            <section className="w-full py-10 bg-[#F3F0FB]">
                <div className="max-w-6xl m-auto p-4 space-y-6">
                    <h1 className="text-3xl text-purple-600 font-bold">All Events</h1>

                    {/* Pass prop to show all */}
                    <EventsGrid showAll />
                </div>
            </section>
        </div>
    );
};

export default AllEvents;
