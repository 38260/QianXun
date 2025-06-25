'use client';

import { useState } from 'react';

export default function Page() {
    const [userInput, setUserInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentView, setCurrentView] = useState('home');
    const [generatedContent, setGeneratedContent] = useState(null);

    const hotTopics = [
        { id: 1, title: 'AI技术革命', heat: 95, category: '科技' },
        { id: 2, title: '元宇宙发展', heat: 88, category: '科技' },
        { id: 3, title: '可持续发展', heat: 92, category: '环保' },
        { id: 4, title: '数字货币', heat: 85, category: '金融' },
        { id: 5, title: '远程办公', heat: 78, category: '职场' },
        { id: 6, title: '健康生活', heat: 90, category: '生活' },
        { id: 7, title: '新能源汽车', heat: 87, category: '汽车' },
        { id: 8, title: '在线教育', heat: 82, category: '教育' },
    ];

    const userTags = [
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

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
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

        setGeneratedContent({
            title: titles[Math.floor(Math.random() * titles.length)],
            content: `基于您的标签"${selectedTags.join('、')}"和当前热点"${randomTopic.title}"，我们为您生成了专属内容方向。这个话题在${randomTopic.category}领域热度达到${randomTopic.heat}%，非常适合当下创作。建议从行业趋势、实际应用、未来发展三个维度展开内容创作。`,
            category: randomTopic.category,
            heat: randomTopic.heat,
        });
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white"
            data-oid="p.1xrf0"
        >
            {/* 导航栏 */}
            <nav
                className="p-6 backdrop-blur-sm bg-white/10 border-b border-white/20"
                data-oid="eqew-7p"
            >
                <div
                    className="max-w-7xl mx-auto flex justify-between items-center"
                    data-oid="3aih0k:"
                >
                    <div
                        className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                        data-oid="mm6d9_u"
                    >
                        AI创作助手
                    </div>
                    <div className="flex space-x-6" data-oid="hg:p8w0">
                        <button
                            onClick={() => setCurrentView('home')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'home' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            data-oid="v2yn9sn"
                        >
                            主页
                        </button>
                        <button
                            onClick={() => setCurrentView('profile')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            data-oid="t2dm9w2"
                        >
                            用户画像
                        </button>
                        <button
                            onClick={() => setCurrentView('analysis')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'analysis' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            data-oid="db_327u"
                        >
                            AI分析
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6" data-oid=".x1_siu">
                {/* 主页 - 热点展示 */}
                {currentView === 'home' && (
                    <div className="space-y-8" data-oid="s:9hfo5">
                        <div className="text-center py-12" data-oid=":bd:9-q">
                            <h1
                                className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                data-oid="ml.je.8"
                            >
                                全部热点展示
                            </h1>
                            <p className="text-xl text-gray-300" data-oid="wa2byw7">
                                发现当下最热门的创作话题
                            </p>
                        </div>

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            data-oid="2ceq:l6"
                        >
                            {hotTopics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                                    data-oid="2s2z3ig"
                                >
                                    <div
                                        className="flex justify-between items-start mb-4"
                                        data-oid="w1guc7l"
                                    >
                                        <span
                                            className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-sm font-medium"
                                            data-oid="-ptfr9i"
                                        >
                                            {topic.category}
                                        </span>
                                        <div
                                            className="flex items-center space-x-1"
                                            data-oid="91zdql2"
                                        >
                                            <div
                                                className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                                data-oid="uvtjh0p"
                                            ></div>
                                            <span
                                                className="text-sm text-gray-300"
                                                data-oid="wng099r"
                                            >
                                                {topic.heat}%
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2" data-oid=".r30jeo">
                                        {topic.title}
                                    </h3>
                                    <div
                                        className="w-full bg-gray-700 rounded-full h-2"
                                        data-oid="0fw1bqf"
                                    >
                                        <div
                                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${topic.heat}%` }}
                                            data-oid="vy:ma_k"
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 用户画像构建 */}
                {currentView === 'profile' && (
                    <div className="space-y-8" data-oid="0j9my.v">
                        <div className="text-center py-12" data-oid="xg1mwee">
                            <h1
                                className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                data-oid="plpziv_"
                            >
                                用户画像构建
                            </h1>
                            <p className="text-xl text-gray-300" data-oid="rtmce8o">
                                选择标签，构建专属创作画像
                            </p>
                        </div>

                        <div
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
                            data-oid="t0m2l6s"
                        >
                            <div className="mb-6" data-oid="m4bihee">
                                <label
                                    className="block text-lg font-medium mb-3"
                                    data-oid="3zrmad8"
                                >
                                    输入您的描述
                                </label>
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="描述您的兴趣、职业或创作方向..."
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
                                    data-oid="ryo:uf1"
                                />
                            </div>

                            <div className="mb-6" data-oid="4ngi_qi">
                                <label
                                    className="block text-lg font-medium mb-3"
                                    data-oid="lilvan0"
                                >
                                    选择标签
                                </label>
                                <div className="flex flex-wrap gap-3" data-oid="i3hsq0x">
                                    {userTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full border-2 transition-all transform hover:scale-105 ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent text-white shadow-lg'
                                                    : 'border-white/30 hover:border-cyan-400 hover:bg-white/10'
                                            }`}
                                            data-oid="t.i52-."
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedTags.length > 0 && (
                                <div
                                    className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-4 border border-cyan-500/30"
                                    data-oid="0c17-uu"
                                >
                                    <h3 className="font-medium mb-2" data-oid="g:-_oc.">
                                        已选择的标签：
                                    </h3>
                                    <div className="flex flex-wrap gap-2" data-oid="uychu.y">
                                        {selectedTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-white/20 rounded-full text-sm"
                                                data-oid="m83w9nt"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* AI分析 */}
                {currentView === 'analysis' && (
                    <div className="space-y-8" data-oid="lu3c5xk">
                        <div className="text-center py-12" data-oid="ge:dhbk">
                            <h1
                                className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                data-oid="-:g2qqe"
                            >
                                AI智能分析
                            </h1>
                            <p className="text-xl text-gray-300" data-oid="oz3mq3c">
                                基于您的画像生成热点创作内容
                            </p>
                        </div>

                        <div
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
                            data-oid="u:lrmec"
                        >
                            {selectedTags.length === 0 ? (
                                <div className="text-center py-12" data-oid="9um_8o_">
                                    <div className="text-6xl mb-4" data-oid=":ckgawt">
                                        🤖
                                    </div>
                                    <p className="text-xl text-gray-300 mb-4" data-oid="n_ygq41">
                                        请先在用户画像页面选择标签
                                    </p>
                                    <button
                                        onClick={() => setCurrentView('profile')}
                                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                                        data-oid="0sri0rr"
                                    >
                                        去选择标签
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6" data-oid="fpshmqc">
                                    <div
                                        className="flex justify-between items-center"
                                        data-oid="fwjpot3"
                                    >
                                        <h2 className="text-2xl font-bold" data-oid="rr0aj0x">
                                            智能内容生成
                                        </h2>
                                        <button
                                            onClick={generateContent}
                                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105"
                                            data-oid="rt.g2lp"
                                        >
                                            🚀 生成内容
                                        </button>
                                    </div>

                                    {generatedContent && (
                                        <div
                                            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl p-6 border border-cyan-500/30"
                                            data-oid="l2bw9hn"
                                        >
                                            <div
                                                className="flex items-center justify-between mb-4"
                                                data-oid="61.nr:r"
                                            >
                                                <span
                                                    className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-sm font-medium"
                                                    data-oid="yeaucej"
                                                >
                                                    {generatedContent.category}
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="ia.08hb"
                                                >
                                                    <div
                                                        className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                                        data-oid="j9tr871"
                                                    ></div>
                                                    <span className="text-sm" data-oid="aay4c1s">
                                                        热度 {generatedContent.heat}%
                                                    </span>
                                                </div>
                                            </div>
                                            <h3
                                                className="text-xl font-bold mb-3 text-cyan-300"
                                                data-oid="siavefo"
                                            >
                                                {generatedContent.title}
                                            </h3>
                                            <p
                                                className="text-gray-300 leading-relaxed"
                                                data-oid="3o8ax1_"
                                            >
                                                {generatedContent.content}
                                            </p>
                                        </div>
                                    )}

                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        data-oid="7xhokof"
                                    >
                                        <div
                                            className="bg-white/5 rounded-lg p-4 border border-white/10"
                                            data-oid="qhknrj."
                                        >
                                            <h4
                                                className="font-medium mb-2 text-cyan-400"
                                                data-oid="aa2t_kd"
                                            >
                                                您的标签
                                            </h4>
                                            <div
                                                className="flex flex-wrap gap-2"
                                                data-oid="-2hqxb2"
                                            >
                                                {selectedTags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-white/20 rounded text-sm"
                                                        data-oid="3xtr.ws"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div
                                            className="bg-white/5 rounded-lg p-4 border border-white/10"
                                            data-oid="a_szv7b"
                                        >
                                            <h4
                                                className="font-medium mb-2 text-purple-400"
                                                data-oid="56oyzm6"
                                            >
                                                匹配热点
                                            </h4>
                                            <p className="text-sm text-gray-300" data-oid="u-85mjf">
                                                基于当前热门话题智能匹配
                                            </p>
                                        </div>
                                        <div
                                            className="bg-white/5 rounded-lg p-4 border border-white/10"
                                            data-oid="2:tsnqv"
                                        >
                                            <h4
                                                className="font-medium mb-2 text-pink-400"
                                                data-oid="w99bao5"
                                            >
                                                创作建议
                                            </h4>
                                            <p className="text-sm text-gray-300" data-oid="flmofkq">
                                                个性化内容创作方向推荐
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
