import { useState } from "react";
import Modal from "./Modal";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const days = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
];

const slotOptions = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default function AddScheduleModal({ open, onClose, onSuccess }: any) {
  const [course, setCourse] = useState("");
  const [room, setRoom] = useState("");
  const [lecturers, setLecturers] = useState("");
  const [type, setType] = useState("teori");
  const [program, setProgram] = useState("TRPL");
  const [semester, setSemester] = useState<number>(4);
  const [dayIndex, setDayIndex] = useState<number>(1);
  const [slots, setSlots] = useState<number[]>([]);

  const toggleSlot = (slot: number) => {
    setSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = async () => {
    await addDoc(collection(db, "schedules"), {
      program,
      semester,
      dayIndex,
      slots,
      course,
      room,
      lecturers: lecturers
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      type,
    });

    onSuccess();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Tambah Jadwal</h2>

      {/* Course */}
      <input
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />

      {/* Room */}
      <input
        placeholder="Room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      {/* Lecturers */}
      <input
        placeholder="Lecturers (comma separated)"
        value={lecturers}
        onChange={(e) => setLecturers(e.target.value)}
      />

      {/* Program */}
      <input
        placeholder="Program"
        value={program}
        onChange={(e) => setProgram(e.target.value)}
      />

      {/* Semester */}
      <input
        type="number"
        placeholder="Semester"
        value={semester}
        onChange={(e) => setSemester(Number(e.target.value))}
      />

      {/* Type */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="teori">Teori</option>
        <option value="praktek">Praktek</option>
      </select>

      {/* Day */}
      <select
        value={dayIndex}
        onChange={(e) => setDayIndex(Number(e.target.value))}
      >
        {days.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {/* Slots Toggle UI */}
      <div style={{ marginTop: 10 }}>
        <label>Slots</label>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: 6,
          }}
        >
          {slotOptions.map((slot) => (
            <div
              key={slot}
              onClick={() => toggleSlot(slot)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #999",
                cursor: "pointer",
                userSelect: "none",
                background: slots.includes(slot) ? "#4f46e5" : "#fff",
                color: slots.includes(slot) ? "#fff" : "#000",
              }}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 12 }}>
        Save
      </button>
    </Modal>
  );
}