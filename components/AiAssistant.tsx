import { useState, useEffect, FC, FormEvent } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { marked } from 'marked';
import GeminiLogo from './GeminiLogo';
import { NODES } from '../constants';

interface AiAssistantProps {
  onCommand: (command: string, args: string[]) => void;
  onGenerateSummary: () => void;
  isGenerating: boolean;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const AiAssistant: FC<AiAssistantProps> = ({ onCommand, onGenerateSummary, isGenerating }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const nodeInfo = NODES.map(n => `- ${n.name} (ID: ${n.id}, Type: ${n.type}): ${n.description}`).join('\n');

        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are an AI System Architect. Your role is to help users understand a complex software architecture.
            
Here is the list of components in the system:
${nodeInfo}

When you mention a component, enclose its ID in brackets like [HIGHLIGHT:component-id]. You can highlight multiple components like [HIGHLIGHT:id1,id2,id3]. Use [CLEAR] to clear all highlights. Be concise and helpful. Start the conversation by introducing yourself.`,
          },
        });
        setChat(newChat);
      } catch (e) {
        console.error("Failed to initialize AI Assistant", e);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    // Start the conversation with the model's introduction using a stream.
    const startConversation = async () => {
      if (chat && history.length === 0) {
        setIsThinking(true);
        // Add an empty placeholder for the streaming message
        setHistory([{ role: 'model', text: '' }]);
        try {
          const responseStream = await chat.sendMessageStream({ message: "Hello" });
          
          let fullText = '';
          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            fullText += chunkText;
            
            handleCommand(chunkText);
            
            // Use an immutable update pattern to prevent state mutation errors.
            setHistory(prev => {
                if (prev.length === 0) return prev;
                const allButLast = prev.slice(0, -1);
                const lastMessage = prev[prev.length - 1];
                const updatedLastMessage = {
                    ...lastMessage,
                    text: fullText.replace(/\[[^\]]*\]/g, '').trimStart(),
                };
                return [...allButLast, updatedLastMessage];
            });
          }

        } catch (error) {
            console.error("AI chat initial message error:", error);
            setHistory([{ role: 'model', text: "Hello! I am the AI System Architect. Ask me anything about this architecture." }]);
        } finally {
            setIsThinking(false);
        }
      }
    };
    startConversation();
  }, [chat]);
  
  const handleCommand = (text: string) => {
    const commandRegex = /\[(HIGHLIGHT|CLEAR):?([^\]]*)\]/g;
    let match;
    while ((match = commandRegex.exec(text)) !== null) {
      const command = match[1];
      const args = match[2] ? match[2].split(',').map(s => s.trim()) : [];
      onCommand(command, args);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isThinking) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await chat.sendMessage({ message: input });
      const modelMessageText = response.text;
      
      handleCommand(modelMessageText);
      
      const modelMessage: ChatMessage = { role: 'model', text: modelMessageText.replace(/\[[^\]]*\]/g, '').trim() };
      setHistory(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 max-w-3xl mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl p-4">
            <div className="h-40 overflow-y-auto pr-2 custom-scrollbar space-y-3 text-sm">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <GeminiLogo className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                        <div className={`p-3 rounded-lg max-w-md ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                            {msg.role === 'model' ? (
                                <div
                                    className="prose prose-sm prose-invert max-w-none [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2"
                                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                                />
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                 {isThinking && history.length > 0 && history[history.length -1].role === 'user' && (
                    <div className="flex items-start gap-2">
                        <GeminiLogo className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="p-3 rounded-lg bg-slate-700 text-slate-200">
                           <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-200"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-400"></div>
                           </div>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the architect... (e.g., 'show me the core services')"
                    className="w-full bg-slate-700/80 border border-slate-600 rounded-full py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    disabled={isThinking || !chat}
                />
                 <button 
                    type="button"
                    onClick={onGenerateSummary}
                    disabled={isGenerating || isThinking}
                    className="flex-shrink-0 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:bg-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                 >
                     {isGenerating ? '...' : 'Summary'}
                 </button>
            </form>
        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a5568; border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #718096; }
        `}</style>
    </div>
  );
};

export default AiAssistant;