import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// R-18テキストでAIがエラーを出さないようにセーフティ制限を解除
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
    generationConfig: { responseMimeType: "application/json" }
});

async function main() {
    // 1. FANZA同人コミックのランキング上位10件を取得
    const dmmUrl = `https://api.dmm.com/affiliate/v3/ItemList?api_id=${process.env.DMM_API_ID}&affiliate_id=${process.env.DMM_AFFILIATE_ID}&site=FANZA&service=doujin&floor=digital_doujin&hits=10&sort=rank&output=json`;

    const res = await fetch(dmmUrl);
    const data = await res.json();
    const items = data.result?.items || [];

    for (const item of items) {
        // サンプル画像がない作品はスキップ
        const sampleImages = item.sampleImageURL?.sample_l?.image || item.sampleImageURL?.sample_s?.image || [];
        if (sampleImages.length === 0) continue;

        const officialTags = item.iteminfo?.genre?.map(g => g.name).join(', ') || '';

        // 2. Gemini APIで「3行要約」と「性癖タグ」を生成
        const prompt = `
    以下の同人作品データから、読者が購買意欲をそそられる「見どころ3行要約」と「属性タグ」「地雷注意タグ（NTRなどがある場合のみ）」をJSON形式で出力してください。
    作品名: ${item.title}
    公式ジャンル: ${officialTags}
    出力フォーマット:
    {
      "summary_3lines": ["魅力的なポイント1", "ポイント2", "ポイント3"],
      "fetish_tags": ["属性タグ1", "属性タグ2", "属性タグ3"],
      "ng_tags": ["NTR等の注意要素があれば記載、なければ空配列"]
    }`;

        const aiResult = await model.generateContent(prompt);
        const aiJson = JSON.parse(aiResult.response.text());

        // 価格と割引率の計算
        const price = parseInt(item.prices?.list_price || item.prices?.price || '0', 10);
        const salePrice = parseInt(item.prices?.price || '0', 10);
        const discountRate = price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

        // 3. Supabaseへ保存（すでにある作品は更新）
        const { error } = await supabase.from('works').upsert({
            fanza_cid: item.content_id,
            title: item.title,
            circle_name: item.iteminfo?.maker?.[0]?.name || '不明',
            price: price,
            sale_price: salePrice,
            discount_rate: discountRate,
            fanza_aff_url: item.affiliateURL,
            thumbnail_url: item.imageURL?.large || item.imageURL?.list,
            sample_image_urls: sampleImages,
            ai_summary_3lines: aiJson.summary_3lines,
            fetish_tags: aiJson.fetish_tags,
            ng_tags: aiJson.ng_tags,
            review_score: item.review?.average ? parseFloat(item.review.average) : null
        }, { onConflict: 'fanza_cid' });

        if (error) console.error('保存エラー:', error);
        else console.log(`保存成功: ${item.title}`);

        // API制限対策で2秒待つ
        await new Promise(r => setTimeout(r, 2000));
    }
}

main();