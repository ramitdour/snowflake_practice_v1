import { useExam } from '../context/ExamContext'

const NavigatorModal = () => {
    const { state, dispatch } = useExam();
    const { questions, answers, flags } = state;

    const closeNav = () => dispatch({ type: 'SHOW_NAVIGATOR', payload: false });
    const jumpTo = (idx) => {
        dispatch({ type: 'GO_TO_QUESTION', payload: idx });
        closeNav();
    }

    return (
        <div className="absolute inset-0 bg-black/60 z-[9999] flex items-center justify-center fade-in">
            <div className="bg-white w-[850px] max-h-[70vh] flex flex-col border-2 border-pvue-primary shadow-2xl rounded-sm">
                {/* Header */}
                <div className="bg-pvue-primary h-[40px] px-4 flex items-center justify-between shadow-md">
                    <span className="text-white text-[14pt] font-semibold flex items-center gap-2">
                        <span className="text-xl">◫</span> Navigator
                    </span>
                    <button onClick={closeNav} className="text-white hover:text-pvue-status-hover text-2xl">✕</button>
                </div>

                {/* Grid Header */}
                <div className="bg-pvue-primary-light grid grid-cols-[80px_1fr_120px_100px] gap-px border-b border-pvue-primary shadow-sm">
                    <div className="p-3 text-white font-bold text-center uppercase tracking-wider text-sm border-r border-white/10">#</div>
                    <div className="p-3 text-white font-bold uppercase tracking-wider text-sm border-r border-white/10">Question Preview</div>
                    <div className="p-3 text-white font-bold text-center uppercase tracking-wider text-sm border-r border-white/10">Status</div>
                    <div className="p-3 text-white font-bold text-center uppercase tracking-wider text-sm">Flagged</div>
                </div>

                {/* Grid Body */}
                <div className="flex-grow overflow-y-auto content-scrollbar bg-neutral-bg select-none">
                    {questions.map((q, idx) => {
                        const hasAnswer = answers[q.id] && answers[q.id].length > 0;
                        const isFlagged = flags[q.id];
                        
                        return (
                            <div 
                              key={idx}
                              onClick={() => jumpTo(idx)}
                              className={`grid grid-cols-[80px_1fr_120px_100px] gap-px border-b border-neutral-border cursor-pointer transition-all hover:bg-pvue-status-warning group
                                ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-bg'}`}
                            >
                                <div className="p-3 text-center text-pvue-primary font-bold border-r border-neutral-border/50 group-hover:border-transparent">
                                    {idx + 1}
                                </div>
                                <div className="p-3 truncate text-neutral-text font-medium border-r border-neutral-border/50 group-hover:border-transparent italic">
                                    {q.question.substring(0, 80)}...
                                </div>
                                <div className={`p-3 text-center font-bold text-sm border-r border-neutral-border/50 group-hover:border-transparent
                                    ${hasAnswer ? 'text-pvue-status-success' : 'text-pvue-status-error tracking-wide'}`}>
                                    {hasAnswer ? 'COMPLETE' : 'INCOMPLETE'}
                                </div>
                                <div className="p-3 flex justify-center items-center group-hover:border-transparent">
                                    {isFlagged ? (
                                        <div className="w-5 h-5 bg-pvue-status-error rounded-sm border border-red-700 shadow-sm flex items-center justify-center text-white text-[10px] animate-pulse">✓</div>
                                    ) : (
                                        <div className="w-5 h-5 border border-neutral-border bg-white group-hover:bg-transparent transition-colors"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="bg-pvue-primary-light p-3 flex justify-end gap-4 shadow-inner">
                    <button 
                      onClick={closeNav}
                      className="px-8 h-8 border border-white text-white hover:bg-white hover:text-pvue-primary transition-all font-bold uppercase text-xs tracking-widest shadow-lg active:translate-y-px"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NavigatorModal;
