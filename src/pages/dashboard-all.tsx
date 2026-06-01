import Navbar from "../components/Navbar";

import { useEffect, useState, useMemo } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

// MODALS
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

import fotokurikulum from "../assets/kurikulumTRPL.png"

// MODALS UNTUK CALENDAR
import AddRencanaModal from "../components/AddRencanaModal";
import ViewRencanaModal from "../components/ViewRencanaModal";

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

export default function DashboardAll() {

    useEffect(() => {
        document.title = "Jadwal ADB | ALL";
    }, []);

    const [Schedule, setSchedule] = useState<Schedule[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [tugasVisibility, setTugasVisibility] = useState(false);

    // ✅ FILTER STATE
    const [filterProgram, setFilterProgram] = useState<string>("ALL");
    const [filterSemester, setFilterSemester] = useState<string>("ALL");

    // modals
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
    const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    // new live
    const [now, setNow] = useState(new Date());

        useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000); // update tiap 1 menit

        return () => clearInterval(interval);
    }, []);

    const currentDayIndex = useMemo(() => {
        const day = now.getDay();
        if (day === 0 || day === 6) return -1;
        return day;
    }, [now]);

    const currentHour = now.getHours();


    const liveMatkul = useMemo(() => {
        if (currentDayIndex === -1) return [];

        return Schedule.filter(s =>
            s.dayIndex === currentDayIndex &&
            Array.isArray(s.slots) &&
            s.slots.includes(currentHour)
        );
    }, [Schedule, currentDayIndex, currentHour]);
    // end of live
    

    // auth
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    // fetch
    const fetchSchedules = async () => {
        const snap = await getDocs(collection(db, "schedules"));

        const data = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Schedule[];

        setSchedule(data);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    // ✅ FILTERED DATA (OPTIMIZED)
    const filteredSchedule = useMemo(() => {
        return Schedule.filter(s => {
            const programMatch =
                filterProgram === "ALL" || s.program === filterProgram;

            const semesterMatch =
                filterSemester === "ALL" || s.semester === Number(filterSemester);

            return programMatch && semesterMatch;
        });
    }, [Schedule, filterProgram, filterSemester]);

    // auto semester list
    const semesters = useMemo(
        () => [...new Set(Schedule.map(s => s.semester))],
        [Schedule]
    );

    // session lookup
    const getSessions = (data: Schedule[], dayIndex: number, hour: number) => {
        return data.filter(
            s =>
                s.dayIndex === dayIndex &&
                Array.isArray(s.slots) &&
                s.slots.includes(hour)
        );
    };

    const renderTable = (title: string, data: Schedule[]) => (
        <div className="card-content-body bg-invert bg-border">
            <h2>{title}</h2>

            {/* ✅ CONTROLS */}
            <div style={{
                display: "flex",
                gap: "10px",
                marginBottom: 10,
                alignItems: "center",
                flexWrap: "wrap",
            }}>

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

                {/* PROGRAM FILTER */}
                <select
                    style={{width:150}}
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                >
                    <option value="ALL">All Program</option>
                    <option value="TRPL">TRPL</option>
                    <option value="BISDIG">BISDIG</option>
                    <option value="BISDIGeks">BISDIGeks</option>
                </select>

                {/* SEMESTER FILTER */}
                <select
                    style={{width:150}}
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                >
                    <option value="ALL">All Semester</option>
                    {semesters.map(s => (
                        <option key={s} value={s}>
                            Semester {s}
                        </option>
                    ))}
                </select>
            </div>

            

            {/* TABLE */}
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
                                    const sessions = getSessions(data, day, hour);

                                    return (
                                        <td key={day}>
                                            {sessions.map((s, idx) => 
                                            s && (
                                                <div key={idx} className={`jadwal-container-new add-hover ${s.type}`}>

                                                    {/* LIVE BADGE (ONLY FOR ACTIVE CLASS) */}
                                                     {liveMatkul.some(live => live.id === s.id) && (
                                                      <div className="live-jadwal add-hover cursor-pointer"
                                                            onClick={() => {
                                                                window.open("https://absensi.digitalbdg.ac.id", "_blank");
                                                            }}>
                                                            <div className="circle-blink green-bg"></div>
                                                            <span> Kelas Live | Segera Absen</span>
                                                        </div>
                                                    )}

                                                    {/* CRUD BUTTONS */}
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

                                                    <h3 style={{ marginTop: 10, color: "var(--red-color)" }}>
                                                        {s.program} - Sem {s.semester}
                                                    </h3>
                                                    <h1>{s.course}</h1>
                                                    <h2>{s.room}</h2>
                                                    <h3 style={{ color: "var(--blue-color)" }}>
                                                        {s.lecturers.join(", ")}
                                                    </h3>

                                                    {s.note && <h4>{s.note}</h4>}

                                                    {/* TUGAS */}
                                                    {tugasVisibility && (
                                                        <>
                                                            {s.titleTugas && (
                                                                <div className="card-content-body bg-invert-new" style={{display:"block", marginBottom:10}}>
                                                                    {user && editMode && (
                                                                        <div className="crud-button">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelected(s);
                                                                                    setOpenTugasEdit(true);
                                                                                }}
                                                                                className="crud-button-icon material-symbols-rounded "
                                                                            >
                                                                                edit
                                                                            </button>

                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelected(s);
                                                                                    setOpenTugasDelete(true);
                                                                                }}
                                                                                className="crud-button-icon material-symbols-rounded "
                                                                            >
                                                                                delete
                                                                            </button>
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
                                                                <div className="card-content-body bg-invert-new" style={{display:"block", marginBottom:10}}>
                                                                    {user && editMode && (
                                                                        <div className="crud-button">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelected(s);
                                                                                    setOpenTugasEditAgain(true);
                                                                                }}
                                                                                className="crud-button-icon material-symbols-rounded "
                                                                            >
                                                                                edit
                                                                            </button>

                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelected(s);
                                                                                    setOpenTugasDeleteAgain(true);
                                                                                }}
                                                                                className="crud-button-icon material-symbols-rounded "
                                                                            >
                                                                                delete
                                                                            </button>
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
                                            )
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
        content: string;
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

        setCalendar(data_calendar);
    };



    useEffect(() => {
        fetchCalendar();
    }, []);

    // FIND EVENT FOR SPECIFIC DATE
    const getCalendar = (
        data: Calendar[],
        bulan: number,
        tgl: number
    ): Calendar[] => {

        return data.filter(
            s =>
                s.bulan === bulan &&
                Array.isArray(s.tanggal) &&
                s.tanggal.includes(tgl)
        );
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

    

    // new const for button crud

    const [selected_cal, setSelected_cal] = useState<Calendar | null>(null);
    const [openAddRencana, setOpenAddRencana] = useState(false);
    const [openViewRencana, setOpenViewRencana] = useState(false);

    

    const renderCalendar = () => {
        return (
        <div className="card-content-body bg-invert bg-border">
            

            {/* TITLE */}
            {/* <h2>
                TRPL REG 24 - Semester {semester} {kategori} / SKS {sks_semesterini}
            </h2> */}

            {/* TITLE */}
            <h2>
                TIMELINE ALL - {" "}
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
                            new Date(
                                year,
                                month - 1,
                                1
                            )
                        )
                    }
                >
                    Prev
                </button>

                <button
                    onClick={() =>
                        setCurrentDate(
                            new Date(
                                year,
                                month + 1,
                                1
                            )
                        )
                    }
                >
                    Next
                </button>

                <button
                    onClick={() =>
                        setCurrentDate(
                            new Date()
                        )
                    }
                >
                    Today
                </button>

                {user && (
                    <>
                        <button onClick={() => setOpenAddRencana(true)}>
                            + Tambah Rencana
                        </button>
                    </>
                )}


                  {/* PROGRAM FILTER */}
                {/* <select
                    style={{width:150}}
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                >
                    <option value="ALL">All Program</option>
                    <option value="TRPL">TRPL</option>
                    <option value="BISDIG">BISDIG</option>
                    <option value="BISDIGeks">BISDIGeks</option>
                </select> */}

                {/* SEMESTER FILTER */}
                {/* <select
                    style={{width:150}}
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                >
                    <option value="ALL">All Semester</option>
                    {semesters.map(s => (
                        <option key={s} value={s}>
                            Semester {s}
                        </option>
                    ))}
                </select> */}

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

                                    const events: Calendar[] =
                                        day !== null
                                            ? getCalendar(
                                                calendar,
                                                month + 1,
                                                day
                                            )
                                            : [];

                                    const isToday = day === new Date().getDate() &&
                                        month === new Date().getMonth() &&
                                        year === new Date().getFullYear();

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
                                                    {day ? (
                                                        <div style={{display:"flex", width:"100%",justifyContent:"center"}}>
                                                            <div className={`tanggal-title ${isToday ? "live " : ""}`}>
                                                            {day}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {/* TASKS */}
                                                {events.map((item, idx) => (
                                                    item.tanggal.length === 1 ? (

                                                        /* SHORT TASK */
                                                        <div
                                                            key={idx}
                                                            className="short-task"
                                                        >
                                                            <div style={{display:"flex", width:"100%",justifyContent:"center"}}>
                                                            {user ? ( 
                                                                <div onClick={() => {
                                                                                    setSelected_cal(item);
                                                                                    setOpenViewRencana(true);
                                                                                }}
                                                                className={`short-banner-selectable add-hover ${item.type}`}></div>
                                                             ) : (
                                                                // <div className={`short-banner ${item.type}`}></div>
                                                                <div onClick={() => {
                                                                                    setSelected_cal(item);
                                                                                    setOpenViewRencana(true);
                                                                                }}
                                                                className={`short-banner-selectable add-hover ${item.type}`}></div>
                                                            )}
                                                            </div>

                                                            <div className="short-task-title">
                                                                {item.task}
                                                            </div>
                                                        </div>

                                                    ) : (

                                                        /* LONG TASK */
                                                        <div
                                                            key={idx}
                                                            className="long-task add-hover"
                                                        >

                                                            {/* SHOW TASK ONLY ON FIRST tanggal */}
                                                            {item.tanggal[0] === day ? (
                                                                <>

                                                               
                                                                    
                                                                <div className="long-task-title">

                                                                     <button
                                                                        onClick={() => {
                                                                               setSelected_cal(item);
                                                                                setOpenViewRencana(true);
                                                                            }}
                                                                        className="task-visibility-btn material-symbols-rounded ">
                                                                            visibility
                                                                    </button>


                                                                    {item.task}
                                                                </div>
                                                                                                                                
                                                                </>

                                                            ) : (

                                                                <div className="long-task-title hide">
                                                                    {item.task}
                                                                </div>

                                                            )}
                                                            

                                                            {/* SHOW BANNER */}
                                                            <div
                                                                className={`long-banner ${item.type}`}
                                                            ></div>

                                                          
                                                                   
                                                                   

                                                        </div>

                                                    )

                                                ))}

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
                        <h1>Dashboard Jadwal Kuliah ALL</h1>
                    </div>

                    <Dashboard />

                    {/* ✅ USE FILTERED DATA */}
                    {renderTable("JADWAL ALL", filteredSchedule)}

                    {renderCalendar()}


                    <div className="card-content-body bg-invert bg-border">
                        <h2>BISNIS DIGITAL - Struktur Kurikulum Akademi Digital Bandung</h2>
                        <p>D4 / S.Tr.B.Ds (Sarjana Terapan Bisnis Digital) - S1 / S.Bns. (Sarjana Bisnis Digital) </p>
                        
                        <img
                            alt="Kurikulum_Bisdig"
                            style={{ height: "auto", width:"85%", objectFit: "contain", margin: "15px 0 0 0"}}
                            className="card-content-body bg-invert bg-border"
                        />
                    </div>


                    <div className="card-content-body bg-invert bg-border">
                        <h2>TRPL - Struktur Kurikulum Akademi Digital Bandung</h2>
                        <p>D4 / S.Tr.Kom (Sarjana Terapan Komputer)</p>
                        
                        <img
                            src={fotokurikulum}
                            alt="Kurikulum_TRPL"
                            style={{ height: "auto", width:"85%", objectFit: "contain", margin: "15px 0 0 0"}}
                            className="card-content-body bg-invert bg-border"
                        />
                    </div>




                </div>
            </div>

            {/* MODALS */}
            <AddScheduleModal open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={fetchSchedules} />
            <EditScheduleModal open={openEdit} onClose={() => setOpenEdit(false)} data={selected} onSuccess={fetchSchedules} />
            <DeleteScheduleModal open={openDelete} onClose={() => setOpenDelete(false)} data={selected} onSuccess={fetchSchedules} />

            <AddTugasModal open={openTugasAdd} data={selected} onClose={() => setOpenTugasAdd(false)} onSuccess={fetchSchedules} />
            <EditTugasModal open={openTugasEdit} data={selected} onClose={() => setOpenTugasEdit(false)} onSuccess={fetchSchedules} />
            <DeleteTugasModal open={openTugasDelete} data={selected} onClose={() => setOpenTugasDelete(false)} onSuccess={fetchSchedules} />

            <AddTugasModalAgain open={openTugasAddAgain} data={selected} onClose={() => setOpenTugasAddAgain(false)} onSuccess={fetchSchedules} />
            <EditTugasModalAgain open={openTugasEditAgain} data={selected} onClose={() => setOpenTugasEditAgain(false)} onSuccess={fetchSchedules} />
            <DeleteTugasModalAgain open={openTugasDeleteAgain} data={selected} onClose={() => setOpenTugasDeleteAgain(false)} onSuccess={fetchSchedules} />

            
            
            {/* MODAL UNTUK CALENDAR RENCANA */}
            <AddRencanaModal open={openAddRencana} onClose={() => setOpenAddRencana(false)} onSuccess={fetchCalendar} />
            <ViewRencanaModal open={openViewRencana} data={selected_cal} onClose={() => setOpenViewRencana(false)} onSuccess={fetchCalendar} />



        </>
    );
}