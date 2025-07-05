# AI聊天功能说明

## 功能概述
AI聊天功能使用Cloudflare AI API提供真实的AI对话体验，帮助用户进行内容创作分析和建议。

## 启动服务

### 方法1：使用启动脚本（推荐）
```bash
cd backEnd
python start_services.py
```

### 方法2：分别启动服务
```bash
# 终端1 - 启动数据API服务
cd backEnd
python main.py

# 终端2 - 启动AI聊天API服务
cd backEnd
python ai_chat.py
```

## API端点

### AI聊天API
- **URL**: `http://localhost:5002/api/chat`
- **方法**: POST
- **请求体**:
```json
{
    "message": "用户消息",
    "selectedTags": ["标签1", "标签2"],
    "hotTopics": [{"title": "热点话题1"}, {"title": "热点话题2"}]
}
```
- **响应**:
```json
{
    "success": true,
    "response": "AI回复内容"
}
```

## 功能特点

1. **真实AI对话**: 使用Cloudflare的Llama-3-8B模型
2. **上下文感知**: AI会根据用户选择的标签和热点话题提供个性化建议
3. **错误处理**: 完善的错误处理和网络异常处理
4. **中文支持**: 专门针对中文内容创作优化

## 注意事项

1. 确保API令牌有效且未过期
2. 网络连接正常以访问Cloudflare API
3. 前端需要同时访问两个后端服务（5001和5002端口）

## 故障排除

如果AI聊天功能无法正常工作：

1. 检查后端服务是否正常启动
2. 确认API令牌是否有效
3. 查看浏览器控制台是否有网络错误
4. 检查防火墙设置是否阻止了端口访问 