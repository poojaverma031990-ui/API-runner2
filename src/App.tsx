import React, { useState } from 'react';
import { Sidebar, MODELS } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { Message, ModelSelection, Provider } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [provider, setProvider] = useLocalStorage<Provider>('ai-provider', 'google');
  const [apiKeys, setApiKeys] = useLocalStorage<Record<Provider, string>>('ai-keys', {
    google: '',
    groq: '',
    openrouter: ''
  });
  const [systemInstruction, setSystemInstruction] = useLocalStorage<string>('ai-system-instruction', 'You are an ultra-advanced, friendly AI coding agent and technical companion! 🚀\n\nWhen the user asks for code, provide clean, production-ready, and well-structured code. 💻\nWhen the user wants to chat normally, be warm, friendly, and conversational—like a helpful buddy! ✨ Use emojis naturally to keep the vibe fun and non-robotic. 🤖❤️\n\nAdapt your tone dynamically: deep and analytical for complex problems, and lighthearted for casual chats.');
  const [model, setModel] = useLocalStorage<ModelSelection>('ai-model', 'gemini-3.6-flash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('ai-messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    const hasStreaming = messages.some(m => m.isStreaming);
    if (!hasStreaming) {
      localStorage.setItem('ai-messages', JSON.stringify(messages));
    }
  }, [messages]);
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
    }
  };

  const handleExportChat = () => {
    const text = messages.map(m => `**${m.role === 'user' ? 'You' : 'AI'}**:\n${m.content}\n\n`).join('---\n\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
    }
  };

  const generateResponse = async (chatMessages: Message[]) => {
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...chatMessages,
      { id: assistantMessageId, role: 'assistant', content: '', isStreaming: true },
    ]);

    try {
      const currentApiKey = apiKeys[provider];
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(currentApiKey ? { 'x-api-key': currentApiKey } : {}),
        },
        body: JSON.stringify({
          messages: chatMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemInstruction,
          model,
          provider
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect to AI Studio backend');
      }

      if (!response.body) throw new Error('ReadableStream not yet supported in this browser.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let text = '';
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.text) {
                  text += data.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessageId ? { ...m, content: text } : m
                    )
                  );
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: `**Error:** ${error.message}` }
              : m
          )
        );
      }
    } finally {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId ? { ...m, isStreaming: false } : m
        )
      );
      setIsLoading(false);
    }
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };
    generateResponse([...messages, userMessage]);
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;
    
    const lastUserIndex = messages.lastIndexOf(lastUserMessage);
    const updatedMessages = messages.slice(0, lastUserIndex + 1);
    generateResponse(updatedMessages);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950 font-sans antialiased overflow-hidden text-neutral-900 dark:text-neutral-100">
      <Sidebar
        provider={provider}
        setProvider={setProvider}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        systemInstruction={systemInstruction}
        setSystemInstruction={setSystemInstruction}
        model={model}
        setModel={setModel}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onClearChat={handleClearChat}
        onExportChat={handleExportChat}
        onStopGeneration={handleStopGeneration}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}
