import Header from '../components/Header'
import Toolbar from '../components/Toolbar'
import QuestionArea from '../components/QuestionArea'
import Footer from '../components/Footer'

const ActiveExamScreen = () => {
    return (
        <div id="abe-container" className="flex flex-col h-screen bg-white select-none animate-in fade-in duration-700">
            {/* Standard Header and Tools */}
            <Header />
            <Toolbar />

            {/* Core Item Viewport */}
            <main className="flex-grow flex flex-col relative overflow-hidden bg-white">
                <QuestionArea />
            </main>

            {/* Standard Navigation Footer */}
            <Footer />
        </div>
    );
};

export default ActiveExamScreen;
