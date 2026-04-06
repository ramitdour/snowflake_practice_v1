import { useExam } from '../context/ExamContext'

const SystemAlertModal = () => {
    const { state, dispatch } = useExam();
    const alert = state.systemAlert;

    if (!alert) return null;

    const handleClose = () => dispatch({ type: 'SHOW_ALERT', payload: null });

    return (
        <div className="modal-overlay select-none fadeIn" style={{ zIndex: 1000 }}>
            <div className="bg-pvue-primary w-[400px] border-2 border-white shadow-2xl rounded-sm overflow-hidden transform scale-100">
                {/* Header */}
                <div className="h-[30px] border-b border-white/50 px-3 flex items-center">
                    <span className="text-white text-[10pt] font-semibold">{alert.title}</span>
                </div>
                
                {/* Content */}
                <div className="p-8 bg-pvue-primary flex flex-col items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="text-4xl text-blue-300">ℹ️</div>
                        <div className="text-white text-[11pt] leading-tight font-medium">
                            {alert.message}
                        </div>
                    </div>

                    <div className="flex justify-center mt-2">
                        <button 
                            onClick={handleClose}
                            className="w-12 h-6 border border-white text-white text-[10pt] hover:bg-white hover:text-pvue-primary transition-all font-medium flex items-center justify-center pt-0.5"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemAlertModal;
