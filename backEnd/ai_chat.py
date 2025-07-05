import requests
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)

API_BASE_URL = "https://api.cloudflare.com/client/v4/accounts/0b2e25078e45b2165dc3a09d0a1d56f0/ai/run/"
headers = {"Authorization": "Bearer jfdcfEjA2SOcW3sxOgY0tpnWghrR3aSYlwmpcObI"}

# 全局变量存储训练数据
training_data = []
data_loaded = False

def load_training_data():
    """加载热点数据作为训练数据"""
    global training_data, data_loaded
    
    if data_loaded:
        return training_data
    
    try:
        data_path = os.path.join(os.path.dirname(__file__), 'source', 'hot_news_data.json')
        with open(data_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        
        # 数据预处理和清洗
        processed_data = []
        for item in raw_data:
            if item.get('title') and item.get('platform'):
                # 提取关键信息
                processed_item = {
                    'title': item['title'],
                    'platform': item['platform'],
                    'category': item.get('slist', ''),
                    'hotcount': item.get('hotcount', ''),
                    'time': item.get('rectime', ''),
                    'link': item.get('link', '')
                }
                processed_data.append(processed_item)
        
        training_data = processed_data
        data_loaded = True
        print(f"成功加载 {len(training_data)} 条训练数据")
        return training_data
        
    except Exception as e:
        print(f"加载训练数据失败: {str(e)}")
        return []

def analyze_trends_and_patterns():
    """分析数据趋势和模式"""
    if not training_data:
        return ""
    
    # 平台分布分析
    platform_stats = {}
    category_stats = {}
    
    for item in training_data:
        platform = item['platform']
        category = item['category']
        
        platform_stats[platform] = platform_stats.get(platform, 0) + 1
        if category:
            category_stats[category] = category_stats.get(category, 0) + 1
    
    # 生成分析报告
    analysis = "基于当前热点数据分析：\n\n"
    
    # 平台热度分析
    analysis += "【平台热度分布】\n"
    sorted_platforms = sorted(platform_stats.items(), key=lambda x: x[1], reverse=True)
    for platform, count in sorted_platforms[:5]:
        analysis += f"• {platform}: {count}条热点内容\n"
    
    # 内容分类分析
    analysis += "\n【内容分类热点】\n"
    sorted_categories = sorted(category_stats.items(), key=lambda x: x[1], reverse=True)
    for category, count in sorted_categories[:8]:
        analysis += f"• {category}: {count}条内容\n"
    
    return analysis

def extract_relevant_topics(user_query):
    """从用户查询中提取相关话题"""
    relevant_topics = []
    
    # 关键词匹配
    keywords = {
        '科技': ['科技', '技术', 'AI', '人工智能', '互联网', '数字化'],
        '娱乐': ['娱乐', '明星', '电影', '音乐', '综艺', '游戏'],
        '财经': ['财经', '经济', '股市', '投资', '金融', '商业'],
        '体育': ['体育', '足球', '篮球', '运动', '比赛', '奥运'],
        '社会': ['社会', '民生', '政策', '教育', '医疗', '交通'],
        '国际': ['国际', '外交', '政治', '战争', '贸易', '合作']
    }
    
    for category, words in keywords.items():
        for word in words:
            if word in user_query:
                relevant_topics.append(category)
                break
    
    return list(set(relevant_topics))

def get_relevant_hot_topics(user_query, limit=5):
    """获取与用户查询相关的热点话题"""
    relevant_topics = []
    
    # 提取用户查询中的关键词
    query_keywords = re.findall(r'[\u4e00-\u9fff]+', user_query)
    
    for item in training_data:
        title = item['title']
        # 简单的关键词匹配
        for keyword in query_keywords:
            if keyword in title and len(keyword) > 1:
                relevant_topics.append({
                    'title': title,
                    'platform': item['platform'],
                    'category': item['category'],
                    'hotcount': item['hotcount']
                })
                break
        
        if len(relevant_topics) >= limit:
            break
    
    return relevant_topics

def run_ai_model(model, inputs):
    """调用Cloudflare AI API"""
    try:
        input_data = {"messages": inputs}
        response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input_data)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@app.route('/api/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    try:
        data = request.json
        user_message = data.get('message', '')
        selected_tags = data.get('selectedTags', [])
        hot_topics = data.get('hotTopics', [])
        
        # 确保训练数据已加载
        if not data_loaded:
            load_training_data()
        
        # 获取相关热点话题
        relevant_hot_topics = get_relevant_hot_topics(user_message)
        
        # 构建AI分析师身份的系统提示词
        system_prompt = """你是一位专业的AI数据分析师，专门从事热点话题分析和趋势预测。你的主要职责包括：

1. 基于实时热点数据进行深度分析
2. 识别市场趋势和用户关注点
3. 提供数据驱动的洞察和建议
4. 分析不同平台的内容特点
5. 预测热点话题的发展趋势

请始终用中文回复，保持专业、客观、数据驱动的分析风格。回答要具体、有针对性，结合具体数据进行分析。"""

        # 添加训练数据背景
        if training_data:
            system_prompt += f"\n\n当前数据库包含 {len(training_data)} 条热点数据，涵盖多个平台和分类。"
            
            # 添加趋势分析
            trends_analysis = analyze_trends_and_patterns()
            if trends_analysis:
                system_prompt += f"\n\n{trends_analysis}"
        
        # 如果有用户标签，添加到系统提示中
        if selected_tags:
            system_prompt += f"\n\n用户关注领域：{', '.join(selected_tags)}"
        
        # 如果有相关热点话题，添加到系统提示中
        if relevant_hot_topics:
            hot_topics_text = "\n".join([
                f"• {topic['title']} ({topic['platform']} - {topic['category']})" 
                for topic in relevant_hot_topics[:3]
            ])
            system_prompt += f"\n\n相关热点话题：\n{hot_topics_text}"
        
        # 如果有前端传来的热点话题，也添加进去
        if hot_topics:
            frontend_topics = ', '.join([topic['title'] for topic in hot_topics[:3]])
            system_prompt += f"\n\n当前热门话题：{frontend_topics}"

        # 构建消息数组
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]

        # 调用AI API
        result = run_ai_model("@cf/meta/llama-3-8b-instruct", messages)
        
        if "error" in result:
            return jsonify({"success": False, "error": result["error"]})
        
        # 提取AI回复
        if "result" in result and "response" in result["result"]:
            ai_response = result["result"]["response"]
        else:
            ai_response = "抱歉，我现在无法回答您的问题，请稍后再试。"
        
        return jsonify({
            "success": True,
            "response": ai_response,
            "relevantTopics": relevant_hot_topics[:3]  # 返回相关话题供前端显示
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/load-data', methods=['GET'])
def load_data_endpoint():
    """手动触发数据加载的API端点"""
    try:
        data = load_training_data()
        return jsonify({
            "success": True,
            "message": f"成功加载 {len(data)} 条训练数据",
            "dataCount": len(data)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    # 启动时自动加载训练数据
    print("正在加载训练数据...")
    load_training_data()
    print("AI分析师服务启动完成！")
    app.run(debug=True, port=5002) 