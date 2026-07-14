import { useEffect, useState } from "react";



function Home() {

    useEffect(() => {
        document.title = "Jadwal Akademi Digital Bandung";
    }, []);


    // offline mode firestore
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

                    {/* Header */}
                    <div className="mb-6 flex gap-2 items-center justify-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200">
                            <img src="/favicon.svg" className="w-10" alt="Logo" />
                        </div>

                        <div className="text-lg font-semibold text-gray-900">
                            Jadwal Akademi Digital Bandung
                        </div>
                    </div>

                    {/* Body */}
                    <div className="max-h-[420px] overflow-y-auto border border-gray-200 rounded-lg py-4 px-7">

                        <h2 className="mb-4 text-center text-md font-medium">
                            Dashboard Jadwal Kuliah
                        </h2>

                        {!isOnline && (
                            <div className="mb-4 rounded-xl text-center border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-600">
                                You're offline — showing cached data.
                            </div>
                        )}

                        <div className="flex flex-col gap-3 py-2">

                            <a
                                href="/trpl-reg-24"
                                className="active:scale-95 justify-center flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm active:border-blue-300 active:bg-blue-50 active:text-blue-700 active:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <span className="material-symbols-rounded">
                                        function
                                    </span>
                                </div>

                                <p className="text-xs font-medium">
                                    Jadwal TRPL REG 24
                                </p>
                            </a>

                            <a
                                href="/bisdig-reg-24"
                                className="active:scale-95 justify-center flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-green-300 hover:bg-green-50 hover:text-green-700 hover:shadow-sm active:border-green-300 active:bg-green-50 active:text-green-700 active:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <span className="material-symbols-rounded">
                                        analytics
                                    </span>
                                </div>

                                <p className="text-xs font-medium">
                                    Jadwal BISDIG REG 24
                                </p>
                            </a>

                            <a
                                href="/trpl-reg-25"
                                className="active:scale-95 justify-center flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm active:border-purple-300 active:bg-purple-50 active:text-purple-700 active:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <span className="material-symbols-rounded">
                                        cards_stack
                                    </span>
                                </div>

                                <p className="text-xs font-medium">
                                    Jadwal TRPL REG 25
                                </p>
                            </a>

                            <a
                                href="/bisdig-reg-25"
                                className="active:scale-95 justify-center flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm active:border-orange-300 active:bg-orange-50 active:text-orange-700 active:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <span className="material-symbols-rounded">
                                        business_center
                                    </span>
                                </div>

                                <p className="text-xs font-medium">
                                    Jadwal BISDIG REG 25
                                </p>
                            </a>

                            <div className="my-2 border-t border-gray-200" />

                            <a
                                href="/bisdig-eks-24"
                                className="active:scale-95 justify-center flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-sm active:border-cyan-300 active:bg-cyan-50 active:text-cyan-700 active:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <span className="material-symbols-rounded">
                                        chart_data
                                    </span>
                                </div>

                                <p className="text-xs font-medium">
                                    Jadwal BISDIG EKS 24
                                </p>
                            </a>

                            <a
                                href="/bisdig-eks-25"
                                className="active:scale-95 justify-center flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 hover:shadow-sm active:border-pink-300 active:bg-pink-50 active:text-pink-700 active:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <span className="material-symbols-rounded">
                                        domain
                                    </span>
                                </div>

                                <p className="text-xs font-medium">
                                    Jadwal BISDIG EKS 25
                                </p>
                            </a>

                            <div className="my-2 border-t border-gray-200" />

                            <a
                                href="/dashboard-all"
                                className="active:scale-95 justify-center flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-sm active:border-red-300 hover:bg-red-50 active:text-red-700 active:shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <span className="material-symbols-rounded">
                                        experiment
                                    </span>
                                </div>

                                <p className="text-xs font-medium">
                                    Jadwal ALL (Eksperimental)
                                </p>
                            </a>

                        </div>

                        <p className="my-6 text-center text-sm text-gray-500">
                            Pilih Kelas Diatas
                        </p>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Home