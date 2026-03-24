import { createContext, useContext, useState } from "react";

interface UIContextType {
    loading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <UIContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUI must be used inside UIProvider");
    return ctx;
};