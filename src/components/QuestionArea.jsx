import { useEffect } from 'react'
import { useExam } from '../context/ExamContext'

const QuestionArea = () => {
    const { state, dispatch } = useExam();
    const { currentIndex, questions, answers } = state;
    const currentQ = questions[currentIndex];

    if (!currentQ) return <div className="p-8">Loading question...</div>;

    const isMultiple = (currentQ.correct_answers || []).length > 1;
    const selected = answers[currentQ.id] || [];

    const handleOptionSelect = (key) => {
        const correctCount = currentQ.correct_answers ? currentQ.correct_answers.length : 1;
        const isMultiple = correctCount > 1;
        
        // Prevent clicking more than the allowed limit for MCQs
        if (isMultiple && !selected.includes(key) && selected.length >= correctCount) {
             dispatch({ 
                 type: 'SHOW_ALERT', 
                 payload: { 
                     title: "Maximum Selections", 
                     message: "You have reached the maximum number of selections for this item." 
                 }
             });
             return;
        }

        dispatch({ 
            type: 'SET_ANSWER', 
            payload: { questionId: currentQ.id, option: key, isMultiple }
        });
    };

    // Keyboard bindings for 1-9 options and Enter navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only handle keyboard shortcuts if there is no open modal stealing focus
            const isModalOpen = document.getElementById('abe-dialog') !== null;
            if (isModalOpen) return;

            if (e.key === 'Enter') {
                e.preventDefault();
                dispatch({ type: 'NEXT_QUESTION' });
            } else if (/^[1-9]$/.test(e.key)) {
                const index = parseInt(e.key) - 1;
                const keys = Object.keys(currentQ.options || {});
                if (index >= 0 && index < keys.length) {
                    e.preventDefault();
                    handleOptionSelect(keys[index]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentQ, selected, dispatch]);

    return (
        <div className="flex-grow overflow-y-auto content-scrollbar p-6 flex flex-col items-center bg-white" id="abe-contentPane">
            <div className="max-w-[1000px] w-full" id="question-container">
                {/* Question Text */}
                <div className="text-[12pt] leading-normal mb-8 text-neutral-text whitespace-pre-wrap font-sans" id="question-text">
                    {currentQ.question}
                </div>

                {/* Options Layout: [Input] [Key]. [Value] */}
                <div className="flex flex-col gap-4" id="options-container">
                    {Object.entries(currentQ.options || {}).map(([key, text]) => {
                        const isChecked = selected.includes(key);
                        return (
                            <div 
                              key={key}
                              onClick={() => handleOptionSelect(key)}
                              className={`flex items-start gap-4 p-4 rounded-md cursor-pointer transition-colors
                                ${isChecked ? 'bg-[#FFFD6F]' : 'hover:bg-neutral-bg'}`}
                            >
                                {/* Radio/Checkbox Input */}
                                <div className="pt-1 shrink-0 flex items-center justify-center">
                                    <input 
                                       type={isMultiple ? "checkbox" : "radio"}
                                       name={isMultiple ? `q-${currentQ.id}-${key}` : `q-${currentQ.id}`}
                                       className={isMultiple ? "pvue-checkbox scale-110 pointer-events-none" : "pvue-radio scale-110 pointer-events-none"}
                                       checked={isChecked}
                                       readOnly
                                    />
                                </div>
                                
                                {/* Key & Text */}
                                <div className="text-[12pt] leading-relaxed flex items-start gap-2">
                                    <span className="font-bold shrink-0">{key}.</span>
                                    <span className="text-neutral-text">{text}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuestionArea;
