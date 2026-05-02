import Modal from "./Modal";
import { updateDoc, doc, deleteField } from "firebase/firestore";
import { db } from "../firebase";

export default function DeleteTugasModal({ open, onClose, data, onSuccess }: any) {
    const handleDelete = async () => {
        if (!data?.id) return;

        await updateDoc(doc(db, "schedules", data.id), {
            statusTugas: deleteField(),
            titleTugas: deleteField(),
            h1Tugas: deleteField(),
            note1Tugas: deleteField(),
            note2Tugas: deleteField(),
        });

        onSuccess();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h3>Yakin mau hapus tugas?</h3>
            <p>"{data?.h1Tugas}"</p>

            <button onClick={handleDelete}>Yes, Delete</button>
        </Modal>
    );
}