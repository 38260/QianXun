import pandas as pd
import json
import os
import re
from datetime import datetime
from glob import glob

def find_latest_hotnews_file():
    """找到source文件夹中时间戳最大的hotNews文件"""
    source_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'source')
    pattern = os.path.join(source_dir, 'hotNews*.xlsx')
    files = glob(pattern)
    
    if not files:
        raise FileNotFoundError("未找到hotNews文件")
    
    # 提取时间戳并排序
    file_timestamps = []
    for file in files:
        filename = os.path.basename(file)
        # 提取时间戳，支持不同格式
        timestamp_match = re.search(r'hotNews(\d{4})(?:_(\d{6}))?\.xlsx', filename)
        if timestamp_match:
            date_part = timestamp_match.group(1)
            time_part = timestamp_match.group(2) if timestamp_match.group(2) else "000000"
            timestamp = date_part + time_part
            file_timestamps.append((timestamp, file))
    
    if not file_timestamps:
        raise ValueError("无法解析hotNews文件的时间戳")
    
    # 按时间戳排序，取最新的
    file_timestamps.sort(key=lambda x: x[0], reverse=True)
    latest_file = file_timestamps[0][1]
    
    print(f"选择的数据源文件: {os.path.basename(latest_file)}")
    return latest_file

def count_chinese_chars(text):
    """计算文本中汉字字符的数量"""
    if not isinstance(text, str):
        return 0
    chinese_pattern = re.compile(r'[\u4e00-\u9fff]')
    return len(chinese_pattern.findall(text))

def preprocess_data(df):
    """数据预处理：去除重复和过短内容"""
    print(f"原始数据行数: {len(df)}")
    
    # 获取列名
    columns = df.columns.tolist()
    print(f"数据列名: {columns}")
    
    if len(columns) < 4:
        raise ValueError(f"数据列数不足，需要至少4列，当前只有{len(columns)}列")
    
    # 使用索引访问列
    title_col = columns[0]  # 第一列作为title
    hotcount_col = columns[2]  # 第三列作为hotcount
    platform_col = columns[3]  # 第四列作为platform
    
    print(f"使用列: title={title_col}, hotcount={hotcount_col}, platform={platform_col}")
    
    # 去除第一列内容相同的重复行
    print("去除重复数据...")
    df_dedup = df.drop_duplicates(subset=[title_col], keep='first')
    print(f"去重后数据行数: {len(df_dedup)}")
    
    # 过滤掉汉字字符少于5个的内容
    print("过滤短内容...")
    valid_rows = []
    for index, row in df_dedup.iterrows():
        title = str(row[title_col]) if pd.notna(row[title_col]) else ""
        if count_chinese_chars(title) >= 5:
            valid_rows.append(index)
    
    df_filtered = df_dedup.loc[valid_rows]
    print(f"过滤后数据行数: {len(df_filtered)}")
    
    return df_filtered, title_col, hotcount_col, platform_col

def extract_data(df, title_col, hotcount_col, platform_col):
    """提取指定列的数据并按平台分组"""
    platform_data = {}
    
    for index, row in df.iterrows():
        title = str(row[title_col]) if pd.notna(row[title_col]) else ""
        platform = str(row[platform_col]) if pd.notna(row[platform_col]) else "未知平台"
        hotcount = row[hotcount_col] if pd.notna(row[hotcount_col]) else None
        
        # 处理hotcount：为空时使用默认值3.0
        if hotcount is None or hotcount == "" or pd.isna(hotcount):
            hotcount = 3.0
        else:
            # 确保hotcount是数字类型
            try:
                if isinstance(hotcount, str):
                    # 移除可能的非数字字符
                    hotcount_str = re.sub(r'[^\d.]', '', str(hotcount))
                    hotcount = float(hotcount_str) if hotcount_str else 3.0
                else:
                    hotcount = float(hotcount) if hotcount else 3.0
            except (ValueError, TypeError):
                hotcount = 3.0
        
        # 按平台分组
        if platform not in platform_data:
            platform_data[platform] = []
        
        item = {
            'title': title,
            'hotcount': hotcount
        }
        
        platform_data[platform].append(item)
    
    return platform_data

def save_to_json(data, source_filename):
    """保存数据到result文件夹的同名json文件"""
    # 创建result目录（如果不存在）
    result_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'result')
    os.makedirs(result_dir, exist_ok=True)
    
    # 生成输出文件名（去掉.xlsx扩展名，加上.json）
    base_name = os.path.splitext(os.path.basename(source_filename))[0]
    output_filename = f"{base_name}.json"
    output_path = os.path.join(result_dir, output_filename)
    
    # 保存数据
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"数据已保存到: {output_path}")
    return output_path

def analyze_hot_news():
    """主分析函数"""
    try:
        # 1. 找到最新的hotNews文件
        latest_file = find_latest_hotnews_file()
        
        # 2. 读取Excel文件
        print("读取Excel文件...")
        df = pd.read_excel(latest_file)
        
        # 3. 数据预处理
        df_processed, title_col, hotcount_col, platform_col = preprocess_data(df)
        
        # 4. 提取数据
        print("提取数据...")
        extracted_data = extract_data(df_processed, title_col, hotcount_col, platform_col)
        
        # 5. 保存到JSON文件
        output_path = save_to_json(extracted_data, latest_file)
        
        # 6. 输出统计信息
        total_items = sum(len(items) for items in extracted_data.values())
        print(f"\n=== 分析完成 ===")
        print(f"处理的数据源: {os.path.basename(latest_file)}")
        print(f"最终数据条数: {total_items}")
        print(f"平台数量: {len(extracted_data)}")
        print(f"输出文件: {output_path}")
        
        print(f"\n平台分布:")
        for platform, items in sorted(extracted_data.items()):
            print(f"  {platform}: {len(items)} 条")
        
        return extracted_data
        
    except Exception as e:
        print(f"分析过程中出错: {e}")
        return None

if __name__ == "__main__":
    analyze_hot_news()