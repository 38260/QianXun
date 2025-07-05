from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import subprocess
import datetime

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

@app.route('/api/update-data', methods=['POST'])
def update_data():
    """运行main.py和read_excel.py，自动读取最新hotNews+当前月日的xlsx文件"""
    try:
        # 1. 运行main.py（假设会生成最新的hotNews*.xlsx文件）
        main_out = run_python_file('main.py')
        # 2. 运行read_excel.py（会自动读取最新hotNews*.xlsx并生成json）
        read_out = run_python_file('read_excel.py')
        # 3. 读取最新平台数据
        file_path = os.path.join('source', 'platform_data.json')
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify({
            'success': True,
            'main_output': main_out,
            'read_output': read_out,
            'data': data,
            'total_platforms': len(data),
            'total_records': sum(len(records) for records in data.values())
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) 