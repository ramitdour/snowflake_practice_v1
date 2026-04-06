import { useEffect } from 'react';
import { useExam } from '../context/ExamContext'
import Header from '../components/Header'

const ScoreScreen = () => {
    const { state, dispatch } = useExam();
    const { score } = state;

    if (!score) return <div className="p-8">Calculating Results...</div>;

    return (
        <div id="abe-container" className="h-screen bg-white flex flex-col items-center p-0 overflow-y-auto content-scrollbar animate-in fadeIn duration-1000 relative">
            <Header />
            
            <div className="max-w-[1000px] w-full flex flex-col items-center pt-12 px-8 space-y-8 select-none">
                {/* Snowflake Logo */}
                <div className="mb-4">
                     <span className="text-5xl font-extrabold tracking-tighter text-[#29B5E8] italic flex items-center gap-2">
                        <span className="text-4xl text-[#29B5E8]">❄</span> snowflake
                     </span>
                </div>

                {/* Text Blocks */}
                <div className="w-full text-[11pt] text-neutral-text space-y-6 leading-tight">
                    <p>Thank you for completing the Practice Exam: Core exam.</p>
                    <p>Your score is {score.correct} correct out of {score.total}.</p>
                    
                    <p>
                        This practice exam is designed to help familiarize yourself with the types of test questions 
                        you should expect to see on the certification exam. However, taking this exam does not 
                        guarantee success on the certification exam and should be used to supplement a 
                        comprehensive test preparation strategy.
                    </p>
                    
                    <p>
                        A more detailed score report will be available in your Pearson Vue candidate account 
                        within 24 hours to help you with your preparation strategy.
                    </p>
                </div>

                {/* Main Action Button (Centered) */}
                <div className="flex flex-col items-center gap-6 pt-10 pb-20 w-full animate-in slide-in-from-bottom-8 duration-700 delay-300">
                     <button 
                        onClick={() => dispatch({ type: 'VIEW_SCORE_REPORT' })}
                        className="bg-pvue-primary text-white border-4 border-pvue-primary px-12 py-5 rounded-full text-xl font-black hover:bg-white hover:text-pvue-primary transition-all shadow-2xl active:scale-95 group uppercase tracking-widest min-w-[340px] flex items-center justify-center gap-4"
                    >
                        <span>🧠</span> VIEW DETAILED REPORT <span>➜</span>
                    </button>
                    
                    <button 
                        onClick={() => dispatch({ type: 'SHOW_END_EXAM_DIALOG', payload: true })}
                        className="text-neutral-muted hover:text-pvue-primary font-bold text-sm uppercase tracking-widest border-b-2 border-transparent hover:border-pvue-primary/20 pb-1 transition-all"
                    >
                        Return to Exam Home
                    </button>
                </div>
            </div>

            {/* Simplified Global Footer */}
            <footer className="fixed bottom-0 w-full bg-pvue-primary opacity-95 text-white h-[35px] flex items-center justify-center border-t-2 border-white select-none pointer-events-none">
                <div className="text-[10px] font-black tracking-widest opacity-80 uppercase">
                    Pearson Simulator Core Session: {state.candidateName}
                </div>
            </footer>
        </div>
    );
};

export default ScoreScreen;
