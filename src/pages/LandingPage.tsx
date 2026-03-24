// import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UpcomingEvent from "@/components/UpcomingEvent";
import Category from "@/components/Category";
import OnlineEvent from "@/components/OnlineEvent";
import Organizer from "@/components/Organizer";
import Speaker from "@/components/Speaker";
import Footer from "@/components/Footer";
import Copyright from "@/components/Copyright";

import BackgroundImage from "@/assets/images/hero_area_image_3.jpg"

const LandingPage = () => {
  // const [pageLoading, setPageLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => setPageLoading(false), 2000); // simulate loading
  // }, []);

  return (
    <>
    {/* {pageLoading && <FullPageLoader />}  */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Header />
        <HeroSection />
      </div>

      <UpcomingEvent />
      <Category />
      <OnlineEvent />
      <Organizer />
      <Speaker />
      <Footer />
      <Copyright />
    </>
  );
};

export default LandingPage;
