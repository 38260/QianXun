from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import time
import re

app = Flask(__name__)
CORS(app)

def generate_content_ideas(tags, user_description):
    """
    使用 ollama qwen2.5:3b 模型生成内容创作标题和大纲
    """
    # 构建 prompt
    tags_str = "、".join(tags) if tags else "通用"
    
    # 创意突破策略：多维度prompt设计
    creative_angles = [
        "反常规思维：从相反角度切入，挑战传统观念",
        "跨界融合：将不同领域的元素创新结合", 
        "情感共鸣：深挖人性痛点，引发强烈情感反应",
        "未来视角：预测趋势，提前布局前沿话题",
        "争议话题：敢于触碰敏感但合理的讨论点",
        "认知偏差利用：巧妙运用心理学原理",
        "社会现象解构：深度剖析热点背后的真相",
        "身份认同挑战：质疑既定的社会角色"
    ]
    
    # 动态选择创意角度 - 根据用户画像智能匹配
    import random
    
    # 根据标签和描述智能选择创意策略
    def select_creative_strategy(tags_str, user_description):
        strategy_map = {
            "科技": ["未来视角", "认知偏差利用", "跨界融合"],
            "教育": ["反常规思维", "社会现象解构", "身份认同挑战"],
            "娱乐": ["情感共鸣", "争议话题", "跨界融合"],
            "商业": ["未来视角", "社会现象解构", "认知偏差利用"],
            "生活": ["情感共鸣", "身份认同挑战", "反常规思维"]
        }
        
        # 检测关键词匹配策略
        for category, strategies in strategy_map.items():
            if category in tags_str or category in user_description:
                return strategies
        
        # 默认随机选择
        return random.sample(creative_angles, 3)
    
    selected_angles = select_creative_strategy(tags_str, user_description)
    
    prompt = f"""你是一位天才级的创意大师，拥有无限的想象力和颠覆性思维。

【用户画像】
标签：{tags_str}
描述：{user_description}

【创意使命】
忘记所有传统的内容创作规则！我需要你完全释放创意天性，为用户创造3个前所未有的内容创意。

【自由创作指引】
- 不要被任何格式束缚，让创意自由流淌
- 可以是任何形式：视频、文章、互动体验、社会实验、艺术项目...
- 可以融合任何元素：科技、艺术、哲学、心理学、社会学...
- 可以挑战任何常规：思维模式、表达方式、传播路径...

【创意维度】（仅供启发，不必拘泥）
• 认知颠覆：挑战人们的固有认知
• 情感共振：触及内心最深处的情感
• 社会议题：关注时代痛点和机遇
• 未来想象：预见和创造趋势
• 跨界融合：连接看似无关的领域
• 互动创新：重新定义参与方式

【输出格式】
请用JSON格式输出，但内容完全自由发挥：
[
  {{
    "title": "你的创意标题（完全自由发挥）",
    "core_idea": "核心创意理念（用一句话概括你的突破性想法）",
    "content_description": "详细描述这个创意的具体内容和实现方式",
    "why_viral": "为什么这个创意会引爆传播（从人性、心理、社会角度分析）",
    "unique_value": "这个创意的独特价值和突破点",
    "category": "你认为这属于什么类型的创意",
    "innovation_level": "创新程度（1-10，10为前所未有）"
  }}
]

【创作自由】
- 不要模仿任何现有的内容形式
- 不要被"标准答案"限制
- 可以天马行空，但要有逻辑支撑
- 可以争议，但要有价值导向
- 可以实验性，但要有可行性

现在，完全释放你的创意天性，为用户创造3个震撼世界的内容创意！"""

    print(f"[generate] 开始生成内容，标签: {tags_str}")
    print(f"[generate] 用户描述: {user_description}")
    
    start_time = time.time()
    
    try:
        # 调用 ollama
        result = subprocess.run(
            ['ollama', 'run', 'qwen2.5:3b'],
            input=prompt,
            capture_output=True, 
            text=True, 
            timeout=120, 
            encoding='utf-8'
        )
        
        output = result.stdout.strip()
        elapsed = time.time() - start_time
        
        print(f"[generate] ollama 输出:\n{output}")
        print(f"[generate] 推理耗时: {elapsed:.2f}s")
        
        if result.returncode != 0:
            print(f"[generate] ollama 错误: {result.stderr}")
            return None, f"ollama 调用失败: {result.stderr}"
        
    except subprocess.TimeoutExpired:
        elapsed = time.time() - start_time
        print(f"[generate] ollama 超时，耗时: {elapsed:.2f}s")
        return None, "生成超时，请重试"
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"[generate] ollama 异常: {e}，耗时: {elapsed:.2f}s")
        return None, f"调用 ollama 失败: {e}"
    
    # 解析 JSON 输出 - 增强版
    try:
        # 多种方式尝试提取和修复JSON
        json_content = extract_and_fix_json(output)
        if json_content:
            video_plans = json.loads(json_content)
            return video_plans, None
        else:
            print(f"[generate] 未找到有效的 JSON 格式，尝试文本解析")
            return parse_text_output(output), None
            
    except json.JSONDecodeError as e:
        print(f"[generate] JSON 解析失败: {e}")
        print(f"[generate] 原始输出: {output}")
        # 如果 JSON 解析失败，尝试简单的文本解析
        return parse_text_output(output), None

