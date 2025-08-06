from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import subprocess
import datetime
import re

app = Flask(__name__)
CORS(app)

def load_platform_data():
    """加载平台数据"""
    try:
        file_path = os.path.join('source', 'platform_data.json')
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"加载数据时出错: {e}")
        return {}

def get_today_excel_filename():
    now = datetime.datetime.now()
    fname = f"hotNews{now.strftime('%m%d')}.xlsx"
    return os.path.join('source', fname)

def run_python_file(filename):
    try:
        result = subprocess.run(['python', filename], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return e.output + '\n' + e.stderr

@app.route('/api/platforms', methods=['GET'])
def get_platforms():
    """获取所有平台列表"""
    data = load_platform_data()
    platforms = list(data.keys())
    return jsonify({
        'platforms': platforms,
        'total_platforms': len(platforms)
    })

@app.route('/api/platform/<platform_name>', methods=['GET'])
def get_platform_data(platform_name):
    """获取指定平台的数据"""
    data = load_platform_data()
    if platform_name in data:
        return jsonify({
            'platform': platform_name,
            'data': data[platform_name],
            'count': len(data[platform_name])
        })
    else:
        return jsonify({'error': 'Platform not found'}), 404

@app.route('/api/all-data', methods=['GET'])
def get_all_data():
    """获取所有数据"""
    data = load_platform_data()
    return jsonify({
        'data': data,
        'total_platforms': len(data),
        'total_records': sum(len(records) for records in data.values())
    })

@app.route('/api/latest-json/<platform>', methods=['GET'])
def get_latest_json(platform):
    """返回result目录下指定平台最新的json文件内容"""
    result_dir = os.path.join(os.path.dirname(__file__), '../result')
    files = [f for f in os.listdir(result_dir) if f.endswith('.json') and platform in f]
    if not files:
        return jsonify({'error': 'No data found for this platform'}), 404
    # 假设文件名格式为 hotNews_20250706_174908.json，按时间戳排序
    def extract_timestamp(filename):
        match = re.search(r'(\d{8}_\d{6})', filename)
        return match.group(1) if match else ''
    files.sort(key=lambda x: extract_timestamp(x), reverse=True)
    latest_file = files[0]
    with open(os.path.join(result_dir, latest_file), 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify({
        'filename': latest_file,
        'platform': platform,
        'data': data,
        'count': len(data) if isinstance(data, list) else 0
    })

@app.route('/api/latest-hotnews', methods=['GET'])
def get_latest_hotnews():
    """返回result目录下最新的热点新闻json文件内容，按平台分组，内容为title和hotcount"""
    result_dir = os.path.join(os.path.dirname(__file__), '../result')
    files = [f for f in os.listdir(result_dir) if f.endswith('.json') and f.startswith('hotNews')]
    if not files:
        return jsonify({'error': 'No hotNews data found'}), 404
    def extract_timestamp(filename):
        match = re.search(r'(\d{8}_\d{6})', filename)
        return match.group(1) if match else ''
    files.sort(key=lambda x: extract_timestamp(x), reverse=True)
    latest_file = files[0]
    with open(os.path.join(result_dir, latest_file), 'r', encoding='utf-8') as f:
        data = json.load(f)
    # 只保留title和hotcount，按platform分组
    result = {}
    for platform, items in data.items():
        result[platform] = [
            {
                'title': item.get('title', ''),
                'hotcount': item.get('hotcount', 0)
            } for item in items
        ]
    return jsonify({
        'filename': latest_file,
        'data': result
    })

# 分析通过上面获取的数据，使用ollama本地大模型分析获取当下10大热门主题，不仅仅是主题词
@app.route('/api/analysis', methods=['POST'])
def analysis():
    """分析数据，生成分析报告"""
    import time
    data = request.get_json()
    # 新增：如果传入的是文件路径，自动读取内容
    if isinstance(data, dict) and 'content' in data and isinstance(data['content'], str) and data['content'].endswith('.json'):
        file_path = data['content']
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"[analysis] loaded data from file: {file_path}")
        except Exception as e:
            print(f"[analysis] failed to load file {file_path}: {e}")
            return jsonify({'success': False, 'error': f'无法读取文件: {e}'}), 400

    # 1. 组织 prompt
    items = []
    if isinstance(data, dict):
        # 支持多平台数据
        for platform, records in data.items():
            for item in records:
                title = item.get('title', '') if isinstance(item, dict) else str(item)
                desc = ''
                if isinstance(item, dict):
                    desc = item.get('desc', '') or item.get('summary', '')
                items.append(f"【{platform}】{title} {desc}")
    elif isinstance(data, list):
        for item in data:
            title = item.get('title', '') if isinstance(item, dict) else str(item)
            desc = ''
            if isinstance(item, dict):
                desc = item.get('desc', '') or item.get('summary', '')
            items.append(f"{title} {desc}")
    else:
        print('Invalid data format:', data)
        return jsonify({'success': False, 'error': 'Invalid data format'}), 400

    content = '\n'.join(items)
    prompt = (
        #"你是一位资深科技领域的自媒体博主。"
        "你是一位资深的社会热点分析专家。"
        "请根据以下内容，提炼出当前10个最受关注的社会热点主题，每个热点用一个词+一句话简要说明。"
        "请以如下JSON格式输出："
        "[{\"topic\": \"热点主题\", \"summary\": \"一句话说明\"}, ...]\n"
        "内容如下：\n"
        + content
        +"请根据以上内容，提炼出当前10个最受关注的社会热点主题，每个主题用一个词+一句话简要说明。\n"

    )
    #print("[analysis] prompt:\n", prompt)

    # 2. 调用ollama本地大模型，记录推理耗时
    start_time = time.time()
    try:
        result = subprocess.run(
            ['ollama', 'run', 'qwen2.5:3b'],
            input=prompt,
            capture_output=True, text=True, timeout=120, encoding='utf-8'
        )
        output = result.stdout.strip()
        elapsed = time.time() - start_time
        print(f"[analysis] ollama output:\n{output}")
        print(f"[analysis] inference_time: {elapsed:.2f}s")
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"[analysis] ollama error: {e}")
        print(f"[analysis] inference_time: {elapsed:.2f}s")
        return jsonify({'success': False, 'error': f'调用ollama失败: {e}', 'inference_time': elapsed}), 500

    # 3. 尝试解析JSON
    topics = []
    try:
        # 提取JSON部分
        match = re.search(r'(\[.*\])', output, re.DOTALL)
        if match:
            topics = json.loads(match.group(1))
        else:
            topics = []
    except Exception as e:
        print(f"[analysis] JSON parse error: {e}")
        topics = []

    # 新增：如果 topics 为空且 output 存在，尝试解析形如“1. 博彩新闻：xxxx”格式
    if not topics and output:
        lines = [line.strip() for line in output.split('\n') if line.strip()]
        for line in lines:
            # 支持多种分隔符，包括括号
            # 首先尝试匹配 **主题**: 描述 格式
            m = re.match(r'\d+\.\s*\*\*([^*]+)\*\*\s*[:：]\s*(.+)', line)
            if not m:
                # 尝试匹配普通的 主题: 描述 格式
                m = re.match(r'\d+\.\s*([^：:—\-\(（]+)[：:]\s*(.+)', line)
            if not m:
                # 尝试匹配括号格式
                m = re.match(r'\d+\.\s*([^(（]+)[(（](.+)[)）]', line)
            if m:
                topic_name = m.group(1).strip()
                summary = m.group(2).strip()
                # 移除可能的额外符号
                topic_name = re.sub(r'[*]+', '', topic_name).strip()
                topics.append({"topic": topic_name, "summary": summary})

    print(f"[analysis] topics: {topics}")
    return jsonify({'success': True, 'topics': topics, 'raw': output, 'inference_time': elapsed})

if __name__ == '__main__':
    # 启动 Flask 服务
    app.run(host='0.0.0.0', port=5001, debug=True) 