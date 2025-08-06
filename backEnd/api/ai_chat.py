import requests
import json
import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)


# Ollama API配置
OLLAMA_API_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "deepseek-r1:1.5b"

# 全局变量存储训练数据
training_data = []
data_loaded = False

# 对话历史，用于支持多轮对话
conversation_history = []

# 加载训练数据的函数
def load_training_data():
    """从source目录加载训练数据"""
    global training_data, data_loaded
    
    if data_loaded:
        return
    
    source_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'source')
    
    # 加载热门新闻数据
    hot_news_path = os.path.join(source_dir, 'hot_news_data.json')
    if os.path.exists(hot_news_path):
        try:
            with open(hot_news_path, 'r', encoding='utf-8') as f:
                hot_news = json.load(f)
                training_data.extend(hot_news)
                print(f"已加载{len(hot_news)}条热门新闻数据")
        except Exception as e:
            print(f"加载热门新闻数据失败: {e}")
    
    # 加载平台数据
    platform_path = os.path.join(source_dir, 'platform_data.json')
    if os.path.exists(platform_path):
        try:
            with open(platform_path, 'r', encoding='utf-8') as f:
                platform_data = json.load(f)
                # 将平台数据转换为列表格式
                platform_items = []
                for platform, items in platform_data.items():
                    for item in items:
                        platform_items.append(item)
                training_data.extend(platform_items)
                print(f"已加载{len(platform_items)}条平台数据")
        except Exception as e:
            print(f"加载平台数据失败: {e}")
    
    data_loaded = True
    print(f"总共加载了{len(training_data)}条训练数据")
    return training_data

def get_relevant_context(query, max_items=5):
    """
    从训练数据中检索与查询相关的信息
    """
    global training_data, data_loaded
    
    # 如果数据未加载，先加载数据
    if not data_loaded:
        load_training_data()
    
    if not training_data:
        return ""
    
    # 简单的关键词匹配，实际应用中可以使用更复杂的相似度算法
    relevant_items = []
    query_keywords = set(query.lower().split())
    
    for item in training_data:
        title = item.get('title', '').lower()
        # 计算简单的关键词匹配度
        match_count = sum(1 for keyword in query_keywords if keyword in title)
        if match_count > 0:
            relevant_items.append((item, match_count))
    
    # 按匹配度排序并取前N个
    relevant_items.sort(key=lambda x: x[1], reverse=True)
    top_items = relevant_items[:max_items]
    
    # 构建上下文信息
    context = "以下是一些可能相关的信息：\n"
    for item, _ in top_items:
        context += f"- 标题: {item.get('title', '')}\n"
        context += f"  平台: {item.get('platform', '')}\n"
        context += f"  分类: {item.get('slist', '')}\n"
        context += f"  时间: {item.get('rectime', '')}\n\n"
    
    return context

def chat_with_ollama(prompt: str):
    """
    发送用户输入到Ollama API并获取响应。
    """
    global data_loaded
    
    # 确保训练数据已加载
    if not data_loaded:
        load_training_data()
    
    # 获取与用户查询相关的上下文
    context = get_relevant_context(prompt)
    
    # 构建系统消息，包含相关上下文
    system_message = {
        "role": "system", 
        "content": "你是一个智能助手，基于以下信息回答用户的问题。如果提供的信息不足以回答问题，请基于你的知识给出合理回答。" + 
                   (f"\n\n{context}" if context else "")
    }
    
    # 将用户的当前输入添加到对话历史中
    current_messages = [system_message]
    
    # 添加最近的对话历史（最多保留最近5轮对话）
    recent_history = conversation_history[-10:] if len(conversation_history) > 0 else []
    current_messages.extend(recent_history)
    
    # 添加当前用户消息
    current_messages.append({"role": "user", "content": prompt})
    
    # 将用户消息添加到历史记录
    conversation_history.append({"role": "user", "content": prompt})

    # 构建请求体
    payload = {
        "model": OLLAMA_MODEL,
        "messages": current_messages,
        "stream": False  # 关闭流式响应，直接获取完整回复
    }

    try:
        # 发送请求到Ollama API
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()  # 如果请求失败（如404, 500），则抛出异常

        # 解析响应
        result = response.json()
        full_response = result['message']['content']
        
        # 将完整的助手回答添加到历史记录中
        conversation_history.append({"role": "assistant", "content": full_response})
        
        return full_response

    except requests.exceptions.RequestException as e:
        return f"无法连接到Ollama API: {e}"
    except json.JSONDecodeError as e:
        return f"解析JSON响应失败: {e}"
    except Exception as e:
        return f"发生未知错误: {e}"

