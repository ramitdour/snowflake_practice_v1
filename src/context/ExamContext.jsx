import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';

const ExamContext = createContext(null);

// Exam phases matching the Pearson VUE flow
export const PHASES = {
  LANDING: 'LANDING',
  INSTRUCTIONS: 'INSTRUCTIONS',
  ACTIVE: 'ACTIVE',
  REVIEW: 'REVIEW',
  SCORE: 'SCORE',
  SCORE_REPORT: 'SCORE_REPORT',
};

const initialState = {
  phase: PHASES.LANDING,
  selectedBank: 'standard', // 'standard' or 'advanced'
  allQuestions: [],   // Store all loaded questions
  questions: [],      // Store the subset of randomized questions
  questionCount: 40,  // Default count
  currentIndex: 0,
  answers: {},        // { questionId: [selectedOptions] }
  flags: {},          // { questionId: true/false }
  timeRemaining: 65 * 60, // 65 minutes in seconds
  timerRunning: false,
  candidateName: 'Candidate',
  examTitle: 'Practice Exam: Core',
  showEndExamDialog: false,
  showNavigator: false,
  reviewFilter: 'all',
  systemAlert: null,
  score: null,
};

function examReducer(state, action) {
  switch (action.type) {
    case 'SET_ALL_QUESTIONS':
      return { ...state, allQuestions: action.payload };

    case 'SET_CANDIDATE_NAME':
      return { ...state, candidateName: action.payload };

    case 'SET_QUESTION_COUNT':
      return { ...state, questionCount: action.payload };

    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'SET_SELECTED_BANK':
      return { ...state, selectedBank: action.payload, allQuestions: [] };

    case 'START_EXAM': {
      // Randomly select N questions from allQuestions
      const count = Math.min(state.questionCount, state.allQuestions.length);
      const shuffled = [...state.allQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      return {
        ...state,
        questions: selected,
        phase: PHASES.ACTIVE,
        timerRunning: true,
        currentIndex: 0,
        // Reset state for new session
        answers: {},
        flags: {},
        timeRemaining: 65 * 60,
        score: null,
      };
    }
    
    case 'SET_QUESTIONS': // Fallback or manual override
       return { ...state, questions: action.payload };

    case 'GO_TO_QUESTION':
      return { ...state, currentIndex: action.payload, phase: PHASES.ACTIVE };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
      };

    case 'PREV_QUESTION':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };

    case 'SET_ANSWER': {
      const { questionId, option, isMultiple } = action.payload;
      const current = state.answers[questionId] || [];
      let newAnswers;

      if (isMultiple) {
        // Toggle the option for multi-select
        if (current.includes(option)) {
          newAnswers = current.filter(o => o !== option);
        } else {
          newAnswers = [...current, option];
        }
      } else {
        // Single select - replace
        newAnswers = [option];
      }

      return {
        ...state,
        answers: { ...state.answers, [questionId]: newAnswers },
      };
    }

    case 'TOGGLE_FLAG': {
      const qId = action.payload;
      return {
        ...state,
        flags: { ...state.flags, [qId]: !state.flags[qId] },
      };
    }

    case 'TICK_TIMER':
      if (state.timeRemaining <= 0) {
        return { ...state, timerRunning: false, phase: PHASES.SCORE };
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };

    case 'SHOW_END_EXAM_DIALOG':
      return { ...state, showEndExamDialog: action.payload };

    case 'SHOW_NAVIGATOR':
      return { ...state, showNavigator: action.payload };

    case 'SET_REVIEW_FILTER':
      return { ...state, reviewFilter: action.payload };

    case 'SHOW_ALERT':
      return { ...state, systemAlert: action.payload }; // { title: string, message: string } or null

    case 'GO_TO_REVIEW':
      return { ...state, phase: PHASES.REVIEW };

    case 'END_EXAM': {
      // Calculate score
      const { questions, answers } = state;
      let correct = 0;
      questions.forEach(q => {
        const userAns = (answers[q.id] || []).sort().join(',');
        const correctAns = (q.correct_answers || []).sort().join(',');
        if (userAns === correctAns) correct++;
      });
      return {
        ...state,
        phase: PHASES.SCORE,
        timerRunning: false,
        score: { correct, total: questions.length },
      };
    }

    case 'VIEW_SCORE_REPORT':
      return { ...state, phase: PHASES.SCORE_REPORT };

    case 'RESTART_EXAM':
      return {
        ...initialState,
        questions: state.questions,
        candidateName: state.candidateName,
        timeRemaining: 65 * 60,
      };

    default:
      return state;
  }
}

export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(examReducer, initialState);
  const timerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (state.timerRunning) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.timerRunning]);

  // Load questions
  const loadQuestions = useCallback(async () => {
    try {
      const fileName = state.selectedBank === 'advanced' 
        ? '/data/question_bank_with_markdown_data.json'
        : '/data/snowflake_all_questions_with_answers.json';
        
      const response = await fetch(fileName);
      const data = await response.json();
      dispatch({ type: 'SET_ALL_QUESTIONS', payload: data });
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  }, [state.selectedBank]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const value = { state, dispatch };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within ExamProvider');
  return context;
}
