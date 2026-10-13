# Maison des Souvenirs / 回憶美術館

A separate full rebuild of the local birthday experience. Preview: http://127.0.0.1:4178/maison/

Run from repository root:

```sh
python3 -m http.server 4178 --bind 127.0.0.1 --directory public
```

## Editing

- `content.js`: six independently editable `galleryPhotos` in front-left/right, middle-left/right, back-left/right order, plus four `memories` cards with platonic friend birthday messages. All four cards are editable HTML, not rasterized text.
- `maison.css`: responsive typography, stationery, UI and CSS photo/text motion.
- `tour.js`: responsive six-photo camera tour; 4.2-second entrance, 2-second hold per photo, forward-facing transitions between walls, ~31 seconds total. Full frames and portrait images stay visible.
- `app.js`: camera playback, touch gestures, keyboard interaction and journey state.
- `letter-motion.js`: flap hinge, projected first-card extraction, horizontal paging, reverse extraction and resealing.
- `scene.js`: garden planting, display walls, props, scene lighting, material batching.
- `assets/orangerie.glb`: new architecture authored using Higgsfield 3D Jutsu, 731,292 bytes. No old Tuscan villa used in this experience.
- `assets/letter.glb`: 34 retained letter/desk-accessory meshes extracted from the earlier original project. The approved letter design and underlying extraction mechanism remain; the surrounding architecture, scene, layout and controller were rebuilt.

Editable architecture source is saved at `../../artifacts/maison/orangerie-editable.blend`; construction source is `../../artifacts/maison/build-architecture.py`.
Higgsfield project (revision 1): https://higgsfield.ai/3d-jutsu/8a7042a0-666b-4751-b596-babf2ad0e2b2

## Performance and accessibility

- Static meshes batched by material, leaf/flower geometry instanced; a single static directional shadow map.
- Shadow updates only while the physical letter moves; WebGL stops redrawing in settled views. Camera input invalidates the frame.
- DPR capped at 1.35 for mobile and 1.65 for desktop. Optional environment-light asset failure does not prevent use.
- Early shader compilation before enabling start; local GLB and photo assets, no runtime model-generation request.
- Vertical touch travel, horizontal card swipes, range control, skip-to-letter, pause, keyboard controls, focus handling, reduced-motion behavior and context-loss recovery.

## Verification

From repository root:

```sh
node artifacts/maison/check.mjs
node artifacts/maison/verify.mjs
node artifacts/maison/verify-gallery.mjs
node artifacts/maison/verify-autotour.mjs
```

`artifacts/maison/verification.json` records fresh measurements. Tests use desktop Chrome with phone viewports and touch emulation, not physical iOS/Android hardware. Local load time is not a mobile-network estimate. Frame timing is indicative only, not a promised device frame rate.

## Assets and delivery scope

The current gallery uses the user's selected personal photos and artist photos. Selection and provenance are recorded in `../../artifacts/maison/photo-selection.md`.
Environment: Poly Haven Rosendal Park Sunset, CC0; attribution: `../birthday-3d/assets/tuscan/ENVIRONMENT.txt`.
Three.js vendor license: `../birthday-3d/vendor/LICENSE.three.txt`.

This is a local preview, not an externally published site. The previous `/birthday-3d/` version is preserved separately. Higgsfield was used for the editable architecture scene; the interactive website runs locally in Three.js.

## Friend birthday revision
Romantic address, declarations, love signature and couple demo photograph removed from the current experience. The engraved love footer and wax heart are hidden in the local letter model at render time. Original model remains editable. Gallery photographs use contain-fit rather than crop. Camera framing is tested at 1440×900, 390×844, 390×932 and 320×568. Actual automatic playback is checked for all six 2-second holds.

## Per-photo subtitles
Each `galleryPhotos` entry owns its `subtitle`, displayed only while that photo's camera holds. The current lines describe each selected photograph. Keep `image`, `caption`, and `subtitle` together when changing photos. With the user's authorization, the friend's Instagram profile and music captions were read; only relevant nickname and preferences informed the copy. See `../../artifacts/maison/personal-copy-notes.md`.

## Performance revision — 2026-10-10

