'use client';

import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import AnalysisPage from './components/AnalysisPage';
import DataPage from './components/DataPage';
import DemoPage from './components/DemoPage';

// 定义类型接口
interface HotTopic {
    keyword: string;
    count: number;
    related_items: RelatedItem[];
}

interface RelatedItem {
    title: string;
    platform: string;
    link: string;
    rectime: string;
}

interface HotTopicsData {
    timestamp: string;
    total_topics: number;
    hot_topics: HotTopic[];
}

interface GeneratedContent {
    id: number;
    title: string;
    core_idea?: string;
    content_description?: string;
    why_viral?: string;
    unique_value?: string;
    innovation_level?: string;
    // 保留旧字段以兼容
    hook?: string;
    content: string;
    outline?: string[];
    interaction?: string;
    viral_trigger?: string;
    category: string;
    content_type?: string;
    controversy_level?: string;
    emotion_target?: string;
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
    const [currentGeneratedPlans, setCurrentGeneratedPlans] = useState<GeneratedContent[]>([]); // 当前生成的所有方案
    const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0); // 当前选中的方案索引
    const [generationHistory, setGenerationHistory] = useState<GeneratedContent[]>([]);
    const [platformData, setPlatformData] = useState<PlatformInfo[]>([]); // 保持原有结构
    const [loading, setLoading] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    // 折叠平台选择区
    const [platformCollapse, setPlatformCollapse] = useState(false);

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
    // 热点数据状态
    const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
    const [hotTopicsLoading, setHotTopicsLoading] = useState(false);
    const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
    // 用户描述状态
    const [userDescription, setUserDescription] = useState<string>('');

    const userTags: string[] = [
        '抖音',
        'b站',
        
        '书影圈',
        '科技爱好者',
        '热点分析师',
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

    // 获取热点数据
    const fetchHotTopics = async () => {
        setHotTopicsLoading(true);
        try {
            // 获取最新的热点数据文件
            const response = await fetch('/api/hot-topics');
            const data: HotTopicsData = await response.json();
            
            setHotTopics(data.hot_topics);
            setLastUpdateTime(data.timestamp);
        } catch (error) {
            console.error('获取热点数据失败:', error);
        } finally {
            setHotTopicsLoading(false);
        }
    };

    // 组件加载时获取热点数据
    useEffect(() => {
        if (currentView === 'home') {
            fetchHotTopics();
        }
    }, [currentView]);

    const generateContent = async () => {
        if (selectedTags.length === 0 && !userDescription.trim()) {
            alert('请选择标签或填写用户描述');
            return;
        }

        setLoading(true);
        
        try {
            // 调用后端生成API
            const response = await fetch('http://localhost:5003/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tags: selectedTags,
                    description: userDescription
                })
            });

            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
                // 处理所有生成的内容创作方案
                const allGeneratedContent = result.data.map((contentData: any, index: number) => {
                    const newContent: GeneratedContent = {
                        id: Date.now() + index,
                        title: contentData.title || '生成的内容标题',
                        // 新的自由创意字段
                        core_idea: contentData.core_idea,
                        content_description: contentData.content_description,
                        why_viral: contentData.why_viral,
                        unique_value: contentData.unique_value,
                        innovation_level: contentData.innovation_level,
                        // 保留旧字段以兼容
                        hook: contentData.hook,
                        content: contentData.content_description || contentData.content || `内容大纲：\n${(contentData.outline || []).join('\n')}`,
                        outline: contentData.outline,
                        interaction: contentData.interaction,
                        viral_trigger: contentData.viral_trigger,
                        category: contentData.category || '创意内容',
                        content_type: contentData.content_type,
                        controversy_level: contentData.controversy_level,
                        emotion_target: contentData.emotion_target,
                        heat: Math.floor(Math.random() * 30) + 70, // 随机热度70-100
                        tags: [...selectedTags],
                        timestamp: new Date().toLocaleString('zh-CN'),
                    };
                    return newContent;
                });

                // 设置当前生成的所有方案
                setCurrentGeneratedPlans(allGeneratedContent);
                setSelectedPlanIndex(0);
                setGeneratedContent(allGeneratedContent[0]);
                // 只将这次生成的方案添加到历史记录（不重复添加）
                setGenerationHistory((prev) => [...allGeneratedContent, ...prev]);
                
                console.log('生成的完整数据:', result.data);
                console.log('处理后的内容:', allGeneratedContent);
            } else {
                alert(`生成失败: ${result.error || '未知错误'}`);
            }
        } catch (error) {
            console.error('生成内容失败:', error);
            alert('生成失败，请检查后端服务是否启动（端口5003）');
        } finally {
            setLoading(false);
        }
    };

    // 新增：直接读取指定 result 目录下的 json 文件
    const fetchLatestResultData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/latest-hotnews');
            const result = await response.json();
            // result.data: {platform: [{title, hotcount}, ...], ...}
            const platformArr: PlatformInfo[] = Object.keys(result.data).map((name) => ({
                name,
                count: result.data[name].length,
                data: result.data[name].map((item: any) => ({
                    title: item.title,
                    link: '',
                    hotcount: item.hotcount,
                    platform: name,
                    slist: '',
                    rectime: '',
                })),
            }));
            setPlatformData(platformArr);
            if (platformArr.length > 0 && !selectedPlatform) {
                setSelectedPlatform(platformArr[0].name);
            }
        } catch (error) {
            console.error('读取本地数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 组件加载时获取热点数据
    useEffect(() => {
        if (currentView === 'data' && platformData.length === 0) {
            fetchLatestResultData();
        }
    }, [currentView]);

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
            // 调用Ollama AI API
            const response = await fetch('http://localhost:5002/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput
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
                    content: `抱歉，Ollama AI服务暂时不可用。错误信息：${result.error || '未知错误'}`,
                    isUser: false,
                    timestamp: new Date().toLocaleString('zh-CN')
                };
                setChatMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            // 网络错误处理
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                content: `网络连接错误，请检查Ollama服务是否启动（http://localhost:11434）或稍后重试。`,
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
                                    fetchLatestResultData();
                                }
                            }}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'data' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                        >
                            数据源
                        </button>
                        <button
                            onClick={() => setCurrentView('demo')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'demo' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                        >
                            项目亮点
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mx-auto p-6 ${currentView === 'analysis' ? 'max-w-none' : 'max-w-7xl'}`}>
                {/* 主页 - 热点展示 */}
                {currentView === 'home' && (
                    <HomePage
                        hotTopics={hotTopics}
                        hotTopicsLoading={hotTopicsLoading}
                        lastUpdateTime={lastUpdateTime}
                        fetchHotTopics={fetchHotTopics}
                    />
                )}
                {/* 用户画像构建 */}
                {currentView === 'profile' && (
                    <ProfilePage
                        userInput={userInput}
                        setUserInput={setUserInput}
                        userTags={userTags}
                        selectedTags={selectedTags}
                        toggleTag={toggleTag}
                        addCustomTag={addCustomTag}
                        handleInputKeyPress={handleInputKeyPress}
                        removeTag={removeTag}
                        generatedContent={generatedContent}
                        currentGeneratedPlans={currentGeneratedPlans}
                        selectedPlanIndex={selectedPlanIndex}
                        setSelectedPlanIndex={setSelectedPlanIndex}
                        generationHistory={generationHistory}
                        generateContent={generateContent}
                        hotTopics={hotTopics}
                        userDescription={userDescription}
                        setUserDescription={setUserDescription}
                        loading={loading}
                    />
                )}
                {/* AI分析 */}
                {currentView === 'analysis' && (
                    <AnalysisPage
                        chatMessages={chatMessages}
                        chatInput={chatInput}
                        setChatInput={setChatInput}
                        isChatLoading={isChatLoading}
                        sendChatMessage={sendChatMessage}
                        handleChatKeyPress={handleChatKeyPress}
                    />
                )}
                {/* 数据源页面 */}
                {currentView === 'data' && (
                    <DataPage
                        loading={loading}
                        platformData={platformData}
                        platformCollapse={platformCollapse}
                        setPlatformCollapse={setPlatformCollapse}
                        selectedPlatform={selectedPlatform}
                        setSelectedPlatform={setSelectedPlatform}
                        getPlatformData={getPlatformData}
                    />
                )}
                {/* 项目亮点页面 */}
                {currentView === 'demo' && <DemoPage />}
            </div>
        </div>
    );
}
