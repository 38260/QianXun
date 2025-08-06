import React, { useState } from 'react';

// 直接定义必要类型
interface RelatedItem {
    title: string;
    platform: string;
    link: string;
    rectime: string;
}
interface HotTopic {
    keyword: string;
    count: number;
    related_items: RelatedItem[];
}


interface HomePageProps {
    hotTopics: HotTopic[];
    hotTopicsLoading: boolean;
    lastUpdateTime: string;
    fetchHotTopics: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ hotTopics, hotTopicsLoading, lastUpdateTime, fetchHotTopics }) => {
    // 新增分析主题相关 state
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisTopics, setAnalysisTopics] = useState<{ topic: string; summary: string }[]>([]);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    // 分析热点主题
    const handleAnalyzeTopics = async () => {
        setAnalysisLoading(true);
        setAnalysisError(null);
        setAnalysisTopics([]);
        try {
            // 这里假设后端分析用最新的 json 文件，实际可根据需要传参
            const res = await fetch('http://localhost:5001/api/analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: '../result/hotNews0723_145728.json' }) // 路径修正，适配后端
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.topics)) {
                setAnalysisTopics(data.topics);
            } else {
                setAnalysisError('分析失败，未获取到主题数据');
            }
        } catch (e) {
            setAnalysisError('分析请求出错');
        } finally {
            setAnalysisLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center py-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                    全部热点展示
                </h1>
                <p className="text-xl text-[#313d44] mb-6">发现当下最热门的创作话题</p>
                <button
                    onClick={fetchHotTopics}
                    disabled={hotTopicsLoading}
                    className={`px-6 py-3 rounded-lg font-medium transition-all text-lg shadow-md ${
                        hotTopicsLoading
                            ? 'bg-[#cccbc8]/50 text-[#313d44]/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] text-white hover:from-[#00668c] hover:to-[#3b3c3d] transform hover:scale-105'
                    }`}
                >
                    {hotTopicsLoading ? '刷新中...' : '🔄 刷新热点'}
                </button>
            </div>
            <div className="text-center py-2">
                <button
                    onClick={handleAnalyzeTopics}
                    disabled={analysisLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-all text-base shadow-md ml-2 ${
                        analysisLoading
                            ? 'bg-[#cccbc8]/50 text-[#313d44]/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#3b3c3d] to-[#71c4ef] text-white hover:from-[#71c4ef] hover:to-[#00668c] transform hover:scale-105'
                    }`}
                >
                    {analysisLoading ? '分析中...' : '🔥 分析热点主题'}
                </button>
            </div>
            {hotTopicsLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#71c4ef]"></div>
                    <p className="mt-4 text-[#313d44] text-lg">正在加载热点数据...</p>
                </div>
            ) : (
                <>
                    {lastUpdateTime && (
                        <div className="text-center mb-6">
                            <p className="text-[#313d44] text-lg">
                                最后更新时间：{new Date(lastUpdateTime).toLocaleString('zh-CN')}
                            </p>
                        </div>
                    )}
                    {/* 统计信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30">
                            <h4 className="font-medium mb-2 text-[#00668c]">总热点数</h4>
                            <div className="text-3xl font-bold text-[#71c4ef]">
                                {hotTopics.length}
                            </div>
                            <p className="text-base text-[#313d44] mt-2">当前热门话题</p>
                        </div>
                        <div className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30">
                            <h4 className="font-medium mb-2 text-[#71c4ef]">最高热度</h4>
                            <div className="text-3xl font-bold text-[#00668c]">
                                {hotTopics.length > 0 ? Math.max(...hotTopics.map(t => t.count)) : 0}
                            </div>
                            <p className="text-base text-[#313d44] mt-2">提及次数</p>
                        </div>
                        <div className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30">
                            <h4 className="font-medium mb-2 text-[#3b3c3d]">平均热度</h4>
                            <div className="text-3xl font-bold text-[#71c4ef]">
                                {hotTopics.length > 0 ? Math.round(hotTopics.reduce((sum, t) => sum + t.count, 0) / hotTopics.length) : 0}
                            </div>
                            <p className="text-base text-[#313d44] mt-2">平均提及次数</p>
                        </div>
                    </div>
                    {/* 分析结果展示 */}
                    {analysisTopics.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-[#00668c]">十大热点主题</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {analysisTopics.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-6 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/50 transition-all hover:scale-105"
                                    >
                                        <div className="flex items-center mb-2">
                                            <span className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-sm font-medium text-white">
                                                主题 {idx + 1}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-[#1d1c1c]">
                                            {item.topic}
                                        </h3>
                                        <p className="text-sm text-[#313d44]">
                                            {item.summary}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {analysisError && (
                        <div className="text-center text-red-500 mb-4">{analysisError}</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {hotTopics.map((topic, index) => {
                            const heatPercentage = Math.min(100, Math.round((topic.count / 200) * 100));
                            const platform = topic.related_items[0]?.platform || '热门话题';
                            return (
                                <div
                                    key={index}
                                    className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-6 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/50 transition-all hover:scale-105"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-sm font-medium text-white">
                                            {platform}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                            <span className="text-sm text-[#313d44]">
                                                {heatPercentage}%
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#1d1c1c]">
                                        {topic.keyword}
                                    </h3>
                                    <p className="text-sm text-[#313d44] mb-3">
                                        提及次数：{topic.count}
                                    </p>
                                    <div className="w-full bg-[#cccbc8] rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-[#71c4ef] to-[#00668c] h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${heatPercentage}%` }}
                                        ></div>
                                    </div>
                                    {topic.related_items.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-xs text-[#313d44] mb-2">相关话题：</p>
                                            <div className="space-y-1">
                                                {topic.related_items.slice(0, 2).map((item, itemIndex) => (
                                                    <div key={itemIndex} className="text-xs text-[#313d44] truncate">
                                                        • {item.title.substring(0, 30)}...
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage; 