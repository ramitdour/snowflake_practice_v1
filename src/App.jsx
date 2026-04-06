import { ExamProvider, useExam, PHASES } from './context/ExamContext'
import LandingScreen from './screens/LandingScreen'
import InstructionsScreen from './screens/InstructionsScreen'
import ActiveExamScreen from './screens/ActiveExamScreen'
import ReviewScreen from './screens/ReviewScreen'
import ScoreScreen from './screens/ScoreScreen'
import ScoreReportScreen from './screens/ScoreReportScreen'
import EndExamDialog from './components/EndExamDialog'
import SystemAlertModal from './components/SystemAlertModal'
import NavigatorModal from './components/NavigatorModal'

function MainContent() {
  const { state } = useExam();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-bg">
      {state.phase === PHASES.LANDING && <LandingScreen />}
      {state.phase === PHASES.INSTRUCTIONS && <InstructionsScreen />}
      {state.phase === PHASES.ACTIVE && <ActiveExamScreen />}
      {state.phase === PHASES.REVIEW && <ReviewScreen />}
      {state.phase === PHASES.SCORE && <ScoreScreen />}
      {state.phase === PHASES.SCORE_REPORT && <ScoreReportScreen />}
      
      {/* Overlays */}
      {state.showEndExamDialog && <EndExamDialog />}
      {state.systemAlert && <SystemAlertModal />}
      {state.showNavigator && <NavigatorModal />}
    </div>
  );
}

function App() {
  return (
    <ExamProvider>
      <MainContent />
    </ExamProvider>
  );
}

export default App;
