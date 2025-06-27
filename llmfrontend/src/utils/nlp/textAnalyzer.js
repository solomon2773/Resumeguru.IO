const nlp = require('compromise');

// Metric keywords remain the same
const metricKeywords = [
    'percent', '%', 'increase', 'decrease', 'dollars', 'units', 'hours', 'days', 'weeks', 'months', 'years',
    'times', 'km', 'miles', 'revenue', 'growth', 'savings', 'profit', 'ROI', 'market share',
    'customer retention', 'engagement', 'conversion rate', 'efficiency', 'cost reduction', 'sales',
    'budget', 'transactions', 'pipeline', 'leads', 'headcount', 'deliverables', 'turnaround time',
    'throughput', 'productivity', 'completion rate', 'accuracy', 'KPIs', 'quality', 'milestones',
    'net income', 'gross margin', 'assets', 'inventory', 'expenses', 'allocation', 'utilization',
    'performance', 'client satisfaction', 'NPS', 'churn rate', 'response time', 'deadlines'
];

// Buzzword categories (good buzzwords)
const buzzwordCategories = {
    adjectives: [
        'adept', 'analytical', 'apt', 'artistic', 'attentive', 'certified', 'committed', 'competent', 'decisive',
        'detail-oriented', 'determined', 'devoted', 'dexterous', 'distinctive', 'driven', 'eager', 'earnest', 'effective',
        'efficient', 'enthusiastic', 'exceptional', 'expressive', 'imaginative', 'impeccable', 'impressive', 'innovative',
        'keen', 'logical', 'methodical', 'observant', 'observational', 'organized', 'original', 'outstanding', 'particular',
        'productive', 'proficient', 'prominent', 'qualified', 'remarkable', 'resourceful', 'results-oriented', 'savvy',
        'significant', 'sophisticated', 'stimulative', 'studious', 'talented', 'transformative', 'versed', 'vigilant', 'visionary'
    ],
    originalityCreativity: [
        'authored', 'built', 'conceptualized', 'constructed', 'contributed', 'developed', 'designed', 'drafted', 'enhanced',
        'fabricated', 'formulated', 'initiated', 'illustrated', 'innovated', 'introduced', 'revitalized', 'transformed', 'upgraded'
    ],
    achievements: [
        'accelerated', 'accessed', 'accomplished', 'accrued', 'achieved', 'acquired', 'advanced', 'awarded', 'attained',
        'converted', 'delivered', 'demonstrated', 'gained', 'generated', 'graduated', 'handled', 'increased', 'integrated',
        'launched', 'merged', 'outpaced', 'perfected', 'produced', 'proven', 'reached', 'received', 'repaired', 'resulted',
        'showcased', 'succeeded', 'surpassed', 'yielded', 'won'
    ],
    management: [
        'administered', 'allocated', 'appraised', 'approved', 'arranged', 'assigned', 'authorized', 'briefed', 'chaired',
        'controlled', 'coordinated', 'decided', 'delegated', 'directed', 'dispatched', 'dispensed', 'encouraged', 'engineered',
        'estimated', 'expedited', 'facilitated', 'fostered', 'hired', 'interviewed', 'led', 'mediated', 'mentored', 'motivated',
        'ordered', 'outperformed', 'planned', 'prioritized', 'promoted', 'recommended', 'recruited', 'scheduled', 'staffed', 'supervised'
    ],
    problemSolving: [
        'absorbed', 'activated', 'adapted', 'adjusted', 'aided', 'alerted', 'aligned', 'changed', 'clarified', 'constructed',
        'contributed', 'customized', 'described', 'devised', 'diagnosed', 'documented', 'formulated', 'furnished', 'identified',
        'implemented', 'improved', 'initiated', 'modified', 'processed', 'reconciled', 'resolved', 'restored', 'restructured',
        'retrieved', 'simplified', 'solved', 'standardized'
    ],
    teamwork: [
        'assisted', 'coached', 'collaborated', 'energized', 'helped', 'influenced', 'inspired', 'interacted', 'participated',
        'shared', 'supported', 'volunteered'
    ],
    communication: [
        'addressed', 'advised', 'advocated', 'affirmed', 'arbitrated', 'broadcasted', 'campaigned', 'communicated', 'compared',
        'concluded', 'conferred', 'consulted', 'contacted', 'conveyed', 'convinced', 'critiqued', 'declared', 'dedicated', 'defined',
        'emphasized', 'ensured', 'explained', 'improvised', 'informed', 'justified', 'negotiated', 'persuaded', 'projected',
        'proposed', 'referred', 'reported', 'responded', 'reviewed', 'revised', 'specified', 'suggested', 'summarized', 'translated', 'updated'
    ],
    responsibilities: [
        'acted', 'advertised', 'analyzed', 'applied', 'assembled', 'assessed', 'brought', 'calculated', 'charted', 'checked',
        'classified', 'collected', 'chose', 'compiled', 'complied', 'conducted', 'configured', 'connected', 'consolidated',
        'counseled', 'distributed', 'enforced', 'established', 'evaluated', 'examined', 'executed', 'financed', 'focused',
        'forecasted', 'funded', 'installed', 'investigated', 'lessened', 'maintained', 'manipulated', 'monitored', 'obtained',
        'operated', 'organized', 'performed', 'prepared', 'presented', 'provided', 'purchased', 'recorded', 'reduced', 'reorganized',
        'replaced', 'represented', 'researched', 'run', 'searched', 'served', 'supplied', 'traded', 'utilized', 'validated', 'verified'
    ]
};

