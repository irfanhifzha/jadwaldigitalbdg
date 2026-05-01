import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import type { User } from "firebase/auth";

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsub();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };



    return (
        <div style={{ marginRight: 10 }}>
            {user ? (
                <>
                    <span>{user.email}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                            type={showPassword ? "text" : "password"}
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: "2.5rem" }}
                        />

                        <span
                            className="material-symbols-rounded"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                            cursor: "pointer",
                            userSelect: "none",
                            fontSize: "20px",
                            }}
                        >
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>

                    <button onClick={handleLogin}>Login</button>
                </>
            )}
        </div>
    );
}