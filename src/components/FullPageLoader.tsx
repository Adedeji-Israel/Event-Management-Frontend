import { Spinner } from "@/components/ui/spinner";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[9999]">
      <Spinner size={60} speed={6} />
    </div>
  );
};

export default FullPageLoader;
