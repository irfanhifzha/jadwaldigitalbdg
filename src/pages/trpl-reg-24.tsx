import Navbar from "../components/Navbar";

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

import AddTugasModal from "../components/AddTugasModal";
import EditTugasModal from "../components/EditTugasModal";
import DeleteTugasModal from "../components/DeleteTugasModal";

import AddTugasModalAgain from "../components/AddTugasModalAgain";
import EditTugasModalAgain from "../components/EditTugasModalAgain";
import DeleteTugasModalAgain from "../components/DeleteTugasModalAgain";

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

    note: string;

    // tambah tugas
    statusTugas: string;
    titleTugas: string;
    h1Tugas: string;
    note1Tugas: string;
    note2Tugas: string;

    // tambah tugas again
    statusTugasAgain: string;
    titleTugasAgain: string;
    h1TugasAgain: string;
    note1TugasAgain: string;
    note2TugasAgain: string;

};

export default function TrplReg24() {
    const [trplSchedule, setTrplSchedule] = useState<Schedule[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [tugasVisibility, setTugasVisibility] = useState(true);

    // ✅ modal states
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [openTugasAdd, setOpenTugasAdd] = useState(false);
    const [openTugasEdit, setOpenTugasEdit] = useState(false);
    const [openTugasDelete, setOpenTugasDelete] = useState(false);

    const [openTugasAddAgain, setOpenTugasAddAgain] = useState(false);
    const [openTugasEditAgain, setOpenTugasEditAgain] = useState(false);
    const [openTugasDeleteAgain, setOpenTugasDeleteAgain] = useState(false);
    
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

            <div style={{ display: "flex", gap: "5px", marginBottom: 10, animation:"fadeUp 0.5s ease-out"}}>
                <button onClick={() => setTugasVisibility(prev => !prev)}>
                    {tugasVisibility ? "👀 Hide Tugas" : "🔍 Show Tugas"}
                </button>

            {/* ➕ ADD BUTTON */}
            {user && (
                <>
                <button onClick={() => setOpenAdd(true)}>
                    + Tambah Jadwal
                </button>

                <button onClick={() => setEditMode(prev => !prev)}>
                    {editMode ? "🔒 Exit Edit Mode" : "✏️ Update Data"}
                </button>
                </>        
            )}
            </div>
            

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
                                                            className="crud-button-icon material-symbols-rounded blue-text">edit</button>
                                                            <button
                                                            onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenDelete(true);
                                                                }}
                                                             className="crud-button-icon material-symbols-rounded blue-text">delete</button>


                                                            {/* New ifs */}
                                                            {s.titleTugas ? (
                                                                s.titleTugasAgain ? (
                                                                <button 
                                                                className="crud-button-icon material-symbols-rounded muted-text no-hover">warning</button>
                                                                ) : (
                                                                    <button
                                                                    onClick={() => {
                                                                            setSelected(s);
                                                                            setOpenTugasAddAgain(true);
                                                                        }}
                                                                    className="crud-button-icon material-symbols-rounded blue-text">playlist_add</button>
                                                                ) 
                                                            ) : ( <button
                                                                    onClick={() => {
                                                                            setSelected(s);
                                                                            setOpenTugasAdd(true);
                                                                        }}
                                                                    className="crud-button-icon material-symbols-rounded blue-text">add</button>
                                                            )}
                                                        </div>
                                                    )}

                                                    <h1>{s.course}</h1>
                                                    
                                                    <h2>{s.room}</h2>
                                                    <h3 style={{color:"var(--blue-color)"}}>
                                                        {s.lecturers.join(", ")}
                                                    </h3>

                                                    {s.note && (<h4>{s.note}</h4>)}
                                                    
                                                    { tugasVisibility && (
                                                        <>
                                                    {s.titleTugas && (
                                                    <div className="card-content-body bg-invert-new" style={{display:"block"}}>

                                                        {user && editMode && (
                                                        <div className="crud-button">
                                                        <button
                                                            onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenTugasEdit(true);
                                                                }}
                                                             className="crud-button-icon material-symbols-rounded ">edit</button>
                                                        

                                                        <button
                                                            onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenTugasDelete(true);
                                                                }}
                                                             className="crud-button-icon material-symbols-rounded ">delete</button>

                                                        </div>
                                                        )}

                                                        <h1><div className={`circle ${s.statusTugas}`}></div>{s.titleTugas}</h1>
                                                        <h2><b>{s.h1Tugas}</b></h2>
                                                        <h2>{s.note1Tugas}</h2>
                                                        <h2>{s.note2Tugas}</h2>
                                                    </div>
                                                    )}

                                                    {s.titleTugasAgain && (
                                                    <div className="card-content-body bg-invert-new" style={{display:"block"}}>

                                                        {user && editMode && (
                                                        <div className="crud-button">
                                                        <button
                                                            onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenTugasEditAgain(true);
                                                                }}
                                                             className="crud-button-icon material-symbols-rounded ">edit</button>
                                                        

                                                        <button
                                                            onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenTugasDeleteAgain(true);
                                                                }}
                                                             className="crud-button-icon material-symbols-rounded ">delete</button>

                                                        </div>
                                                        )}

                                                        <h1><div className={`circle ${s.statusTugasAgain}`}></div>{s.titleTugasAgain}</h1>
                                                        <h2><b>{s.h1TugasAgain}</b></h2>
                                                        <h2>{s.note1TugasAgain}</h2>
                                                        <h2>{s.note2TugasAgain}</h2>
                                                    </div>
                                                    )}
                                                    </>
                                                    )}

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
            

            <div className="main-flex">
                <div className="card-container" style={{fontSize:10, color:"black"}}>
                    {/* HEADER */}
                    <div className="card-content-header">
                        <h1 style={{ marginLeft: 10 }}>
                            Dashboard Jadwal Kuliah - TRPL REG 24
                        </h1>
                    </div>
                    <div className="card-content">
                    <p><span className="circle green-color" style={{border: "1px solid var(--green-color)"}}></span> Hijau = Teori</p>
                    <p><span className="circle blue-color" style={{border: "1px solid var(--blue-color)"}}></span> Biru = Praktek</p>
                    <p><span className="circle grey-bg" style={{border: "1px solid var(--grey-color)"}}></span> Abu = Matkul Tambahan</p>
                    </div>

                    {/* TABLE */}
                    {renderTable("TRPL REG 24 - Semester 'x'", trplSchedule)}
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

            {/* 🧩 MODALS TUGAS */}

            <AddTugasModal
                open={openTugasAdd}
                data={selected}
                onClose={() => setOpenTugasAdd(false)}
                onSuccess={fetchSchedules}
            />

            <EditTugasModal
                open={openTugasEdit}
                onClose={() => setOpenTugasEdit(false)}
                data={selected}
                onSuccess={fetchSchedules}
            />

            <DeleteTugasModal
                open={openTugasDelete}
                onClose={() => setOpenTugasDelete(false)}
                data={selected}
                onSuccess={fetchSchedules}
            />

            
            {/* 🧩 MODALS TUGAS AGAIN */}

            <AddTugasModalAgain
                open={openTugasAddAgain}
                data={selected}
                onClose={() => setOpenTugasAddAgain(false)}
                onSuccess={fetchSchedules}
            />

            <EditTugasModalAgain
                open={openTugasEditAgain}
                onClose={() => setOpenTugasEditAgain(false)}
                data={selected}
                onSuccess={fetchSchedules}
            />

            <DeleteTugasModalAgain
                open={openTugasDeleteAgain}
                onClose={() => setOpenTugasDeleteAgain(false)}
                data={selected}
                onSuccess={fetchSchedules}
            />


        </>
    );
}