import { useEffect, useState } from "react";
import Modal from "./Modal";
import { updateDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

const slotOptions = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const days = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 }
];

export default function EditScheduleModal({
  open,
  onClose,
  data,
  onSuccess,
}: any) {
  const [course, setCourse] = useState("");
  const [room, setRoom] = useState("");
  const [lecturers, setLecturers] = useState("");
  const [type, setType] = useState("teori");
  const [dayIndex, setDayIndex] = useState<number>(1);
  const [slots, setSlots] = useState<number[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data) {
      setCourse(data.course || "");
      setRoom(data.room || "");
      setLecturers((data.lecturers || []).join(", "));
      setType(data.type || "");
      setDayIndex(data.dayIndex || 1);
      setSlots(data.slots || []);
    }
  }, [data]);

  // 🔥 WEEKDAY ONLY conflict detection (1–5 only)
  const loadConflicts = async () => {
    const snap = await getDocs(collection(db, "schedules"));
    const occupied = new Set<string>();

    snap.forEach((docSnap) => {
      const d = docSnap.data();

      if (docSnap.id === data.id) return;

      const day = d.dayIndex;

      // 🚨 only consider Monday–Friday
      if (day < 1 || day > 5) return;

      (d.slots || []).forEach((slot: number) => {
        occupied.add(`${day}-${slot}`);
      });
    });

    setOccupiedSlots(occupied);
  };

  useEffect(() => {
    if (open) loadConflicts();
  }, [open, dayIndex]);

  const toggleSlot = (slot: number) => {
    const key = `${dayIndex}-${slot}`;

    if (occupiedSlots.has(key)) return;

    setSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleUpdate = async () => {
    if (!data?.id) return;

    await updateDoc(doc(db, "schedules", data.id), {
      course,
      room,
      lecturers: lecturers
        .split(",")
        .map((l: string) => l.trim())
        .filter(Boolean),
      type,
      dayIndex,
      slots,
    });

    onSuccess();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Edit Jadwal</h2>

      <input value={course} onChange={(e) => setCourse(e.target.value)} />
      <input value={room} onChange={(e) => setRoom(e.target.value)} />
      <input value={lecturers} onChange={(e) => setLecturers(e.target.value)} />

      
      {/* Type */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="teori">Teori</option>
        <option value="praktek">Praktek</option>
                <option value="tambahan">Matkul Tambahan</option>
      </select>

      {/* Day (unchanged list, but Fri-only logic handled in conflict) */}
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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

      <button onClick={handleUpdate}>Update</button>
    </Modal>
  );
}