@app.route('/api/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': '消息不能为空'
            }), 400

        # 调用Ollama API获取回复
        ai_response = chat_with_ollama(user_message)
        
        return jsonify({
            'success': True,
            'response': ai_response,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    """处理流式聊天请求"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': '消息不能为空'
            }), 400

        # 确保训练数据已加载
        if not data_loaded:
            load_training_data()
        
        # 获取与用户查询相关的上下文
        context = get_relevant_context(user_message)
        
        # 构建系统消息，包含相关上下文
        system_message = {
            "role": "system", 
            "content": "你是一个智能助手，基于以下信息回答用户的问题。如果提供的信息不足以回答问题，请基于你的知识给出合理回答。" + 
                       (f"\n\n{context}" if context else "")
        }
        
        # 构建消息列表
        current_messages = [system_message]
        
        # 添加最近的对话历史
        recent_history = conversation_history[-10:] if len(conversation_history) > 0 else []
        current_messages.extend(recent_history)
        
        # 添加当前用户消息
        current_messages.append({"role": "user", "content": user_message})
        
        # 将用户的当前输入添加到对话历史中
        conversation_history.append({"role": "user", "content": user_message})

        # 构建请求体
        payload = {
            "model": OLLAMA_MODEL,
            "messages": current_messages,
            "stream": True  # 开启流式响应
        }

        def generate():
            try:
                # 使用 stream=True 来接收流式响应
                with requests.post(OLLAMA_API_URL, json=payload, stream=True) as response:
                    response.raise_for_status()

                    full_response = ""

                    # 逐行迭代响应内容
                    for line in response.iter_lines():
                        if line:
                            # 解码每一行（它们是JSON字符串）
                            chunk = json.loads(line.decode('utf-8'))
                            
                            # 提取消息内容
                            content = chunk['message']['content']
                            full_response += content

                            # 发送数据块
                            yield f"data: {json.dumps({'content': content, 'done': False})}\n\n"

                            # 检查对话是否结束
                            if chunk.get('done', False):
                                # 将完整的助手回答添加到历史记录中
                                conversation_history.append({"role": "assistant", "content": full_response})
                                yield f"data: {json.dumps({'content': '', 'done': True})}\n\n"
                                break

            except requests.exceptions.RequestException as e:
                yield f"data: {json.dumps({'error': f'无法连接到Ollama API: {e}'})}\n\n"
            except json.JSONDecodeError as e:
                yield f"data: {json.dumps({'error': f'解析JSON响应失败: {e}'})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': f'发生未知错误: {e}'})}\n\n"

        return Response(generate(), mimetype='text/plain')

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/chat/history', methods=['GET'])
def get_chat_history():
    """获取对话历史"""
    return jsonify({
        'success': True,
        'history': conversation_history
    })

@app.route('/api/chat/clear', methods=['POST'])
def clear_chat_history():
    """清空对话历史"""
    global conversation_history
    conversation_history = []
    return jsonify({
        'success': True,
        'message': '对话历史已清空'
    })

if __name__ == '__main__':
    print(f"Ollama 聊天服务启动")
    print(f"模型: {OLLAMA_MODEL}")
    print(f"API地址: {OLLAMA_API_URL}")
    print("-" * 50)
    
    # 预加载训练数据
    print("正在加载训练数据...")
    load_training_data()
    print("-" * 50)
    
    app.run(debug=True, port=5002)

