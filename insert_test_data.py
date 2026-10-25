import os
from supabase import create_client, Client

# Supabaseの接続情報（あなたの環境に合わせて書き換えてください）
SUPABASE_URL = "https://fsgxecznvvpajhkcdaad.supabase.co"
SUPABASE_ANON_KEY = "あなたのANON_KEYをここに貼り付け"

# クライアントの初期化
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def insert_work():
    # 登録したい作品データ
    new_work = {
        "fanza_cid": "test_cid_001",
        "title": "Python自動登録テスト作品",
        "circle_name": "自動化サークル",
        "thumbnail_url": "https://www.tcaeco.ac.jp/contents/animalbook/wp-content/uploads/sites/5/2024/12/cat-type_00.jpg",
        "fetish_tags": ["Python", "自動化", "テスト"],
        "ng_tags": [],
        "page_count": 40,
        "price": 1100,
        "discount_rate": 20,
        "ai_summary_3lines": [
            "Pythonスクリプトから自動登録された作品です。",
            "データベース操作のテスト用として使用します。",
            "正常にカードが表示されるか確認しましょう。"
        ],
        "fanza_aff_url": "https://www.dmm.co.jp/"
    }

    # Supabaseの 'works' テーブルにデータを挿入
    response = supabase.table("works").insert(new_work).execute()
    print("登録が完了しました！", response)

if __name__ == "__main__":
    insert_work()