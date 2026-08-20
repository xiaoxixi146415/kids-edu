export interface HanziItem {
  id: string
  /** 主题分组：数字 / 自然 / 动物 / 身体 / 常用字 */
  category: string
  emoji: string
  /** 汉字 */
  hanzi: string
  /** 拼音 */
  pinyin: string
  /** 组词（1-2 个，幼儿常用词） */
  words: string[]
  /** 幼儿向一句话讲解（含字形联想） */
  text: string
}

export const hanzi: HanziItem[] = [
  // ===== 数字 =====
  {
    id: 'yi',
    category: '数字',
    emoji: '🥇',
    hanzi: '一',
    pinyin: 'yī',
    words: ['一个', '第一'],
    text: '一像一根直直的小木棍，是第一个数字，表示只有一个。',
  },
  {
    id: 'er',
    category: '数字',
    emoji: '🥈',
    hanzi: '二',
    pinyin: 'èr',
    words: ['二个', '第二'],
    text: '二像两只小鸭子，上面一横下面一横，表示有两个。',
  },
  {
    id: 'san',
    category: '数字',
    emoji: '🥉',
    hanzi: '三',
    pinyin: 'sān',
    words: ['三个', '三只小羊'],
    text: '三有三条横线，像叠起来的楼梯，表示有三个。',
  },
  {
    id: 'shi',
    category: '数字',
    emoji: '✨',
    hanzi: '十',
    pinyin: 'shí',
    words: ['十个', '十字路口'],
    text: '十一横一竖，就像十字路口交叉的路，表示十个。',
  },
  // ===== 自然 =====
  {
    id: 'ri',
    category: '自然',
    emoji: '☀️',
    hanzi: '日',
    pinyin: 'rì',
    words: ['日出', '生日'],
    text: '日就是太阳，一个圆圈加一横，太阳升起就带来白天。',
  },
  {
    id: 'yue',
    category: '自然',
    emoji: '🌙',
    hanzi: '月',
    pinyin: 'yuè',
    words: ['月亮', '月牙'],
    text: '月像弯弯的月牙，晚上静静地挂在天上。',
  },
  {
    id: 'shan',
    category: '自然',
    emoji: '⛰️',
    hanzi: '山',
    pinyin: 'shān',
    words: ['大山', '爬山'],
    text: '山中间高两边低，就像高高的山峰，我们一起去爬山。',
  },
  {
    id: 'shui',
    category: '自然',
    emoji: '💧',
    hanzi: '水',
    pinyin: 'shuǐ',
    words: ['喝水', '流水'],
    text: '水像哗哗流动的小河，我们每天都要喝水。',
  },
  // ===== 动物 =====
  {
    id: 'ma',
    category: '动物',
    emoji: '🐴',
    hanzi: '马',
    pinyin: 'mǎ',
    words: ['小马', '骑马'],
    text: '马有四条腿，跑起来哒哒哒，比小牛跑得快。',
  },
  {
    id: 'niu',
    category: '动物',
    emoji: '🐮',
    hanzi: '牛',
    pinyin: 'niú',
    words: ['小牛', '牛奶'],
    text: '牛爱吃草，还会帮农民伯伯耕地，产出的牛奶很好喝。',
  },
  {
    id: 'yang',
    category: '动物',
    emoji: '🐑',
    hanzi: '羊',
    pinyin: 'yáng',
    words: ['小羊', '山羊'],
    text: '羊穿着软软的毛大衣，爱吃青草，还会咩咩叫。',
  },
  {
    id: 'niao',
    category: '动物',
    emoji: '🐦',
    hanzi: '鸟',
    pinyin: 'niǎo',
    words: ['小鸟', '飞鸟'],
    text: '鸟有翅膀会飞，在天空叽叽喳喳唱着歌。',
  },
  // ===== 身体 =====
  {
    id: 'kou',
    category: '身体',
    emoji: '👄',
    hanzi: '口',
    pinyin: 'kǒu',
    words: ['嘴巴', '门口'],
    text: '口就是我们的嘴巴，用来吃饭和说话。',
  },
  {
    id: 'shou',
    category: '身体',
    emoji: '🖐️',
    hanzi: '手',
    pinyin: 'shǒu',
    words: ['小手', '洗手'],
    text: '手有五个手指，帮我们拿东西、画画、写数字。',
  },
  {
    id: 'mu',
    category: '身体',
    emoji: '👁️',
    hanzi: '目',
    pinyin: 'mù',
    words: ['眼睛', '目光'],
    text: '目就是眼睛，用来看世界，看清每一件东西。',
  },
  {
    id: 'zu',
    category: '身体',
    emoji: '🦶',
    hanzi: '足',
    pinyin: 'zú',
    words: ['足球', '远足'],
    text: '足就是脚，帮我们走路、跑步、踢球。',
  },
  // ===== 常用字 =====
  {
    id: 'ren',
    category: '常用字',
    emoji: '🧑',
    hanzi: '人',
    pinyin: 'rén',
    words: ['大人', '小朋友'],
    text: '人像一个站得直直的小朋友，两条腿稳稳地站着。',
  },
  {
    id: 'da',
    category: '常用字',
    emoji: '🐘',
    hanzi: '大',
    pinyin: 'dà',
    words: ['大人', '大山'],
    text: '大表示很大的意思，大象就是很大的动物。',
  },
  {
    id: 'xiao',
    category: '常用字',
    emoji: '🐣',
    hanzi: '小',
    pinyin: 'xiǎo',
    words: ['小鸟', '小孩'],
    text: '小表示很小的意思，小鸡和小鸟都是小小的。',
  },
  {
    id: 'shang',
    category: '常用字',
    emoji: '⬆️',
    hanzi: '上',
    pinyin: 'shàng',
    words: ['上面', '上课'],
    text: '上表示高高的地方，小鸟在天上飞，手放在桌子上面。',
  },
]
