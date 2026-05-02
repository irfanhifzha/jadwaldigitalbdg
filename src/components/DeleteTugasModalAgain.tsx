import Modal from "./Modal";
import { updateDoc, doc, deleteField } from "firebase/firestore";
import { db } from "../firebase";

export default function DeleteTugasModalAgain({ open, onClose, data, onSuccess }: any) {
    const handleDelete = async () => {
        if (!data?.id) return;

        await updateDoc(doc(db, "schedules", data.id), {
            statusTugasAgain: deleteField(),
            titleTugasAgain: deleteField(),
            h1TugasAgain: deleteField(),
            note1TugasAgain: deleteField(),
            note2TugasAgain: deleteField(),
        });

        onSuccess();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h3>Yakin mau hapus tugas?</h3>
            <p>"{data?.h1TugasAgain}"</p>

            <button onClick={handleDelete}>Yes, Delete</button>
        </Modal>
    );
}