import { useState, useEffect } from 'react';
import { Trophy, Lock, Unlock, CheckCircle, XCircle, Shield, ExternalLink, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import '../styles/Level2.css';
import { useNavigate } from 'react-router-dom';

const Level2 = ({ userInfo, level2Solved }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [submission, setSubmission] = useState(null);
  const [isSolved, setIsSolved] = useState(level2Solved || false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Hint system
  const [hint2Revealed, setHint2Revealed] = useState(false);
  const [hint3Revealed, setHint3Revealed] = useState(false);
  const [hintPenalty, setHintPenalty] = useState(0);
  const [showHint2Confirm, setShowHint2Confirm] = useState(false);
  const [showHint3Confirm, setShowHint3Confirm] = useState(false);

  const challenge = {
    title: "SQL Injection - Juice Shop",
    category: "Web Security",
    difficulty: "Medium",
    basePoints: 100,
    description: "Welcome to Level 2! Your target is the OWASP Juice Shop - a deliberately vulnerable web application. Your mission is to exploit SQL injection vulnerabilities to discover hidden products and retrieve the flag.",
    targetUrl: "http://20.40.47.118:3000/#/",
    hints: {
      hint1: "Search is more powerful than you think.",
      hint2: "What if the website believes something true or false?",
      hint3: "Try adding symbols instead of words."
    }
  };

  const currentPoints = challenge.basePoints - hintPenalty;

  useEffect(() => {
    setIsSolved(level2Solved || false);
  }, [level2Solved]);

  useEffect(() => {
    async function checklogin() {
      try {
        const res = await fetch("http://localhost:3000/checklogin", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const response = await res.json();
        if (!response.success) {
          navigate('/login');
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    }
    checklogin();
  }, [navigate]);

  const revealHint2 = () => {
    setHint2Revealed(true);
    setHintPenalty(prev => prev + 5);
    setShowHint2Confirm(false);
  };

  const revealHint3 = () => {
    setHint3Revealed(true);
    setHintPenalty(prev => prev + 10);
    setShowHint3Confirm(false);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setErrorMessage("Please enter a flag");
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch("http://localhost:3000/solve-level2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          flag: inputValue.trim(),
          hintPenalty: hintPenalty
        })
      });

      const response = await res.json();

      if (response.success) {
        setIsSolved(true);
        setSubmission('correct');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setTimeout(() => navigate(0), 2000);
      } else {
        setSubmission('incorrect');
        setErrorMessage(response.message || "Incorrect flag");
        setTimeout(() => setSubmission(null), 2000);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="level2-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="content-wrapper">
        {/* Header */}
        <div className="level2-header">
          <h1 className="level2-title">
            <Shield className="title-icon" />
            Level 2: SQL Injection
          </h1>
          <div className="points-display">
            <Trophy className="points-icon" />
            <span>{currentPoints} Points Available</span>
            {hintPenalty > 0 && (
              <span className="penalty-note">(-{hintPenalty} hint penalty)</span>
            )}
          </div>
        </div>

        {/* Main Challenge Card */}
        <div className="challenge-card">
          {/* Challenge Header */}
          <div className="challenge-header purple-pink">
            <div className="challenge-header-overlay"></div>
            <div className="challenge-header-content">
              <div className="challenge-info">
                <div className="challenge-icon-wrapper">
                  <Shield className="challenge-icon" />
                </div>
                <div className="challenge-title-section">
                  <h3 className="challenge-title">{challenge.title}</h3>
                  <div className="challenge-meta">
                    <span className="challenge-category">{challenge.category}</span>
                    <span className="challenge-difficulty difficulty-medium">
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              {isSolved ? (
                <CheckCircle className="status-icon status-solved" />
              ) : (
                <Unlock className="status-icon status-unlocked" />
              )}
            </div>
          </div>

          {/* Challenge Body */}
          <div className="challenge-body">
            {/* Description */}
            <div className="challenge-section">
              <h4 className="section-title">MISSION BRIEFING</h4>
              <p className="section-text">{challenge.description}</p>
            </div>

            {/* Target Link */}
            <div className="target-section">
              <h4 className="section-title">TARGET</h4>
              <a 
                href={challenge.targetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="target-link"
              >
                <ExternalLink size={18} />
                <span>Open Juice Shop</span>
              </a>
              <p className="target-note">Opens in a new tab - Explore and exploit!</p>
            </div>

            {/* Hints Section */}
            <div className="hints-section">
              <h4 className="section-title">HINTS</h4>
              <p className="hint-note">Flag format: PHISH{"{____}"}</p>
              
              {/* Hint 1 - Always visible */}
              <div className="hint-box hint-free">
                <div className="hint-header">
                  <span className="hint-label">Hint 1</span>
                  <span className="hint-cost free">FREE</span>
                </div>
                <code className="hint-code">{challenge.hints.hint1}</code>
              </div>

              {/* Hint 2 - Costs 5 points */}
              <div className={`hint-box hint-paid ${hint2Revealed ? 'revealed' : ''}`}>
                <div className="hint-header">
                  <span className="hint-label">Hint 2</span>
                  <span className="hint-cost paid">-5 points</span>
                </div>
                {hint2Revealed ? (
                  <code className="hint-code">{challenge.hints.hint2}</code>
                ) : (
                  <div className="hint-locked">
                    {showHint2Confirm ? (
                      <div className="hint-confirm">
                        <AlertTriangle size={16} />
                        <span>This will cost 5 points. Reveal?</span>
                        <button className="confirm-yes" onClick={revealHint2}>Yes</button>
                        <button className="confirm-no" onClick={() => setShowHint2Confirm(false)}>No</button>
                      </div>
                    ) : (
                      <button className="reveal-hint-btn" onClick={() => setShowHint2Confirm(true)}>
                        <Eye size={16} />
                        <span>Reveal Hint (-5 pts)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Hint 3 - Costs 10 points */}
              <div className={`hint-box hint-paid ${hint3Revealed ? 'revealed' : ''}`}>
                <div className="hint-header">
                  <span className="hint-label">Hint 3</span>
                  <span className="hint-cost paid">-10 points</span>
                </div>
                {hint3Revealed ? (
                  <code className="hint-code">{challenge.hints.hint3}</code>
                ) : (
                  <div className="hint-locked">
                    {showHint3Confirm ? (
                      <div className="hint-confirm">
                        <AlertTriangle size={16} />
                        <span>This will cost 10 points. Reveal?</span>
                        <button className="confirm-yes" onClick={revealHint3}>Yes</button>
                        <button className="confirm-no" onClick={() => setShowHint3Confirm(false)}>No</button>
                      </div>
                    ) : (
                      <button className="reveal-hint-btn" onClick={() => setShowHint3Confirm(true)}>
                        <Eye size={16} />
                        <span>Reveal Hint (-10 pts)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Form */}
            <div className="submit-section">
              <input
                type="text"
                placeholder="Enter flag here... (PHISH{...})"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isSolved || submitting}
                className="flag-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />

              <button
                onClick={handleSubmit}
                disabled={isSolved || submitting}
                className={`submit-button ${isSolved ? 'submit-button-solved' : 'submit-button-active'}`}
              >
                {isSolved ? (
                  <span className="button-content">
                    <CheckCircle className="button-icon" />
                    Solved - {currentPoints} Points
                  </span>
                ) : submitting ? (
                  'Checking...'
                ) : (
                  `Submit Flag (+${currentPoints} pts)`
                )}
              </button>

              {submission === 'correct' && (
                <div className="feedback-box feedback-correct">
                  <CheckCircle className="feedback-icon" />
                  <span className="feedback-text">Correct! +{currentPoints} points</span>
                </div>
              )}

              {submission === 'incorrect' && (
                <div className="feedback-box feedback-incorrect">
                  <XCircle className="feedback-icon" />
                  <span className="feedback-text">{errorMessage || "Incorrect flag. Try again!"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {isSolved && (
          <div className="completion-card">
            <Trophy className="completion-trophy" />
            <h2 className="completion-title">Level 2 Complete!</h2>
            <p className="completion-text">
              You've mastered SQL Injection! Proceed to Level 3.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level2;
