import requests
import concurrent.futures
import threading

class Crawl(object):
    """
    Crawl is a web scraping class designed to fetch information from different categories of news websites.
    It supports both synchronous and asynchronous scraping methods.
    """


    def __init__(self):
        """
        Initializes the Crawl class with cookies, headers, and parameters required for the HTTP requests.
        It also sets up dictionaries for page limits and URLs for different categories.
        """
        self.cookies = {
            'Hm_lvt_3b1e939f6e789219d8629de8a519eab9': '1715853553,1715855472,1715858860',
            'Hm_lpvt_3b1e939f6e789219d8629de8a519eab9': '1715859056',
        }
        self.headers = {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        }
        self.params = {
            'p': '',
        }

        self.page_dict = {
            'comprehensive_info': 31,
            'technological_info': 25,
           # 'recreational_info': 29,
            #'communal_info': 23,
            #'shop_info': 11,
            'financial_info': 14,
            'newspaper_info': 10
        }

        self.url_dict = {
            'comprehensive_info': 'https://tophub.today/c/news',
            'technological_info': 'https://tophub.today/c/tech',
            #'recreational_info': 'https://tophub.today/c/ent',
            #'communal_info': 'https://tophub.today/c/community',
            #'shop_info': 'https://tophub.today/c/shopping',
            'financial_info': 'https://tophub.today/c/finance',
            'newspaper_info': 'https://tophub.today/c/epaper'
        }

        self.lock = threading.Lock()
        # ScraperAPI 配置
        self.scraperapi_url = 'https://api.scraperapi.com/'
        self.scraperapi_key = 'f13c4b0ddf87c4dd69fa82867f6f8bb9'

        # 新增：重试机制和超时、延迟配置
        self.max_retries = 3  # 最大重试次数
        self.timeout = 5     # 超时时间（秒）
        self.min_delay = 1    # 最小延迟（秒）
        self.max_delay = 3    # 最大延迟（秒）
        self.max_workers = 2  # 并发线程数（异步抓取用）
        self.global_min_delay = 2  # 全局请求最小延迟（秒）
        self.global_max_delay = 5  # 全局请求最大延迟（秒）

    def get_all_info(self):
        """
        Synchronously fetches all information from all categories.

        Returns:
            str: Concatenated string of all fetched information.
        """
        print("Starting synchronous fetching of all information...")
        all_info = ''
        for category in self.page_dict:
            if category not in self.url_dict:
                print(f"[警告] 分类 {category} 未在 url_dict 中配置，已跳过。")
                continue
            print(f"Fetching information for category: {category}")
            all_info += self.get_category_info(category)
        print("Completed synchronous fetching of all information.")
        return all_info

    def get_category_info(self, category):
        """
        Synchronously fetches information for a specific category.

        Args:
            category (str): The category of information to fetch.

        Returns:
            str: Concatenated string of fetched information for the category.
        """
        if category not in self.page_dict or category not in self.url_dict:
            print(f"[警告] 分类 {category} 未在 page_dict 或 url_dict 中配置，已跳过。")
            return ""

        print(f"Starting synchronous fetching for category: {category}")
        all_page_str = ''
        for page_num in range(self.page_dict[category]):
            all_page_str += self.get_single_info(category, page_num)
        print(f"Completed synchronous fetching for category: {category}")
        return all_page_str

    def get_single_info(self, category, page):
        """
        Fetches information for a specific page in a category.

        Args:
            category (str): The category of information to fetch.
            page (int): The page number to fetch.

        Returns:
            str: The fetched information as a string.
        """
        import time
        import random

        # 添加随机延迟，避免被反爬虫检测
        delay = random.uniform(self.min_delay, self.max_delay)
        time.sleep(delay)

        last_exception = None
        for attempt in range(1, self.max_retries + 1):
            try:
                self.params['p'] = str(page)
                payload = {
                    'api_key': self.scraperapi_key,
                    'url': self.url_dict[category],
                    'p': str(page)
                }
                response = requests.get(
                    self.scraperapi_url,
                    params=payload,
                    cookies=self.cookies,
                    headers=self.headers,
                    timeout=self.timeout
                )
                print(f"[ScraperAPI] Fetched page {page} for category {category}, status: {response.status_code}, attempt: {attempt}")
                if response.status_code == 200:
                    # 全局延迟
                    global_delay = random.uniform(self.global_min_delay, self.global_max_delay)
                    time.sleep(global_delay)
                    return response.text
                elif response.status_code == 429:
                    print(f"[ScraperAPI] 429 Too Many Requests, retrying after delay... (attempt {attempt})")
                    time.sleep(delay * attempt)
                else:
                    print(f"[ScraperAPI] Error fetching page {page} for category {category}: {response.status_code}, attempt: {attempt}")
                    time.sleep(delay * attempt)
            except Exception as e:
                print(f"[ScraperAPI] Exception fetching page {page} for category {category}: {str(e)}, attempt: {attempt}")
                last_exception = e
                time.sleep(delay * attempt)
        print(f"[ScraperAPI] Failed to fetch page {page} for category {category} after {self.max_retries} attempts.")
        if last_exception:
            print(f"[ScraperAPI] Last exception: {str(last_exception)}")
        # 全局延迟
        global_delay = random.uniform(self.global_min_delay, self.global_max_delay)
        time.sleep(global_delay)
        return ""

    def get_homepage_via_scraperapi(self):
        """
        通过 ScraperAPI 获取 https://tophub.today/ 首页内容，并打印返回内容。
        """
        import requests
        payload = {
            'api_key': self.scraperapi_key,
            'url': 'https://tophub.today/'
        }
        try:
            response = requests.get(self.scraperapi_url, params=payload, timeout=10)
            print(f"[ScraperAPI] Status: {response.status_code}")
            #print(response.text[:1000])  # 只打印前1000字符，避免输出过长
            return response.text
        except Exception as e:
            print(f"[ScraperAPI] Exception fetching homepage: {str(e)}")
            return ""

    def get_all_info_async(self):
        """
        Asynchronously fetches all information from all categories.

        Returns:
            str: Concatenated string of all fetched information.
        """
        print("Starting asynchronous fetching of all information...")
        all_info = ''
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {}
            for category in self.page_dict:
                if category not in self.url_dict:
                    print(f"[警告] 分类 {category} 未在 url_dict 中配置，已跳过。")
                    continue
                futures[executor.submit(self.get_category_info_async, category)] = category
            for future in concurrent.futures.as_completed(futures):
                category = futures[future]
                try:
                    result = future.result()
                    with self.lock:
                        all_info += result
                except Exception as exc:
                    with self.lock:
                        all_info += f"\n{category} generated an exception: {exc}"
        print("Completed asynchronous fetching of all information.")
        return all_info

    def get_category_info_async(self, category):
        """
        Asynchronously fetches information for a specific category.

        Args:
            category (str): The category of information to fetch.

        Returns:
            str: Concatenated string of fetched information for the category.
        """
        if category not in self.page_dict or category not in self.url_dict:
            print(f"[警告] 分类 {category} 未在 page_dict 或 url_dict 中配置，已跳过。")
            return ""

        print(f"Starting asynchronous fetching for category: {category}")
        all_page_str = ''
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {executor.submit(self.get_single_info, category, page_num): page_num for page_num in
                       range(self.page_dict[category])}
            for future in concurrent.futures.as_completed(futures):
                page_num = futures[future]
                try:
                    result = future.result()
                    with self.lock:
                        all_page_str += result
                except Exception as exc:
                    with self.lock:
                        all_page_str += f"\nPage {page_num} generated an exception: {exc}"
        print(f"Completed asynchronous fetching for category: {category}")
        return all_page_str

if __name__ == '__main__':
    # a = Crawl()
    # a.get_single_info()

    help(Crawl)