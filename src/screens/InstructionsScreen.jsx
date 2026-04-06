import { useEffect } from 'react'
import { useExam, PHASES } from '../context/ExamContext'

const InstructionsScreen = () => {
    const { state, dispatch } = useExam();

    const handleStart = () => dispatch({ type: 'START_EXAM' });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleStart();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch]);

    return (
        <div className="h-full bg-white flex flex-col items-center p-4 md:p-8 overflow-y-auto content-scrollbar select-none animate-in fadeIn duration-700 outline-none">
            <div className="max-w-[850px] w-full bg-neutral-bg/10 rounded-xl shadow-inner border border-pvue-primary/10 overflow-hidden flex flex-col">
                {/* Header Section */}
                <div className="bg-pvue-primary p-6 md:p-10 text-white/90 space-y-3">
                    <h1 className="text-[20pt] md:text-[28pt] font-black text-white leading-tight tracking-tight">Introduction & Instructions</h1>
                    <div className="h-1 w-20 bg-pvue-status-success rounded-full opacity-60"></div>
                    <div className="text-[11pt] md:text-[13pt] font-medium opacity-90 italic">
                        Welcome <span className="text-pvue-status-warning font-bold not-italic">{state.candidateName}</span>, please review the session parameters.
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-10 space-y-8 bg-white/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg border-l-4 border-pvue-primary shadow-sm group">
                            <h3 className="text-pvue-primary font-bold text-xs uppercase tracking-widest mb-2 opacity-60">Exam Parameters</h3>
                            <div className="text-[14pt] md:text-[16pt] font-extrabold text-neutral-text">{state.questionCount} Questions</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border-l-4 border-pvue-status-warning shadow-sm group">
                            <h3 className="text-pvue-status-warning font-black text-xs uppercase tracking-widest mb-2 opacity-80">Time Allocation</h3>
                            <div className="text-[14pt] md:text-[16pt] font-extrabold text-neutral-text">65 Minutes Remaining</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-pvue-primary/10 shadow-sm">
                        <h3 className="text-pvue-primary font-black text-xs uppercase tracking-widest mb-4 border-b border-pvue-primary/10 pb-2">Guidelines</h3>
                        <ul className="space-y-4 text-[10pt] md:text-[12pt]">
                            {[
                                { text: "Timer begins on the first item.", icon: "⏱️" },
                                { text: "Use 'Flag for Review' to bookmark items.", icon: "🚩" },
                                { text: "Final scoring is instant upon submission.", icon: "📊" }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="shrink-0">{item.icon}</span>
                                    <span className="text-neutral-text font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col items-center pt-4 border-t border-pvue-primary/10">
                        <button 
                            onClick={handleStart}
                            className="bg-pvue-primary text-white w-full py-4 rounded-lg text-[14pt] md:text-[18pt] font-black hover:bg-pvue-primary-dark transition-all shadow-lg active:scale-95 group uppercase tracking-[0.2em]"
                        >
                            START SESSION ➔
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructionsScreen;
