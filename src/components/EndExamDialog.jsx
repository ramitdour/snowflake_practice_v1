import { useExam, PHASES } from '../context/ExamContext'

const EndExamDialog = () => {
    const { state, dispatch } = useExam();
    const isReview = state.phase === PHASES.REVIEW;
    const isScore = state.phase === PHASES.SCORE || state.phase === PHASES.SCORE_REPORT;
    
    const handleNo = () => dispatch({ type: 'SHOW_END_EXAM_DIALOG', payload: false });
    const handleYes = () => {
        dispatch({ type: 'SHOW_END_EXAM_DIALOG', payload: false });
        if (isScore) {
            window.location.reload(); // Final exit
        } else if (isReview) {
            dispatch({ type: 'END_EXAM' }); // To score
        } else {
            dispatch({ type: 'GO_TO_REVIEW' }); // To review
        }
    };

    let title = "End Exam";
    let icon = "ℹ️";
    let message = "You have chosen to end this exam. Are you sure you want to end this exam?";

    if (isReview) {
        title = "End Review Confirmation";
        icon = "⚠️";
        message = "Please confirm that you want to end this review. If you click Yes, you will NOT be able to return to this review. Are you sure you want to end this review?";
    }

    return (
        <div className="modal-overlay select-none fadeIn">
            <div className="bg-pvue-primary w-[480px] border-2 border-white shadow-2xl rounded-sm overflow-hidden transform scale-100">
                {/* Header */}
                <div className="h-[32px] border-b border-white/50 px-3 flex items-center">
                    <span className="text-white text-[10pt] font-semibold">{title}</span>
                </div>
                
                {/* Content */}
                <div className="p-8 bg-pvue-primary flex flex-col items-center gap-6">
                    <div className="flex items-start gap-4">
                        <div className={`text-4xl ${isReview ? 'text-yellow-400' : 'text-blue-300'}`}>
                            {icon}
                        </div>
                        <div className="text-white text-[11pt] leading-tight space-y-4 pt-1">
                            <p>{message}</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-2">
                        <button 
                            onClick={handleYes}
                            className="w-12 h-6 border border-white text-white text-[10pt] hover:bg-white hover:text-pvue-primary transition-all font-medium py-0 px-2"
                        >
                            Yes
                        </button>
                        <button 
                            onClick={handleNo}
                            className="w-12 h-6 border border-white text-white text-[10pt] hover:bg-white hover:text-pvue-primary transition-all font-medium py-0 px-2"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EndExamDialog;
