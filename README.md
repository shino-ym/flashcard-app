# Flashcard App

## 概要

AIで回答を生成しながら学習できるフラッシュカードアプリです。

学習中に別タブで検索する手間を減らしたいと思い、
「検索・記録・学習を1画面で行えること」を目的として作成しました。

---

## 使用技術

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Laravel
- MySQL

### Deploy
- Vercel
- Railway

---

## 主な機能

- カード追加
- カード編集 / 削除
- AI回答生成
- カテゴリー管理
- 学習モード
- mastered管理
- ログイン認証

---

## セットアップ方法
1. 
```
git clone git@github.com:shino-ym/flashcard-app.git
```
2. 
```
cd flashcard-app/
```
3. 
```
npm install
```
4. 
```
npm run dev
```

## 環境変数

ルートディレクトリに `.env.local` を作成してください。
以下を追加

```env
NEXT_PUBLIC_API_URL=your_api_url
OPENAI_API_KEY=your_api_key
```