import React from 'react';

// 直接定义必要类型
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

interface DataPageProps {
    loading: boolean;
    platformData: PlatformInfo[];
    platformCollapse: boolean;
    setPlatformCollapse: (v: boolean) => void;
    selectedPlatform: string;
    setSelectedPlatform: (v: string) => void;
    getPlatformData: () => any[];
}

const DataPage: React.FC<DataPageProps> = ({
    loading,
    platformData,
    platformCollapse,
    setPlatformCollapse,
    selectedPlatform,
    setSelectedPlatform,
    getPlatformData
}) => {
    const platformRecords = getPlatformData();

    return (
        <div className="flex space-x-6 min-h-[600px]">
            {/* 侧边栏：平台选择 - 调整位置更靠左，添加滚动限制 */}
            <aside className="w-56 bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-4 border border-[#cccbc8]/30 flex-shrink-0 self-start mt-4 sticky top-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-[#1d1c1c]">选择平台</h2>
                    <button
                        onClick={() => setPlatformCollapse(!platformCollapse)}
                        className="px-2 py-1 rounded-lg bg-gradient-to-r from-[#71c4ef] to-[#00668c] text-white hover:from-[#00668c] hover:to-[#3b3c3d] transition-all text-xs font-medium"
                    >
                        {platformCollapse ? '展开' : '折叠'}
                    </button>
                </div>
                {!platformCollapse && (
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {platformData.map((platform) => (
                            <button
                                key={platform.name}
                                onClick={() => setSelectedPlatform(platform.name)}
                                className={`flex justify-between items-center p-2 rounded-lg border-2 transition-all hover:scale-105 text-left ${
                                    selectedPlatform === platform.name
                                        ? 'bg-gradient-to-r from-[#71c4ef] to-[#00668c] border-transparent text-white shadow-lg'
                                        : 'border-[#cccbc8] hover:border-[#71c4ef] hover:bg-[#d4eaf7]/30 text-[#313d44]'
                                }`}
                            >
                                <span className="font-medium">{platform.name}</span>
                                <span className="text-xs opacity-80">{platform.count}条</span>
                            </button>
                        ))}
                    </div>
                )}
                {/* 统计信息 */}
                <div className="mt-6 space-y-3">
                    <div className="bg-[#fffefb]/80 rounded-lg p-3 border border-[#cccbc8]/30">
                        <h4 className="font-medium mb-1 text-[#00668c] text-sm">总平台数</h4>
                        <div className="text-xl font-bold text-[#71c4ef]">{platformData.length}</div>
                    </div>
                    <div className="bg-[#fffefb]/80 rounded-lg p-3 border border-[#cccbc8]/30">
                        <h4 className="font-medium mb-1 text-[#71c4ef] text-sm">总记录数</h4>
                        <div className="text-xl font-bold text-[#00668c]">{platformData.reduce((sum, p) => sum + p.count, 0)}</div>
                    </div>
                </div>
            </aside>

            {/* 主内容区：热点数据展示 - 增大显示尺寸 */}
            <main className="flex-1">
                <div className="text-center py-6">
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-[#00668c] via-[#71c4ef] to-[#3b3c3d] bg-clip-text text-transparent">
                        数据源管理
                    </h1>
                    <p className="text-xl text-[#313d44]">实时热点数据，多平台信息汇总</p>
                </div>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#71c4ef]"></div>
                        <p className="mt-4 text-[#313d44] text-lg">正在加载数据...</p>
                    </div>
                ) : (
                    <div className="bg-[#f5f4f1]/80 backdrop-blur-sm rounded-xl p-6 border border-[#cccbc8]/30">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-[#1d1c1c]">
                                {selectedPlatform} - 热点数据
                            </h2>
                            <span className="px-4 py-1 bg-gradient-to-r from-[#71c4ef] to-[#00668c] rounded-full text-lg font-medium text-white">
                                {platformRecords.length} 条记录
                            </span>
                        </div>
                        <div className="space-y-5 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                            {platformRecords.length === 0 ? (
                                <div className="text-center py-8 text-[#313d44]">暂无数据</div>
                            ) : (
                                platformRecords.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#fffefb]/80 rounded-lg p-5 border border-[#cccbc8]/30 hover:bg-[#d4eaf7]/30 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-medium text-[#00668c] text-lg line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center space-x-2 ml-4">
                                                {item.hotcount && (
                                                    <span className="px-3 py-1 bg-[#d4eaf7]/50 rounded text-base text-[#313d44] border border-[#cccbc8]/30">
                                                        热度: {item.hotcount}
                                                    </span>
                                                )}
                                                <div className="w-3 h-3 bg-[#71c4ef] rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-base text-[#313d44]">
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
                                                className="text-base text-[#71c4ef] hover:text-[#00668c] transition-colors mt-3 inline-block"
                                            >
                                                查看原文 →
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DataPage; 