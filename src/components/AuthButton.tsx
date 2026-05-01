import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import type { User } from "firebase/auth";

import Modal from "./Modal";

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsub();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setOpen(false); // close modal after login
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
            <div>
            {user ? (
                <>
                    <span>{user.email}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => setOpen(true)}>Login</button>

                    <Modal open={open} onClose={() => setOpen(false)}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <h3>Login</h3>

                            <div style={{ display:"flex", position: "relative", width:"100%" }}>
                                <input
                                    type="email"
                                    placeholder="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width:"100%"}}
                                />
                            </div>

                            <div style={{ display:"flex", position: "relative", width:"100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingRight: "2.5rem", width:"100%"}}
                                />

                                <span
                                    className="material-symbols-rounded"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    style={{
                                        cursor: "pointer",
                                        userSelect: "none",
                                        fontSize: "20px",
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)"
                                    }}
                                >
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </div>

                            <button onClick={handleLogin}>Login</button>
                        </div>
                    </Modal>
                </>
            )}
            </div>
    );
}