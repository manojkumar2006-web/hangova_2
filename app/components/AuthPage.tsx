"use client";

import { useEffect, useRef, useState } from "react";

interface AuthPageProps {
    onLogin: () => void;
    onBack: () => void;
}

export default function AuthPage({ onLogin, onBack }: AuthPageProps) {
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    
    // Validation Errors
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    
    // OTP Flow
    const [authStep, setAuthStep] = useState<"form" | "otp">("form");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const lightIntensityRef = useRef(0);
    const targetIntensityRef = useRef(0);

    // 3D Scene
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let animId: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let renderer: any, scene: any, camera: any, mesh: any, pointLight: any, ambientLight: any;
        let t = 0;

        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
        script.onload = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const THREE = (window as any).THREE;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);

            // Torus Knot
            const geo = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 20);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x8b5cf6,
                metalness: 0.3,
                roughness: 0.2,
                emissive: 0x4c1d95,
                emissiveIntensity: 0.3,
            });
            mesh = new THREE.Mesh(geo, mat);
            scene.add(mesh);

            // Ambient light (always on, subtle)
            ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
            scene.add(ambientLight);

            // Point light that reacts to password visibility
            pointLight = new THREE.PointLight(0xa78bfa, 0, 10);
            pointLight.position.set(3, 3, 3);
            scene.add(pointLight);

            // Rim light
            const rimLight = new THREE.PointLight(0x2dd4bf, 0.4, 15);
            rimLight.position.set(-3, -2, -2);
            scene.add(rimLight);

            const animate = () => {
                animId = requestAnimationFrame(animate);
                t += 0.01;

                mesh.rotation.x = t * 0.4;
                mesh.rotation.y = t * 0.6;

                // Smooth light transition
                const target = targetIntensityRef.current;
                lightIntensityRef.current += (target - lightIntensityRef.current) * 0.05;
                const intensity = lightIntensityRef.current;

                pointLight.intensity = intensity * 3.5;
                ambientLight.intensity = 0.15 + intensity * 0.5;
                mat.emissiveIntensity = 0.1 + intensity * 0.8;

                // Pulse on high intensity
                if (intensity > 0.5) {
                    const pulse = Math.sin(t * 3) * 0.05 * intensity;
                    mesh.scale.setScalar(1 + pulse);
                } else {
                    mesh.scale.setScalar(1);
                }

                renderer.render(scene, camera);
            };
            animate();
        };
        document.head.appendChild(script);

        return () => {
            cancelAnimationFrame(animId);
            if (renderer) renderer.dispose();
            document.head.removeChild(script);
        };
    }, []);

    // React to password visibility
    useEffect(() => {
        targetIntensityRef.current = (showPassword || showConfirmPassword) ? 1 : 0;
    }, [showPassword, showConfirmPassword]);

    // 3D tilt on card
    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1200px) rotateX(${y * -0.02}deg) rotateY(${x * 0.02}deg)`;
    };
    const handleCardMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        color: "#fff",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    };

    return (
        <div style={{
            width: "100vw", height: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#05040a", position: "relative", overflow: "hidden",
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Background blobs */}
            <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "45vw", height: "45vw", background: "rgba(139,92,246,0.18)", filter: "blur(120px)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "45vw", height: "45vw", background: "rgba(45,212,191,0.12)", filter: "blur(120px)", borderRadius: "50%", pointerEvents: "none" }} />

            {/* Back button */}
            <button onClick={onBack} style={{
                position: "absolute", top: "28px", left: "36px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer",
                zIndex: 10, display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 16px", borderRadius: "20px",
                transition: "all 0.2s",
            }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
            >
                ← Back
            </button>

            {/* Main card */}
            <div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                    display: "flex", width: "860px", maxWidth: "95vw",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "28px",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                    backdropFilter: "blur(24px)",
                    overflow: "hidden",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.15s ease-out",
                }}
            >
                {/* LEFT: 3D Canvas */}
                <div style={{
                    flex: "0 0 380px", position: "relative",
                    background: "rgba(0,0,0,0.3)",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "40px 24px",
                    overflow: "hidden",
                }}>
                    {/* Canvas glow bg */}
                    <div id="canvas-glow" style={{
                        position: "absolute", inset: 0,
                        background: (showPassword || showConfirmPassword)
                            ? "radial-gradient(circle at center, rgba(139,92,246,0.25) 0%, transparent 70%)"
                            : "radial-gradient(circle at center, rgba(139,92,246,0.04) 0%, transparent 70%)",
                        transition: "background 0.8s ease",
                        pointerEvents: "none",
                    }} />

                    <canvas
                        ref={canvasRef}
                        style={{ width: "100%", aspectRatio: "1", display: "block", borderRadius: "12px" }}
                    />

                    <p style={{
                        textAlign: "center", fontSize: "12px",
                        color: (showPassword || showConfirmPassword) ? "rgba(167,139,250,0.8)" : "rgba(255,255,255,0.2)",
                        marginTop: "16px", transition: "color 0.5s",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>
                        {(showPassword || showConfirmPassword) ? "🔓 password visible" : "🔒 password hidden"}
                    </p>
                </div>

                {/* RIGHT: Form */}
                <div style={{ flex: 1, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {authStep === "form" ? (
                    <>
                    {/* Logo */}
                    <div style={{ marginBottom: "32px" }}>
                        <h1 style={{
                            fontFamily: "'Unbounded', 'Inter', sans-serif",
                            fontSize: "28px", fontWeight: 800, margin: "0 0 6px",
                            background: "linear-gradient(135deg, #fff 30%, #a78bfa)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>Hangova</h1>
                        <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "14px" }}>
                            {authMode === "login" ? "Welcome back, gang. 👋" : "Join the gang. 🚀"}
                        </p>
                    </div>

                    {/* Toggle */}
                    <div style={{
                        display: "flex", gap: "4px",
                        background: "rgba(0,0,0,0.35)", padding: "5px",
                        borderRadius: "12px", marginBottom: "28px",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                        {(["login", "signup"] as const).map(mode => (
                            <button key={mode} onClick={() => setAuthMode(mode)} style={{
                                flex: 1, padding: "10px",
                                background: authMode === mode
                                    ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                                    : "transparent",
                                color: "#fff", border: "none", borderRadius: "8px",
                                fontWeight: 600, fontSize: "14px", cursor: "pointer",
                                transition: "background 0.25s",
                                boxShadow: authMode === mode ? "0 4px 12px rgba(139,92,246,0.4)" : "none",
                            }}>
                                {mode === "login" ? "Login" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={e => {
                        e.preventDefault();
                        
                        let hasError = false;
                        
                        // Reset errors
                        setEmailError("");
                        setUsernameError("");
                        setPasswordError("");
                        setConfirmPasswordError("");

                        // Validate Email
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(email)) {
                            setEmailError("Please enter a valid email address");
                            hasError = true;
                        }

                        // Validate Username (Signup only)
                        if (authMode === "signup") {
                            if (username.length < 3) {
                                setUsernameError("Username must be at least 3 characters");
                                hasError = true;
                            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                                setUsernameError("Username can only contain letters, numbers, and underscores");
                                hasError = true;
                            }
                        }

                        // Validate Password
                        if (password.length < 8) {
                            setPasswordError("Password must be at least 8 characters");
                            hasError = true;
                        } else if (authMode === "signup" && !/(?=.*[0-9])/.test(password)) {
                            setPasswordError("Password must contain at least one number");
                            hasError = true;
                        }

                        // Validate Confirm Password (Signup only)
                        if (authMode === "signup" && password !== confirmPassword) {
                            setConfirmPasswordError("Passwords do not match");
                            hasError = true;
                        }

                        if (hasError) return;

                        setIsProcessing(true);
                        
                        if (authMode === "signup") {
                            fetch("/api/auth/send-otp", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ username, email, password })
                            })
                            .then(res => res.json())
                            .then(data => {
                                setIsProcessing(false);
                                if (data.error) {
                                    setEmailError(data.error);
                                } else {
                                    if (data.previewUrl) setPreviewUrl(data.previewUrl);
                                    setAuthStep("otp");
                                }
                            })
                            .catch(() => {
                                setIsProcessing(false);
                                setEmailError("Failed to send verification code");
                            });
                        } else {
                            // Direct login (TODO: implement real login API)
                            onLogin();
                        }
                    }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {authMode === "signup" && (
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text" placeholder="Username" required
                                    value={username} onChange={e => { setUsername(e.target.value); setUsernameError(""); }}
                                    style={{
                                        ...inputStyle,
                                        borderColor: usernameError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)",
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = usernameError ? "rgba(239,68,68,0.6)" : "rgba(139,92,246,0.6)"}
                                    onBlur={e => e.currentTarget.style.borderColor = usernameError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}
                                />
                                {usernameError && (
                                    <p style={{ color: "rgba(239,68,68,0.9)", fontSize: "12px", margin: "6px 0 0 4px" }}>⚠ {usernameError}</p>
                                )}
                            </div>
                        )}
                        <div style={{ position: "relative" }}>
                            <input
                                type="email" placeholder="Email address" required
                                value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                                style={{
                                    ...inputStyle,
                                    borderColor: emailError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)",
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = emailError ? "rgba(239,68,68,0.6)" : "rgba(139,92,246,0.6)"}
                                onBlur={e => e.currentTarget.style.borderColor = emailError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}
                            />
                            {emailError && (
                                <p style={{ color: "rgba(239,68,68,0.9)", fontSize: "12px", margin: "6px 0 0 4px" }}>⚠ {emailError}</p>
                            )}
                        </div>

                        {/* Password with eye toggle */}
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password" required
                                value={password} onChange={e => { setPassword(e.target.value); setPasswordError(""); }}
                                style={{ ...inputStyle, paddingRight: "48px", borderColor: passwordError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)" }}
                                onFocus={e => e.currentTarget.style.borderColor = passwordError ? "rgba(239,68,68,0.6)" : "rgba(139,92,246,0.6)"}
                                onBlur={e => e.currentTarget.style.borderColor = passwordError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                style={{
                                    position: "absolute", right: "14px", top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none", border: "none",
                                    color: showPassword ? "#a78bfa" : "rgba(255,255,255,0.35)",
                                    cursor: "pointer", fontSize: "18px", lineHeight: 1,
                                    transition: "color 0.2s",
                                    display: "flex", alignItems: "center",
                                }}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    // Eye open SVG
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                ) : (
                                    // Eye closed SVG
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                )}
                            </button>
                            {passwordError && (
                                <p style={{ color: "rgba(239,68,68,0.9)", fontSize: "12px", margin: "6px 0 0 4px" }}>⚠ {passwordError}</p>
                            )}
                        </div>

                        {/* Confirm Password — signup only */}
                        {authMode === "signup" && (
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password" required
                                    value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setConfirmPasswordError(""); }}
                                    style={{
                                        ...inputStyle,
                                        paddingRight: "48px",
                                        borderColor: confirmPasswordError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)",
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = confirmPasswordError ? "rgba(239,68,68,0.6)" : "rgba(139,92,246,0.6)"}
                                    onBlur={e => e.currentTarget.style.borderColor = confirmPasswordError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(p => !p)}
                                    style={{
                                        position: "absolute", right: "14px", top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none", border: "none",
                                        color: showConfirmPassword ? "#a78bfa" : "rgba(255,255,255,0.35)",
                                        cursor: "pointer", fontSize: "18px", lineHeight: 1,
                                        transition: "color 0.2s",
                                        display: "flex", alignItems: "center",
                                    }}
                                    title={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    )}
                                </button>
                                {confirmPasswordError && (
                                    <p style={{ color: "rgba(239,68,68,0.9)", fontSize: "12px", margin: "6px 0 0 4px" }}>⚠ {confirmPasswordError}</p>
                                )}
                            </div>
                        )}

                        {authMode === "login" && (
                            <div style={{ textAlign: "right", marginTop: "-6px" }}>
                                <button type="button" style={{ background: "none", border: "none", color: "rgba(139,92,246,0.7)", fontSize: "13px", cursor: "pointer" }}>
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button type="submit" disabled={isProcessing} style={{
                            width: "100%", padding: "15px",
                            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                            color: "#fff", border: "none", borderRadius: "12px",
                            fontWeight: 700, fontSize: "16px", cursor: isProcessing ? "wait" : "pointer",
                            marginTop: "8px",
                            opacity: isProcessing ? 0.7 : 1,
                            boxShadow: "0 8px 24px rgba(139,92,246,0.35)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                            onMouseOver={e => { if(!isProcessing) { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(139,92,246,0.5)"; } }}
                            onMouseOut={e => { if(!isProcessing) { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(139,92,246,0.35)"; } }}
                        >
                            {isProcessing ? "Processing..." : (authMode === "login" ? "Enter Hangova ✨" : "Join the Gang 🚀")}
                        </button>
                    </form>
                                        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "24px" }}>
                            By continuing, you agree to Hangova&apos;s Terms &amp; Privacy Policy.
                        </p>
                    </>
                    ) : (
                    <>
                    {/* OTP Verification Screen */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <div style={{ width: "64px", height: "64px", background: "rgba(139,92,246,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                            <span style={{ fontSize: "28px" }}>✉️</span>
                        </div>
                        <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 12px" }}>Verify your email</h2>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.5, marginBottom: "32px", maxWidth: "280px" }}>
                            We&apos;ve sent a 6-digit code to <br />
                            <strong style={{ color: "#fff" }}>{email}</strong>
                        </p>

                        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        const newOtp = [...otp];
                                        newOtp[i] = val;
                                        setOtp(newOtp);
                                        setOtpError("");
                                        if (val && i < 5) {
                                            document.getElementById(`otp-${i + 1}`)?.focus();
                                        }
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                                            document.getElementById(`otp-${i - 1}`)?.focus();
                                        }
                                    }}
                                    style={{
                                        width: "44px", height: "52px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "12px",
                                        color: "#fff", fontSize: "20px", fontWeight: 700,
                                        textAlign: "center", outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                                />
                            ))}
                        </div>
                        
                        {otpError && (
                            <p style={{ color: "rgba(239,68,68,0.9)", fontSize: "13px", margin: "-12px 0 20px" }}>⚠ {otpError}</p>
                        )}

                        <button onClick={() => {
                            const code = otp.join("");
                            if (code.length < 6) {
                                setOtpError("Please enter all 6 digits");
                                return;
                            }
                            setIsProcessing(true);
                            fetch("/api/auth/verify-otp", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email, otp: code })
                            })
                            .then(res => res.json())
                            .then(data => {
                                setIsProcessing(false);
                                if (data.error) {
                                    setOtpError(data.error);
                                } else {
                                    onLogin();
                                }
                            })
                            .catch(() => {
                                setIsProcessing(false);
                                setOtpError("Verification failed");
                            });
                        }} disabled={isProcessing} style={{
                            width: "100%", padding: "15px",
                            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                            color: "#fff", border: "none", borderRadius: "12px",
                            fontWeight: 700, fontSize: "16px", cursor: isProcessing ? "wait" : "pointer",
                            opacity: isProcessing ? 0.7 : 1,
                            boxShadow: "0 8px 24px rgba(139,92,246,0.35)",
                        }}>
                            {isProcessing ? "Verifying..." : "Verify & Join"}
                        </button>
                        
                        <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", fontSize: "13px" }}>
                            <button onClick={() => setAuthStep("form")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                                ← Back
                            </button>
                            <button onClick={() => {
                                setOtpError("Sending new code...");
                                fetch("/api/auth/send-otp", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ username, email, password })
                                }).then(res=>res.json()).then(d => {
                                    if(d.previewUrl) setPreviewUrl(d.previewUrl);
                                    setOtpError("Code resent!");
                                    setTimeout(()=>setOtpError(""), 2000);
                                });
                            }} style={{ background: "none", border: "none", color: "rgba(139,92,246,0.8)", cursor: "pointer" }}>
                                Resend Code
                            </button>
                            {previewUrl && (
                                <a href={previewUrl} target="_blank" rel="noreferrer" style={{ color: "#ec4899", textDecoration: "none", width: "100%", marginTop: "12px" }}>
                                    [Dev Mode] Click here to view email
                                </a>
                            )}
                        </div>
                    </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
}
