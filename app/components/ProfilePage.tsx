import React from 'react';

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

interface ProfilePageProps {
    userInput: string;
    setUserInput: (v: string) => void;
    userTags: string[];
    selectedTags: string[]; // 支持多选标签
    toggleTag: (tag: string) => void;
    addCustomTag: () => void;
    handleInputKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    removeTag: (tag: string) => void;
    generatedContent: GeneratedContent | null;
    currentGeneratedPlans: GeneratedContent[]; // 当前生成的所有方案
    selectedPlanIndex: number; // 当前选中的方案索引
    setSelectedPlanIndex: (index: number) => void; // 设置选中方案的函数
    generationHistory: GeneratedContent[];
    generateContent: () => void;
    hotTopics: HotTopic[];
    userDescription: string;
    setUserDescription: (v: string) => void;
    loading?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
    userInput,
    setUserInput,
    userTags,
    selectedTags,
    toggleTag,
    addCustomTag,
    handleInputKeyPress,
    removeTag,
    currentGeneratedPlans,
    selectedPlanIndex,
    setSelectedPlanIndex,
    generationHistory,
    generateContent,
    userDescription,
    setUserDescription,
    loading = false
}) => {
    // 多选逻辑：支持选择多个标签
    return (
        <div className="space-y-8">
            <div className="text-center py-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                    用户画像构建
                </h1>
                <p className="text-xl text-[#313d44]">选择标签，构建专属创作画像并生成内容</p>
            </div>
            <div className="space-y-8">
                {/* 上方：标签选择 */}
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
                                onKeyDown={(e) => e.key === 'Enter' && handleInputKeyPress(e as any)}
                                placeholder="描述您的兴趣、职业或创作方向..."
                                className="flex-1 px-4 py-3 bg-[#fffefb] border border-[#cccbc8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71c4ef] text-[#1d1c1c] placeholder-[#313d44] text-base"
                            />
                            <button
                                onClick={addCustomTag}
                                disabled={!userInput.trim() || selectedTags.includes(userInput.trim())}
                                className={`px-6 py-3 rounded-lg transition-all font-medium text-base ${userInput.trim() && !selectedTags.includes(userInput.trim())
                                    ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] hover:from-[#00668c] hover:to-[#3b3c3d] text-white transform hover:scale-105'
                                    : 'bg-[#cccbc8]/50 text-[#313d44]/50 cursor-not-allowed'
                                    }`}
                            >
                                确定
                            </button>
                        </div>
                        {userInput.trim() && selectedTags.includes(userInput.trim()) && (
                            <p className="text-base text-[#71c4ef] mt-2">⚠️ 该标签已存在</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-lg font-medium mb-3 text-[#1d1c1c]">
                            选择标签（可多选）
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {userTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-2 rounded-full border-2 transition-all transform hover:scale-105 text-base ${selectedTags.includes(tag)
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
                            <h3 className="font-medium mb-2 text-[#1d1c1c]">已选择的标签：</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="flex items-center gap-1 px-3 py-1 bg-[#fffefb]/80 rounded-full text-base text-[#313d44] border border-[#cccbc8]/50 group hover:bg-[#d4eaf7]/30 transition-all"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 w-5 h-5 rounded-full bg-[#cccbc8]/50 hover:bg-[#71c4ef] text-[#313d44] hover:text-white transition-all flex items-center justify-center text-sm font-bold group-hover:scale-110"
                                            title="删除标签"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 用户描述输入框 */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium mb-3 text-[#1d1c1c]">
                            用户描述
                        </label>
                        <textarea
                            value={userDescription}
                            onChange={(e) => setUserDescription(e.target.value)}
                            placeholder="请描述您的兴趣爱好、专业领域、创作方向等，这将帮助生成更符合您需求的内容创作方案..."
                            className="w-full px-4 py-3 bg-[#fffefb] border border-[#cccbc8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71c4ef] text-[#1d1c1c] placeholder-[#313d44] text-base resize-none"
                            rows={4}
                        />
                    </div>
                </div>
                {/* 下方：智能内容生成 */}
                <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-8 border border-[#cccbc8]/30">
                    {selectedTags.length === 0 && !userDescription.trim() ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🤖</div>
                            <p className="text-xl text-[#313d44] mb-4">请选择标签或填写用户描述以生成专属内容创作方案</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-[#1d1c1c]">智能内容生成</h2>
                                <div className="flex gap-3">
                                    <button
                                        onClick={generateContent}
                                        disabled={loading}
                                        className={`px-6 py-3 rounded-lg transition-all transform text-white text-base ${loading
                                            ? 'bg-[#cccbc8]/50 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] hover:from-[#00668c] hover:to-[#3b3c3d] hover:scale-105'
                                            }`}
                                    >
                                        {loading ? '🔄 生成中...' : '🚀 生成创作方案'}
                                    </button>
                                    {generationHistory.length > 0 && (
                                        <span className="px-3 py-3 bg-[#d4eaf7]/50 rounded-lg text-base text-[#313d44] border border-[#cccbc8]/30">
                                            已生成 {generationHistory.length} 条记录
                                        </span>
                                    )}
                                </div>
                            </div>
                            {currentGeneratedPlans.length > 0 && (
                                <div className="space-y-6">
                                    {/* 方案切换导航 */}
                                    {currentGeneratedPlans.length > 1 && (
                                        <div className="flex justify-center">
                                            <div className="bg-white/50 rounded-lg p-2 flex gap-2">
                                                {currentGeneratedPlans.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedPlanIndex(index)}
                                                        className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${selectedPlanIndex === index
                                                            ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] text-white shadow-lg'
                                                            : 'hover:bg-white/70 text-[#313d44]'
                                                            }`}
                                                    >
                                                        方案 {index + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 当前选中的方案内容 */}
                                    <div className="bg-gradient-to-r from-[#d4eaf7]/50 to-[#b6ccd8]/30 rounded-xl p-8 border border-[#71c4ef]/30">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="px-4 py-2 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-lg font-medium text-white">
                                                    {currentGeneratedPlans[selectedPlanIndex].category}
                                                </span>
                                                {currentGeneratedPlans[selectedPlanIndex].innovation_level && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm text-white">
                                                        创新度 {currentGeneratedPlans[selectedPlanIndex].innovation_level}/10
                                                    </span>
                                                )}
                                                {currentGeneratedPlans[selectedPlanIndex].content_type && (
                                                    <span className="px-3 py-1 bg-[#3b3c3d] rounded-full text-sm text-white">
                                                        {currentGeneratedPlans[selectedPlanIndex].content_type}
                                                    </span>
                                                )}
                                                {currentGeneratedPlans.length > 1 && (
                                                    <span className="px-3 py-1 bg-orange-500 rounded-full text-sm text-white">
                                                        {selectedPlanIndex + 1}/{currentGeneratedPlans.length}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                                <span className="text-lg text-[#313d44] font-medium">热度 {currentGeneratedPlans[selectedPlanIndex].heat}%</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-6 text-[#00668c]">{currentGeneratedPlans[selectedPlanIndex].title}</h3>

                                        {/* 核心创意理念 */}
                                        {currentGeneratedPlans[selectedPlanIndex].core_idea && (
                                            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                                                <h4 className="font-bold text-yellow-800 mb-2">💡 核心创意理念</h4>
                                                <p className="text-yellow-700 text-lg font-medium">{currentGeneratedPlans[selectedPlanIndex].core_idea}</p>
                                            </div>
                                        )}

                                        {/* 详细内容描述 */}
                                        {currentGeneratedPlans[selectedPlanIndex].content_description ? (
                                            <div className="mb-6">
                                                <h4 className="font-bold text-[#00668c] mb-3">📝 创意详述</h4>
                                                <div className="bg-white/50 p-4 rounded-lg">
                                                    <p className="text-[#313d44] leading-relaxed text-base whitespace-pre-line">{currentGeneratedPlans[selectedPlanIndex].content_description}</p>
                                                </div>
                                            </div>
                                        ) : currentGeneratedPlans[selectedPlanIndex].outline && currentGeneratedPlans[selectedPlanIndex].outline!.length > 0 ? (
                                            <div className="mb-6">
                                                <h4 className="font-bold text-[#00668c] mb-3">📋 内容大纲</h4>
                                                <div className="space-y-2">
                                                    {currentGeneratedPlans[selectedPlanIndex].outline!.map((item, index) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                                                            <span className="flex-shrink-0 w-6 h-6 bg-[#71c4ef] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                                {index + 1}
                                                            </span>
                                                            <span className="text-[#313d44]">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                <div className="bg-white/50 p-4 rounded-lg">
                                                    <p className="text-[#313d44] leading-relaxed text-base whitespace-pre-line">{currentGeneratedPlans[selectedPlanIndex].content}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* 创意亮点展示 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            {currentGeneratedPlans[selectedPlanIndex].why_viral && (
                                                <div className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-lg">
                                                    <h4 className="font-bold text-red-800 mb-2">🔥 病毒传播分析</h4>
                                                    <p className="text-red-700 text-sm">{currentGeneratedPlans[selectedPlanIndex].why_viral}</p>
                                                </div>
                                            )}

                                            {currentGeneratedPlans[selectedPlanIndex].unique_value && (
                                                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
                                                    <h4 className="font-bold text-blue-800 mb-2">⭐ 独特价值</h4>
                                                    <p className="text-blue-700 text-sm">{currentGeneratedPlans[selectedPlanIndex].unique_value}</p>
                                                </div>
                                            )}

                                            {/* 保留旧格式兼容 */}
                                            {currentGeneratedPlans[selectedPlanIndex].interaction && (
                                                <div className="bg-green-100 p-4 rounded-lg">
                                                    <h4 className="font-bold text-green-800 mb-2">🎪 互动设计</h4>
                                                    <p className="text-green-700 text-sm">{currentGeneratedPlans[selectedPlanIndex].interaction}</p>
                                                </div>
                                            )}

                                            {currentGeneratedPlans[selectedPlanIndex].viral_trigger && (
                                                <div className="bg-purple-100 p-4 rounded-lg">
                                                    <h4 className="font-bold text-purple-800 mb-2">🚀 传播触发点</h4>
                                                    <p className="text-purple-700 text-sm">{currentGeneratedPlans[selectedPlanIndex].viral_trigger}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* 创意钩子（如果存在） */}
                                        {currentGeneratedPlans[selectedPlanIndex].hook && (
                                            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                                                <h4 className="font-bold text-yellow-800 mb-2">🎯 创意钩子</h4>
                                                <p className="text-yellow-700">{currentGeneratedPlans[selectedPlanIndex].hook}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30">
                                            <h4 className="font-medium mb-2 text-[#00668c]">您的标签</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTags.map((tag) => (
                                                    <div
                                                        key={tag}
                                                        className="flex items-center gap-1 px-2 py-1 bg-[#d4eaf7]/50 rounded text-base text-[#313d44] group hover:bg-[#b6ccd8]/40 transition-all"
                                                    >
                                                        <span>{tag}</span>
                                                        <button
                                                            onClick={() => removeTag(tag)}
                                                            className="w-4 h-4 rounded-full bg-[#cccbc8]/50 hover:bg-[#71c4ef] text-[#313d44] hover:text-white transition-all flex items-center justify-center text-sm font-bold group-hover:scale-110"
                                                            title="删除标签"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30">
                                            <h4 className="font-medium mb-2 text-[#71c4ef]">匹配热点</h4>
                                            <p className="text-base text-[#313d44]">基于当前热门话题智能匹配</p>
                                        </div>
                                        <div className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30">
                                            <h4 className="font-medium mb-2 text-[#3b3c3d]">创作建议</h4>
                                            <p className="text-base text-[#313d44]">个性化内容创作方向推荐</p>
                                        </div>
                                    </div>
                                    
                                    {/* 生成历史记录 */}
                                    {generationHistory.length > 0 && (
                                        <div className="mt-10">
                                            <h3 className="text-2xl font-bold mb-6 text-[#00668c]">📝 生成历史记录</h3>
                                            <div className="space-y-6 max-h-96 overflow-y-auto">
                                                {generationHistory.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-[#fffefb]/80 rounded-lg p-6 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/30 transition-all"
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-base font-medium text-white">
                                                                {item.category}
                                                            </span>
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-base text-[#313d44]">{item.timestamp}</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                                                    <span className="text-base text-[#313d44] font-medium">{item.heat}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h4 className="font-bold mb-3 text-[#00668c] text-lg">{item.title}</h4>
                                                        <p className="text-base text-[#313d44] mb-3 leading-relaxed whitespace-pre-line">{item.content}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.tags.map((tag: string) => (
                                                                <span
                                                                    key={tag}
                                                                    className="px-3 py-1 bg-[#d4eaf7]/50 rounded-full text-base text-[#313d44] border border-[#cccbc8]/30"
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 