def extract_and_fix_json(output):
    """
    从输出中提取并修复JSON格式
    """
    # 方法1: 寻找完整的JSON数组
    json_patterns = [
        r'(\[[\s\S]*?\])',  # 匹配 [...]
        r'```json\s*(\[[\s\S]*?\])\s*```',  # 匹配 ```json [...] ```
        r'```\s*(\[[\s\S]*?\])\s*```',  # 匹配 ``` [...] ```
    ]
    
    for pattern in json_patterns:
        matches = re.findall(pattern, output, re.DOTALL)
        for match in matches:
            try:
                # 尝试解析这个匹配
                json.loads(match)
                return match
            except:
                continue
    
    # 方法2: 寻找JSON对象并组装成数组
    object_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    objects = re.findall(object_pattern, output, re.DOTALL)
    
    if objects:
        try:
            # 尝试将找到的对象组装成数组
            json_array = '[' + ','.join(objects) + ']'
            json.loads(json_array)  # 验证是否有效
            return json_array
        except:
            pass
    
    # 方法3: 智能修复常见的JSON错误
    json_match = re.search(r'(\[.*)', output, re.DOTALL)
    if json_match:
        json_str = json_match.group(1)
        
        # 修复常见问题
        json_str = fix_common_json_issues(json_str)
        
        try:
            json.loads(json_str)
            return json_str
        except:
            pass
    
    return None

def fix_common_json_issues(json_str):
    """
    修复常见的JSON格式问题
    """
    # 移除多余的文本
    json_str = re.sub(r'^[^[\{]*', '', json_str)  # 移除开头的非JSON字符
    json_str = re.sub(r'[^}\]]*$', '', json_str)  # 移除结尾的非JSON字符
    
    # 修复未闭合的括号
    open_brackets = json_str.count('[')
    close_brackets = json_str.count(']')
    if open_brackets > close_brackets:
        json_str += ']' * (open_brackets - close_brackets)
    
    open_braces = json_str.count('{')
    close_braces = json_str.count('}')
    if open_braces > close_braces:
        json_str += '}' * (open_braces - close_braces)
    
    # 修复缺少逗号的问题
    json_str = re.sub(r'}\s*{', '},{', json_str)
    
    # 修复多余的逗号
    json_str = re.sub(r',\s*([}\]])', r'\1', json_str)
    
    # 修复引号问题
    json_str = re.sub(r'([{,]\s*)(\w+)(\s*:)', r'\1"\2"\3', json_str)
    
    return json_str

