import time
import random
from crawl import Crawl
from extract import Extract

def test_single_page():
    """测试单个页面的抓取"""
    crawl = Crawl()
    
    # 只测试一个分类的一页
    category = 'comprehensive_info'
    page = 0
    
    print(f"测试抓取分类: {category}, 页面: {page}")
    
    # 添加延迟
    time.sleep(random.uniform(2, 4))
    
    try:
        # 获取单页数据
        text = crawl.get_single_info(category, page)
        print(f"获取到的数据长度: {len(text)}")
        print(f"数据前200字符: {text[:200]}")
        
        if text and len(text) > 0:
            # 提取数据
            extract = Extract()
            info = extract.extract_info(text)
            print(f"提取到的数据条数: {len(info)}")
            
            if info:
                print("第一条数据示例:")
                print(info[0])
            else:
                print("没有提取到有效数据")
        else:
            print("没有获取到页面数据")
            
    except Exception as e:
        print(f"测试过程中出错: {str(e)}")

if __name__ == "__main__":
    test_single_page() 