import React, { useState } from 'react';

const DemoPage = () => {
    const [activeDemo, setActiveDemo] = useState('realtime');

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00668c] to-[#71c4ef] bg-clip-text text-transparent">
                    项目亮点展示
                </h1>
                <p className="text-xl text-[#313d44]">AI驱动的智能创作助手核心优势</p>
            </div>

            {/* 核心亮点卡片 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-[#d4eaf7] to-[#f5f4f1] p-6 rounded-xl border border-[#cccbc8]/30">
                    <div className="text-3xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold mb-2 text-[#00668c]">实时数据融合</h3>
                    <p className="text-[#313d44]">15分钟更新周期，覆盖10+主流平台，数据新鲜度99.9%</p>
                    <div className="mt-4 text-sm text-[#71c4ef]">
                        • 微博热搜 • 抖音热榜 • 知乎热议 • 淘宝热卖
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#f5f4f1] to-[#d4eaf7] p-6 rounded-xl border border-[#cccbc8]/30">
                    <div className="text-3xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold mb-2 text-[#00668c]">本地AI分析</h3>
                    <p className="text-[#313d44]">Ollama本地部署，隐私安全，响应速度小于200ms</p>
                    <div className="mt-4 text-sm text-[#71c4ef]">
                        • 零API费用 • 数据不出本地 • 24/7可用
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#d4eaf7] to-[#f5f4f1] p-6 rounded-xl border border-[#cccbc8]/30">
                    <div className="text-3xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-2 text-[#00668c]">智能个性化</h3>
                    <p className="text-[#313d44]">基于用户画像，生成专属内容方向，提升创作效率300%</p>
                    <div className="mt-4 text-sm text-[#71c4ef]">
                        • 标签匹配 • 热度预测 • 趋势分析
                    </div>
                </div>
            </div>

            {/* 数据对比展示 */}
            <div className="bg-[#f5f4f1]/80 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#00668c]">vs 传统创作方式</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#313d44]">传统方式</h3>
                        <ul className="space-y-2 text-[#313d44]">
                            <li>❌ 手动搜集热点：2-3小时</li>
                            <li>❌ 分析趋势：1-2小时</li>
                            <li>❌ 选题决策：30分钟</li>
                            <li>❌ 数据滞后：6-12小时</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#00668c]">AI创作助手</h3>
                        <ul className="space-y-2 text-[#00668c]">
                            <li>✅ 自动数据采集：实时更新</li>
                            <li>✅ AI智能分析：1分钟</li>
                            <li>✅ 个性化推荐：秒级响应</li>
                            <li>✅ 数据实时性：15分钟</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 互动演示区 */}
            <div className="bg-[#fffefb] rounded-xl p-8 border border-[#cccbc8]/30 mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#00668c]">功能演示</h2>

                {/* 演示选项卡 */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#f5f4f1] rounded-lg p-1 flex space-x-1">
                        <button
                            onClick={() => setActiveDemo('realtime')}
                            className={`px-4 py-2 rounded-md transition-all ${activeDemo === 'realtime'
                                ? 'bg-[#71c4ef] text-white shadow-md'
                                : 'text-[#313d44] hover:bg-[#d4eaf7]/50'
                                }`}
                        >
                            实时数据
                        </button>
                        <button
                            onClick={() => setActiveDemo('ai')}
                            className={`px-4 py-2 rounded-md transition-all ${activeDemo === 'ai'
                                ? 'bg-[#71c4ef] text-white shadow-md'
                                : 'text-[#313d44] hover:bg-[#d4eaf7]/50'
                                }`}
                        >
                            AI分析
                        </button>
                        <button
                            onClick={() => setActiveDemo('personalize')}
                            className={`px-4 py-2 rounded-md transition-all ${activeDemo === 'personalize'
                                ? 'bg-[#71c4ef] text-white shadow-md'
                                : 'text-[#313d44] hover:bg-[#d4eaf7]/50'
                                }`}
                        >
                            个性化推荐
                        </button>
                    </div>
                </div>

                {/* 演示内容 */}
                {activeDemo === 'realtime' && (
                    <div className="bg-[#f5f4f1]/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[#00668c]">实时热点数据流</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border-l-4 border-red-400">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">微博热搜</span>
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">实时</span>
                                </div>
                                <p className="font-semibold text-gray-800">#AI创作助手#</p>
                                <p className="text-sm text-gray-500 mt-1">热度: 1,234,567</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">抖音热榜</span>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">2分钟前</span>
                                </div>
                                <p className="font-semibold text-gray-800">智能内容创作</p>
                                <p className="text-sm text-gray-500 mt-1">播放: 890万</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">知乎热议</span>
                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">5分钟前</span>
                                </div>
                                <p className="font-semibold text-gray-800">如何提升创作效率</p>
                                <p className="text-sm text-gray-500 mt-1">关注: 45,678</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeDemo === 'ai' && (
                    <div className="bg-[#f5f4f1]/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[#00668c]">AI智能分析示例</h3>
                        <div className="bg-white rounded-lg p-4 border border-[#cccbc8]/30">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    AI
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800 mb-2">
                                        <strong>热点分析：</strong>"AI创作助手"话题分析
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                                        <p className="mb-2">📊 <strong>热度趋势：</strong>上升37%，预计持续3-5天</p>
                                        <p className="mb-2">🎯 <strong>目标受众：</strong>内容创作者、自媒体运营、营销人员</p>
                                        <p className="mb-2">💡 <strong>创作建议：</strong>结合实际案例，突出效率提升和成本节约</p>
                                        <p>🔥 <strong>最佳发布时间：</strong>今日19:00-21:00，预期互动率+45%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeDemo === 'personalize' && (
                    <div className="bg-[#f5f4f1]/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[#00668c]">个性化内容推荐</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-3 text-[#313d44]">用户画像：书影圈 + 热点分析师</h4>
                                <div className="space-y-3">
                                    <div className="bg-white rounded-lg p-3 border border-[#cccbc8]/30">
                                        <h5 className="font-semibold text-[#00668c] mb-1">推荐选题1</h5>
                                        <p className="text-sm text-gray-600">《热门电影背后的AI技术解析》</p>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <span className="text-xs bg-[#d4eaf7] text-[#00668c] px-2 py-1 rounded">匹配度: 95%</span>
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">热度: 高</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-[#cccbc8]/30">
                                        <h5 className="font-semibold text-[#00668c] mb-1">推荐选题2</h5>
                                        <p className="text-sm text-gray-600">《2025年影视行业数据分析报告》</p>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <span className="text-xs bg-[#d4eaf7] text-[#00668c] px-2 py-1 rounded">匹配度: 88%</span>
                                            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">热度: 中</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-3 text-[#313d44]">内容优化建议</h4>
                                <div className="bg-white rounded-lg p-4 border border-[#cccbc8]/30">
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-[#71c4ef] rounded-full"></span>
                                            <span>标题建议加入"独家解析"等吸引词</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-[#71c4ef] rounded-full"></span>
                                            <span>配图建议使用电影海报+数据图表</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-[#71c4ef] rounded-full"></span>
                                            <span>发布平台：知乎、微信公众号优先</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-[#71c4ef] rounded-full"></span>
                                            <span>预期阅读量：8,000-12,000</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 技术架构图 */}
            <div className="bg-[#fffefb] rounded-xl p-8 border border-[#cccbc8]/30 mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#00668c]">技术架构优势</h2>
                <div className="flex justify-center items-center space-x-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#71c4ef] to-[#00668c] rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                            爬虫
                        </div>
                        <p className="text-sm text-[#313d44]">多平台数据采集</p>
                        <p className="text-xs text-[#71c4ef] mt-1">Python + 异步处理</p>
                    </div>
                    <div className="text-2xl text-[#71c4ef]">→</div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#00668c] to-[#3b3c3d] rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                            AI
                        </div>
                        <p className="text-sm text-[#313d44]">本地智能分析</p>
                        <p className="text-xs text-[#71c4ef] mt-1">Ollama + 自然语言处理</p>
                    </div>
                    <div className="text-2xl text-[#71c4ef]">→</div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#3b3c3d] to-[#71c4ef] rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                            UI
                        </div>
                        <p className="text-sm text-[#313d44]">现代化界面</p>
                        <p className="text-xs text-[#71c4ef] mt-1">Next.js + TailwindCSS</p>
                    </div>
                </div>
            </div>

            {/* ROI计算器 */}
            <div className="bg-gradient-to-br from-[#d4eaf7] to-[#f5f4f1] rounded-xl p-8 border border-[#cccbc8]/30">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#00668c]">投资回报率计算</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/80 rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-[#00668c] mb-2">5小时</div>
                        <p className="text-[#313d44] mb-1">每日节省时间</p>
                        <p className="text-xs text-[#71c4ef]">选题+分析+决策</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-[#71c4ef] mb-2">300%</div>
                        <p className="text-[#313d44] mb-1">创作效率提升</p>
                        <p className="text-xs text-[#71c4ef]">基于用户反馈统计</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-[#00668c] mb-2">￥0</div>
                        <p className="text-[#313d44] mb-1">AI API费用</p>
                        <p className="text-xs text-[#71c4ef]">本地部署，无额外成本</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoPage;