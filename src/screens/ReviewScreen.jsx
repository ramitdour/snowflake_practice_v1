import { useExam } from '../context/ExamContext'
import Header from '../components/Header'

const ReviewScreen = () => {
    const { state, dispatch } = useExam();
    const { questions, answers, flags } = state;

    const handleJump = (idx) => dispatch({ type: 'GO_TO_QUESTION', payload: idx });
    const handleEnd = () => dispatch({ type: 'SHOW_END_EXAM_DIALOG', payload: true });

    return (
        <div id="abe-container" className="flex flex-col h-screen bg-white select-none animate-in fadeIn duration-500">
            <Header />
            
            {/* Secondary Toolbar for Review */}
            <div className="bg-pvue-primary-light text-white h-[32px] flex items-center px-4 border-b-2 border-white select-none shrink-0">
                <button className="flex items-center gap-1 hover:text-pvue-status-hover text-[11pt] font-semibold">
                    <span className="text-sm">🗒</span> Instructions
                </button>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden">
                {/* Subtitle */}
                <div className="w-full text-center py-2 text-neutral-text text-[12pt] font-medium border-b border-neutral-border/20 bg-neutral-bg/10">
                    Item Review Screen
                </div>

                {/* Main Content Area */}
                <div className="flex-grow overflow-y-auto content-scrollbar p-0">
                    {/* Expandable Section Header */}
                    <div className="bg-pvue-primary text-white h-[35px] flex items-center justify-between px-2 cursor-pointer shadow-sm">
                        <div className="flex items-center gap-2 font-bold text-[11pt]">
                            <span className="border border-white/50 w-4 h-4 flex items-center justify-center text-[10px] leading-none">−</span>
                            EXAM Section
                        </div>
                        <div className="text-[11pt] pr-4">
                            ( {questions.length - Object.keys(answers).length} Unseen/Incomplete )
                        </div>
                    </div>

                    {/* Question List */}
                    <div className="flex flex-col">
                        {questions.map((q, idx) => {
                            const isAnswered = answers[q.id] && answers[q.id].length > 0;
                            return (
                                <div 
                                    key={q.id}
                                    onClick={() => handleJump(idx)}
                                    className="h-[30px] flex items-center px-4 border-b border-neutral-border/30 hover:bg-[#E8F1F8] cursor-pointer group transition-colors"
                                >
                                    <div className="w-8 flex justify-center opacity-60 group-hover:opacity-100">
                                        <div className="text-pvue-primary text-lg">📝</div>
                                    </div>
                                    <div className="text-[11pt] text-neutral-text font-medium">
                                        Question {idx + 1}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-pvue-primary text-white h-[44px] flex items-center justify-between px-3 border-t-2 border-white select-none shrink-0">
                <div className="flex items-center h-full">
                    <button 
                        onClick={handleEnd}
                        className="px-6 h-full hover:text-pvue-status-hover text-[11pt] font-semibold flex items-center gap-1 group border-r border-white/20"
                    >
                        <span className="text-lg">➔</span> End Review
                    </button>
                </div>

                <div className="flex items-center h-full">
                    <button className="px-6 h-full hover:text-pvue-status-hover text-[11pt] font-semibold border-l border-white/20 flex items-center gap-2">
                        <span>👥</span> Review All
                    </button>
                    <button className="px-6 h-full hover:text-pvue-status-hover text-[11pt] font-semibold border-l border-white/20 flex items-center gap-2">
                        <span>✖</span> Review Incomplete
                    </button>
                    <button className="px-6 h-full hover:text-pvue-status-hover text-[11pt] font-semibold border-l border-white/20 flex items-center gap-2">
                        <span>🚩</span> Review Flagged
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ReviewScreen;
