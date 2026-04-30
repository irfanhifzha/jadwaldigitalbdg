import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar"

type Todo = {
    id: string;
    title: string;
    content: string;
    status: string;
    note: string;
};

export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const snapshot = await getDocs(collection(db, "todo"));

                const data: Todo[] = snapshot.docs.map((doc) => {
                    const d = doc.data();

                    return {
                        id: doc.id,

                        // 🔥 normalize Firestore weird keys into clean ones
                        title: d.Title ?? "",
                        content: d.Content ?? "",
                        status: d.Status ?? "",
                        note: d["Note tambahan"] ?? "",
                    };
                });

                console.log("CLEAN DATA:", data);

                setTodos(data);
            } catch (error) {
                console.error("FETCH ERROR:", error);
            }
        };

        fetchTodos();
    }, []);

    return (
        <>
            <Navbar />


            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    margin: "0 10px"
                }}
            >
                {todos.map((todo) => (
                    <div className="card-content add-hover" key={todo.id}>
                        
                        <div className="card-content-header">
                            <h1 style={{marginLeft: 10}}>{todo.title}</h1>
                        </div>

                        <div className="card-content-body bg-invert bg-border">
                            
                            <h2>{todo.status}</h2>

                            <p>{todo.content}</p>

                            <p style={{ color: "var(--text-muted)", marginTop: 15 }}>
                                {todo.note}
                            </p>

                        </div>

                    </div>
                ))}
            </div>
        </>
    );
}