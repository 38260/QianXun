import React from 'react';

// 直接定义必要类型
interface ChatMessage {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: string;
}

interface AnalysisPageProps {
    chatMessages: ChatMessage[];
    chatInput: string;
    setChatInput: (v: string) => void;
    isChatLoading: boolean;
    sendChatMessage: () => void;
    handleChatKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Markdown渲染组件（直接复制原有实现）
const MarkdownRenderer = ({ content }: { content: string }) => {
    const renderMarkdown = (text: string) => {
        return text
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
            .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
            .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
            .replace(/\n/g, '<br>');
    };
    return (
        <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
    );
};

const AnalysisPage: React.FC<AnalysisPageProps> = ({
    chatMessages,
    chatInput,
    setChatInput,
    isChatLoading,
    sendChatMessage,
    handleChatKeyPress
}) => {
    return (
        <div className="space-y-8">
            <div className="text-center py-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                    AI智能分析
                </h1>
                <p className="text-xl text-[#313d44]">与AI助手对话，获取创作建议</p>
            </div>
            <div className="w-full max-w-none">
                {/* AI对话 */}
                <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-8 border border-[#cccbc8]/30 h-[calc(100vh-300px)] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-[#1d1c1c]">💬 AI助手对话</h2>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#71c4ef] rounded-full animate-pulse"></div>
                            <span className="text-lg text-[#313d44]">在线</span>
                        </div>
                    </div>
                    {/* 聊天消息区域 */}
                    <div className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30 flex-1 overflow-y-auto mb-6">
                        <div className="space-y-6">
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-xl p-5 ${
                                            message.isUser
                                                ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] text-white'
                                                : 'bg-[#d4eaf7]/50 text-[#313d44] border border-[#cccbc8]/30'
                                        }`}
                                    >
                                        <div className={`leading-relaxed ${message.isUser ? 'text-lg' : 'text-lg'}`}>
                                            {message.isUser ? (
                                                <div className="whitespace-pre-wrap">{message.content}</div>
                                            ) : (
                                                <MarkdownRenderer content={message.content} />
                                            )}
                                        </div>
                                        <div className={`text-base mt-3 ${message.isUser ? 'text-white/70' : 'text-[#313d44]/60]'}`}>
                                            {message.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#d4eaf7]/50 rounded-xl p-5 border border-[#cccbc8]/30">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-[#71c4ef] rounded-full animate-bounce"></div>
                                                <div className="w-3 h-3 bg-[#71c4ef] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-3 h-3 bg-[#71c4ef] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-lg text-[#313d44]">AI正在思考...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* 输入区域 */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={handleChatKeyPress}
                            placeholder="输入您的问题或需求..."
                            disabled={isChatLoading}
                            className="flex-1 px-6 py-4 bg-[#fffefb] border border-[#cccbc8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#71c4ef] text-[#1d1c1c] placeholder-[#313d44] disabled:opacity-50 text-lg"
                        />
                        <button
                            onClick={sendChatMessage}
                            disabled={!chatInput.trim() || isChatLoading}
                            className={`px-8 py-4 rounded-xl transition-all font-medium text-lg ${
                                chatInput.trim() && !isChatLoading
                                    ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] hover:from-[#00668c] hover:to-[#3b3c3d] text-white transform hover:scale-105'
                                    : 'bg-[#cccbc8]/50 text-[#313d44]/50 cursor-not-allowed'
                            }`}
                        >
                            发送
                        </button>
                    </div>
                    {/* 快捷问题 */}
                    <div className="mt-6">
                        <p className="text-lg text-[#313d44] mb-3">💡 快捷问题：</p>
                        <div className="flex flex-wrap gap-3">
                            {[
                                '如何选择热点话题？',
                                '内容创作技巧',
                                '提高阅读量',
                                '用户画像分析'
                            ].map((question) => (
                                <button
                                    key={question}
                                    onClick={() => setChatInput(question)}
                                    className="px-4 py-2 bg-[#d4eaf7]/50 hover:bg-[#b6ccd8]/40 rounded-full text-base text-[#313d44] border border-[#cccbc8]/30 transition-all"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage; 