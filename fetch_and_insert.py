import os
import requests
from supabase import create_client, Client

# Supabaseの設定
SUPABASE_URL = "https://fsgxecznvvpajhkcdaad.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_IlAJbRtk3xDK3VB6nvwzhg_YnuF93va"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# DMM/FANZA APIの設定
DMM_API_ID = "UH3H2dLRYga0HTRKtMZd"
DMM_AFFILIATE_ID = "munilog-991"

def fetch_fanza_works():
    url = "https://api.dmm.com/affiliate/v3/ItemList"
    
    params = {
        "api_id": DMM_API_ID,
        "affiliate_id": DMM_AFFILIATE_ID,
        "site": "FANZA",
        "service": "doujin",     # serviceを doujin
        # floorの指定をあえて外す、または以下のように設定
        "sort": "date",
        "hits": 10,
        "output": "json"
    }

    print("APIにリクエストを送信中...")
    response = requests.get(url, params=params)
    print(f"ステータスコード: {response.status_code}")
    
    data = response.json()

    if "result" in data and "items" in data["result"]:
        items = data["result"]["items"]
        print(f"{len(items)}件の作品を取得しました！Supabaseへ登録を開始します...")
        
        for item in items:
            title = item.get("title")
            fanza_cid = item.get("content_id")
            aff_url = item.get("affiliateURL")
            thumbnail = item.get("imageURL", {}).get("large", "")
            
            circle_name = "不明サークル"
            if "iteminfo" in item and "maker" in item["iteminfo"]:
                makers = item["iteminfo"]["maker"]
                if makers:
                    circle_name = makers[0].get("name", "不明サークル")

            # 価格の安全な取得（'~' や '円'、',' を取り除いて数値にする）
            price = 0
            if "prices" in item:
                price_str = item["prices"].get("price", "0")
                clean_price_str = str(price_str).split("~")[0].replace("円", "").replace(",", "").strip()
                if clean_price_str.isdigit():
                    price = int(clean_price_str)
                else:
                    price = 0

            work_data = {
                "fanza_cid": fanza_cid,
                "title": title,
                "circle_name": circle_name,
                "thumbnail_url": thumbnail,
                "fetish_tags": ["API自動取得", "新着"],
                "ng_tags": [],
                "page_count": 30,
                "price": price,
                "discount_rate": 0,
                "ai_summary_3lines": [
                    "DMM APIから自動取得された作品です。",
                    title,
                    f"サークル名: {circle_name}"
                ],
                "fanza_aff_url": aff_url
            }

            try:
                supabase.table("works").upsert(work_data, on_conflict="fanza_cid").execute()
                print(f"登録成功: {title}")
            except Exception as e:
                print(f"登録エラー ({title}): {e}")
    else:
        print("APIからデータが正常に取得できませんでした。")

if __name__ == "__main__":
    fetch_fanza_works()