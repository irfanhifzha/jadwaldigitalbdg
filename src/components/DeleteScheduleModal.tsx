import Modal from "./Modal";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function DeleteScheduleModal({ open, onClose, data, onSuccess }: any) {
    const handleDelete = async () => {
        if (!data?.id) return;

        await deleteDoc(doc(db, "schedules", data.id));

        onSuccess();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h3>Yakin mau hapus?</h3>
            <p>{data?.course}</p>

            <button onClick={handleDelete}>Yes, Delete</button>
        </Modal>
    );
}