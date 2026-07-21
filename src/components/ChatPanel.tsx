import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Menu, Bot, User, Loader2, Check, Copy, Trash2, Download, Square, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  onClearChat?: () => void;
  onExportChat?: () => void;
  onStopGeneration?: () => void;
  onRegenerate?: () => void;
}

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400 font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden bg-[#1E1E1E] border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-neutral-700">
        <span className="text-xs font-medium text-neutral-300 lowercase">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export function ChatPanel({ messages, onSendMessage, isLoading, onToggleSidebar, onClearChat, onExportChat, onStopGeneration, onRegenerate }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={onToggleSidebar}
            className="p-2 -ml-2 mr-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-md md:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Playground Pro</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onExportChat && messages.length > 0 && (
            <button
              onClick={onExportChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-md transition-all"
              title="Export Chat"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
          {onClearChat && messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-md transition-all"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                <Bot className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Welcome to AI Studio Pro 🚀</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                Your ultra-advanced coding companion is ready. Configure the agent in the sidebar and drop a message below to start coding! ✨
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 w-full">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={clsx(
                  "flex space-x-4",
                  message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
                )}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                    message.role === 'user' 
                      ? "bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 text-neutral-600 dark:text-neutral-300"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className={clsx(
                  "flex flex-col space-y-2 max-w-[85%]",
                  message.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={clsx(
                    "text-sm font-medium",
                    message.role === 'user' ? "text-neutral-500 dark:text-neutral-400" : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300"
                  )}>
                    {message.role === 'user' ? 'You' : 'Studio Pro Agent'}
                  </div>
                  
                  <div className={clsx(
                    "prose prose-sm dark:prose-invert max-w-none break-words",
                    message.role === 'user' 
                      ? "bg-neutral-100 dark:bg-neutral-800/80 px-4 py-3 rounded-2xl rounded-tr-sm text-neutral-900 dark:text-neutral-100 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50" 
                      : "text-neutral-800 dark:text-neutral-200 leading-relaxed"
                  )}>
                    {message.role === 'assistant' ? (
                      <div className="flex flex-col gap-2">
                        <div className={clsx("markdown-body", message.isStreaming && "opacity-80")}>
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: CodeBlock as any,
                              p: ({ children }: any) => {
                                const hasBlock = React.Children.toArray(children).some((child: any) => 
                                  child && typeof child === 'object' && (child.type === 'div' || child.type === 'pre' || child.props?.node?.tagName === 'pre' || child.props?.node?.tagName === 'div')
                                );
                                if (hasBlock) {
                                  return <div className="my-2">{children}</div>;
                                }
                                return <p className="mb-3 leading-relaxed">{children}</p>;
                              }
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        {!message.isStreaming && index === messages.length - 1 && onRegenerate && (
                          <div className="flex justify-start">
                            <button
                              onClick={onRegenerate}
                              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-md transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Regenerate
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-900">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-end shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/50 dark:focus-within:ring-blue-400/50 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask anything... (Shift+Enter for new line)"
              className="w-full max-h-48 min-h-[56px] py-4 pl-4 pr-14 bg-transparent border-none focus:outline-none resize-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              rows={1}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="absolute right-2 bottom-2 p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                title="Stop generation"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={clsx(
                  "absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-200",
                  input.trim()
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
          <div className="flex items-center justify-between mt-3 px-2">
            <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
              {input.trim() ? (
                <span>~{Math.ceil(input.length / 4)} tokens</span>
              ) : (
                <span>0 tokens</span>
              )}
            </div>
            <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
              <span>⚡</span> Powered by Gemini 3.1 Pro & 3.6 Flash
            </p>
            <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
              {messages.length} msgs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
