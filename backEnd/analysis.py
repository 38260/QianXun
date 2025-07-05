import pandas as pd
import matplotlib.pyplot as plt
import os

# 读取Excel文件路径
EXCEL_PATH = os.path.abspath(r'热搜数据.xlsx')

# 读取数据
df = pd.read_excel(EXCEL_PATH)

# 假设有一个包含热度或排名的列，尝试自动识别
# 你可以根据实际表头修改下面的列名
possible_columns = ['热度', '排名', '热搜词', '关键词', '标题']

# 自动检测热度和标题列
heat_col = None
title_col = None
for col in df.columns:
    if any(key in col for key in ['热度', '指数', '热度值']):
        heat_col = col
    if any(key in col for key in ['词', '标题', '内容', '关键词']):
        title_col = col

if heat_col is None or title_col is None:
    print('无法自动识别热度或标题列，请检查表头。')
    print('表头为:', df.columns.tolist())
    exit(1)

# 取top10
hot_top10 = df.sort_values(by=heat_col, ascending=False).head(10)

print('热点Top10:')
print(hot_top10[[title_col, heat_col]])

# 绘图
plt.figure(figsize=(10, 6))
plt.barh(hot_top10[title_col][::-1], hot_top10[heat_col][::-1], color='skyblue')
plt.xlabel('热度')
plt.title('热搜Top10')
plt.tight_layout()
plt.show() 