def parse_text_output(output):
    """
    当 JSON 解析失败时，尝试从文本中提取创意内容
    """
    plans = []
    lines = output.split('\n')
    current_plan = {}
    current_outline = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # 检测标题（支持emoji和创意格式）
        if '标题' in line or 'title' in line.lower() or line.startswith('🔥'):
            if current_plan and current_plan.get('title'):
                # 保存上一个方案
                if current_outline:
                    current_plan['outline'] = current_outline
                plans.append(current_plan)
                current_plan = {}
                current_outline = []
            
            # 提取标题
            title_match = re.search(r'[：:]\s*(.+)', line)
            if title_match:
                current_plan['title'] = title_match.group(1).strip()
            elif line.startswith('🔥'):
                current_plan['title'] = line
        
        # 检测创意钩子
        elif '钩子' in line or 'hook' in line.lower():
            hook_match = re.search(r'[：:]\s*(.+)', line)
            if hook_match:
                current_plan['hook'] = hook_match.group(1).strip()
        
        # 检测互动设计
        elif '互动' in line or 'interaction' in line.lower():
            interaction_match = re.search(r'[：:]\s*(.+)', line)
            if interaction_match:
                current_plan['interaction'] = interaction_match.group(1).strip()
        
        # 检测传播触发点
        elif '传播' in line or 'viral' in line.lower():
            viral_match = re.search(r'[：:]\s*(.+)', line)
            if viral_match:
                current_plan['viral_trigger'] = viral_match.group(1).strip()
        
        # 检测争议度
        elif '争议' in line or 'controversy' in line.lower():
            controversy_match = re.search(r'(\d+)', line)
            if controversy_match:
                current_plan['controversy_level'] = controversy_match.group(1)
        
        # 检测目标情感
        elif '情感' in line or 'emotion' in line.lower():
            emotion_match = re.search(r'[：:]\s*(.+)', line)
            if emotion_match:
                current_plan['emotion_target'] = emotion_match.group(1).strip()
        
        # 检测大纲项目（支持emoji格式）
        elif re.match(r'\d+\.|[一二三四五六七八九十]、|•|-|💥|🎯|🔍|💡|🚀|🎪', line):
            current_outline.append(line)
    
    # 添加最后一个方案
    if current_plan and current_plan.get('title'):
        if current_outline:
            current_plan['outline'] = current_outline
        plans.append(current_plan)
    
    # 如果没有解析到内容，返回创意默认方案
    if not plans:
        plans = [{
            "title": "🔥 突破常规！你从未见过的创作角度",
            "hook": "前3秒用反常识观点震撼观众",
            "outline": [
                "💥开场爆点：颠覆传统认知的开场",
                "🎯核心冲突：制造强烈的认知冲突", 
                "🔍深度揭秘：独家视角深度解析",
                "💡创新方案：前所未有的解决思路",
                "🚀行动召唤：激发强烈参与欲望",
                "🎪彩蛋环节：意外惊喜引爆传播"
            ],
            "interaction": "设置争议性投票，让用户选择立场",
            "viral_trigger": "挑战主流观点，引发激烈讨论",
            "category": "颠覆性内容",
            "content_type": "病毒视频",
            "controversy_level": "7",
            "emotion_target": "震惊+好奇"
        }]
    
    return plans

@app.route('/api/generate', methods=['POST'])
def generate_content():
    """
    生成内容创作方案的 API 端点
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': '请求数据为空'
            }), 400
        
        tags = data.get('tags', [])
        user_description = data.get('description', '')
        
        if not tags and not user_description:
            return jsonify({
                'success': False,
                'error': '请提供标签或用户描述'
            }), 400
        
        # 生成内容
        content_plans, error = generate_content_ideas(tags, user_description)
        
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 500
        
        return jsonify({
            'success': True,
            'data': content_plans,
            'message': f'成功生成 {len(content_plans)} 个内容创作方案'
        })
        
    except Exception as e:
        print(f"[generate] API 异常: {e}")
        return jsonify({
            'success': False,
            'error': f'服务器内部错误: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("内容创作生成服务启动")
    print("模型: qwen2.5:3b")
    print("端口: 5003")
    print("-" * 50)
    
    app.run(debug=True, port=5003)