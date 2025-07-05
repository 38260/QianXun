import subprocess
import sys
import time
import threading

def run_service(script_name, port):
    """运行指定的服务"""
    try:
        print(f"启动 {script_name} 在端口 {port}...")
        subprocess.run([sys.executable, script_name], check=True)
    except subprocess.CalledProcessError as e:
        print(f"服务 {script_name} 启动失败: {e}")
    except KeyboardInterrupt:
        print(f"服务 {script_name} 被中断")

def main():
    print("正在启动所有后端服务...")
    
    # 启动数据API服务 (端口5001)
    data_thread = threading.Thread(target=run_service, args=("api.py", 5001))
    data_thread.daemon = True
    data_thread.start()
    
    # 等待一下确保第一个服务启动
    time.sleep(2)
    
    # 启动AI聊天API服务 (端口5002)
    ai_thread = threading.Thread(target=run_service, args=("ai_chat.py", 5002))
    ai_thread.daemon = True
    ai_thread.start()
    
    print("所有服务已启动:")
    print("- 数据API服务: http://localhost:5001")
    print("- AI聊天API服务: http://localhost:5002")
    print("\n按 Ctrl+C 停止所有服务")
    
    try:
        # 保持主线程运行
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n正在停止所有服务...")
        sys.exit(0)

if __name__ == "__main__":
    main() 