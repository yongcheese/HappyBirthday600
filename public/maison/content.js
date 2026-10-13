// Editable photo/copy pairs. Wall order matches the six camera stops.
// All captions describe visible details; no invented dates, trips or events.
const photo = name => `./assets/photos/${name}.webp`;
export const recipient = {
 nickname: '六百',
 pet: { type: 'cat', color: 'black', name: '' },
 favoriteArtists: ['pizzali', '美秀集團'],
 tone: '普通朋友的生日祝福，自然、輕鬆、不曖昧'
};
export const favoriteArtists = [
 {name:'PIZZALI', image:photo('pizzali')},
 {name:'美秀集團', image:photo('bisiugroup')}
];
export const galleryPhotos = [
 {id:'front-left', side:-1, z:3.65, image:photo('classroom-portrait'), caption:'今天妳生日', subtitle:'先放一張壽星的照片。'},
 {id:'front-right', side:1, z:3.65, image:photo('classroom-friends'), caption:'教室裡的合照', subtitle:'在教室也要拍一下。太抽象了～'},
 {id:'middle-right', side:1, z:.45, image:photo('festival-friends'), caption:'一起去音樂節', subtitle:'去音樂節，還有跟朋友一起拍照。'},
 {id:'middle-left', side:-1, z:.45, image:photo('happy-friend'), caption:'謝謝妳帶來那麼多歡笑', subtitle:'謝謝妳帶來那麼多歡笑。'},
 {id:'back-left', side:-1, z:-2.75, image:photo('cat-at-home'), caption:'還有妳家的貓', subtitle:'當然也不能少了妳家的貓。'},
 {id:'back-right', side:1, z:-2.75, images:favoriteArtists, caption:'PIZZALI ／ 美秀集團', subtitle:'還有妳喜歡的 PIZZALI 跟美秀。'}
];
export const memories = [
 {image:photo('blackboard-friends'), alt:'三位朋友在教室黑板前的合照', title:'去年生日，謝謝妳。', text:'看到教室的照片，就想到去年生日。\n你們準備了刮鬍泡，在教室幫我慶生，\n真的給了我一個驚喜。\n你們是第一群幫我過生日的朋友，\n這件事我不會忘記。', caption:'黑板前的合照'},
 {image:photo('friends-night'), alt:'夜晚和朋友們一起合照，前方拿著一張拍立得', title:'合照裡還有一張合照。', text:'這張還有拍立得入鏡。\n每張照片都有一段回憶，\n所以想放在這裡，跟妳一起看看。\n也祝妳之後想看的美秀、PIZZALI，\n都能買到票！', caption:'拍立得也一起入鏡'},
 {image:photo('friends-selfie'), alt:'三位朋友一起比耶、對著鏡頭自拍', title:'這張的表情也太好笑。', text:'不管怎樣，都希望妳開開心心的。\n不開心的事都會過去，生日快樂啦！\n希望妳以後平安、開心，\n妳跟貓咪都健健康康的。', caption:'一起比耶'},
 {image:photo('everyone-together'), alt:'一群朋友在建築前開心合照', title:'生日快樂啦，六百！', text:'最後放一張大家的合照。\n祝妳心想事成，學業進步，\n考試都能考到想要的成績。\n去年謝謝你們幫我過生日，\n今年也想好好幫妳慶祝一下。', caption:'大家都在這張裡'}
];
