import { useEffect, useState } from "react";
import Modal from "./Modal";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const days = [
  { label: "Senin", value: 1 },
  { label: "Selasa", value: 2 },
  { label: "Rabu", value: 3 },
  { label: "Kamis", value: 4 },
  { label: "Jumat", value: 5 }
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
  const [note, setNote] = useState("");

  const [showInvalid, setShowInvalid] = useState(false);

  // ✅ validation
  const isInvalid =
    !course.trim() ||
    !room.trim() ||
    !lecturers.trim() ||
    slots.length === 0;

  // ✅ RESET FORM
  const resetForm = () => {
    setCourse("");
    setRoom("");
    setLecturers("");
    setType("teori");
    setDayIndex(1);
    setSlots([]);
    setShowInvalid(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 🔥 load occupied slots
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

  // ✅ reset + reload when modal opens
  useEffect(() => {
    if (open) {
      loadConflicts();
      resetForm();
    }
  }, [open]);

  // 🚨 KEY FIX: reset slots when day changes
  useEffect(() => {
    setSlots([]);
  }, [dayIndex]);

  // toggle slot selection
  const toggleSlot = (slot: number) => {
    const key = `${dayIndex}-${slot}`;

    if (occupiedSlots.has(key)) return;

    setSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  // ✅ submit with validation
  const handleSubmit = async () => {
    if (isInvalid) {
      setShowInvalid(true);
      return;
    }

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
      note,
    });

    onSuccess();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <h2>Tambah Jadwal</h2>

      <input
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />

      <input
        placeholder="Room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <input
        placeholder="Lecturers (comma separated)"
        value={lecturers}
        onChange={(e) => setLecturers(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="teori">Teori</option>
        <option value="praktek">Praktek</option>
        <option value="tambahan">Matkul Tambahan</option>
      </select>

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

      {/* warning */}
      {showInvalid && (
        <div style={{
          background: "#ffe5e5",
          color: "#b00020",
          padding: 10,
          marginTop: 10,
          borderRadius: 6
        }}>
          Semua field wajib diisi dan minimal 1 jam harus dipilih
        </div>
      )}

      {/* slots */}
      <div style={{ marginTop: 10 }}>
        <label>Jam</label>

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
      
      <input
        placeholder="Note (Optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* button */}
      <button
        onClick={handleSubmit}
        disabled={isInvalid}
        style={{
          marginTop: 12,
          opacity: isInvalid ? 0.5 : 1,
          cursor: isInvalid ? "not-allowed" : "pointer"
        }}
      >
        Save
      </button>
    </Modal>
  );
}