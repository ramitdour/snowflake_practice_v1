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
  selectedBank: 'advanced', // 'standard' or 'advanced'
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

const SESSION_KEY = 'snowflake_exam_session';
const HISTORY_KEY = 'snowflake_exam_history';

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // If they somehow managed to save an active session with no questions, it's corrupted. Reset it.
      if (parsed.phase && parsed.phase !== PHASES.LANDING && (!parsed.questions || parsed.questions.length === 0)) {
         localStorage.removeItem(SESSION_KEY);
         return initialState;
      }
      return { ...initialState, ...parsed };
    }
  } catch (err) {
    console.warn("Could not load session", err);
  }
  return initialState;
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
      if (state.selectedBank !== action.payload) {
          return { ...state, selectedBank: action.payload, allQuestions: [] };
      }
      return state;

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

      const scoreObj = { correct, total: questions.length };
      
      // Save exam history
      try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        history.push({
          date: new Date().toISOString(),
          candidateName: state.candidateName,
          score: scoreObj,
          bank: state.selectedBank,
          questions: questions,
          answers: answers
        });
        
        // Keep only top 20 to prevent localStorage exhaustion
        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      } catch (err) {
        console.error("Failed saving history", err);
      }

      return {
        ...state,
        phase: PHASES.SCORE,
        timerRunning: false,
        score: scoreObj,
      };
    }

    case 'VIEW_SCORE_REPORT':
      return { ...state, phase: PHASES.SCORE_REPORT };

    case 'LOAD_HISTORY_REPORT': {
      const record = action.payload;
      return {
        ...state,
        phase: PHASES.SCORE_REPORT,
        questions: record.questions || [],
        answers: record.answers || {},
        candidateName: record.candidateName,
        score: record.score,
        selectedBank: record.bank
      };
    }

    case 'RESTART_EXAM':
      return {
        ...initialState,
        questions: state.questions,
        candidateName: state.candidateName,
        timeRemaining: 65 * 60,
      };

    case 'RESET_PORTAL':
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (err) {}
      return { 
        ...initialState, 
        allQuestions: state.allQuestions,
        candidateName: state.candidateName 
      };

    default:
      return state;
  }
}

export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(examReducer, getInitialState());
  const timerRef = useRef(null);

  // Save active session
  useEffect(() => {
    const { allQuestions, ...stateToSave } = state;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
    } catch (err) {}
  }, [state]);

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
  
  const fetchFallback = useCallback(async () => {
    try {
        console.warn(`[ExamEngine] ⚠ TRIGGERING FAILSAFE FALLBACK. Pointing index to raw GitHub standard bank...`);
        const fallbackUrl = 'https://raw.githubusercontent.com/ramitdour/snowflake_practice_v1/refs/heads/main/public/data/snowflake_all_questions_with_answers.json';
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        console.log(`[ExamEngine] ✓ SUCCESS: Fallback data safely materialized.`);
        dispatch({ type: 'SET_ALL_QUESTIONS', payload: fallbackData });
    } catch (err) {
        console.error('[ExamEngine] Critical failure: Fallback also failed.', err);
    }
  }, []);

  // Load questions
  const loadQuestions = useCallback(async () => {
    try {
      const isAdvanced = state.selectedBank === 'advanced';
      const fileName = isAdvanced 
        ? `${import.meta.env.BASE_URL}data/question_bank_with_markdown_data.json`
        : `${import.meta.env.BASE_URL}data/snowflake_all_questions_with_answers.json`;

      if (isAdvanced) {
        console.log(`[ExamEngine] Initialization started. Attempting to fetch advanced question bank from: ${fileName}`);
      }
        
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout limiter

      try {
        const response = await fetch(fileName, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        clearTimeout(timeoutId);
        
        if (isAdvanced) {
           console.log(`[ExamEngine] ✓ SUCCESS: Safely materialized ${data.length} advanced questions.`);
        }
        dispatch({ type: 'SET_ALL_QUESTIONS', payload: data });
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (isAdvanced) {
           console.error(`[ExamEngine] ✕ CAUGHT TIMEOUT OR ERROR:`, fetchErr);
           await fetchFallback();
        } else {
           throw fetchErr;
        }
      }
    } catch (err) {
      console.error('Failed to load questions completely:', err);
    }
  }, [state.selectedBank]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const value = { state, dispatch, skipToFallback: fetchFallback };

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
