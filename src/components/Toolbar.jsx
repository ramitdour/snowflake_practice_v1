import { useExam } from '../context/ExamContext'

const Toolbar = () => {
    const { state, dispatch } = useExam();
    const currentQ = state.questions[state.currentIndex];
    const isFlagged = currentQ ? state.flags[currentQ.id] : false;

    const toggleFlag = () => {
        if (!currentQ) return;
        dispatch({ type: 'TOGGLE_FLAG', payload: currentQ.id });
    };

    return (
        <div 
            className="bg-pvue-primary-light text-white h-[32px] flex items-center justify-between px-2 border-b-2 border-white select-none shrink-0" 
            id="abe-toolbar"
        >
            {/* Tools Left */}
            <div className="flex items-center gap-1 h-full" id="abe-toolbar-tools">
                <button className="px-4 hover:text-pvue-status-hover text-[12pt] font-semibold flex items-center h-full transition-colors border-r border-white/20">
                    Comment
                </button>
            </div>

            {/* Flags Right */}
            <div className="flex items-center h-full" id="abe-toolbar-flags">
                <button 
                  onClick={toggleFlag}
                  className={`px-4 h-full flex items-center gap-2 group transition-all text-[12pt] font-semibold border-l border-white/20
                    ${isFlagged ? 'bg-white text-pvue-primary scale-95' : 'hover:text-pvue-status-hover'}`}
                >
                    <span className={`w-3.5 h-3.5 rounded-sm border-2 ${isFlagged ? 'bg-pvue-status-error border-transparent' : 'border-white group-hover:border-pvue-status-hover'} transition-all`}></span>
                    Flag for Review
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
