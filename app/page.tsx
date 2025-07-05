'use client';

import { useState } from 'react';

// 定义类型接口
interface HotTopic {
    id: number;
    title: string;
    heat: number;
    category: string;
}

interface GeneratedContent {
    id: number;
    title: string;
    content: string;
    category: string;
    heat: number;
    tags: string[];
    timestamp: string;
}

interface PlatformData {
    title: string;
    link: string;
    hotcount: string;
    platform: string;
    slist: string;
    rectime: string;
}

interface PlatformInfo {
    name: string;
    count: number;
    data: PlatformData[];
}

interface ChatMessage {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: string;
}

export default function Home() {
    const [userInput, setUserInput] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState('home');
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [generationHistory, setGenerationHistory] = useState<GeneratedContent[]>([]);
    const [platformData, setPlatformData] = useState<PlatformInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    // 折叠平台选择区
    const [platformCollapse, setPlatformCollapse] = useState(false);
    // 更新数据loading
    const [updating, setUpdating] = useState(false);
    // AI对话相关状态
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            content: '你好！我是AI创作助手，可以帮你分析热点话题、提供创作建议，或者回答任何关于内容创作的问题。请告诉我你需要什么帮助？',
            isUser: false,
            timestamp: new Date().toLocaleString('zh-CN')
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const hotTopics: HotTopic[] = [
        { id: 1, title: 'AI技术革命', heat: 95, category: '科技' },
        { id: 2, title: '元宇宙发展', heat: 88, category: '科技' },
        { id: 3, title: '可持续发展', heat: 92, category: '环保' },
        { id: 4, title: '数字货币', heat: 85, category: '金融' },
        { id: 5, title: '远程办公', heat: 78, category: '职场' },
        { id: 6, title: '健康生活', heat: 90, category: '生活' },
        { id: 7, title: '新能源汽车', heat: 87, category: '汽车' },
        { id: 8, title: '在线教育', heat: 82, category: '教育' },
    ];

    const userTags: string[] = [
        '科技爱好者',
        '创业者',
        '设计师',
        '程序员',
        '营销专家',
        '内容创作者',
        '投资者',
        '学生',
        '教师',
        '自媒体',
        '产品经理',
        '数据分析师',
        '艺术家',
        '摄影师',
        '旅行者',
    ];

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
    };

    const addCustomTag = () => {
        if (userInput.trim() && !selectedTags.includes(userInput.trim())) {
            setSelectedTags((prev) => [...prev, userInput.trim()]);
            setUserInput('');
        }
    };

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addCustomTag();
        }
    };

    const removeTag = (tagToRemove: string) => {
        setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    const generateContent = () => {
        if (selectedTags.length === 0) return;

        const randomTopic = hotTopics[Math.floor(Math.random() * hotTopics.length)];
        const titles = [
            `${randomTopic.title}：${selectedTags[0]}必知的5个趋势`,
            `深度解析：${randomTopic.title}如何影响${selectedTags[0]}`,
            `2024年${randomTopic.title}风口下的${selectedTags[0]}机遇`,
            `${selectedTags[0]}视角：${randomTopic.title}的未来展望`,
        ];

        const newContent: GeneratedContent = {
            id: Date.now(),
            title: titles[Math.floor(Math.random() * titles.length)],
            content: `基于您的标签"${selectedTags.join('、')}"和当前热点"${randomTopic.title}"，我们为您生成了专属内容方向。这个话题在${randomTopic.category}领域热度达到${randomTopic.heat}%，非常适合当下创作。建议从行业趋势、实际应用、未来发展三个维度展开内容创作。`,
            category: randomTopic.category,
            heat: randomTopic.heat,
            tags: [...selectedTags],
            timestamp: new Date().toLocaleString('zh-CN'),
        };

        setGeneratedContent(newContent);
        setGenerationHistory((prev) => [newContent, ...prev]);
    };

    const fetchPlatformData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/all-data');
            const result = await response.json();
            
            const platforms: PlatformInfo[] = Object.entries(result.data).map(([name, data]: [string, any]) => ({
                name,
                count: data.length,
                data: data
            }));
            
            setPlatformData(platforms);
        } catch (error) {
            console.error('获取平台数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPlatformData = () => {
        if (selectedPlatform) {
            return platformData.find(p => p.name === selectedPlatform)?.data || [];
        }
        return [];
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim() || isChatLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            content: chatInput.trim(),
            isUser: true,
            timestamp: new Date().toLocaleString('zh-CN')
        };

        setChatMessages(prev => [...prev, userMessage]);
        const currentInput = chatInput.trim();
        setChatInput('');
        setIsChatLoading(true);

        try {
            // 调用真实的AI API
            const response = await fetch('http://localhost:5002/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput,
                    selectedTags: selectedTags,
                    hotTopics: hotTopics
                })
            });

            const result = await response.json();
            
            if (result.success) {
                const aiMessage: ChatMessage = {
                    id: Date.now() + 1,
                    content: result.response,
                    isUser: false,
                    timestamp: new Date().toLocaleString('zh-CN')
                };
                setChatMessages(prev => [...prev, aiMessage]);
            } else {
                // 如果API调用失败，显示错误消息
                const errorMessage: ChatMessage = {
                    id: Date.now() + 1,
                    content: `抱歉，AI服务暂时不可用。错误信息：${result.error || '未知错误'}`,
                    isUser: false,
                    timestamp: new Date().toLocaleString('zh-CN')
                };
                setChatMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            // 网络错误处理
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                content: `网络连接错误，请检查网络连接或稍后重试。`,
                isUser: false,
                timestamp: new Date().toLocaleString('zh-CN')
            };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleChatKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-[#fffefb] via-[#f5f4f1] to-[#d4eaf7] text-[#1d1c1c]"
            style={{
                '--primary-100': '#d4eaf7',
                '--primary-200': '#b6ccd8',
                '--primary-300': '#3b3c3d',
                '--accent-100': '#71c4ef',
                '--accent-200': '#00668c',
                '--text-100': '#1d1c1c',
                '--text-200': '#313d44',
                '--bg-100': '#fffefb',
                '--bg-200': '#f5f4f1',
                '--bg-300': '#cccbc8',
            } as React.CSSProperties}
        >
            {/* 导航栏 */}
            <nav className="p-6 backdrop-blur-sm bg-[#f5f4f1]/80 border-b border-[#cccbc8]/50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#00668c] to-[#71c4ef] bg-clip-text text-transparent">
                        AI创作助手
                    </div>
                    <div className="flex space-x-6">
                        <button
                            onClick={() => setCurrentView('home')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'home' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                        >
                            主页
                        </button>
                        <button
                            onClick={() => setCurrentView('profile')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'profile' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                        >
                            用户画像
                        </button>
                        <button
                            onClick={() => setCurrentView('analysis')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'analysis' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                        >
                            AI分析
                        </button>
                        <button
                            onClick={() => {
                                setCurrentView('data');
                                if (platformData.length === 0) {
                                    fetchPlatformData();
                                }
                            }}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'data' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                        >
                            数据源
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                {/* 主页 - 热点展示 */}
                {currentView === 'home' && (
                    <div className="space-y-8">
                        <div className="text-center py-12">
                            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                                全部热点展示
                            </h1>
                            <p className="text-xl text-[#313d44]">发现当下最热门的创作话题</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {hotTopics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-6 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/50 transition-all hover:scale-105"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-sm font-medium text-white">
                                            {topic.category}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                            <span className="text-sm text-[#313d44]">
                                                {topic.heat}%
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#1d1c1c]">
                                        {topic.title}
                                    </h3>
                                    <div className="w-full bg-[#cccbc8] rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-[#71c4ef] to-[#00668c] h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${topic.heat}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 用户画像构建 */}
                {currentView === 'profile' && (
                    <div className="space-y-8">
                        <div className="text-center py-12">
                            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                                用户画像构建
                            </h1>
                            <p className="text-xl text-[#313d44]">选择标签，构建专属创作画像</p>
                        </div>

                        <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-8 border border-[#cccbc8]/30">
                            <div className="mb-6">
                                <label className="block text-lg font-medium mb-3 text-[#1d1c1c]">
                                    输入您的描述
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyPress={handleInputKeyPress}
                                        placeholder="描述您的兴趣、职业或创作方向..."
                                        className="flex-1 px-4 py-3 bg-[#fffefb] border border-[#cccbc8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71c4ef] text-[#1d1c1c] placeholder-[#313d44]"
                                    />

                                    <button
                                        onClick={addCustomTag}
                                        disabled={
                                            !userInput.trim() ||
                                            selectedTags.includes(userInput.trim())
                                        }
                                        className={`px-6 py-3 rounded-lg transition-all font-medium ${
                                            userInput.trim() &&
                                            !selectedTags.includes(userInput.trim())
                                                ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] hover:from-[#00668c] hover:to-[#3b3c3d] text-white transform hover:scale-105'
                                                : 'bg-[#cccbc8]/50 text-[#313d44]/50 cursor-not-allowed'
                                        }`}
                                    >
                                        确定
                                    </button>
                                </div>
                                {userInput.trim() && selectedTags.includes(userInput.trim()) && (
                                    <p className="text-sm text-[#71c4ef] mt-2">⚠️ 该标签已存在</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-medium mb-3 text-[#1d1c1c]">
                                    选择标签
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {userTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full border-2 transition-all transform hover:scale-105 ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] border-transparent text-white shadow-lg'
                                                    : 'border-[#cccbc8] hover:border-[#71c4ef] hover:bg-[#d4eaf7]/30 text-[#313d44]'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedTags.length > 0 && (
                                <div className="bg-gradient-to-r from-[#d4eaf7]/50 to-[#b6ccd8]/30 rounded-lg p-4 border border-[#71c4ef]/30">
                                    <h3 className="font-medium mb-2 text-[#1d1c1c]">
                                        已选择的标签：
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="flex items-center gap-1 px-3 py-1 bg-[#fffefb]/80 rounded-full text-sm text-[#313d44] border border-[#cccbc8]/50 group hover:bg-[#d4eaf7]/30 transition-all"
                                            >
                                                <span>{tag}</span>
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 w-4 h-4 rounded-full bg-[#cccbc8]/50 hover:bg-[#71c4ef] text-[#313d44] hover:text-white transition-all flex items-center justify-center text-xs font-bold group-hover:scale-110"
                                                    title="删除标签"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* AI分析 */}
                {currentView === 'analysis' && (
                    <div className="space-y-8">
                        <div className="text-center py-12">
                            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                                AI智能分析
                            </h1>
                            <p className="text-xl text-[#313d44]">基于您的画像生成热点创作内容</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 左侧：内容生成 */}
                            <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-8 border border-[#cccbc8]/30">
                                {selectedTags.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🤖</div>
                                        <p className="text-xl text-[#313d44] mb-4">
                                            请先在用户画像页面选择标签
                                        </p>
                                        <button
                                            onClick={() => setCurrentView('profile')}
                                            className="px-6 py-3 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-lg hover:from-[#00668c] hover:to-[#3b3c3d] transition-all text-white"
                                        >
                                            去选择标签
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold text-[#1d1c1c]">
                                                智能内容生成
                                            </h2>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={generateContent}
                                                    className="px-6 py-3 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-lg hover:from-[#00668c] hover:to-[#3b3c3d] transition-all transform hover:scale-105 text-white"
                                                >
                                                    🚀 生成内容
                                                </button>
                                                {generationHistory.length > 0 && (
                                                    <span className="px-3 py-3 bg-[#d4eaf7]/50 rounded-lg text-sm text-[#313d44] border border-[#cccbc8]/30">
                                                        已生成 {generationHistory.length} 条记录
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {generatedContent && (
                                            <div className="bg-gradient-to-r from-[#d4eaf7]/50 to-[#b6ccd8]/30 rounded-xl p-6 border border-[#71c4ef]/30">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-sm font-medium text-white">
                                                        {generatedContent.category}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                                        <span className="text-sm text-[#313d44]">
                                                            热度 {generatedContent.heat}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold mb-3 text-[#00668c]">
                                                    {generatedContent.title}
                                                </h3>
                                                <p className="text-[#313d44] leading-relaxed">
                                                    {generatedContent.content}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30">
                                                <h4 className="font-medium mb-2 text-[#00668c]">
                                                    您的标签
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTags.map((tag) => (
                                                        <div
                                                            key={tag}
                                                            className="flex items-center gap-1 px-2 py-1 bg-[#d4eaf7]/50 rounded text-sm text-[#313d44] group hover:bg-[#b6ccd8]/40 transition-all"
                                                        >
                                                            <span>{tag}</span>
                                                            <button
                                                                onClick={() => removeTag(tag)}
                                                                className="w-3 h-3 rounded-full bg-[#cccbc8]/50 hover:bg-[#71c4ef] text-[#313d44] hover:text-white transition-all flex items-center justify-center text-xs font-bold group-hover:scale-110"
                                                                title="删除标签"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30">
                                                <h4 className="font-medium mb-2 text-[#71c4ef]">
                                                    匹配热点
                                                </h4>
                                                <p className="text-sm text-[#313d44]">
                                                    基于当前热门话题智能匹配
                                                </p>
                                            </div>
                                            <div className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30">
                                                <h4 className="font-medium mb-2 text-[#3b3c3d]">
                                                    创作建议
                                                </h4>
                                                <p className="text-sm text-[#313d44]">
                                                    个性化内容创作方向推荐
                                                </p>
                                            </div>
                                        </div>

                                        {/* 生成历史记录 */}
                                        {generationHistory.length > 0 && (
                                            <div className="mt-8">
                                                <h3 className="text-xl font-bold mb-4 text-[#00668c]">
                                                    📝 生成历史记录
                                                </h3>
                                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                                    {generationHistory.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/30 transition-all"
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="px-2 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-xs font-medium text-white">
                                                                    {item.category}
                                                                </span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs text-[#313d44]">
                                                                        {item.timestamp}
                                                                    </span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <div className="w-1.5 h-1.5 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                                                        <span className="text-xs text-[#313d44]">
                                                                            {item.heat}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <h4 className="font-medium mb-2 text-[#00668c] text-sm">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-xs text-[#313d44] mb-2 line-clamp-2">
                                                                {item.content}
                                                            </p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {item.tags.map((tag: string) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="px-2 py-0.5 bg-[#d4eaf7]/50 rounded text-xs text-[#313d44] border border-[#cccbc8]/30"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 右侧：AI对话 */}
                            <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-8 border border-[#cccbc8]/30">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-[#1d1c1c]">
                                        💬 AI助手对话
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                        <span className="text-sm text-[#313d44]">在线</span>
                                    </div>
                                </div>

                                {/* 聊天消息区域 */}
                                <div className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30 h-96 overflow-y-auto mb-4">
                                    <div className="space-y-4">
                                        {chatMessages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-lg p-3 ${
                                                        message.isUser
                                                            ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] text-white'
                                                            : 'bg-[#d4eaf7]/50 text-[#313d44] border border-[#cccbc8]/30'
                                                    }`}
                                                >
                                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                        {message.content}
                                                    </div>
                                                    <div className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-[#313d44]/60'}`}>
                                                        {message.timestamp}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isChatLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-[#d4eaf7]/50 rounded-lg p-3 border border-[#cccbc8]/30">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex space-x-1">
                                                            <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-bounce"></div>
                                                            <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                            <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                        </div>
                                                        <span className="text-sm text-[#313d44]">AI正在思考...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 输入区域 */}
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={handleChatKeyPress}
                                        placeholder="输入您的问题或需求..."
                                        disabled={isChatLoading}
                                        className="flex-1 px-4 py-3 bg-[#fffefb] border border-[#cccbc8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71c4ef] text-[#1d1c1c] placeholder-[#313d44] disabled:opacity-50"
                                    />
                                    <button
                                        onClick={sendChatMessage}
                                        disabled={!chatInput.trim() || isChatLoading}
                                        className={`px-6 py-3 rounded-lg transition-all font-medium ${
                                            chatInput.trim() && !isChatLoading
                                                ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] hover:from-[#00668c] hover:to-[#3b3c3d] text-white transform hover:scale-105'
                                                : 'bg-[#cccbc8]/50 text-[#313d44]/50 cursor-not-allowed'
                                        }`}
                                    >
                                        发送
                                    </button>
                                </div>

                                {/* 快捷问题 */}
                                <div className="mt-4">
                                    <p className="text-sm text-[#313d44] mb-2">💡 快捷问题：</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            '如何选择热点话题？',
                                            '内容创作技巧',
                                            '提高阅读量',
                                            '用户画像分析'
                                        ].map((question) => (
                                            <button
                                                key={question}
                                                onClick={() => setChatInput(question)}
                                                className="px-3 py-1 bg-[#d4eaf7]/50 hover:bg-[#b6ccd8]/40 rounded-full text-xs text-[#313d44] border border-[#cccbc8]/30 transition-all"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 数据源页面 */}
                {currentView === 'data' && (
                    <div className="space-y-8">
                        <div className="text-center py-12">
                            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                                数据源管理
                            </h1>
                            <p className="text-xl text-[#313d44]">实时热点数据，多平台信息汇总</p>
                            <button
                                onClick={async () => {
                                    setUpdating(true);
                                    try {
                                        const res = await fetch('http://localhost:5001/api/update-data', { method: 'POST' });
                                        const result = await res.json();
                                        if (result.success) {
                                            // 刷新平台数据
                                            const platforms = Object.entries(result.data).map(([name, data]: [string, any]) => ({
                                                name,
                                                count: data.length,
                                                data: data
                                            }));
                                            setPlatformData(platforms);
                                            setSelectedPlatform('');
                                        } else {
                                            alert('更新失败：' + (result.error || '未知错误'));
                                        }
                                    } catch (e) {
                                        alert('更新失败：' + e);
                                    } finally {
                                        setUpdating(false);
                                    }
                                }}
                                disabled={updating || loading}
                                className={`mt-6 px-8 py-3 rounded-lg font-bold transition-all text-lg shadow-md ${
                                    updating || loading
                                        ? 'bg-[#cccbc8]/50 text-[#313d44]/50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] text-white hover:from-[#00668c] hover:to-[#3b3c3d] transform hover:scale-105'
                                }`}
                            >
                                {updating ? '正在更新...' : '更新数据'}
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#71c4ef]"></div>
                                <p className="mt-4 text-[#313d44]">正在加载数据...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* 平台选择（可折叠） */}
                                <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-6 border border-[#cccbc8]/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-[#1d1c1c]">选择平台</h2>
                                        <button
                                            onClick={() => setPlatformCollapse((v) => !v)}
                                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#71c4ef] to-[#00668c] text-white hover:from-[#00668c] hover:to-[#3b3c3d] transition-all text-sm font-medium"
                                        >
                                            {platformCollapse ? '展开平台列表' : '折叠平台列表'}
                                        </button>
                                    </div>
                                    {!platformCollapse && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {platformData.map((platform) => (
                                                <button
                                                    key={platform.name}
                                                    onClick={() => setSelectedPlatform(platform.name)}
                                                    className={`p-3 rounded-lg border-2 transition-all transform hover:scale-105 ${
                                                        selectedPlatform === platform.name
                                                            ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] border-transparent text-white shadow-lg'
                                                            : 'border-[#cccbc8] hover:border-[#71c4ef] hover:bg-[#d4eaf7]/30 text-[#313d44]'
                                                    }`}
                                                >
                                                    <div className="text-sm font-medium">{platform.name}</div>
                                                    <div className="text-xs opacity-80">{platform.count} 条</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 数据展示 */}
                                {selectedPlatform && (
                                    <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-6 border border-[#cccbc8]/30">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-[#1d1c1c]">
                                                {selectedPlatform} - 热点数据
                                            </h2>
                                            <span className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-sm font-medium text-white">
                                                {getPlatformData().length} 条记录
                                            </span>
                                        </div>

                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {getPlatformData().map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/30 transition-all"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-medium text-[#00668c] text-sm line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                        <div className="flex items-center space-x-2 ml-4">
                                                            {item.hotcount && (
                                                                <span className="px-2 py-1 bg-[#d4eaf7]/50 rounded text-xs text-[#313d44] border border-[#cccbc8]/30">
                                                                    热度: {item.hotcount}
                                                                </span>
                                                            )}
                                                            <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-center text-xs text-[#313d44]">
                                                        <span>平台: {item.platform}</span>
                                                        {item.rectime && (
                                                            <span>时间: {item.rectime}</span>
                                                        )}
                                                    </div>
                                                    
                                                    {item.link && (
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-[#71c4ef] hover:text-[#00668c] transition-colors mt-2 inline-block"
                                                        >
                                                            查看原文 →
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 数据统计 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30">
                                        <h4 className="font-medium mb-2 text-[#00668c]">总平台数</h4>
                                        <div className="text-3xl font-bold text-[#71c4ef]">
                                            {platformData.length}
                                        </div>
                                        <p className="text-sm text-[#313d44] mt-2">覆盖多个热门平台</p>
                                    </div>
                                    <div className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30">
                                        <h4 className="font-medium mb-2 text-[#71c4ef]">总记录数</h4>
                                        <div className="text-3xl font-bold text-[#00668c]">
                                            {platformData.reduce((sum, p) => sum + p.count, 0)}
                                        </div>
                                        <p className="text-sm text-[#313d44] mt-2">实时热点数据</p>
                                    </div>
                                    <div className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30">
                                        <h4 className="font-medium mb-2 text-[#3b3c3d]">数据更新</h4>
                                        <div className="text-3xl font-bold text-[#71c4ef]">
                                            实时
                                        </div>
                                        <p className="text-sm text-[#313d44] mt-2">持续监控热点</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
