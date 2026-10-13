# 六百，生日快樂！

可用手機、平板或電腦開啟的互動生日展：走進小屋看照片、打開信件，左右滑動閱讀，再把信收好、點亮生日蠟燭，看刮鬍泡的小驚喜，最後揭曉 600 專屬蛋糕。

正式網址：https://yongcheese.github.io/HappyBirthday600/

## 編輯內容

- `public/maison/content.js`：展牆與信件的照片、標題和文字。
- `public/maison/typography.css`：手機、平板與桌機的字體及閱讀版面。
- `public/maison/cafe-shell.js`、`scene.js`：3D 建築與擺設。
- `public/maison/tour.js`、`letter-motion.js`：運鏡和信件動作。
- `public/maison/celebration.js`、`cake-finale.js`：生日蠟燭、刮鬍泡驚喜與 600 專屬蛋糕。

## 預覽與部署

需要 Node.js 22 或更新版本。建置不需要安裝其他套件：

```sh
node scripts/build-birthday-pages.mjs
node scripts/preview-birthday.mjs dist/pages 4180
```

打開 http://localhost:4180/。

GitHub Pages 的 Source 設為 **GitHub Actions**。推送網站更新到 `main` 後，`Publish birthday website` 工作流程會打包並上線。也可以在 Actions 手動執行。成品僅包含網站使用的程式與素材，約 6 MB。

## 生日收尾

信件收好後，直接接點亮蠟燭、刮鬍泡驚喜，再揭曉有貓咪、音符與 600 糖牌的專屬蛋糕。所有內容隨時可以看，不設開放時間。

## 素材

照片來源見 `public/maison/assets/photos/SOURCES.md`。個人照片並非開放授權；第三方素材依各自權利及授權使用。Three.js 授權與環境光來源隨附在 vendor 和 assets 目錄。
