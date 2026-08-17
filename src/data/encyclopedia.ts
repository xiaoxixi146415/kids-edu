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
]
