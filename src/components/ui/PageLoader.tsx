import Logo from "@/assets/images/logo_main.png";
import preloaderVideo from "@/assets/preloaders/Preloader.mp4";

const PageLoader = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden gap-2">
      <img src={Logo} alt="logo" className="w-36" />

      <video
        src={preloaderVideo}
        autoPlay
        muted
        loop
        playsInline
        className="w-52 h-52 object-contain"
      />
    </div>
  );
};

export default PageLoader;