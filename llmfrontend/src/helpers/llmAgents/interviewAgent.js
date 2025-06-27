// lib/helpers.js

import {  StateGraph, START, END, StateGraphArgs } from "@langchain/langgraph";
import { TavilySearch } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { StructuredTool } from "@langchain/core/tools";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";



// Define the initial state
export const state = {
    jobDescription: "",
    questions: "",
    responses: "",
    feedback: "",
    critique: "",
    researchResults: [],
};

// Initialize the Tavily search tool
export const tavilySearch = new TavilySearch();

// Initialize the OpenAI LLM
export const llm = new ChatOpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' });

// Define the tools to be used
export const tools = [
    new StructuredTool({
        name: "TavilySearch",
        description: "Searches for information using Tavily",
        execute: async (input) => {
            const results = await tavilySearch.search(input);
            return results;
        },
    }),
    // Add more tools as needed
];

// System message for the agent
export const systemMessage = "This is a system message for the mock interview agent.";

/**
 * Create an agent that can run a set of tools.
 */
export async function createToolAgent({
                                      llm,
                                      tools,
                                      systemMessage,
                                  }) {
    const toolNames = tools.map((tool) => tool.name).join(", ");
    const formattedTools = tools.map((t) => convertToOpenAITool(t));

    let prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are a helpful AI assistant, collaborating with other assistants." +
            " Use the provided tools to progress towards answering the question." +
            " If you are unable to fully answer, that's OK, another assistant with different tools " +
            " will help where you left off. Execute what you can to make progress." +
            " If you or any of the other assistants have the final answer or deliverable," +
            " prefix your response with FINAL ANSWER so the team knows to stop." +
            " You have access to the following tools: {tool_names}.\n{system_message}",
        ],
        new MessagesPlaceholder("messages"),
    ]);
    prompt = await prompt.partial({
        system_message: systemMessage,
        tool_names: toolNames,
    });

    return prompt.pipe(llm.bind({ tools: formattedTools }));
}


interface AgentStateChannels {
    messages: BaseMessage[];
    // The agent node that last performed work
    sender: string;
}

// Define agent state channels
// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
const agentStateChannels: StateGraphArgs<AgentStateChannels>["channels"] = {
    messages: {
        value: (x?: BaseMessage[], y?: BaseMessage[]) => (x ?? []).concat(y ?? []),
        default: () => [],
    },
    sender: {
        value: (x?: string, y?: string) => y ?? x ?? "user",
        default: () => "user",
    },
};

// Function to run the graph
export const runGraph = async (jobDescription) => {
    state.jobDescription = jobDescription;

    const graphArgs = { state, channels: agentStateChannels };
    const graph = new StateGraph(graphArgs);

    const agent = await createAgent({ llm, tools, systemMessage });

    // Define nodes
    const interviewerNode = async (graphArgs) => {
        console.log("Interviewer Agent: Analyzing job description...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        graphArgs.state.questions = `Questions based on ${graphArgs.state.jobDescription}`;
    };

    const candidateNode = async (graphArgs) => {
        console.log("Candidate Proxy Agent: Generating responses...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        graphArgs.state.responses = `Responses to ${graphArgs.state.questions}`;
    };

    const feedbackNode = async (graphArgs) => {
        console.log("Feedback Agent: Providing feedback...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        graphArgs.state.feedback = `Feedback on ${graphArgs.state.responses}`;
    };

    const skillEvaluationNode = async (graphArgs) => {
        console.log("Skill Evaluation Agent: Evaluating technical skills...");
        // Simulate technical evaluation
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        graphArgs.state.skillEvaluation = "Technical skills evaluated.";
    };

    const behavioralAnalysisNode = async (graphArgs) => {
        console.log("Behavioral Analysis Agent: Analyzing behavioral responses...");
        // Simulate behavioral analysis
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        graphArgs.state.behavioralAnalysis = "Behavioral responses analyzed.";
    };

    const humanProxyNode = async (graphArgs) => {
        console.log("Human Proxy Agent: Providing human review...");
        // Simulate human review
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        graphArgs.state.humanProxy = "Human review provided.";
    };

    const researchNode = async (graphArgs) => {
        console.log("Research Agent: Conducting research...");
        graphArgs.state.researchResults = await tavilySearch.search(graphArgs.state.jobDescription);
        console.log("Research results:", graphArgs.state.researchResults);
        // Use research results to enhance the process
    };

    const critiqueNode = async (graphArgs) => {
        console.log("Critique Agent: Summarizing feedback...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        graphArgs.state.critique = `Critique based on ${graphArgs.state.feedback}`;
    };

    // Add nodes to the graph
    graph.addNode("Interviewer", interviewerNode)
        .addNode("CandidateProxy", candidateNode)
        .addNode("Feedback", feedbackNode)
        .addNode("SkillEvaluation", skillEvaluationNode)
        .addNode("BehavioralAnalysis", behavioralAnalysisNode)
        .addNode("HumanProxy", humanProxyNode)
        .addNode("Research", researchNode)
        .addNode("Critique", critiqueNode);

    // Define the edges
    const router = (state) => {
        if (state.questions) return "CandidateProxy";
        if (state.responses) return "Feedback";
        if (state.feedback) return "SkillEvaluation";
        if (state.skillEvaluation) return "Critique";
        if (state.behavioralAnalysis) return "Critique";
        if (state.researchResults.length > 0) return "Critique";
        return END;
    };

    graph.addConditionalEdges("Interviewer", router, {
        CandidateProxy: "CandidateProxy",
        Research: "Research",
        end: END,
    });

    graph.addConditionalEdges("CandidateProxy", router, {
        Feedback: "Feedback",
        end: END,
    });

    graph.addConditionalEdges("Feedback", router, {
        SkillEvaluation: "SkillEvaluation",
        BehavioralAnalysis: "BehavioralAnalysis",
        end: END,
    });

    graph.addConditionalEdges("SkillEvaluation", router, {
        Critique: "Critique",
        end: END,
    });

    graph.addConditionalEdges("BehavioralAnalysis", router, {
        Critique: "Critique",
        end: END,
    });

    graph.addConditionalEdges("Research", router, {
        Critique: "Critique",
        end: END,
    });

    graph.addConditionalEdges("Critique", router, {
        HumanProxy: "HumanProxy",
        end: END,
    });

    graph.addEdge(START, "Interviewer");

    const compiledGraph = graph.compile();

    // Stream results from the graph
    const streamResults = await graph.stream(
        {
            messages: [
                new HumanMessage({
                    content: "Generate a bar chart of the US GDP over the past 3 years.",
                }),
            ],
        },
        { recursionLimit: 150 },
    );

    for await (const output of streamResults) {
        if (!output?.__end__) {
            console.log(output);
            console.log("----");
        }
    }

    await compiledGraph.execute(state);
    console.log("Final critique:", state.critique);
};
