import requests

def test_ai_api():
    """测试AI API是否正常工作"""
    API_BASE_URL = "https://api.cloudflare.com/client/v4/accounts/0b2e25078e45b2165dc3a09d0a1d56f0/ai/run/"
    headers = {"Authorization": "Bearer jfdcfEjA2SOcW3sxOgY0tpnWghrR3aSYlwmpcObI"}
    
    try:
        print("正在测试AI API...")
        
        # 测试消息
        messages = [
            {"role": "system", "content": "You are a helpful assistant. Please respond in Chinese."},
            {"role": "user", "content": "你好，请简单介绍一下你自己"}
        ]
        
        response = requests.post(
            f"{API_BASE_URL}@cf/meta/llama-3-8b-instruct", 
            headers=headers, 
            json={"messages": messages},
            timeout=30
        )
        
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("API调用成功!")
            print("响应内容:", result)
            
            if "result" in result and "response" in result["result"]:
                print(f"AI回复: {result['result']['response']}")
            else:
                print("响应格式异常:", result)
        else:
            print(f"API调用失败: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"网络请求错误: {e}")
    except Exception as e:
        print(f"其他错误: {e}")

if __name__ == "__main__":
    test_ai_api() 