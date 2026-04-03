import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
export default function AuthPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState("Farmer");
    const [isOpen, setIsOpen] = useState(false);

    const [phone, setPhone] = useState("");
    const [notification, setNotification] = useState(null);
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [password, setPassword] = useState("");
    const roles = ["Farmer", "Buyer"];

    // Phone: strip non-digits, limit to 10 digits, always display with +91 prefix
    const handlePhoneChange = (e) => {
        let raw = e.target.value.replace(/\D/g, ''); // strip non-digits
        // If user typed "91" at start (from the prefix), remove it
        if (raw.startsWith('91') && raw.length > 10) {
            raw = raw.slice(2);
        }
        if (raw.length > 10) raw = raw.slice(0, 10);
        setPhone(raw);
    };

    // Aadhar: strip non-digits, limit to 12, format as XXXX-XXXX-XXXX
    const formatAadhar = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 12);
        const parts = [];
        for (let i = 0; i < digits.length; i += 4) {
            parts.push(digits.slice(i, i + 4));
        }
        return parts.join('-');
    };

    const handleAadharChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
        setAadhar(digits); // store raw digits
    };

    const handleRoleSelect = (selected) => {
        setRole(selected);
        setIsOpen(false);
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });

        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };
    const handleLoginSuccess = (user, customRole) => {
        showNotification("Login successful");
        const userRole = customRole || role;
        if (user) {
            localStorage.setItem("userName", user.name || user.displayName || name || "User");
            localStorage.setItem("userPhone", user.phone || phone || "");
            localStorage.setItem("userPhoto", user.photoURL || "");
            localStorage.setItem("role", user.role || role);
            localStorage.setItem("userData", JSON.stringify(user));
        }
        setTimeout(() => {
            if (userRole === "Farmer") {
                navigate("/farmer-dashboard");
            } else if (userRole === "Buyer") {
                navigate("/buyer-marketplace");
            } else {
                navigate("/");
            }
        }, 1000);
    };

    const handleSignIn = async () => {
        if (!phone || !password) {
            showNotification("Please enter your phone number and password.", "error");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, password })
            });
            const data = await response.json();

            if (response.ok) {
                handleLoginSuccess(data.user, data.user?.role);
            } else {
                showNotification(data.message || "You haven't registered so please register", "error");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            showNotification("Server error. Try again later.", "error");
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
            handleLoginSuccess(result.user);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            showNotification("Failed to sign in with Google", "error");
        }
    };

    const handleSignUp = async () => {
        if (!phone || !name || !password) {
            showNotification("Please fill in required fields including password.", "error");
            return;
        }

        const payload = { role, name, phone, password, gender, address, aadhar };
        try {
            const response = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (response.status === 409) {
                showNotification("Account already exists. Please Sign In.", "info");
                setTimeout(() => setIsLogin(true), 1500);
            } else if (response.ok) {
                showNotification("Registration successful!");
                handleLoginSuccess(data.user, data.user?.role);
            } else {
                showNotification(data.message || "Registration failed", "error");
            }
        } catch (error) {
            console.error(error);
            showNotification("Server error. Try again later.", "error");
        }
    };

    return (
        <div className="auth-container">
            <button className="back-btn" onClick={() => window.history.back()}>
                ← Back
            </button>

            <div className="auth-box">
                <header className="auth-header">
                    <h1>MandiConnect</h1>
                    <p>{isLogin ? "Welcome back" : "Create your account"}</p>
                </header>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>

                    {/* ROLE SELECT */}
                    <div className="input-group">
                        <label>I am a...</label>

                        <div className={`custom-select ${isOpen ? "open" : ""}`}>
                            <div
                                className="select-trigger"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span>{role}</span>
                                <span className="chevron">▼</span>
                            </div>

                            {isOpen && (
                                <div className="select-options">
                                    {roles.map((r) => (
                                        <div
                                            key={r}
                                            className={`option ${role === r ? "selected" : ""}`}
                                            onClick={() => handleRoleSelect(r)}
                                        >
                                            {r}
                                            {role === r && <span className="check">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* REGISTRATION FIELDS */}
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <label>{role === "Farmer" ? "Farmer's Name" : "Full Name"}</label>
                                <input type="text" placeholder={role === "Farmer" ? "e.g. Ramesh Patil" : "e.g. Priya Sharma"} value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            {role === "Farmer" && (
                                <>
                                    <div className="input-group">
                                        <label>Gender</label>
                                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full address"
                                            value={address} onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Aadhar KYC</label>
                                        <input
                                            type="text"
                                            placeholder="XXXX-XXXX-XXXX"
                                            maxLength="14"
                                            value={formatAadhar(aadhar)}
                                            onChange={handleAadharChange}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* PHONE NUMBER */}
                    <div className="input-group">
                        <label>Phone Number</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ padding: '9px 10px', background: '#f1f5f9', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>+91</span>
                            <input
                                type="tel"
                                placeholder="9876543210"
                                maxLength="10"
                                value={phone}
                                onChange={handlePhoneChange}
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="input-group">
                        <label>{isLogin ? "Password" : "Set Password"}</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* BUTTONS / GOOGLE OR DIVIDER */}
                    <div className="auth-btn-group">
                        <button type="button" className="btn-primary" onClick={isLogin ? handleSignIn : handleSignUp} style={{ width: '100%', marginBottom: '10px' }}>
                            {isLogin ? "Sign In" : "Sign Up"}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', color: '#999', fontSize: '0.8rem' }}>
                            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
                            <span style={{ padding: '0 8px' }}>or</span>
                            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button type="button" className="google-icon-btn" onClick={signInWithGoogle} title="Continue with Google" style={{
                                background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'transform 0.2s'
                            }} onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
                                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.799 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.679 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>

                </form>

                <footer className="auth-footer">
                    <p>
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}{" "}
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Sign up" : "Log in"}
                        </span>
                    </p>
                </footer>
            </div>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}