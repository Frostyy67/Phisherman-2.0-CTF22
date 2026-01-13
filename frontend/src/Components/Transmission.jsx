import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Wifi, WifiOff } from 'lucide-react';
import '../styles/Level2.css'; // Reusing for common clean styles, but we'll override for specific look

const Transmission = () => {
    const [text, setText] = useState('');
    const [showButtons, setShowButtons] = useState(false);
    const [terminated, setTerminated] = useState(false);

    const fullText = `ENCRYPTED TRANSMISSION — SOURCE: agent_x@darknet.onion

Connection Established
Encryption: UNKNOWN
Trace: IMPOSSIBLE
Timestamp: REDACTED

You reached the end.

That was the point.

What you just interacted with wasn’t random and it wasn’t isolated.
And it definitely wasn't DeadSoC's training program. We did it, from the start.
Systems like this exist because most people give up early. But you didn’t.


WHY?

Phishermen isn’t something you can catch, let alone destroy.
It’s something you become aware of.

If this felt familiar and unfinished — good.
That means you’re paying attention.

Keep doing that.

Connection Terminated.`;

    useEffect(() => {
        let i = 0;
        const speed = 30; // ms per char
        const typeWriter = setInterval(() => {
            if (i < fullText.length) {
                setText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typeWriter);
                setShowButtons(true);
            }
        }, speed);

        return () => clearInterval(typeWriter);
    }, []);

    const [joinClicked, setJoinClicked] = useState(false);

    const handleJoin = () => {
        setJoinClicked(true);
        // After 6 seconds of "watching you", close the window
        setTimeout(() => {
            handleClose();
        }, 6000);
    };

    const handleClose = () => {
        setTerminated(true);
        // Attempt to close window
        setTimeout(() => {
            try {
                window.close();
            } catch (e) {
                console.log("Window close prevented by browser");
            }
            // Fallback: Redirect to about:blank or simple black screen
            window.location.href = "about:blank";
        }, 2000);
    };

    if (joinClicked && !terminated) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff0000',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '3rem',
                textAlign: 'center',
                animation: 'fadeIn 3s ease-in'
            }}>
                <style>
                    {`
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    `}
                </style>
                We will be watching you.
            </div>
        );
    }

    if (terminated) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#333',
                fontFamily: 'monospace',
                fontSize: '2rem',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <WifiOff size={48} color="#333" />
                NO CARRIER
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050505',
            color: '#00ff00',
            fontFamily: '"Courier New", Courier, monospace',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* CRT Overlay Effect */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 2px, 3px 100%',
                pointerEvents: 'none',
                zIndex: 10
            }}></div>

            <div style={{
                maxWidth: '800px',
                width: '100%',
                position: 'relative',
                zIndex: 20
            }}>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.7 }}>
                    <Shield size={20} />
                    <span>SECURE CHANNEL // ENCRYPTED_V2</span>
                </div>

                <div style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    fontSize: '1.1rem',
                    textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
                }}>
                    {text}
                    <span className="cursor-blink">_</span>
                </div>

                {showButtons && (
                    <div style={{
                        marginTop: '50px',
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        animation: 'fadeIn 1s ease-in'
                    }}>
                        <button
                            onClick={handleJoin}
                            style={{
                                background: 'transparent',
                                border: '1px solid #00ff00',
                                color: '#00ff00',
                                padding: '15px 40px',
                                fontFamily: 'inherit',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#00ff00';
                                e.currentTarget.style.color = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#00ff00';
                            }}
                        >
                            JOIN
                        </button>
                        <button
                            onClick={handleClose}
                            style={{
                                background: 'transparent',
                                border: '1px solid #ff4444',
                                color: '#ff4444',
                                padding: '15px 40px',
                                fontFamily: 'inherit',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#ff4444';
                                e.currentTarget.style.color = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#ff4444';
                            }}
                        >
                            QUIT
                        </button>
                    </div>
                )}
            </div>

            <style>
                {`
                    @keyframes blink { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
                    .cursor-blink { animation: blink 1s infinite; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>
        </div>
    );
};

export default Transmission;
