import Navbar from "../components/Navbar";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    getDoc,
    doc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

// MODALS (UNCHANGED)
import AddScheduleModal from "../components/AddScheduleModal";
import EditScheduleModal from "../components/EditScheduleModal";
import DeleteScheduleModal from "../components/DeleteScheduleModal";

import AddTugasModal from "../components/AddTugasModal";
import EditTugasModal from "../components/EditTugasModal";
import DeleteTugasModal from "../components/DeleteTugasModal";

import AddTugasModalAgain from "../components/AddTugasModalAgain";
import EditTugasModalAgain from "../components/EditTugasModalAgain";
import DeleteTugasModalAgain from "../components/DeleteTugasModalAgain";
import Dashboard from "../components/Dashboard";

type Schedule = {
    id?: string;

    program: "TRPL" | "BISDIG" | "BISDIGeks";
    semester: number;

    dayIndex: number;
    slots: number[];

    course: string;
    room: string;
    lecturers: string[];

    type: "teori" | "praktek";

    note: string;

    statusTugas: string;
    titleTugas: string;
    h1Tugas: string;
    note1Tugas: string;
    note2Tugas: string;

    statusTugasAgain: string;
    titleTugasAgain: string;
    h1TugasAgain: string;
    note1TugasAgain: string;
    note2TugasAgain: string;
};

