export interface Tangshi {
  id: string
  title: string
  author: string
  dynasty: string
  emoji: string
  /** 诗句，按行排列 */
  lines: string[]
  /** 白话译文，供幼儿理解 */
  meaning: string
}

export const tangshi: Tangshi[] = [
  {
    id: 'jingyesi',
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    emoji: '🌙',
    lines: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
    meaning: '夜晚，明亮的月光照在床前，好像地上铺了一层白霜。抬起头望着天上的月亮，低下头就想起了远方的家乡。',
  },
  {
    id: 'chunxiao',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐',
    emoji: '🌷',
    lines: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
    meaning: '春天里睡得很香，天亮了都不知道。醒来听到到处都是小鸟的叫声。想起昨夜的风雨声，不知道花儿落了多少。',
  },
  {
    id: 'yonge',
    title: '咏鹅',
    author: '骆宾王',
    dynasty: '唐',
    emoji: '🦢',
    lines: ['鹅，鹅，鹅', '曲项向天歌', '白毛浮绿水', '红掌拨清波'],
    meaning: '鹅呀鹅，弯弯的脖子朝着天空唱歌，白白的羽毛浮在绿绿的水上，红红的脚掌拨动着清清的水波。',
  },
  {
    id: 'dengguanquelou',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    emoji: '⛰️',
    lines: ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'],
    meaning: '太阳挨着山慢慢地落下，黄河水哗哗地流向大海。要想看得更远，就要再登上一层高楼。',
  },
  {
    id: 'minnong',
    title: '悯农（其二）',
    author: '李绅',
    dynasty: '唐',
    emoji: '🌾',
    lines: ['锄禾日当午', '汗滴禾下土', '谁知盘中餐', '粒粒皆辛苦'],
    meaning: '中午的太阳很晒，农民伯伯还在田里锄地，汗水滴在禾苗下的泥土里。谁知道碗里的每一粒米饭，来得都那么辛苦。',
  },
  {
    id: 'yongliu',
    title: '咏柳',
    author: '贺知章',
    dynasty: '唐',
    emoji: '🌿',
    lines: ['碧玉妆成一树高', '万条垂下绿丝绦', '不知细叶谁裁出', '二月春风似剪刀'],
    meaning: '高高的柳树像碧玉装扮的一样，千万条柳枝垂下来，像绿色的丝带。不知道细细的叶子是谁剪出来的，原来是二月的春风像剪刀一样。',
  },
  {
    id: 'wanglushanpubu',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    emoji: '💦',
    lines: ['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'],
    meaning: '太阳照在香炉峰上，升起紫色的烟雾。远远看去，瀑布像挂在山前的河流。水流哗哗地从高处直冲下来，好像是银河从天上落下来。',
  },
  {
    id: 'fudeguyuancao',
    title: '赋得古原草送别（节选）',
    author: '白居易',
    dynasty: '唐',
    emoji: '🌱',
    lines: ['离离原上草', '一岁一枯荣', '野火烧不尽', '春风吹又生'],
    meaning: '原野上长满了茂盛的野草，一年里枯萎又茂盛。野火怎么烧也烧不完，因为春风吹来，草又长出来了。',
  },
]
