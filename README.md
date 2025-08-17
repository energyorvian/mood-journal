# Mood Journal

一個輕量的心情日記 PWA（可離線、可安裝到手機）。  
功能包含：心情記錄、時間軸圖表（Chart.js）、每日提示語（收藏/分享/換一句）、CSV 匯出、刪除單筆/清除全部。

## 📦 專案結構
```
.
├─ index.html
├─ styles.css
├─ app.js
├─ daily-quote.vanilla.js
├─ sw.js
├─ manifest.webmanifest
└─ icons/
   ├─ icon-192.png
   └─ icon-512.png
```

## 🚀 快速開始（GitHub Pages）
1. 將專案推到 GitHub（或直接上傳檔案到 repo 的 `main` 分支）。
2. 進入 **Settings → Pages**  
   - Source：選 **Deploy from a branch**  
   - Branch：選 **main**，資料夾 **/**（root） → **Save**  
3. 幾十秒後會出現一個網址（例如 `https://<username>.github.io/<repo>/`）。  
   - 首次開啟若樣式/JS 沒更新，請強制重整（Windows: `Ctrl+Shift+R` / Mac: `Cmd+Shift+R`）。

> 若你已在 repo 啟用過 Pages，只要之後 **Push/Commit** 就會重新部署。

## 📱 安裝到手機（PWA）
- 手機瀏覽器開啟站點 → 「加入主畫面」/「Install app」即可安裝。  
- 桌面瀏覽器也支援安裝（網址列右側的安裝圖示）。

## 🔁 更新與快取（Service Worker）
專案使用 `sw.js` 做快取：  
- **更新檔案後**：請同步調整 `sw.js` 內的版本字串（例如 `mood-journal-clean-v7` 改成 `v7-1`）或變更 `<script src="app.js?v=7">` 的查詢參數版本，讓瀏覽器抓新檔。  
- 使用者端可強制重整（`Ctrl/Cmd + Shift + R`）以確保拿到最新版本。

## 🧾 匯出 / 刪除
- **匯出 CSV**：點「匯出 CSV」即可下載 `mood_records.csv`。  
- **刪除單筆**：每筆記錄右側有 🗑️ 按鈕。  
- **清除全部**：右上角「清除全部」。  
> 所有資料都儲存在 **瀏覽器 localStorage**，不會上傳到伺服器。

## 🗂️ 資料位置與格式
- key：`moodRecords`（localStorage）  
- 結構：
```json
[
  { "timestamp": "2025/08/17 21:34", "mood": 3, "note": "備註" }
]
```

## 🌿 每日提示語（daily-quote.vanilla.js）
- 修改語錄：編輯 `DQ_QUOTES` 陣列即可。  
- 收藏記錄：`localStorage` key 為 `dq:favs`。  
- 每日「換一句」上限：`DQ_LIMIT`（預設 2 次/天）。

## 🧰 本地開發（不需建置）
1. 用任何靜態伺服器開啟（例如 VSCode 的 Live Server，或 `python -m http.server`）。  
2. 瀏覽 `http://localhost:8000`（或 Live Server 顯示的網址）。

## 🔒 隱私
- 本專案為純前端靜態網站，**不會上傳你的資料**。  
- 所有記錄皆保存在使用者的瀏覽器 `localStorage`。清除瀏覽器資料將一併清空。

## ❓疑難排解
- **頁面改了但使用者看起來沒變？**  
  1) 變更 `sw.js` 的 `CACHE_NAME`；或  
  2) 將資源引用加上版本 query，例如：`app.js?v=8`；  
  3) 指導用戶強制重整（`Ctrl/Cmd + Shift + R`）。
- **Chart.js 沒顯示**：確認外部 CDN 可存取（公司防火牆可能會擋），或改用本地檔案。  
- **一筆變兩筆**：已在 `app.js` 以節流與單次綁定修正；若你自行改了 DOM，請確認按鈕 **沒有** 同時使用 `onclick` 與 `addEventListener` 重複綁定。

## 📝 授權
自由使用與修改；若對你有幫助，歡迎標星 ⭐️ 支持。