export default function BisdigEks25() {

    useEffect(() => {
        document.title = "Jadwal ADB | BISDIG EKS 25";
    }, []);

    const [Schedule, setSchedule] = useState<Schedule[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [tugasVisibility, setTugasVisibility] = useState(true);

    // modals (UNCHANGED)
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
    const hours = [16, 17, 18, 19, 20, 21, 22];

    // new live
    const [now, setNow] = useState(new Date());

        useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000); // update tiap 1 menit

        return () => clearInterval(interval);
    }, []);

    const currentDayIndex = () => {
    const day = now.getDay();
        // JS: Sunday=0 ... Saturday=6
        // your system: Monday=1 ... Friday=5

        if (day === 0 || day === 6) return -1;
        return day;
    };

    const currentHour = now.getHours();


    const liveMatkul = Schedule.find(s =>
        s.dayIndex === currentDayIndex() &&
        Array.isArray(s.slots) &&
        s.slots.includes(currentHour)
    );

    // end of live

    // auth
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    // fetch data semester
    const [semester, setSemester] = useState<number | null>(null);
    const [kategori, setKategori] = useState<string | null>(null);
    const [sks_semesterini, setSKS] = useState<number | null>(null);

    useEffect(() => {
    getDoc(doc(db, "kelas", "bisdigeks25")).then((snap) => {
        if (snap.exists()) {
        setSemester(snap.data().semester);
        setKategori(snap.data().kategori);
        setSKS(snap.data().sks_semesterini);
        }
    });
    }, []);

    // FETCH (FIXED FILTER ONLY)
    const fetchSchedules = async () => {
        const snap = await getDocs(collection(db, "schedules"));

        const data = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Schedule[];

        setSchedule(
            data.filter(d => d.program === "BISDIGeks" && d.semester === semester)
        );
    };

    useEffect(() => {
    if (semester !== null) {
        fetchSchedules();
    }
    }, [semester]);

    // SESSION LOOKUP (SIMPLE, NO RESTRICTION)
    const getSession = (data: Schedule[], dayIndex: number, hour: number) => {
        return data.find(
            s =>
                s.dayIndex === dayIndex &&
                Array.isArray(s.slots) &&
                s.slots.includes(hour)
        ) || null;
    };

    const renderTable = (title: string, data: Schedule[]) => (
        <div className="card-content-body bg-invert bg-border">
            <h2>{title}</h2>

            <div style={{ display: "flex", gap: "5px", marginBottom: 10, animation:"fadeUp 0.5s ease-out"}}>
                <button onClick={() => setTugasVisibility(prev => !prev)}>
                    {tugasVisibility ? "👀 Hide Tugas" : "🔍 Show Tugas"}
                </button>

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

                                                    {/* LIVE BADGE (ONLY FOR ACTIVE CLASS) */}
                                                    {liveMatkul && liveMatkul.id === s.id && (
                                                        <div className="live-jadwal">
                                                            <div className="circle-blink green-bg"></div><span> Kelas Live | Segera Absen</span>
                                                        </div>
                                                    )}

                                                    {/* CRUD BUTTONS (UNCHANGED) */}
                                                    {user && editMode && (
                                                        <div className="crud-button">
                                                            <button
                                                                onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenEdit(true);
                                                                }}
                                                                className="crud-button-icon material-symbols-rounded blue-text"
                                                            >
                                                                edit
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setSelected(s);
                                                                    setOpenDelete(true);
                                                                }}
                                                                className="crud-button-icon material-symbols-rounded blue-text"
                                                            >
                                                                delete
                                                            </button>

                                                            {s.titleTugas ? (
                                                                s.titleTugasAgain ? (
                                                                    <button className="crud-button-icon material-symbols-rounded muted-text no-hover">
                                                                        warning
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelected(s);
                                                                            setOpenTugasAddAgain(true);
                                                                        }}
                                                                        className="crud-button-icon material-symbols-rounded blue-text"
                                                                    >
                                                                        playlist_add
                                                                    </button>
                                                                )
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelected(s);
                                                                        setOpenTugasAdd(true);
                                                                    }}
                                                                    className="crud-button-icon material-symbols-rounded blue-text"
                                                                >
                                                                    add
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* CONTENT (UNCHANGED) */}
                                                    <h1>{s.course}</h1>
                                                    <h2>{s.room}</h2>
                                                    <h3 style={{color:"var(--blue-color)"}}>
                                                        {s.lecturers.join(", ")}
                                                    </h3>

                                                    {s.note && <h4>{s.note}</h4>}

                                                    {/* TUGAS */}
                                                    {tugasVisibility && (
                                                        <>
                                                            {s.titleTugas && (
                                                                <div className="card-content-body bg-invert-new" style={{display:"block"}}>

                                                                     {/* adain lagi crud for tugas */}
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

                                                                    <h1>
                                                                        <div className={`circle ${s.statusTugas}`}></div>
                                                                        {s.titleTugas}
                                                                    </h1>
                                                                    <h2><b>{s.h1Tugas}</b></h2>
                                                                    <h2>{s.note1Tugas}</h2>
                                                                    <h2>{s.note2Tugas}</h2>
                                                                </div>
                                                            )}

                                                            {s.titleTugasAgain && (
                                                                <div className="card-content-body bg-invert-new" style={{display:"block"}}>

                                                                     {/* adain lagi crud for tugas */}
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


                                                                    <h1>
                                                                        <div className={`circle ${s.statusTugasAgain}`}></div>
                                                                        {s.titleTugasAgain}
                                                                    </h1>
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
                <div className="card-container">

                    <div className="card-content-header">
                        <h1>Dashboard Jadwal Kuliah - BISDIG EKS 25</h1>
                    </div>
                    <Dashboard />

                    {renderTable(`BISDIG EKS 25 - Semester ${semester} (${kategori}) / SKS ${sks_semesterini}`, Schedule)}
                </div>
            </div>

            {/* MODALS (UNCHANGED) */}
            <AddScheduleModal open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={fetchSchedules} />
            <EditScheduleModal open={openEdit} onClose={() => setOpenEdit(false)} data={selected} onSuccess={fetchSchedules} />
            <DeleteScheduleModal open={openDelete} onClose={() => setOpenDelete(false)} data={selected} onSuccess={fetchSchedules} />

            <AddTugasModal open={openTugasAdd} data={selected} onClose={() => setOpenTugasAdd(false)} onSuccess={fetchSchedules} />
            <EditTugasModal open={openTugasEdit} data={selected} onClose={() => setOpenTugasEdit(false)} onSuccess={fetchSchedules} />
            <DeleteTugasModal open={openTugasDelete} data={selected} onClose={() => setOpenTugasDelete(false)} onSuccess={fetchSchedules} />

            <AddTugasModalAgain open={openTugasAddAgain} data={selected} onClose={() => setOpenTugasAddAgain(false)} onSuccess={fetchSchedules} />
            <EditTugasModalAgain open={openTugasEditAgain} data={selected} onClose={() => setOpenTugasEditAgain(false)} onSuccess={fetchSchedules} />
            <DeleteTugasModalAgain open={openTugasDeleteAgain} data={selected} onClose={() => setOpenTugasDeleteAgain(false)} onSuccess={fetchSchedules} />
        </>
    );
}