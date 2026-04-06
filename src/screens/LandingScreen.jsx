import { useState } from 'react'
import { useExam, PHASES } from '../context/ExamContext'

const LandingScreen = () => {
    const { dispatch } = useExam();
    const [name, setName] = useState('');
    const [qCount, setQCount] = useState(40);
    const [bank, setBank] = useState('advanced');

    // Make Enter key globally submit the form
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && name.trim()) {
            handleStart(e);
        }
    };

    const handleStart = (e) => {
        e.preventDefault();
        if (name.trim()) {
            dispatch({ type: 'SET_CANDIDATE_NAME', payload: name });
            dispatch({ type: 'SET_QUESTION_COUNT', payload: parseInt(qCount) || 40 });
            dispatch({ type: 'SET_SELECTED_BANK', payload: bank });
            dispatch({ type: 'SET_PHASE', payload: PHASES.INSTRUCTIONS });
        }
    };

    return (
        <div 
            className="h-full bg-neutral-bg flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 outline-none"
            onKeyDown={handleKeyDown}
        >
            <div className="bg-white p-12 rounded-xl shadow-2xl border border-pvue-primary/10 max-w-[550px] w-full text-center relative overflow-hidden group">
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
        </div>
    );
};

export default LandingScreen;
