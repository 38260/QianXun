import schedule
import time
import os
from datetime import datetime
from crawl import Crawl
from extract import Extract
from store import Store

def job():
    crawl = Crawl()
    all_text = crawl.get_all_info_async()
    
    # 添加调试信息
    print(f"抓取到的原始数据长度: {len(all_text)}")
    print(f"原始数据前500字符: {all_text[:500]}")
    
    extract = Extract()
    info = extract.extract_info(all_text)
    print(f"提取后的数据: {info}")
    print('获得的数据总量是:{}'.format(len(info)))

    # 只有在成功获取到数据时才保存
    if info and len(info) > 0:
        store = Store(info)
        
        # 创建source文件夹（如果不存在）
        source_dir = 'source'
        if not os.path.exists(source_dir):
            os.makedirs(source_dir)
        
        # 生成文件名：hotNews+当前月日
        current_date = datetime.now().strftime('%m%d')
        filename = f'hotNews{current_date}.xlsx'
        file_path = os.path.join(source_dir, filename)
        
        try:
            store.mode_excel(file_path)
            print(f"数据已保存到: {file_path}")
            store.mode_mysql('HotSearch','hot_search')
        except Exception as e:
            print(f"保存数据时出错: {str(e)}")
    else:
        print("没有获取到有效数据，跳过保存步骤")

# 每隔一个小时运行一次
schedule.every(1).hours.do(job)

# 初次运行
job()

while True:
    schedule.run_pending()
    time.sleep(1)
