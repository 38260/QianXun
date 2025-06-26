'use client';

import { useState } from 'react';

export default function Page() {
    const [userInput, setUserInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentView, setCurrentView] = useState('home');
    const [generatedContent, setGeneratedContent] = useState(null);
    const [generationHistory, setGenerationHistory] = useState([]);

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

    const addCustomTag = () => {
        if (userInput.trim() && !selectedTags.includes(userInput.trim())) {
            setSelectedTags((prev) => [...prev, userInput.trim()]);
            setUserInput('');
        }
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            addCustomTag();
        }
    };

    const removeTag = (tagToRemove) => {
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

        const newContent = {
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
            }}
            data-oid="cq5nln5"
        >
            {/* 导航栏 */}
            <nav
                className="p-6 backdrop-blur-sm bg-[#f5f4f1]/80 border-b border-[#cccbc8]/50"
                data-oid="9a-cyek"
            >
                <div
                    className="max-w-7xl mx-auto flex justify-between items-center"
                    data-oid="xa-da.3"
                >
                    <div
                        className="text-2xl font-bold bg-gradient-to-r from-[#00668c] to-[#71c4ef] bg-clip-text text-transparent"
                        data-oid=".05saii"
                    >
                        AI创作助手
                    </div>
                    <div className="flex space-x-6" data-oid="yl45gpw">
                        <button
                            onClick={() => setCurrentView('home')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'home' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                            data-oid="rbe0_:-"
                        >
                            主页
                        </button>
                        <button
                            onClick={() => setCurrentView('profile')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'profile' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                            data-oid="n42opms"
                        >
                            用户画像
                        </button>
                        <button
                            onClick={() => setCurrentView('analysis')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'analysis' ? 'bg-[#d4eaf7] text-[#00668c]' : 'hover:bg-[#cccbc8]/30 text-[#313d44]'}`}
                            data-oid="oqs8j3r"
                        >
                            AI分析
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6" data-oid="9utecii">
                {/* 主页 - 热点展示 */}
                {currentView === 'home' && (
                    <div className="space-y-8" data-oid="ttiz2d5">
                        <div className="text-center py-12" data-oid="k-9r9df">
                            <h1
                                className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent"
                                data-oid="exgp2i5"
                            >
                                全部热点展示
                            </h1>
                            <p className="text-xl text-[#313d44]" data-oid="5f0nqd8">
                                发现当下最热门的创作话题
                            </p>
                        </div>

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            data-oid="tsrgdpk"
                        >
                            {hotTopics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-6 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/50 transition-all hover:scale-105"
                                    data-oid="7eexo:e"
                                >
                                    <div
                                        className="flex justify-between items-start mb-4"
                                        data-oid="6logolb"
                                    >
                                        <span
                                            className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-sm font-medium text-white"
                                            data-oid="4s8azp-"
                                        >
                                            {topic.category}
                                        </span>
                                        <div
                                            className="flex items-center space-x-1"
                                            data-oid="cvs_zr8"
                                        >
                                            <div
                                                className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"
                                                data-oid="h2j_4cg"
                                            ></div>
                                            <span
                                                className="text-sm text-[#313d44]"
                                                data-oid="fo7hjj:"
                                            >
                                                {topic.heat}%
                                            </span>
                                        </div>
                                    </div>
                                    <h3
                                        className="text-lg font-semibold mb-2 text-[#1d1c1c]"
                                        data-oid="mj95d6:"
                                    >
                                        {topic.title}
                                    </h3>
                                    <div
                                        className="w-full bg-[#cccbc8] rounded-full h-2"
                                        data-oid="wwbin8."
                                    >
                                        <div
                                            className="bg-gradient-to-r from-[#71c4ef] to-[#00668c] h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${topic.heat}%` }}
                                            data-oid=":e3c7b2"
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 用户画像构建 */}
                {currentView === 'profile' && (
                    <div className="space-y-8" data-oid="johfc45">
                        <div className="text-center py-12" data-oid=".hqw:qt">
                            <h1
                                className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent"
                                data-oid="0fpc13v"
                            >
                                用户画像构建
                            </h1>
                            <p className="text-xl text-[#313d44]" data-oid="k0m.wgj">
                                选择标签，构建专属创作画像
                            </p>
                        </div>

                        <div
                            className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-8 border border-[#cccbc8]/30"
                            data-oid="bkbibc_"
                        >
                            <div className="mb-6" data-oid="ec7vj3h">
                                <label
                                    className="block text-lg font-medium mb-3 text-[#1d1c1c]"
                                    data-oid="5:6ezu3"
                                >
                                    输入您的描述
                                </label>
                                <div className="flex gap-3" data-oid="npl1joc">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyPress={handleInputKeyPress}
                                        placeholder="描述您的兴趣、职业或创作方向..."
                                        className="flex-1 px-4 py-3 bg-[#fffefb] border border-[#cccbc8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71c4ef] text-[#1d1c1c] placeholder-[#313d44]"
                                        data-oid="qqn74iy"
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
                                        data-oid=":qm9x:m"
                                    >
                                        确定
                                    </button>
                                </div>
                                {userInput.trim() && selectedTags.includes(userInput.trim()) && (
                                    <p className="text-sm text-[#71c4ef] mt-2" data-oid="2egl.b9">
                                        ⚠️ 该标签已存在
                                    </p>
                                )}
                            </div>

                            <div className="mb-6" data-oid="skj2t_0">
                                <label
                                    className="block text-lg font-medium mb-3 text-[#1d1c1c]"
                                    data-oid="qtvv-fs"
                                >
                                    选择标签
                                </label>
                                <div className="flex flex-wrap gap-3" data-oid="p58jo:t">
                                    {userTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full border-2 transition-all transform hover:scale-105 ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] border-transparent text-white shadow-lg'
                                                    : 'border-[#cccbc8] hover:border-[#71c4ef] hover:bg-[#d4eaf7]/30 text-[#313d44]'
                                            }`}
                                            data-oid="i_fwd:2"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedTags.length > 0 && (
                                <div
                                    className="bg-gradient-to-r from-[#d4eaf7]/50 to-[#b6ccd8]/30 rounded-lg p-4 border border-[#71c4ef]/30"
                                    data-oid="8ayltz."
                                >
                                    <h3
                                        className="font-medium mb-2 text-[#1d1c1c]"
                                        data-oid="h.y6_ma"
                                    >
                                        已选择的标签：
                                    </h3>
                                    <div className="flex flex-wrap gap-2" data-oid=":exgf83">
                                        {selectedTags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="flex items-center gap-1 px-3 py-1 bg-[#fffefb]/80 rounded-full text-sm text-[#313d44] border border-[#cccbc8]/50 group hover:bg-[#d4eaf7]/30 transition-all"
                                                data-oid="4nqko.x"
                                            >
                                                <span data-oid="3qrj.7a">{tag}</span>
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 w-4 h-4 rounded-full bg-[#cccbc8]/50 hover:bg-[#71c4ef] text-[#313d44] hover:text-white transition-all flex items-center justify-center text-xs font-bold group-hover:scale-110"
                                                    title="删除标签"
                                                    data-oid="px-6jw8"
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
                    <div className="space-y-8" data-oid="mtoz7-n">
                        <div className="text-center py-12" data-oid="m:we.8g">
                            <h1
                                className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent"
                                data-oid="2ydqb:m"
                            >
                                AI智能分析
                            </h1>
                            <p className="text-xl text-[#313d44]" data-oid="34s-3x3">
                                基于您的画像生成热点创作内容
                            </p>
                        </div>

                        <div
                            className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-8 border border-[#cccbc8]/30"
                            data-oid="x17kus4"
                        >
                            {selectedTags.length === 0 ? (
                                <div className="text-center py-12" data-oid="k4g-4:v">
                                    <div className="text-6xl mb-4" data-oid="y2yw6ns">
                                        🤖
                                    </div>
                                    <p className="text-xl text-[#313d44] mb-4" data-oid="--2.r:3">
                                        请先在用户画像页面选择标签
                                    </p>
                                    <button
                                        onClick={() => setCurrentView('profile')}
                                        className="px-6 py-3 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-lg hover:from-[#00668c] hover:to-[#3b3c3d] transition-all text-white"
                                        data-oid="mgcod76"
                                    >
                                        去选择标签
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6" data-oid=":.mejw_">
                                    <div
                                        className="flex justify-between items-center"
                                        data-oid="-gtk45u"
                                    >
                                        <h2
                                            className="text-2xl font-bold text-[#1d1c1c]"
                                            data-oid="1-g-vt-"
                                        >
                                            智能内容生成
                                        </h2>
                                        <div className="flex gap-3" data-oid="aai4l9g">
                                            <button
                                                onClick={generateContent}
                                                className="px-6 py-3 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-lg hover:from-[#00668c] hover:to-[#3b3c3d] transition-all transform hover:scale-105 text-white"
                                                data-oid="qjxu.n3"
                                            >
                                                🚀 生成内容
                                            </button>
                                            {generationHistory.length > 0 && (
                                                <span
                                                    className="px-3 py-3 bg-[#d4eaf7]/50 rounded-lg text-sm text-[#313d44] border border-[#cccbc8]/30"
                                                    data-oid="e0fiqow"
                                                >
                                                    已生成 {generationHistory.length} 条记录
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {generatedContent && (
                                        <div
                                            className="bg-gradient-to-r from-[#d4eaf7]/50 to-[#b6ccd8]/30 rounded-xl p-6 border border-[#71c4ef]/30"
                                            data-oid="a.xozai"
                                        >
                                            <div
                                                className="flex items-center justify-between mb-4"
                                                data-oid="pwu57wt"
                                            >
                                                <span
                                                    className="px-3 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-sm font-medium text-white"
                                                    data-oid="sd.z36v"
                                                >
                                                    {generatedContent.category}
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="qtux7l_"
                                                >
                                                    <div
                                                        className="w-2 h-2 bg-[#71c4ef] rounded-full animate-pulse"
                                                        data-oid="8fs744s"
                                                    ></div>
                                                    <span
                                                        className="text-sm text-[#313d44]"
                                                        data-oid="fv_bg:y"
                                                    >
                                                        热度 {generatedContent.heat}%
                                                    </span>
                                                </div>
                                            </div>
                                            <h3
                                                className="text-xl font-bold mb-3 text-[#00668c]"
                                                data-oid="u0f5khk"
                                            >
                                                {generatedContent.title}
                                            </h3>
                                            <p
                                                className="text-[#313d44] leading-relaxed"
                                                data-oid="gog6_:2"
                                            >
                                                {generatedContent.content}
                                            </p>
                                        </div>
                                    )}

                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        data-oid="u_6pksi"
                                    >
                                        <div
                                            className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30"
                                            data-oid="al8yx72"
                                        >
                                            <h4
                                                className="font-medium mb-2 text-[#00668c]"
                                                data-oid="ubpys91"
                                            >
                                                您的标签
                                            </h4>
                                            <div
                                                className="flex flex-wrap gap-2"
                                                data-oid="8nskzcd"
                                            >
                                                {selectedTags.map((tag) => (
                                                    <div
                                                        key={tag}
                                                        className="flex items-center gap-1 px-2 py-1 bg-[#d4eaf7]/50 rounded text-sm text-[#313d44] group hover:bg-[#b6ccd8]/40 transition-all"
                                                        data-oid="pr2r7t0"
                                                    >
                                                        <span data-oid="r8842b-">{tag}</span>
                                                        <button
                                                            onClick={() => removeTag(tag)}
                                                            className="w-3 h-3 rounded-full bg-[#cccbc8]/50 hover:bg-[#71c4ef] text-[#313d44] hover:text-white transition-all flex items-center justify-center text-xs font-bold group-hover:scale-110"
                                                            title="删除标签"
                                                            data-oid="8ahrz6n"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div
                                            className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30"
                                            data-oid="y5pu146"
                                        >
                                            <h4
                                                className="font-medium mb-2 text-[#71c4ef]"
                                                data-oid="27c82i:"
                                            >
                                                匹配热点
                                            </h4>
                                            <p
                                                className="text-sm text-[#313d44]"
                                                data-oid="z.yg83d"
                                            >
                                                基于当前热门话题智能匹配
                                            </p>
                                        </div>
                                        <div
                                            className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30"
                                            data-oid="x1::70f"
                                        >
                                            <h4
                                                className="font-medium mb-2 text-[#3b3c3d]"
                                                data-oid="68s_qs-"
                                            >
                                                创作建议
                                            </h4>
                                            <p
                                                className="text-sm text-[#313d44]"
                                                data-oid="iftzmuf"
                                            >
                                                个性化内容创作方向推荐
                                            </p>
                                        </div>
                                    </div>

                                    {/* 生成历史记录 */}
                                    {generationHistory.length > 0 && (
                                        <div className="mt-8" data-oid="6es45ae">
                                            <h3
                                                className="text-xl font-bold mb-4 text-[#00668c]"
                                                data-oid=":0as8z4"
                                            >
                                                📝 生成历史记录
                                            </h3>
                                            <div
                                                className="space-y-4 max-h-96 overflow-y-auto"
                                                data-oid="gul7qz1"
                                            >
                                                {generationHistory.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-[#fffefb]/80 rounded-lg p-4 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/30 transition-all"
                                                        data-oid="9vc_pjm"
                                                    >
                                                        <div
                                                            className="flex items-center justify-between mb-2"
                                                            data-oid="b.zo7da"
                                                        >
                                                            <span
                                                                className="px-2 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-xs font-medium text-white"
                                                                data-oid="hn3uml0"
                                                            >
                                                                {item.category}
                                                            </span>
                                                            <div
                                                                className="flex items-center space-x-2"
                                                                data-oid="6bypocw"
                                                            >
                                                                <span
                                                                    className="text-xs text-[#313d44]"
                                                                    data-oid="acoe9x3"
                                                                >
                                                                    {item.timestamp}
                                                                </span>
                                                                <div
                                                                    className="flex items-center space-x-1"
                                                                    data-oid="92op3jd"
                                                                >
                                                                    <div
                                                                        className="w-1.5 h-1.5 bg-[#71c4ef] rounded-full animate-pulse"
                                                                        data-oid="i5n5oq4"
                                                                    ></div>
                                                                    <span
                                                                        className="text-xs text-[#313d44]"
                                                                        data-oid="1hz-jls"
                                                                    >
                                                                        {item.heat}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h4
                                                            className="font-medium mb-2 text-[#00668c] text-sm"
                                                            data-oid="21rvldq"
                                                        >
                                                            {item.title}
                                                        </h4>
                                                        <p
                                                            className="text-xs text-[#313d44] mb-2 line-clamp-2"
                                                            data-oid="uims2b7"
                                                        >
                                                            {item.content}
                                                        </p>
                                                        <div
                                                            className="flex flex-wrap gap-1"
                                                            data-oid="v49rsw4"
                                                        >
                                                            {item.tags.map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="px-2 py-0.5 bg-[#d4eaf7]/50 rounded text-xs text-[#313d44] border border-[#cccbc8]/30"
                                                                    data-oid="dqw0xl8"
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
                    </div>
                )}
            </div>
        </div>
    );
}
