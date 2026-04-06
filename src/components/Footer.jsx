import { useExam } from '../context/ExamContext'

const Footer = () => {
    const { state, dispatch } = useExam();
    const { currentIndex, questions, answers } = state;

    const handleNext = () => {
        const currentQ = questions[currentIndex];
        const correctCount = currentQ.correct_answers ? currentQ.correct_answers.length : 1;
        const selectedCount = (answers[currentQ.id] || []).length;

        if (selectedCount < correctCount) {
             const respMsg = correctCount > 1 ? `${correctCount} responses` : `a response`;
             dispatch({ 
                 type: 'SHOW_ALERT', 
                 payload: { 
                     title: "Response Required", 
                     message: `You must select ${respMsg}.` 
                 }
             });
             return;
        }
        dispatch({ type: 'NEXT_QUESTION' });
    };

    const handlePrev = () => dispatch({ type: 'PREV_QUESTION' });
    const handleEnd = () => dispatch({ type: 'SHOW_END_EXAM_DIALOG', payload: true });
    const handleNavigator = () => dispatch({ type: 'SHOW_NAVIGATOR', payload: true });

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === questions.length - 1;

    return (
        <footer 
          className="bg-pvue-primary text-white h-[44px] flex items-center justify-between px-3 border-t-2 border-white select-none shrink-0" 
          id="abe-navigationbar"
        >
            {/* Left Nav Group */}
            <div className="flex items-center gap-0 h-full" id="abe-navigation-help-finish">
                <button className="px-6 h-full hover:text-pvue-status-hover text-[12pt] font-semibold border-r border-white/20">
                    Help
                </button>
                <button 
                  onClick={handleEnd}
                  className="px-6 h-full hover:text-pvue-status-hover text-[12pt] font-semibold border-r border-white/20"
                >
                    End Exam
                </button>
            </div>

            {/* Right Nav Group */}
            <div className="flex items-center h-full" id="abe-navigation-jump">
                <button 
                  onClick={handlePrev}
                  disabled={isFirst}
                  className={`px-8 h-full text-[12pt] font-semibold border-l border-white/20 transition-colors
                    ${isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:text-pvue-status-hover'}`}
                >
                    Previous
                </button>
                
                <button 
                  onClick={handleNavigator}
                  className="px-8 h-full hover:text-pvue-status-hover text-[12pt] font-semibold border-l border-white/20"
                >
                    Navigator
                </button>

                <button 
                  onClick={handleNext}
                  disabled={isLast}
                  className={`px-10 h-full text-[12pt] font-semibold border-l border-white/20 transition-colors
                    ${isLast ? 'opacity-30 cursor-not-allowed' : 'hover:text-pvue-status-hover'}`}
                >
                    Next
                </button>
            </div>
        </footer>
    );
};

export default Footer;
