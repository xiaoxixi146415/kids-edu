export interface RhymeLine {
  /** 本句剧场大字 emoji */
  emoji: string
  /** 歌词一句（不含标点拆分，长度适合整句朗读） */
  text: string
}

export interface NurseryRhyme {
  id: string
  /** 分组：动物 / 自然 / 生活 / 游戏 */
  category: string
  emoji: string
  title: string
  lines: RhymeLine[]
  /** 唱完后家长引导提问（大班认知：联系生活/原因/道理），点读可朗读 */
  tip: string
}

/** 儿童歌谣：以传统童谣为主，歌词逐句配 emoji 小剧场，每首附「想一想」互动提问 */
export const nurseryRhymes: NurseryRhyme[] = [
  {
    id: 'twinkle',
    category: '自然',
    emoji: '⭐',
    title: '小星星',
    lines: [
      { emoji: '🌌', text: '一闪一闪亮晶晶' },
      { emoji: '⭐', text: '满天都是小星星' },
      { emoji: '💡', text: '挂在天上放光明' },
      { emoji: '👀', text: '好像许多小眼睛' },
      { emoji: '🌠', text: '一闪一闪亮晶晶' },
      { emoji: '⭐', text: '满天都是小星星' },
    ],
    tip: '想一想：星星真的是亮亮的小片片吗？其实我们看到的星星，大多是好远好远、像太阳一样会发光的大星球哦。',
  },
  {
    id: 'two-tigers',
    category: '动物',
    emoji: '🐯',
    title: '两只老虎',
    lines: [
      { emoji: '🐯', text: '两只老虎，两只老虎' },
      { emoji: '💨', text: '跑得快，跑得快' },
      { emoji: '🙉', text: '一只没有耳朵' },
      { emoji: '🐵', text: '一只没有尾巴' },
      { emoji: '🤔', text: '真奇怪，真奇怪' },
    ],
    tip: '想一想：真正的老虎有耳朵也有尾巴，歌里唱得可真夸张！这是一首好玩的滑稽歌，唱着玩就好啦。',
  },
  {
    id: 'white-rabbit',
    category: '动物',
    emoji: '🐰',
    title: '小白兔白又白',
    lines: [
      { emoji: '🐰', text: '小白兔，白又白' },
      { emoji: '👂', text: '两只耳朵竖起来' },
      { emoji: '🥕', text: '爱吃萝卜和青菜' },
      { emoji: '🐇', text: '蹦蹦跳跳真可爱' },
    ],
    tip: '想一想：兔子的耳朵为什么老是竖得高高的？因为长耳朵能听见很远处的声音，一有危险就能马上跑掉，很厉害吧。',
  },
  {
    id: 'little-rabbit-open',
    category: '动物',
    emoji: '🐇',
    title: '小兔子乖乖',
    lines: [
      { emoji: '🐰', text: '小兔子乖乖，把门儿开开' },
      { emoji: '🚪', text: '快点儿开开，我要进来' },
      { emoji: '🙅', text: '不开不开我不开' },
      { emoji: '👩', text: '妈妈没回来，谁来也不开' },
    ],
    tip: '想一想：小兔子为什么谁敲门都不开？对啦，一个人在家时，不认识的人敲门绝对不能开，等爸爸妈妈回来才安全。',
  },
  {
    id: 'little-mouse',
    category: '动物',
    emoji: '🐭',
    title: '小老鼠上灯台',
    lines: [
      { emoji: '🪔', text: '小老鼠，上灯台' },
      { emoji: '🕯️', text: '偷油吃，下不来' },
      { emoji: '😾', text: '喵喵喵，猫来了' },
      { emoji: '🌀', text: '叽里咕噜滚下来' },
    ],
    tip: '想一想：小老鼠偷偷去拿别人的东西，结果吓得滚下来啦。别人的东西可不能随便拿，想要要先问一问哦。',
  },
  {
    id: 'find-friend',
    category: '游戏',
    emoji: '🤝',
    title: '找朋友',
    lines: [
      { emoji: '🔍', text: '找呀找呀找朋友' },
      { emoji: '🧒', text: '找到一个好朋友' },
      { emoji: '🙋', text: '敬个礼呀握握手' },
      { emoji: '😊', text: '笑嘻嘻呀点点头' },
      { emoji: '🤝', text: '你是我的好朋友' },
    ],
    tip: '想一想：怎样交到更多好朋友？先有礼貌地说「你好」，愿意分享、会帮忙，朋友就会越来越多哦。',
  },
  {
    id: 'pull-turnip',
    category: '游戏',
    emoji: '🥕',
    title: '拔萝卜',
    lines: [
      { emoji: '🧑‍🌾', text: '拔萝卜，拔萝卜' },
      { emoji: '💪', text: '嘿哟嘿哟拔萝卜，嘿哟嘿哟拔不动' },
      { emoji: '👵', text: '老婆婆，快快来，快来帮我们拔萝卜' },
      { emoji: '👧', text: '小姑娘，快快来，快来帮我们拔萝卜' },
      { emoji: '🐶', text: '小花狗，快快来，快来帮我们拔萝卜' },
      { emoji: '🐱', text: '小花猫，快快来，快来帮我们拔萝卜' },
      { emoji: '🎉', text: '嘿哟嘿哟，大萝卜终于拔出来啦' },
    ],
    tip: '想一想：一个人拔不动的大萝卜，为什么大家一起就拔出来了？对呀，团结合作力量大！',
  },
  {
    id: 'row-to-grandma',
    category: '生活',
    emoji: '🚣',
    title: '摇到外婆桥',
    lines: [
      { emoji: '🚣', text: '摇啊摇，摇啊摇' },
      { emoji: '🌉', text: '摇到外婆桥' },
      { emoji: '👵', text: '外婆叫我好宝宝' },
      { emoji: '🍬', text: '糖一包，果一包' },
      { emoji: '🍰', text: '还有饼儿还有糕' },
    ],
    tip: '想一想：外婆为什么总把好吃的留给你？因为你是她的小宝贝呀。多去看看外婆外公，他们最开心啦。',
  },
  {
    id: 'saw-sing',
    category: '生活',
    emoji: '🪚',
    title: '拉大锯',
    lines: [
      { emoji: '🪚', text: '拉大锯，扯大锯' },
      { emoji: '🎭', text: '姥姥家唱大戏' },
      { emoji: '👧', text: '接姑娘，请女婿' },
      { emoji: '👶', text: '小外孙，也要去' },
    ],
    tip: '想一想：歌里要去姥姥家看什么热闹？是唱大戏呀。一家人都聚在一起，看戏、聊天，真热闹。',
  },
]
