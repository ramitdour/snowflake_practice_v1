import { useMemo, useEffect, useRef, useState } from 'react'
import { useExam } from '../context/ExamContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Initialize Mermaid with clean settings
mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        primaryColor: '#11567F',
        primaryTextColor: '#fff',
        primaryBorderColor: '#11567F',
        lineColor: '#11567F',
        secondaryColor: '#B6EEFF',
        tertiaryColor: '#fff',
    },
    securityLevel: 'loose',
});

const MermaidDiagram = ({ chart }) => {
    const ref = useRef(null);
    const [svg, setSvg] = useState('');
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        if (chart && ref.current) {
            const renderDiagram = async () => {
                try {
                    const { svg } = await mermaid.render(id, chart);
                    setSvg(svg);
                } catch (error) {
                    console.error("Mermaid Render Error:", error);
                }
            };
            renderDiagram();
        }
    }, [chart, id]);

    return (
        <div 
            className="flex justify-center my-8 p-6 bg-white border-2 border-neutral-bg rounded-2xl shadow-sm overflow-x-auto min-h-[100px] flex-col items-center" 
            ref={ref}
        >
            <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full h-full text-center" />
            <div className="text-[10px] font-black uppercase text-pvue-primary/40 mt-4 tracking-widest border-t border-pvue-primary/5 pt-2 w-full text-center">
                System Architecture Visualization
            </div>
        </div>
    );
};

