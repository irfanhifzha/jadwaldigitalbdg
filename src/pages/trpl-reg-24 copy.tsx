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

    program: "TRPL" | "BISDIG";
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

export default function TrplReg24() {

    useEffect(() => {
        document.title = "Jadwal ADB | TRPL REG 24";
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
    const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];


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
    getDoc(doc(db, "kelas", "trplreg24")).then((snap) => {
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
            data.filter(d => d.program === "TRPL" && d.semester === semester)
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




    // NEW CALENDAR

    type Calendar = {
        id?: string;

        program: string;
        semester: number;

        tahun: number;

        bulan: number;
        tanggal: number[];

        task: string;
        type: string;
        model: string;
    };

    // firestore calendar data
    const [calendar, setCalendar] = useState<Calendar[]>([]);

    // current displayed month
    const [currentDate, setCurrentDate] = useState(new Date());

    // FETCH FIRESTORE
    const fetchCalendar = async () => {

        const snap_calendar = await getDocs(
            collection(db, "calendar")
        );

        const data_calendar = snap_calendar.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Calendar[];

        setCalendar(
            data_calendar.filter(
                d =>
                    d.program === "TRPL" &&
                    d.semester === semester
            )
        );
    };

    useEffect(() => {
        fetchCalendar();
    }, [semester]);

    // FIND EVENT FOR SPECIFIC DATE
    const getCalendar = (
        data: Calendar[],
        bulan: number,
        tgl: number
    ) => {

        return data.find(
            s =>
                s.bulan === bulan &&
                Array.isArray(s.tanggal) &&
                s.tanggal.includes(tgl)
        ) || null;
    };

    // BUILD CALENDAR MATRIX
    const buildCalendar = (
        year: number,
        month: number
    ): (number | null)[][] => {

        const firstDay = new Date(
            year,
            month,
            1
        ).getDay();

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate();

        const weeks: (number | null)[][] = [];

        let week: (number | null)[] =
            new Array(7).fill(null);

        let day = 1;

        // first week
        for (let i = firstDay; i < 7; i++) {
            week[i] = day++;
        }

        weeks.push(week);

        // remaining weeks
        while (day <= daysInMonth) {

            week = new Array(7).fill(null);

            for (
                let i = 0;
                i < 7 && day <= daysInMonth;
                i++
            ) {
                week[i] = day++;
            }

            weeks.push(week);
        }

        return weeks;
    };

    // CURRENT YEAR + MONTH
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const weeks = buildCalendar(year, month);

    const daysHeader = [
        "Min",
        "Sen",
        "Sel",
        "Rab",
        "Kam",
        "Jum",
        "Sab"
    ];

    const renderCalendar = () => {
        return (
        <div className="card-content-body bg-invert bg-border">

            {/* TITLE */}
            <h2>
                {
                    currentDate.toLocaleString(
                        "default",
                        { month: "long" }
                    )
                } {year}
            </h2>

            {/* BUTTONS */}
            <div
                style={{
                    display: "flex",
                    gap: "5px",
                    marginBottom: 10
                }}
            >

                <button
                    onClick={() =>
                        setCurrentDate(
                            new Date(year, month - 1, 1)
                        )
                    }
                >
                    Prev
                </button>

                <button
                    onClick={() =>
                        setCurrentDate(
                            new Date(year, month + 1, 1)
                        )
                    }
                >
                    Next
                </button>

                <button
                    onClick={() =>
                        setCurrentDate(new Date())
                    }
                >
                    Today
                </button>

            </div>

            {/* CALENDAR */}
            <div className="calendar-wrapper">

                <table className="calendar-table">

                    <thead>
                        <tr>
                            {daysHeader.map(day => (
                                <th key={day}>
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>

                        {weeks.map((week, i) => (

                            <tr key={i}>

                                {week.map((day, j) => {

                                    const c =
                                        day !== null
                                            ? getCalendar(
                                                calendar,
                                                month +1,
                                                day
                                            )
                                            : null;

                                    return (
                                        <td
                                            key={j}
                                            className={
                                                day !== null
                                                    ? "day-cell"
                                                    : "empty-cell"
                                            }
                                        >

                                            <div className="calendar-container">

                                                {/* DATE */}
                                                <div className="tanggal-title">
                                                    {day ?? ""}
                                                </div>

                                                {/* TASK */}
                                                {c && c.model === "long" && (
                                                    <div className="long-task">

                                                        {/* show task only on first tanggal */}
                                                        {c.tanggal[0] === day ? (
                                                        <>
                                                            <div className="long-task-title">
                                                                {c.task}
                                                            </div>
                                                        </>
                                                        ) : (
                                                            <div className="long-task-title hide">
                                                                {c.task}
                                                            </div>
                                                        )
                                                        }

                                                        {/* show banner for all tanggal */}
                                                        <div className={`long-banner ${c.type}`}></div>
                                                    </div>
                                                )}

                                                {c && c.model === "short" && (
                                                    <div className="calendar-container add-hover praktek">asdf</div>
                                                )}

                                            </div>

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
    };






    return (
        <>
            <Navbar />

            <div className="main-flex">
                <div className="card-container">

                    <div className="card-content-header">
                        <h1>Dashboard Jadwal Kuliah - TRPL REG 24</h1>
                    </div>
                    <Dashboard />

                    {renderTable(`TRPL REG 24 - Semester ${semester} (${kategori}) / SKS ${sks_semesterini}`, Schedule)}

                    {renderCalendar()}
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