- Demand-driven render scheduling: no WebGL redraw or card projection work while paused or reading. Photo holds keep the timeline alive without redrawing an unchanged camera.
- UI text/visibility writes only on change; progress slider updates at 10 Hz.
- Retina/large-screen WebGL buffer capped at 2.5 million pixels. HTML photographs and text retain native resolution.
- Garden leaves spatially batched for frustum culling; original count, positions, colors and geometry preserved.
- Letter shadows update during flap motion; HTML extraction and paging do not redraw the whole scene each frame. Resize explicitly refreshes the card projection.
- Official StreetVoice player preloads during initial scene preparation. No autoplay claim: the visitor taps play. Collapsing keeps playback, Stop removes the player, restarting stops it and prepares a fresh silent player. Slow loading has an external listening link and does not block the tour.

Reproduce: `node artifacts/maison/performance/measure.mjs after` and `node artifacts/maison/performance/lifecycle.mjs`. Browser timings are diagnostic, not guaranteed physical-device FPS.

## Soft exterior and direct gallery movement — 2026-10-10

`soft-geometry.js` supplies rounded stone profiles for the façade piers, cornices, terrace and foundation. Runtime changes preserve the editable source GLB. Garden path and beds have rounded ends; foliage uses shorter, broader leaves and softer greens, and flower stems sit lower. Leaf counts, spatial batching and the rendering pixel budget remain intact.

The tour interpolates directly between photo poses, with no aisle reset keys. Order: front-left → front-right → middle-right → middle-left → back-left → back-right. Same-wall transfers track sideways for 1.7 seconds without changing the viewing direction; cross-wall turns take 2.2 seconds. Each photo holds for 2 seconds; total duration is 29.95 seconds. Phone/desktop photos remain fully framed. `check-direct-tour.mjs` verifies ongoing angular motion at every transfer midpoint and that turns face forward rather than back toward the entrance. Before/after previews: `artifacts/maison/exterior-{before,after}-{desktop,phone}.png`.

The central rectangular roof caps were replaced by an arched masonry crown. GLTF matching uses original `userData.name` because Three.js removes periods from node names. First-party JS imports and CSS carry the same `20261010-soft03` revision to refresh nested module caches. Latest preview: `artifacts/maison/exterior-rounded-crown-desktop.png`.

## Personal birthday copy and video handoff — 2026-10-10

