import pandas as pd
import json
import os
from datetime import datetime

def read_hot_news_excel():
    """读取hotNews0705.xlsx文件并转换为JSON格式"""
    try:
        # 读取Excel文件
        file_path = os.path.join('source', 'hotNews0705.xlsx')
        df = pd.read_excel(file_path)
        
        # 打印列名以便了解数据结构
        print("Excel文件的列名:", df.columns.tolist())
        print("数据行数:", len(df))
        
        # 转换数据为字典列表
        data = []
        for index, row in df.iterrows():
            # 处理每一行数据，根据实际列名调整
            item = {}
            for col in df.columns:
                # 处理NaN值
                if pd.isna(row[col]):
                    item[col] = None
                else:
                    item[col] = str(row[col]) if isinstance(row[col], (int, float)) else row[col]
            data.append(item)
        
        # 保存为JSON文件
        output_path = os.path.join('source', 'hot_news_data.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"数据已保存到 {output_path}")
        print(f"共处理 {len(data)} 条记录")
        
        return data
        
    except Exception as e:
        print(f"读取Excel文件时出错: {e}")
        return None

def get_platform_data(data):
    """按平台分组数据"""
    if not data:
        return {}
    
    platform_data = {}
    
    # 根据实际数据结构调整字段名
    for item in data:
        # 尝试不同的可能的平台字段名
        platform = None
        if 'platform' in item:
            platform = item['platform']
        elif 'Platform' in item:
            platform = item['Platform']
        elif '平台' in item:
            platform = item['平台']
        elif 'source' in item:
            platform = item['source']
        elif 'Source' in item:
            platform = item['Source']
        elif '来源' in item:
            platform = item['来源']
        
        if platform:
            if platform not in platform_data:
                platform_data[platform] = []
            platform_data[platform].append(item)
    
    return platform_data

if __name__ == "__main__":
    # 读取Excel数据
    data = read_hot_news_excel()
    
    if data:
        # 按平台分组
        platform_data = get_platform_data(data)
        
        # 保存平台分组数据
        platform_output_path = os.path.join('source', 'platform_data.json')
        with open(platform_output_path, 'w', encoding='utf-8') as f:
            json.dump(platform_data, f, ensure_ascii=False, indent=2)
        
        print(f"平台分组数据已保存到 {platform_output_path}")
        print("平台统计:")
        for platform, items in platform_data.items():
            print(f"  {platform}: {len(items)} 条记录") 