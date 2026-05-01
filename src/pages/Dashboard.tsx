import Navbar from "../components/Navbar";
import AuthButton from "../components/AuthButton";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

// ✅ MODALS
import AddScheduleModal from "../components/AddScheduleModal";
import EditScheduleModal from "../components/EditScheduleModal";
import DeleteScheduleModal from "../components/DeleteScheduleModal";

type Schedule = {
    id?: string;

    program: "TRPL" | "BISDIG";
    semester: number;

    dayIndex: number;
    slots: number[];

    course: string;
    room: string;
    lecturers: string[];

    type: "teori" | "praktek";
};

export default function Dashboard() {
    const [trplSchedule, setTrplSchedule] = useState<Schedule[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const [editMode, setEditMode] = useState(false);

    // ✅ modal states
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [selected, setSelected] = useState<Schedule | null>(null);

    const days = [1, 2, 3, 4, 5];
    const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    // 🔐 Auth listener
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsub();
    }, []);

    // 🔄 Fetch schedules
    const fetchSchedules = async () => {
        const snap = await getDocs(collection(db, "schedules"));

        const data = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Schedule[];

        setTrplSchedule(data.filter(d => d.program === "TRPL"));
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    // 🔍 Get session
    const getSession = (data: Schedule[], dayIndex: number, hour: number) => {
        return data.find(
            s => s.dayIndex === dayIndex && s.slots?.includes(hour)
        );
    };

    // 🧱 Table renderer
    const renderTable = (title: string, data: Schedule[]) => (
        <div className="card-content-body bg-invert bg-border">
            <h2>{title}</h2>

            {/* ➕ ADD BUTTON */}
            {user && (
                <div style={{ display: "flex", gap: "10px", marginBottom: 10 }}>
                    
                    <button onClick={() => setOpenAdd(true)}>
                        + Tambah Jadwal
                    </button>

                    <button onClick={() => setEditMode(prev => !prev)}>
                        {editMode ? "🔒 Exit Edit Mode" : "✏️ Update Data"}
                    </button>

                </div>
            )}

            <div className="jadwal-wrapper">
                <table className="jadwal-table">
                    <thead>
                        <tr>
                            <th className="jam">Jam</th>
                            <th>Senin</th>
                            <th>Selasa</th>
                            <th>Rabu</th>
                            <th>Kamis</th>
                            <th>Jumat</th>
                        </tr>
                    </thead>

                    <tbody>
                        {hours.map(hour => (
                            <tr key={hour}>
                                <td className="jam">{hour}:00</td>

                                {days.map(day => {
                                    const s = getSession(data, day, hour);

                                    return (
                                        <td key={day}>
                                            {s && (
                                                <div className={`jadwal-container add-hover ${s.type}`}>
                                                    
                                                    {user && editMode && (
                                                        <div className="crud-button">
                                                            <button 
                                                            onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenEdit(true);
                                                                }}
                                                            className="crud-button-icon material-symbols-rounded">edit</button>
                                                            <button
                                                            onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenDelete(true);
                                                                }}
                                                             className="crud-button-icon material-symbols-rounded">delete</button>
                                                        </div>
                                                    )}

                                                    <h1>{s.course}</h1>
                                                    
                                                    <h2>{s.room}</h2>
                                                    <h3 style={{color:"var(--blue-color)"}}>
                                                        {s.lecturers.join(", ")}
                                                    </h3>

                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <AuthButton />

            <div className="main-flex">
                <div className="card-container">
                    {/* HEADER */}
                    <div className="card-content-header">
                        <h1 style={{ marginLeft: 10 }}>
                            Jadwal Reguler 24
                        </h1>
                    </div>

                    {/* TABLE */}
                    {renderTable("TRPL REG Semester 4", trplSchedule)}
                </div>
            </div>

            {/* 🧩 MODALS */}

            <AddScheduleModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={fetchSchedules}
            />

            <EditScheduleModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                data={selected}
                onSuccess={fetchSchedules}
            />

            <DeleteScheduleModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                data={selected}
                onSuccess={fetchSchedules}
            />
        </>
    );
}