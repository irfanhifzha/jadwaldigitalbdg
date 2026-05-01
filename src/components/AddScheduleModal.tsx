import { useEffect, useState } from "react";
import Modal from "./Modal";
import { addDoc, collection, getDocs } from "firebase/firestore";
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
  const [program] = useState("TRPL");
  const [semester] = useState<number>(4);
  const [dayIndex, setDayIndex] = useState<number>(1);
  const [slots, setSlots] = useState<number[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<Set<string>>(new Set());

  // 🔥 Load conflicts from Firestore
  const loadConflicts = async () => {
    const snap = await getDocs(collection(db, "schedules"));
    const occupied = new Set<string>();

    snap.forEach((doc) => {
      const d = doc.data();
      const day = d.dayIndex;
      const s = d.slots || [];

      s.forEach((slot: number) => {
        occupied.add(`${day}-${slot}`);
      });
    });

    setOccupiedSlots(occupied);
  };

  useEffect(() => {
    if (open) {
      loadConflicts();
    }
  }, [open]);

  const toggleSlot = (slot: number) => {
    const key = `${dayIndex}-${slot}`;

    if (occupiedSlots.has(key)) return;

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

      {/* Type */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="teori">Teori</option>
        <option value="praktek">Praktek</option>
        <option value="tambahan">Matkul Tambahan</option>
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

      {/* Slots */}
      <div style={{ marginTop: 10 }}>
        <label>Slots</label>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
          {slotOptions.map((slot) => {
            const key = `${dayIndex}-${slot}`;
            const isBlocked = occupiedSlots.has(key);
            const isSelected = slots.includes(slot);

            return (
              <div
                key={slot}
                onClick={() => toggleSlot(slot)}
                className={`button-jam 
                    ${isBlocked ? "blocked" : "enabled"} 
                    ${isSelected && !isBlocked ? "selected" : ""}`}
              >
                {slot}
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 12 }}>
        Save
      </button>
    </Modal>
  );
}