// Bad buzzwords: Overused, vague, or lacking specificity
const badBuzzwords = [
    'synergy', 'disrupt', 'leverage', 'paradigm shift', 'innovative', 'dynamic', 'scalable', 'next-gen',
    'best practices', 'ecosystem', 'value proposition', 'market-leading', 'thought-provoking',
    'cutting-edge', 'blockchain', 'cloud architecture', 'enterprise-level', 'driving growth',
    'customer experience', 'brand management', 'solution-oriented', 'lean methodology', 'highly adaptable',
    'sales enablement', 'spearheading', 'decision-making', 'milestone achievement', 'P&L management',
    'roadmap', 'risk management', 'competitive advantage', 'problem-solving', 'people management',
    'client satisfaction', 'process automation', 'emotional intelligence', 'stakeholder alignment',
    'digital engagement', 'resource optimization', 'customer onboarding', 'business development'
];

export const analyzeText = (text) => {
    // Initialize score variables
    if (text === '' || text === null || text === undefined){

        return {
            "numbers": [],
            "verbs": [],
            "metrics": [],
            "goodBuzzwords": {},
            "badBuzzwords": [],
            "score": 0,
            "contentLength": {
                "characterCount": 0,
                "wordCount": 0,
                "sentenceCount": 0
            }
        };
    }
    let totalScore = 100;
    let metricScore = 0;
    let buzzwordScore = 0;
    let verbScore = 0;

    const metricPart = 34; // 33.33% for metrics
    const buzzwordPart = 32; // 33.33% for good buzzwords
    const verbPart = 34; // 33.33% for action verbs

    // Parse text with compromise
    const doc = nlp(text);

    // 1. Metrics Analysis
    const numbers = doc.numbers().out('array');
    const foundMetrics = metricKeywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
    const metricCount = numbers.length + foundMetrics.length;

    if (metricCount > 0) {
        metricScore = metricPart; // Assign full score for metrics if any found
    }

    // 2. Good Buzzwords Analysis
    const foundGoodBuzzwords = {};
    let goodBuzzwordsCount = 0;
    for (const [category, buzzwords] of Object.entries(buzzwordCategories)) {
        const found = buzzwords.filter((buzzword) => text.toLowerCase().includes(buzzword.toLowerCase()));
        foundGoodBuzzwords[category] = found;
        goodBuzzwordsCount += found.length;
    }

    if (goodBuzzwordsCount > 0) {
        buzzwordScore = buzzwordPart; // Assign full score for buzzwords if any found
    }

    // 3. Action Verbs Analysis
    const verbs = doc.verbs().out('array');
    const verbCount = verbs.length;

    if (verbCount > 0) {
        verbScore = verbPart; // Assign full score for action verbs if any found
    }

    // 4. Calculate total score based on the three parts
    let score = metricScore + buzzwordScore + verbScore;

    // 5. Bad Buzzwords Deduction
    const foundBadBuzzwords = badBuzzwords.filter((buzzword) => text.toLowerCase().includes(buzzword.toLowerCase()));
    score -= foundBadBuzzwords.length * 5;

    // Ensure the score is capped between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Content length analysis
    const characterCount = text.length;
    const wordCount = text.trim().split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]/).filter(sentence => sentence.trim().length > 0).length;

    return {
        numbers,
        verbs,
        metrics: foundMetrics,
        goodBuzzwords: foundGoodBuzzwords,
        badBuzzwords: foundBadBuzzwords,
        score, // Final score for this job description
        contentLength: {
            characterCount,
            wordCount,
            sentenceCount
        }
    };
};


