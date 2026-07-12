import { useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import api from "@/lib/AxiosInterceptor"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Copyright from "@/components/Copyright"
import Footer from "@/components/Footer"

const NotFoundPage = () => {
    const [backendMessage, setBackendMessage] = useState("")
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBackendMessage = async () => {
            try {
                // Call the exact invalid route user tried to access
                await api.get(location.pathname)
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    "This route does not exist on the server."
                setBackendMessage(message)
            }
        }

        fetchBackendMessage()
    }, [location.pathname])

    return (
        <div className="flex min-h-screen flex-col">
            <div className="bg-purple-600">
                <Header />
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 bg-[#F3F0FB] px-4 py-16 sm:py-20 md:py-25">
                <h1 className="text-6xl font-bold text-purple-600 sm:text-7xl md:text-9xl">
                    404
                </h1>

                <p className="w-full max-w-[90%] break-words text-center text-lg font-bold text-gray-600 sm:max-w-md sm:text-2xl md:max-w-120 md:text-3xl">
                    Sorry, the page you are looking for could not be found!
                </p>

                {backendMessage && (
                    <p className="w-full max-w-[90%] break-words text-center text-sm text-red-600 sm:max-w-md sm:text-base md:max-w-120">
                        {backendMessage}
                    </p>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="border-purple-600 p-6 text-sm font-bold text-purple-600 cursor-pointer transition-colors duration-300 hover:bg-purple-100 active:scale-95"
                    >
                        GO BACK
                    </Button>

                    <Button
                        asChild
                        className="bg-purple-600 p-6 text-sm font-bold text-white transition-colors duration-300 hover:bg-purple-800 hover:text-white active:scale-95"
                    >
                        <Link to="/">BACK TO HOME</Link>
                    </Button>
                </div>
            </div>

            <Footer />
            <Copyright />
        </div>
    )
}

export default NotFoundPage