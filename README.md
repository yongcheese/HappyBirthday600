# 六百，生日快樂！

可用手機、平板或電腦開啟的互動生日展：走進小屋看照片、打開信件，左右滑動閱讀，再把信收好、點亮生日蠟燭，看刮鬍泡的小驚喜。

正式網址：https://yongcheese.github.io/HappyBirthday600/

## 編輯內容

- `public/maison/content.js`：展牆與信件的照片、標題和文字。
- `public/maison/typography.css`：手機、平板與桌機的字體及閱讀版面。
- `public/maison/cafe-shell.js`、`scene.js`：3D 建築與擺設。
- `public/maison/tour.js`、`letter-motion.js`：運鏡和信件動作。
- `public/maison/delivery-config.js`：生日影片來源和開放時間。

## 預覽與部署

需要 Node.js 22 或更新版本。建置不需要安裝其他套件：

```sh
node scripts/build-birthday-pages.mjs
node scripts/preview-birthday.mjs dist/pages 4180
```

打開 http://localhost:4180/。

GitHub Pages 的 Source 設為 **GitHub Actions**。推送網站更新到 `main` 後，`Publish birthday website` 工作流程會打包並上線。也可以在 Actions 手動執行。成品僅包含網站使用的程式與素材，約 17 MB。

## 影片

照片與信件隨時可以看；只有影片設定在 **2026/10/14 17:00（台灣時間）** 開放。已加入 58 秒直式照片回顧影片，搭配原創鋼琴配樂。播放結束會接回生日蠟燭與刮鬍泡彩蛋。

替換影片時設定 `delivery-config.js` 的 `src`，並更新 `public/maison/assets/video/` 的檔案。開放時間是裝置端介面控制，並非限制提前存取檔案的伺服器授權。

## 素材

照片來源見 `public/maison/assets/photos/SOURCES.md`。個人照片並非開放授權；第三方素材依各自權利及授權使用。Three.js 授權與環境光來源隨附在 vendor 和 assets 目錄。