const QuestionReviewItem = ({ q, idx, userAns, correctAns }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isCorrect = userAns.sort().join(',') === correctAns.sort().join(',');
    const isUnanswered = userAns.length === 0;

    const mainBorder = isCorrect ? 'border-emerald-500/30 hover:border-emerald-500/60' : isUnanswered ? 'border-neutral-border/50 hover:border-neutral-border/80' : 'border-rose-500/30 hover:border-rose-500/60';
    const mainBg = isCorrect ? 'bg-emerald-50/30' : isUnanswered ? 'bg-neutral-bg/10' : 'bg-rose-50/30';
    const badgeBg = isCorrect ? 'bg-emerald-500 shadow-emerald-500/20' : isUnanswered ? 'bg-neutral-400' : 'bg-rose-500 shadow-rose-500/20';
    const statusText = isCorrect ? 'text-emerald-700' : isUnanswered ? 'text-neutral-500' : 'text-rose-700';

    return (
        <div className={`p-5 md:p-8 rounded-2xl border-2 transition-all duration-300 shadow-sm ${mainBorder} ${mainBg}`}>
            {/* Header row for expand/collapse */}
            <div 
                className="flex flex-wrap gap-4 justify-between items-center cursor-pointer select-none group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <span className={`text-sm font-black px-3 py-1.5 rounded-lg text-white shadow-sm ${badgeBg}`}>
                        Question {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{q.category}</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className={`text-sm font-black uppercase tracking-widest ${statusText}`}>
                        {isCorrect ? 'Correct' : isUnanswered ? 'Unanswered' : 'Incorrect'}
                    </div>
                    <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-white shadow-sm border ${mainBorder} group-hover:scale-105 transition-all text-neutral-500`}>
                        <span className={`transform transition-transform duration-300 text-[10px] ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                </div>
            </div>

            {/* Expandable Body */}
            {isExpanded && (
                <div className="mt-6 pt-6 border-t border-black/5 animate-in slide-in-from-top-4 fade-in duration-300">
                    {/* Question Text */}
                    <div className="text-[13pt] text-neutral-800 font-semibold leading-relaxed mb-8 whitespace-pre-wrap">
                        {q.question}
                    </div>

                    {/* All Options Context */}
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 pl-1">Available Options</h4>
                    <div className="space-y-3 mb-10 pl-4 text-[11pt] text-neutral-600 font-medium">
                        {Object.entries(q.options || {}).map(([key, text]) => (
                            <div key={key} className="flex gap-4 items-start">
                                <span className="font-extrabold w-6 text-neutral-400 bg-white border border-neutral-200 rounded text-center text-sm py-0.5 shadow-sm">{key}</span>
                                <span className="pt-0.5">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Split View Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8 pt-8 border-t border-black/5">
                        {/* User's Selection Column */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
                                <span className="bg-white px-2 py-1.5 rounded-md shadow-sm border border-neutral-200">👤</span> Your Selection
                            </h4>
                            {userAns.length > 0 ? userAns.map(key => {
                                const isKeyCorrect = correctAns.includes(key);
                                const text = q.options[key] || "";
                                const style = isKeyCorrect 
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-900" 
                                    : "border-rose-300 bg-rose-50 text-rose-900 line-through opacity-90";
                                const icon = isKeyCorrect ? "✅" : "❌";
                                
                                return (
                                    <div key={`user-${key}`} className={`flex items-start gap-4 p-4 rounded-xl border-2 shadow-sm ${style}`}>
                                        <span className="shrink-0 pt-0.5 text-sm">{icon}</span>
                                        <span className="font-extrabold shrink-0 bg-white/50 px-2 rounded border border-black/5">{key}</span>
                                        <span className="text-[11pt] font-semibold leading-snug">{text}</span>
                                    </div>
                                );
                            }) : (
                                <div className="p-6 border-2 border-dashed border-neutral-300 bg-white/50 rounded-xl text-neutral-400 font-semibold italic text-center text-sm">
                                    No option selected for this item.
                                </div>
                            )}
                        </div>

                        {/* Correct Answer Column */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                                <span className="bg-blue-50 px-2 py-1.5 rounded-md shadow-sm border border-blue-200">🎯</span> Correct Answer
                            </h4>
                            {correctAns.map(key => {
                                const text = q.options[key] || "";
                                return (
                                    <div key={`correct-${key}`} className="flex items-start gap-4 p-4 rounded-xl border-2 border-blue-300 bg-blue-50 text-blue-900 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                                        <span className="shrink-0 pt-0.5 text-blue-500 font-bold text-sm">↳</span>
                                        <span className="font-extrabold shrink-0 bg-white/80 px-2 rounded border border-blue-200">{key}</span>
                                        <span className="text-[11pt] font-semibold leading-snug">{text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Explanation */}
                    {(q.study_guide || q.reason) && (
                        <div className="bg-white p-8 rounded-2xl border border-pvue-primary/10 shadow-md relative overflow-hidden mt-8 group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-pvue-primary/80"></div>
                            <div className="text-xs font-black text-pvue-primary uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-pvue-primary/10 pb-3">
                                <span>💡</span> Explanation & Study Guide
                            </div>
                            <div className="text-[11pt] text-neutral-700 leading-relaxed prose prose-slate prose-headings:text-pvue-primary prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none">
                                {q.study_guide ? (
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h3: ({node, ...props}) => <h3 className="text-lg font-bold text-pvue-primary mt-8 mb-4 flex items-center gap-2" {...props} />,
                                            p: ({node, ...props}) => <p className="mb-5" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-extrabold text-neutral-900 bg-pvue-primary/5 px-1 rounded" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-6 space-y-2 marker:text-pvue-primary" {...props} />,
                                            li: ({node, ...props}) => <li className="pl-2" {...props} />,
                                            code: ({node, inline, className, children, ...props}) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                const chart = String(children).replace(/\n$/, '');

                                                if (match && match[1] === 'mermaid') {
                                                    return <MermaidDiagram chart={chart} />;
                                                }

                                                if (!inline && match) {
                                                    return (
                                                        <div className="my-6 shadow-sm overflow-hidden rounded-xl border border-neutral-200">
                                                            <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
                                                                <span className="text-[10px] font-bold tracking-widest uppercase text-pvue-primary/60">{match[1]}</span>
                                                                <div className="flex gap-1.5">
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                                                                </div>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                style={vs}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                className="!m-0 !bg-white !text-[13px] !leading-relaxed"
                                                                showLineNumbers={true}

                                                                {...props}
                                                            >
                                                                {chart}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    );
                                                }

                                                if (inline) {
                                                    return <code className="bg-neutral-100 px-1.5 py-0.5 rounded-md font-mono text-sm text-pvue-primary border border-neutral-200" {...props}>{children}</code>
                                                }
                                                return (
                                                    <pre className="bg-[#0D1117] text-[#C9D1D9] p-5 rounded-xl my-6 overflow-x-auto font-mono text-[13px] leading-relaxed border border-neutral-800 shadow-xl">
                                                        <code {...props}>{children}</code>
                                                    </pre>
                                                )
                                            }
                                        }}
                                    >
                                        {q.study_guide}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="italic text-neutral-600 bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-sm leading-relaxed">
                                        {q.reason}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ScoreReportScreen = () => {
    const { state } = useExam();
    const { questions, answers, candidateName } = state;

    // Calculate performance by category
    const analysis = useMemo(() => {
        const stats = {};
        questions.forEach(q => {
            if (!stats[q.category]) {
                stats[q.category] = { total: 0, correct: 0 };
            }
            stats[q.category].total++;
            
            const userAns = (answers[q.id] || []).sort().join(',');
            const correctAns = (q.correct_answers || []).sort().join(',');
            if (userAns === correctAns) {
                stats[q.category].correct++;
            }
        });
        return stats;
    }, [questions, answers]);

    const overallScore = useMemo(() => {
        const correct = questions.filter(q => {
            const userAns = (answers[q.id] || []).sort().join(',');
            const correctAns = (q.correct_answers || []).sort().join(',');
            return userAns === correctAns;
        }).length;
        return { correct, total: questions.length };
    }, [questions, answers]);

    return (
        <div id="abe-container" className="h-screen bg-white flex flex-col p-12 overflow-y-auto content-scrollbar animate-in zoom-in-95 duration-1000">
            <div className="max-w-[1000px] w-full mx-auto space-y-12">
                
                {/* Header Profile Section */}
                <div className="flex flex-col items-center gap-6 mb-16 relative">
                     <span className="text-5xl font-extrabold tracking-tight text-pvue-primary-dark select-none">snowflake</span>
                     <div className="h-1.5 w-32 bg-pvue-status-success rounded-full opacity-60"></div>
                     <span className="text-[24pt] font-black text-neutral-text uppercase tracking-widest leading-none shadow-sm pb-2">Score Analysis Report</span>
                </div>

                {/* Performance Summary - Candidate Stats */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-pvue-primary/10 mb-12 shadow-sm order-pvue-primary/5">
                    {[
                        { label: 'CANDIDATE', value: candidateName, icon: '👤' },
                        { label: 'EXAMINATION ID', value: `SNOW-${Math.floor(Math.random()*9000000 + 1000000)}`, icon: '🆔' },
                        { label: 'DATE', value: new Date().toLocaleDateString('en-GB'), icon: '📅' },
                        { label: 'OVERALL SCORE', value: `${overallScore.correct} / ${overallScore.total}`, icon: '📊' }
                    ].map((item, i) => (
                        <div key={i} className="bg-neutral-bg/20 p-6 rounded-xl border border-pvue-primary/5 shadow-inner group transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 duration-300">
                            <div className="text-xs font-black text-pvue-primary/40 uppercase tracking-widest mb-3 underline decoration-pvue-primary/10 decoration-2 underline-offset-4">{item.label}</div>
                            <div className="text-lg font-black text-neutral-text flex items-center gap-3">
                                <span className="text-xl opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                                <span className="truncate">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sectional Performance Analysis */}
                <div className="space-y-12 pb-24">
                    <div className="flex items-center gap-6 mb-12">
                         <div className="bg-pvue-primary p-3 rounded-xl shadow-lg animate-pulse"><div className="w-6 h-6 border-2 border-white/40 rounded-full flex items-center justify-center text-white text-xs font-black">⚙️</div></div>
                         <h2 className="text-[18pt] font-black text-pvue-primary-dark tracking-wide uppercase border-l-4 border-pvue-primary pl-6 leading-none">Category Metrics</h2>
                    </div>

                    <div className="grid gap-10">
                        {Object.entries(analysis).map(([category, stat], idx) => {
                            const percent = ((stat.correct / stat.total) * 100).toFixed(0);
                            const performanceColor = percent >= 75 ? 'bg-pvue-status-success' : 'bg-pvue-status-error';
                            return (
                                <div key={idx} className="group transition-all hover:translate-x-3 duration-500">
                                    <div className="flex justify-between items-end mb-4 pr-2">
                                        <div className="text-[12pt] font-black text-neutral-text uppercase tracking-widest flex items-center gap-4">
                                            <span className="text-xs text-pvue-primary/30 font-black">0{idx + 1}</span>
                                            {category}
                                        </div>
                                        <div className="text-[14pt] font-black tabular-nums text-neutral-muted flex items-end gap-2 drop-shadow-sm">
                                            <span className={percent >= 75 ? 'text-pvue-status-success' : 'text-pvue-status-error'}>{percent}%</span>
                                            <span className="text-xs opacity-40 font-black mb-1">ACCURACY</span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative h-4 w-full bg-neutral-bg rounded-full overflow-hidden shadow-inner border border-pvue-primary/5">
                                        {/* Background Grid */}
                                        <div className="absolute inset-0 flex justify-between px-[10%] opacity-20 pointer-events-none">
                                            {[...Array(9)].map((_, i) => <div key={i} className="w-px h-full bg-neutral-border"></div>)}
                                        </div>
                                        
                                        <div 
                                          style={{ width: `${percent}%` }}
                                          className={`h-full ${performanceColor} shadow-md transition-all duration-[2000ms] ease-out rounded-full group-hover:brightness-110`}
                                        >
                                            <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 flex gap-4 text-[10pt] font-bold text-neutral-muted/40 uppercase tracking-widest pl-12 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span>Items: {stat.total}</span>
                                        <span>•</span>
                                        <span>Correct: {stat.correct}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detailed Performance Breakdown */}
                <div className="space-y-12 pb-24 border-t border-pvue-primary/10 pt-16">
                    <div className="flex items-center gap-6 mb-12">
                         <div className="bg-pvue-primary p-3 rounded-xl shadow-lg animate-pulse"><div className="w-6 h-6 border-2 border-white/40 rounded-full flex items-center justify-center text-white text-xs font-black">📝</div></div>
                         <h2 className="text-[18pt] font-black text-pvue-primary-dark tracking-wide uppercase border-l-4 border-pvue-primary pl-6 leading-none">Detailed Item Review</h2>
                    </div>

                    <div className="space-y-10">
                        {questions.map((q, idx) => (
                            <QuestionReviewItem 
                                key={q.id} 
                                q={q} 
                                idx={idx} 
                                userAns={answers[q.id] || []} 
                                correctAns={q.correct_answers || []} 
                            />
                        ))}
                    </div>
                </div>

                {/* Analysis Footer */}
                <div className="flex flex-col items-center pt-16 border-t-4 border-neutral-bg gap-10">
                    <div className="text-[12pt] text-neutral-muted italic max-w-2xl text-center leading-relaxed font-medium opacity-80">
                         Performance metrics are calculated in real-time based on the production Snowflake documentation benchmarks. 
                         Review these categories to prioritize your study alignment.
                    </div>
                    
                    <button 
                         onClick={() => dispatch({ type: 'RESET_PORTAL' })}
                         className="bg-pvue-primary text-white border-2 border-transparent px-16 py-5 rounded-lg text-lg font-black hover:bg-white hover:text-pvue-primary hover:border-pvue-primary transition-all shadow-xl active:scale-95 group uppercase tracking-[0.3em] duration-500"
                    >
                         START NEW SESSION
                    </button>
                    
                    <button 
                        onClick={() => window.print()}
                        className="text-pvue-primary font-black text-xs uppercase tracking-[0.2em] border-b-2 border-pvue-primary/10 hover:border-pvue-primary pb-1 transition-all opacity-40 hover:opacity-100"
                    >
                        Export Performance Data (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScoreReportScreen;
