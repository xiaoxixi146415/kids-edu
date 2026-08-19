export interface EncyclopediaItem {
  id: string
  category: string
  emoji: string
  title: string
  /** 科普内容，点开详情时朗读 */
  text: string
}

export const encyclopedia: EncyclopediaItem[] = [
  {
    id: 'elephant',
    category: '动物',
    emoji: '🐘',
    title: '大象',
    text: '大象是陆地上最大的动物，它的鼻子又长又有力气，可以喷水洗澡，也可以卷起食物放进嘴巴里。',
  },
  {
    id: 'giraffe',
    category: '动物',
    emoji: '🦒',
    title: '长颈鹿',
    text: '长颈鹿是世界上脖子最长的动物，它站在那儿，就可以吃到高高的树上的叶子。',
  },
  {
    id: 'bee',
    category: '动物',
    emoji: '🐝',
    title: '小蜜蜂',
    text: '小蜜蜂很勤劳，它飞到花朵里采花蜜，还能酿出甜甜的蜂蜜。',
  },
  {
    id: 'whale',
    category: '动物',
    emoji: '🐋',
    title: '鲸鱼',
    text: '鲸鱼住在海里，可是它并不是鱼，它像我们一样用肺呼吸，要经常浮到水面上换气。',
  },
  {
    id: 'panda',
    category: '动物',
    emoji: '🐼',
    title: '熊猫',
    text: '熊猫圆滚滚的，身上只有黑色和白色，最喜欢抱着竹子吃，是中国的小朋友特别喜欢的国宝。',
  },
  {
    id: 'tiger',
    category: '动物',
    emoji: '🐯',
    title: '老虎',
    text: '老虎身上有漂亮的条纹，它跑得很快，是森林里厉害的大王，吼起来声音可大了。',
  },
  {
    id: 'penguin',
    category: '动物',
    emoji: '🐧',
    title: '企鹅',
    text: '企鹅住在很冷很冷的南极，它走路摇摇摆摆，还会跳进水里游泳，抓小鱼吃。',
  },
  {
    id: 'dolphin',
    category: '动物',
    emoji: '🐬',
    title: '海豚',
    text: '海豚很聪明也很友善，它会在海面上跳来跳去，还能学会人们教它的本领。',
  },
  {
    id: 'sun',
    category: '自然',
    emoji: '☀️',
    title: '太阳',
    text: '太阳是一个大大的火球，它每天从东方升起来，给我们带来光明和温暖。',
  },
  {
    id: 'moon',
    category: '自然',
    emoji: '🌙',
    title: '月亮',
    text: '月亮在晚上出现，它会变圆又会变弯，像一个大银盘，也像一只弯弯的小船。',
  },
  {
    id: 'rainbow',
    category: '自然',
    emoji: '🌈',
    title: '彩虹',
    text: '下过雨后，太阳出来了，天上就会出现彩虹，它有七种颜色，像一座彩色的桥。',
  },
  {
    id: 'sea',
    category: '自然',
    emoji: '🌊',
    title: '大海',
    text: '大海又大又蓝，海浪哗啦哗啦地拍打着沙滩，海里住着好多好多的小鱼。',
  },
  {
    id: 'star',
    category: '自然',
    emoji: '⭐',
    title: '星星',
    text: '天黑了，星星就一颗一颗亮起来，一闪一闪的，好像在和我们眨眼睛。离我们最近的星星就是太阳。',
  },
  {
    id: 'snow',
    category: '自然',
    emoji: '❄️',
    title: '雪花',
    text: '冬天到了，天空会飘下小小的雪花，白白的、凉凉的，落在手心里，一下子就变成小水滴了。',
  },
  {
    id: 'volcano',
    category: '自然',
    emoji: '🌋',
    title: '火山',
    text: '火山是一座高高的山，它的肚子里有很烫很烫的岩浆，生气的时候就会喷出来，冒出红色的火焰。',
  },
  {
    id: 'wind',
    category: '自然',
    emoji: '🍃',
    title: '风',
    text: '风看不见也摸不着，可是我们能感觉到它，树会摇，风筝会飞，都是风在帮忙。',
  },
  {
    id: 'tooth',
    category: '生活常识',
    emoji: '🦷',
    title: '牙齿',
    text: '牙齿长在嘴巴里，帮我们把食物咬碎嚼烂。每天早晚刷牙，牙齿才会白白亮亮、健健康康。',
  },
  {
    id: 'shadow',
    category: '生活常识',
    emoji: '👤',
    title: '影子',
    text: '太阳照着我们，地上就会出现一个黑黑的影子，我们动，影子也动，像在和我们玩游戏。',
  },
  {
    id: 'bubble',
    category: '生活常识',
    emoji: '🫧',
    title: '泡泡',
    text: '泡泡圆圆的、亮亮的，用泡泡水轻轻一吹就飞上天，太阳一照，还会变成五颜六色的。',
  },
  {
    id: 'traffic-light',
    category: '生活常识',
    emoji: '🚦',
    title: '红绿灯',
    text: '马路边的红绿灯在指挥汽车和行人。红灯停，绿灯行，黄灯亮了等一等，过马路要看好它。',
  },
]