The copy now follows the sender's own brief: thanks for last year's classroom surprise with shaving foam (the first group of friends to celebrate the sender's birthday), memories attached to each photograph, and wishes for peace, happiness, fulfilled hopes and progress in studies. The classroom photo introduces the recollection; it is not labeled as a photo from that birthday. Ordinary-friend tone is retained. Birthday fabric bunting, a greeting at the entrance, cover candles and a short confetti entrance add celebration without continuous WebGL animation.

The gallery and letter are **always available**. Only the future video is scheduled for **2026-10-14 17:00 Asia/Taipei**, equivalent to `2026-10-14T09:00:00Z`.

- Edit `delivery-config.js` to attach the final video: `src` for the file URL, optional `poster`, optional WebVTT `captions`.
- The end-of-letter invitation appears after the envelope folds shut. Before release it displays the opening time. After release it offers playback only when a video URL exists; otherwise it says the video is still being prepared.
- No video file is currently supplied. The website does not fetch a video or poster until an explicit play tap after release.
- The player supports landscape and portrait content with contain-fit, native controls and inline mobile playback. Opening it stops the music player; closing it pauses the video.
- This local static preview implements a scheduled **UI reveal using device time**, not secure media access control. When the finished file is hosted, use a server-time media endpoint/signed delivery URL if early direct-link access must be prevented; do not upload a secret pre-release video to a public static URL and mistake the UI for protection.

Validation: `check-birthday-video.mjs` covers the exact Taipei opening boundary, letter access before release, delayed media fetch, automatic opening-time state update, real playback of a generated test clip, music stop and video pause on close at phone/small-phone/desktop sizes. The test clip is generated in memory and never replaces the recipient's future video. `check-real-photos.mjs` verifies all four pages fit without horizontal overflow or overlapping navigation.

## 2026-10-10 照片去重與蛋糕

- 展牆與信件共使用 9 張不同的個人照片，另有兩張歌手宣傳照，皆不重複出現。
- 新選照片為 IMG_8649、IMG_9703，原始檔名已加（已使用），原檔雜湊驗證不變。
- scene.js 的 textPanel 依世界座標長寬比建立貼圖，不再拉扁字形。
- 信旁加入可編輯幾何組成的奶油草莓蛋糕、瓷盤、擠花與三支蠟燭；採既有靜態材質合批，不增加燈光或常駐動畫。

## 清楚、簡潔的字體調整

- typography.css 集中管理閱讀字級：桌機正文 18px、手機 17px、短螢幕 16px；深綠文字搭配淺色紙張。
- 移除重複的小標、簽名與裝飾分隔線。照片下只保留該張照片的說明。
- 抵達信件後收起旅程進度列，只保留打開信件的主要按鈕；音樂收合為單一按鈕。
- 手機桌前取景加寬，蛋糕與信件可同時入鏡。
- 小螢幕長信文可以垂直捲動；左右滑動仍保留翻頁功能。

## 2026-10-11 生日聚會佈置

- 拿掉深綠布簾、白色插花、入口對稱甕形花器，以及成排蠟燭式吊燈。
- 換成明亮天空、淺木桌、紙吊燈、彩色氣球、彩旗、餐盤與禮物；走道改成柔和陶粉色地毯。
- 背牆只保留生日標題，蛋糕蠟燭改短。手機取景可同時看到生日佈置與信件。
- 所有固定裝飾繼續合併材質繪製，沒有額外的粒子動畫、燈光或持續渲染迴圈。

## 2026-10-11 外觀改為玻璃咖啡小屋

- cafe-shell.js 是目前使用的可編輯建築來源：低斜屋頂、木框玻璃、左側木格柵、條紋遮雨棚、木平台與戶外長椅。
- 舊 orangerie.glb 保留作為歷史素材，執行時不再下載或顯示；所有拱門、石柱、柱頭、雕花、拱頂與入口燈籠均已移除。
- 展廳六幅照片、相機動線、信件座標與互動保持原配置。室內紙燈的吊線同步縮到新屋頂高度。
- 官網素材說明已更新為客製場景，避免把新建築誤標為先前的生成模型。

## 2026-10-11 可愛細節

- 奶油蜜桃粉的波浪遮雨棚、圓角黑貓招牌、長椅黑貓小擺飾、兩盆粉黃小花。
- 入口氣球降低，避免遮住招牌。長椅背板朝向已修正，貓咪擺飾面向進來的訪客。
- 新增擺飾使用靜態幾何與既有合批；未加入循環動畫。

## 2026-10-11 小屋輪廓重設

- 平屋頂改為草莓粉斜屋頂、奶油色屋簷、圓形閣樓窗，以及粉色橫板外牆。
- 手機開場換成斜側視角，讓房屋的屋頂與深度都能看見；同步減輕封面的霧化遮罩。
- 玻璃門與六幅照片的位置不變；室內燈具吊線接到新屋頂，後牆補齊山牆。

## 2026-10-11 Apple 裝置與 GitHub Pages 檢查

- iPad 直向改成上圖下文，正文以 19px 實際顯示；橫向維持雙欄。低高度橫向手機保留 17px 正文與獨立捲動區，不再把整張卡片縮小。
- 觸控装置 DPR 上限 1.35、繪圖像素上限 160 萬；桌機維持 DPR 1.5、250 萬。HTML 照片與文字不受 3D 解析度上限影響。
- 螢幕旋轉與 Safari 網址列改變高度時，合併 resize 事件、一次更新繪圖緩衝區；閱讀時仍停止 WebGL 重繪。
- 官方音樂播放器改在「進來看看」後準備，避免初始模型、照片與第三方音樂一起搶載入。音樂開始仍須訪客點播放。
- 移除信件內未顯示的重複歌手縮圖；生活照 9 張、歌手照 2 張皆獨立使用。照片來源說明同步補齊。
- 每頁照片短暫淡入後保持靜止，完整顯示照片、不增加循環特效。信件、照片說明維持普通朋友的語氣。
- `node scripts/build-birthday-pages.mjs` 產出約 6 MiB 靜態成品，GitHub Pages 流程不再依賴 Vinext／Cloudflare。詳見根目錄 `DEPLOY-GITHUB.md`。
- Apple 相容性以 Playwright WebKit 引擎和裝置視窗模擬檢查；這不是實體 iPhone／iPad 的效能測量。完整結果在本機 `artifacts/maison/apple-audit/`。
