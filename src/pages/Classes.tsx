import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { db, auth } from "../firebase";

import Navbar from "../components/Navbar";

import CalendarView from "../components/CalendarView";
import ScheduleTable from "../components/ScheduleTable";
import Todo from "../components/Todo";

import { collection, query, where, getDocs } from "firebase/firestore";

import fotokurikulum from "../assets/kurikulumTRPL.png"

type HomeProps = {
    kategori?: string;
};

export default function Classes({ kategori }: HomeProps) {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!kategori) {
            setData(null);
            return;
        }

        async function fetchData() {
            const q = query(
                collection(db, "kelas"),
                where("kategori", "==", kategori)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                setData(snap.docs[0].data());
            } else {
                setData(null);
            }
        }

        fetchData();
    }, [kategori]);

    const isValidKategori = !!kategori;


    return (
        <>
            <Navbar />

            <div className="mx-5 px-4 flex flex-wrap gap-2 text-bold">
                <p className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Kelas <span className="uppercase">{isValidKategori ? (data?.kategori ?? "-") : "ALL"}</span>
                </p>

                <p className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    Semester{" "}
                    {isValidKategori ? (data?.semester ?? "-") : "ALL"}{" "}
                    {data?.semester
                        ? Number(data.semester) % 2 === 0
                            ? "(Genap)"
                            : "(Ganjil)"
                        : ""}
                </p>

                <p className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                    {isValidKategori
                        ? (data?.sks_semesterini ?? "-")
                        : "ALL"}{" "}
                    SKS
                </p>
            </div>



            <div className="m-0 p-0 flex flex-col">
                <div className="flex flex-col h-fit rounded-2xl gap-2 px-4 pb-5 overflow-hidden mx-5 bg-white">
                    <div>
                        <p className="font-bold text-lg"></p>
                    </div>

                    <Todo kategori={kategori} user={isValidKategori ? user : null} />
                    <CalendarView kategori={kategori} user={isValidKategori ? user : null} />
                    <ScheduleTable kategori={kategori} user={isValidKategori ? user : null} />

                    



                    { (!isValidKategori || (kategori === "TRPL24" || kategori === "TRPL25")) && (<div className="flex flex-col gap-2 w-fit max-w-4xl min-w-[320px] h-fit rounded-2xl px-8 py-6 border border-gray-200 justify-center bg-white">

                        <div className="font-bold">
                            TRPL - Struktur Kurikulum Akademi Digital Bandung
                        </div>

                        <div>
                            D4 / S.Tr.Kom (Sarjana Terapan Komputer)
                        </div>

                        {/* image wrapper controls large images */}
                        <div className="w-full max-h-[80vh] overflow-auto border border-gray-200 rounded-lg">
                            <img
                                src={fotokurikulum}
                                alt="Kurikulum_TRPL"
                                className="w-full h-auto object-contain"
                            />
                        </div>

                    </div>)}

                    { (!isValidKategori || (kategori === "BISDIG24" || kategori === "BISDIG25" || kategori === "BISDIGeks24" || kategori === "BISDIGeks25")) && (<div className="flex flex-col gap-2 w-fit max-w-4xl min-w-[320px] h-fit rounded-2xl px-8 py-6 border border-gray-200 justify-center bg-white">

                        <div className="font-bold">
                            BISNIS DIGITAL - Struktur Kurikulum Akademi Digital Bandung
                        </div>

                        <div>
                            D4 / Sarjana Terapan Bisnis Digital (S.Tr.Bns.) atau Sarjana Bisnis Digital (S.Bns.)
                        </div>

                        {/* image wrapper controls large images */}
                        <div className="w-full max-h-[80vh] overflow-auto border border-gray-200 rounded-lg">
                            <img
                                src=""
                                alt="Kurikulum_BISDIG"
                                className="w-full h-auto object-contain"
                            />
                        </div>

                    </div>)}


                </div>
            </div>
        </>
    );
}