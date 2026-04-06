import { useExam } from '../context/ExamContext'

const Header = () => {
    const { state } = useExam();
    const { examTitle, candidateName, timeRemaining, questions, currentIndex } = state;

    // Timer format mm:ss
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    return (
        <header className="bg-pvue-primary text-white h-[50px] flex items-center px-4 border-b-2 border-white select-none shrink-0" id="abe-titlebar">
            {/* Logo area */}
            <div className="flex-shrink-0 mr-6">
                <span className="font-extrabold text-2xl tracking-tighter italic">snowflake</span>
            </div>

            {/* Combined Title - Candidate name */}
            <div className="flex-grow text-[14pt] font-sans font-medium" id="abe-titlebar-title">
                <span id="abe-assessment-title">{examTitle} - {candidateName}</span>
            </div>

            {/* Timer & Item counter */}
            <div className="flex items-center gap-6" id="abe-titlebar-info">
                {state.timerRunning && (
                    <div className="flex items-center gap-2" role="timer">
                        <span className="text-[12pt]">Time Remaining:</span>
                        <span className="text-[12pt] font-mono tabular-nums">{formatTime(timeRemaining)}</span>
                    </div>
                )}
                
                {questions.length > 0 && (
                    <div className="flex items-center gap-2">
                         <span className="text-[12pt]">Question {currentIndex + 1} of {questions.length}</span>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
