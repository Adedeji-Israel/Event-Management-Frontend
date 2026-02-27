import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import api from "@/lib/AxiosInterceptor"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Copyright from "@/components/Copyright"
import Footer from "@/components/Footer"

const NotFoundPage = () => {
    const [backendMessage, setBackendMessage] = useState("")
    const location = useLocation()

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
        <div>
            <div className="bg-purple-600">
                <Header />
            </div>

            <div className="bg-[#F3F0FB] flex flex-col items-center gap-4 py-25">
                <h1 className="text-9xl text-purple-600 font-bold">404</h1>

                <p className="text-3xl text-gray-600 font-bold w-120 break-words text-center">
                    Sorry, the page you are looking for could not be found!
                </p>

                {backendMessage && (
                    <p className="text-red-600 text-center w-120 break-words">
                        {backendMessage}
                    </p>
                )}

                <Button
                    asChild
                    className="bg-purple-600 p-6 mt-4 text-sm font-bold text-white hover:bg-purple-800 hover:text-white transition-colors duration-300 active:scale-95"
                >
                    <Link to="/">BACK TO HOME</Link>
                </Button>
            </div>

            <Footer />
            <Copyright />
        </div>
    )
}

export default NotFoundPage
