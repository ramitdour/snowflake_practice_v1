import { useState, useEffect } from 'react'
import { useExam, PHASES } from '../context/ExamContext'

const LandingScreen = () => {
    const { dispatch } = useExam();
    const [name, setName] = useState('');
    const [qCount, setQCount] = useState(40);
    const [bank, setBank] = useState('advanced');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('snowflake_exam_history');
            if (savedHistory) setHistory(JSON.parse(savedHistory).reverse().slice(0, 5)); // Show last 5
            
            const savedPrefs = localStorage.getItem('snowflake_exam_prefs');
            if (savedPrefs) {
                const prefs = JSON.parse(savedPrefs);
                if (prefs.name) setName(prefs.name);
                if (prefs.qCount) setQCount(prefs.qCount);
                if (prefs.bank) setBank(prefs.bank);
            }
        } catch (err) {}
    }, []);

    // Make Enter key globally submit the form
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && name.trim()) {
            handleStart(e);
        }
    };

    const handleStart = (e) => {
        e.preventDefault();
        if (name.trim()) {
            const parsedCount = parseInt(qCount) || 40;
            try {
                localStorage.setItem('snowflake_exam_prefs', JSON.stringify({ 
                    name: name.trim(), 
                    qCount: parsedCount, 
                    bank 
                }));
            } catch (err) {}

            dispatch({ type: 'SET_CANDIDATE_NAME', payload: name.trim() });
            dispatch({ type: 'SET_QUESTION_COUNT', payload: parsedCount });
            dispatch({ type: 'SET_SELECTED_BANK', payload: bank });
            dispatch({ type: 'SET_PHASE', payload: PHASES.INSTRUCTIONS });
        }
    };

    return (
        <div 
            className="h-full bg-neutral-bg flex flex-col items-center p-6 lg:p-12 overflow-y-auto content-scrollbar animate-in fade-in duration-500 outline-none"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Main Form Card */}
            <div className="bg-white p-12 rounded-xl shadow-2xl border border-pvue-primary/10 max-w-[550px] w-full text-center relative overflow-hidden group mb-12 shrink-0">
                <div className="absolute top-0 left-0 w-full h-2 bg-pvue-primary transition-all group-hover:h-3"></div>
                
                <div className="mb-10 flex flex-col items-center gap-4">
                     <span className="text-4xl font-extrabold tracking-tight text-pvue-primary-dark">snowflake</span>
                     <div className="h-0.5 w-16 bg-pvue-status-success rounded-full"></div>
                     <span className="text-2xl font-bold text-neutral-muted italic tracking-wide">SnowPro Core Certification</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-[22pt] font-black text-pvue-primary mb-2 leading-tight">Practice Exam Portal</h1>
                    <p className="text-neutral-muted text-[11pt]">
                        Enter your name and number of questions to begin.
                    </p>
                </div>

                <form onSubmit={handleStart} className="flex flex-col gap-4 items-center w-full">
                    <div className="w-full px-8 space-y-4">
                        <div className="text-left font-bold text-pvue-primary-dark text-sm uppercase">Candidate Name</div>
                        <input 
                            type="text" 
                            className="bg-neutral-bg/50 border-2 border-neutral-border p-3 rounded w-full text-left text-lg outline-none focus:border-pvue-primary focus:bg-white transition-all shadow-inner"
                            placeholder="Full Candidate Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            required
                        />
                        
                        <div className="text-left font-bold text-pvue-primary-dark text-sm uppercase pt-2">Number of Questions (1-100)</div>
                        <input 
                            type="number" 
                            min="1"
                            max="100"
                            className="bg-neutral-bg/50 border-2 border-neutral-border p-3 rounded w-full text-left text-lg outline-none focus:border-pvue-primary focus:bg-white transition-all shadow-inner"
                            placeholder="Question Count"
                            value={qCount}
                            onChange={(e) => setQCount(e.target.value)}
                            required
                        />

                        <div className="text-left font-bold text-pvue-primary-dark text-sm uppercase pt-2">Select Question Bank</div>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button 
                                type="button"
                                onClick={() => setBank('standard')}
                                className={`p-4 rounded-xl border-2 transition-all text-sm font-bold flex flex-col items-center gap-1 ${bank === 'standard' ? 'border-pvue-primary bg-pvue-primary/5 text-pvue-primary shadow-md' : 'border-neutral-border bg-transparent text-neutral-muted hover:border-neutral-text'}`}
                            >
                                <span className={bank === 'standard' ? 'text-lg' : 'text-lg opacity-50'}>📊</span>
                                Standard Bank
                            </button>
                            <button 
                                type="button"
                                onClick={() => setBank('advanced')}
                                className={`p-4 rounded-xl border-2 transition-all text-sm font-bold flex flex-col items-center gap-1 ${bank === 'advanced' ? 'border-pvue-primary bg-pvue-primary/5 text-pvue-primary shadow-md' : 'border-neutral-border bg-transparent text-neutral-muted hover:border-neutral-text'}`}
                            >
                                <span className={bank === 'advanced' ? 'text-lg' : 'text-lg opacity-50'}>🧠</span>
                                Advanced Bank
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        className="bg-pvue-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pvue-primary-dark hover:shadow-xl hover:scale-105 transition-all shadow-lg active:scale-95 group uppercase tracking-widest mt-6"
                    >
                        Initialize Practice Session <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                    </button>
                    
                    <div className="text-[10pt] text-neutral-muted/60 mt-4 font-medium flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-pvue-status-success animate-pulse"></div>
                        Secure Pearson VUE Simulator Engine v2.4
                    </div>
                </form>
            </div>

            {/* Past Exams History */}
            {history.length > 0 && (
                <div className="max-w-[800px] w-full animate-in slide-in-from-bottom-8 duration-700 pb-12 shrink-0">
                    <h2 className="text-sm font-black text-pvue-primary uppercase tracking-widest mb-6 flex items-center gap-3">
                        <span className="text-xl">📊</span> Recent Exam History
                        <div className="h-px bg-pvue-primary/10 flex-grow"></div>
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        {history.map((record, i) => {
                            const pct = ((record.score.correct / record.score.total) * 100).toFixed(0);
                            const isPass = pct >= 75;
                            const d = new Date(record.date);
                            
                            return (
                                <div key={i} className="bg-white p-5 rounded-xl border border-black/5 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                    <div className="space-y-1 text-left">
                                        <div className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                                            {d.toLocaleDateString()} at {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="text-sm font-bold text-neutral-800">
                                            {record.candidateName} • <span className="text-neutral-500 font-medium capitalize">{record.bank} Bank</span>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col items-end`}>
                                        <div className={`text-xl font-black ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>{pct}%</div>
                                        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                                            {record.score.correct} / {record.score.total} Correct
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingScreen;
