/**
 * 安静书 · 电子版互动内容
 *
 * 仿实物「安静书」设计：一页 = 一个布书机关场景，整页做完算完成。
 * 玩法全部是「点一点」（无需拖动，适合幼儿小肌肉发展期）：
 * - goal 'pick-one'：单选 —— 从几个东西里点出对的
 * - goal 'pick-all'：多选 —— 把某一类全部点出来（点对进小篮，点错摇一摇提示再找）
 * - goal 'spot-diff'：找不同 —— 下排与上排（reference）对照，把被改过的地方全部点出
 * - goal 'whats-missing'：谁不见了 —— 先记住 memory 里的小家伙，消失后点出躲起来的那个
 * - goal 'shadow'：影子配对 —— 看着彩色的小动物，在黑色影子里点出它的影子
 * 每页完成后计入学习激励（useProgress.learn('quietbook', pageId)），首次完成 +⭐
 * 并计入今日任务；总页数即首页栏目卡总数。
 */
export interface QbOption {
  kind: 'emoji' | 'color' | 'num'
  /** 读给小朋友的 / 无障碍名（颜色页 = 颜色名，emoji = 物品名） */
  label?: string
  emoji?: string
  /** 颜色页的小圆点色值 */
  color?: string
  /** 数字页的数字 */
  value?: number
}

export interface QbRound {
  /** 任务引导语（显示 + 朗读） */
  ask: string
  goal: 'pick-one' | 'pick-all' | 'spot-diff' | 'whats-missing' | 'shadow'
  /** 数数页/影子页题目区：摆出 quantity 个 emoji（count=1 时放大展示主角） */
  quantity?: { emoji: string; count: number }
  /** 找不同：上面的「原样」一栏，与 options 逐位对照，不同处即答案 */
  reference?: QbOption[]
  /** 谁不见了：先记住的这串小家伙（记忆阶段展示） */
  memory?: QbOption[]
  /** 谁不见了：消失之后的追问语（点一点哪个躲起来了） */
  after?: string
  options: QbOption[]
  /** 正确答案在 options 中的下标（spot-diff 为不同处下标，whats-missing 为躲起来的那个） */
  answer: number[]
}

export interface QbPage {
  id: string
  emoji: string
  title: string
  /** 翻到这页时念的引导语 */
  intro: string
  /** 页面色调：浅色底 / 强调色 */
  bg: string
  accent: string
  rounds: QbRound[]
}

export const quietbook: QbPage[] = [
  /* ========== 1. 穿衣小帮手 ========== */
  {
    id: 'dress',
    emoji: '👗',
    title: '穿衣小帮手',
    intro: '天气不一样，穿的衣服也不一样。我们来帮小熊选衣服吧！',
    bg: '#fff4e0',
    accent: '#ea580c',
    rounds: [
      {
        ask: '下雪啦，外面好冷呀！找出下雪天要穿的衣服，都点进小衣柜里。',
        goal: 'pick-all',
        options: [
          { kind: 'emoji', emoji: '🧥', label: '棉袄' },
          { kind: 'emoji', emoji: '🧣', label: '围巾' },
          { kind: 'emoji', emoji: '🧤', label: '手套' },
          { kind: 'emoji', emoji: '👕', label: '短袖' },
          { kind: 'emoji', emoji: '🩴', label: '凉鞋' },
        ],
        answer: [0, 1, 2],
      },
      {
        ask: '太阳大大的，好热呀！找出大热天穿的衣服，点进小衣柜里。',
        goal: 'pick-all',
        options: [
          { kind: 'emoji', emoji: '🩳', label: '短裤' },
          { kind: 'emoji', emoji: '👕', label: '短袖' },
          { kind: 'emoji', emoji: '🧢', label: '遮阳帽' },
          { kind: 'emoji', emoji: '🧥', label: '棉袄' },
          { kind: 'emoji', emoji: '🧣', label: '围巾' },
        ],
        answer: [0, 1, 2],
      },
      {
        ask: '下雨啦，找出下雨天要穿的衣服和雨具，点进小衣柜里。',
        goal: 'pick-all',
        options: [
          { kind: 'emoji', emoji: '🧥', label: '雨衣' },
          { kind: 'emoji', emoji: '👢', label: '雨靴' },
          { kind: 'emoji', emoji: '☂️', label: '雨伞' },
          { kind: 'emoji', emoji: '👙', label: '泳衣' },
          { kind: 'emoji', emoji: '🕶️', label: '墨镜' },
        ],
        answer: [0, 1, 2],
      },
    ],
  },

  /* ========== 2. 颜色点点找朋友 ========== */
  {
    id: 'colors',
    emoji: '🎨',
    title: '颜色点点',
    intro: '红色、黄色、蓝色、绿色、橙色……帮颜色小球找朋友吧！',
    bg: '#eaf4ff',
    accent: '#0284c7',
    rounds: [
      {
        ask: '找一找，哪个小球是红色的？点一点它。',
        goal: 'pick-one',
        options: [
          { kind: 'color', color: '#ef4444', label: '红色小球' },
          { kind: 'color', color: '#facc15', label: '黄色小球' },
          { kind: 'color', color: '#3b82f6', label: '蓝色小球' },
          { kind: 'color', color: '#22c55e', label: '绿色小球' },
          { kind: 'color', color: '#f97316', label: '橙色小球' },
        ],
        answer: [0],
      },
      {
        ask: '找一找，哪个小球是蓝色的？点一点它。',
        goal: 'pick-one',
        options: [
          { kind: 'color', color: '#3b82f6', label: '蓝色小球' },
          { kind: 'color', color: '#22c55e', label: '绿色小球' },
          { kind: 'color', color: '#f97316', label: '橙色小球' },
          { kind: 'color', color: '#ef4444', label: '红色小球' },
          { kind: 'color', color: '#facc15', label: '黄色小球' },
        ],
        answer: [0],
      },
      {
        ask: '找一找，哪个小球是绿色的？点一点它。',
        goal: 'pick-one',
        options: [
          { kind: 'color', color: '#22c55e', label: '绿色小球' },
          { kind: 'color', color: '#f97316', label: '橙色小球' },
          { kind: 'color', color: '#3b82f6', label: '蓝色小球' },
          { kind: 'color', color: '#facc15', label: '黄色小球' },
          { kind: 'color', color: '#ef4444', label: '红色小球' },
        ],
        answer: [0],
      },
      {
        ask: '找一找，哪个小球是黄色的？点一点它。',
        goal: 'pick-one',
        options: [
          { kind: 'color', color: '#facc15', label: '黄色小球' },
          { kind: 'color', color: '#ef4444', label: '红色小球' },
          { kind: 'color', color: '#22c55e', label: '绿色小球' },
          { kind: 'color', color: '#f97316', label: '橙色小球' },
          { kind: 'color', color: '#3b82f6', label: '蓝色小球' },
        ],
        answer: [0],
      },
      {
        ask: '找一找，哪个小球是橙色的？点一点它。',
        goal: 'pick-one',
        options: [
          { kind: 'color', color: '#f97316', label: '橙色小球' },
          { kind: 'color', color: '#3b82f6', label: '蓝色小球' },
          { kind: 'color', color: '#ef4444', label: '红色小球' },
          { kind: 'color', color: '#facc15', label: '黄色小球' },
          { kind: 'color', color: '#22c55e', label: '绿色小球' },
        ],
        answer: [0],
      },
    ],
  },

  /* ========== 3. 数一数 点一点 ========== */
  {
    id: 'counting',
    emoji: '🔢',
    title: '数一数',
    intro: '数一数小东西有几个，再点一点数字朋友！',
    bg: '#fff9dc',
    accent: '#ca8a04',
    rounds: [
      {
        ask: '篮子里有几个苹果？数一数，点一点下面的数字。',
        goal: 'pick-one',
        quantity: { emoji: '🍎', count: 3 },
        options: [
          { kind: 'num', value: 3 },
          { kind: 'num', value: 1 },
          { kind: 'num', value: 5 },
          { kind: 'num', value: 6 },
          { kind: 'num', value: 2 },
          { kind: 'num', value: 4 },
        ],
        answer: [0],
      },
      {
        ask: '池塘里有几只小鸭子？数一数，点一点下面的数字。',
        goal: 'pick-one',
        quantity: { emoji: '🐤', count: 4 },
        options: [
          { kind: 'num', value: 2 },
          { kind: 'num', value: 4 },
          { kind: 'num', value: 1 },
          { kind: 'num', value: 6 },
          { kind: 'num', value: 3 },
          { kind: 'num', value: 5 },
        ],
        answer: [1],
      },
      {
        ask: '天上有几颗小星星？数一数，点一点下面的数字。',
        goal: 'pick-one',
        quantity: { emoji: '⭐', count: 5 },
        options: [
          { kind: 'num', value: 5 },
          { kind: 'num', value: 2 },
          { kind: 'num', value: 1 },
          { kind: 'num', value: 4 },
          { kind: 'num', value: 6 },
          { kind: 'num', value: 3 },
        ],
        answer: [0],
      },
      {
        ask: '花园里有几只蝴蝶？数一数，点一点下面的数字。',
        goal: 'pick-one',
        quantity: { emoji: '🦋', count: 2 },
        options: [
          { kind: 'num', value: 1 },
          { kind: 'num', value: 6 },
          { kind: 'num', value: 3 },
          { kind: 'num', value: 2 },
          { kind: 'num', value: 5 },
          { kind: 'num', value: 4 },
        ],
        answer: [3],
      },
    ],
  },

  /* ========== 4. 动物宝宝吃什么 ========== */
  {
    id: 'food',
    emoji: '🐾',
    title: '动物吃什么',
    intro: '小动物们肚子咕咕叫，快来帮它们找好吃的吧！',
    bg: '#eaffef',
    accent: '#16a34a',
    rounds: [
      {
        ask: '小兔子肚子饿了，它最喜欢吃什么？点一点。',
        goal: 'pick-one',
        quantity: { emoji: '🐰', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🥕', label: '胡萝卜' },
          { kind: 'emoji', emoji: '🦴', label: '骨头' },
          { kind: 'emoji', emoji: '🎋', label: '竹子' },
          { kind: 'emoji', emoji: '🐟', label: '小鱼' },
        ],
        answer: [0],
      },
      {
        ask: '小狗肚子饿了，它最喜欢吃什么？点一点。',
        goal: 'pick-one',
        quantity: { emoji: '🐶', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🍎', label: '苹果' },
          { kind: 'emoji', emoji: '🥕', label: '胡萝卜' },
          { kind: 'emoji', emoji: '🦴', label: '骨头' },
          { kind: 'emoji', emoji: '🍌', label: '香蕉' },
        ],
        answer: [2],
      },
      {
        ask: '小猫肚子饿了，它最喜欢吃什么？点一点。',
        goal: 'pick-one',
        quantity: { emoji: '🐱', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🐟', label: '小鱼' },
          { kind: 'emoji', emoji: '🦴', label: '骨头' },
          { kind: 'emoji', emoji: '🥕', label: '胡萝卜' },
          { kind: 'emoji', emoji: '🍇', label: '葡萄' },
        ],
        answer: [0],
      },
      {
        ask: '熊猫肚子饿了，它最喜欢吃什么？点一点。',
        goal: 'pick-one',
        quantity: { emoji: '🐼', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🍌', label: '香蕉' },
          { kind: 'emoji', emoji: '🦴', label: '骨头' },
          { kind: 'emoji', emoji: '🥕', label: '胡萝卜' },
          { kind: 'emoji', emoji: '🎋', label: '竹子' },
        ],
        answer: [3],
      },
      {
        ask: '小猴子肚子饿了，它最喜欢吃什么？点一点。',
        goal: 'pick-one',
        quantity: { emoji: '🐵', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🐟', label: '小鱼' },
          { kind: 'emoji', emoji: '🍌', label: '香蕉' },
          { kind: 'emoji', emoji: '🎋', label: '竹子' },
          { kind: 'emoji', emoji: '🦴', label: '骨头' },
        ],
        answer: [1],
      },
    ],
  },

  /* ========== 5. 果蔬分分类 ========== */
  {
    id: 'sorting',
    emoji: '🧺',
    title: '果蔬分类',
    intro: '水果和蔬菜要分开放，把它们点进对的篮子里吧！',
    bg: '#fdf1ff',
    accent: '#a21caf',
    rounds: [
      {
        ask: '小篮子里要装水果。找出下面的水果，把它们都点进篮子。',
        goal: 'pick-all',
        options: [
          { kind: 'emoji', emoji: '🍎', label: '苹果' },
          { kind: 'emoji', emoji: '🥦', label: '西兰花' },
          { kind: 'emoji', emoji: '🍌', label: '香蕉' },
          { kind: 'emoji', emoji: '🍞', label: '面包' },
          { kind: 'emoji', emoji: '🍇', label: '葡萄' },
        ],
        answer: [0, 2, 4],
      },
      {
        ask: '小篮子里要装蔬菜。找出下面的蔬菜，把它们都点进篮子。',
        goal: 'pick-all',
        options: [
          { kind: 'emoji', emoji: '🍦', label: '冰淇淋' },
          { kind: 'emoji', emoji: '🥕', label: '胡萝卜' },
          { kind: 'emoji', emoji: '🍎', label: '苹果' },
          { kind: 'emoji', emoji: '🍆', label: '茄子' },
          { kind: 'emoji', emoji: '🥦', label: '西兰花' },
        ],
        answer: [1, 3, 4],
      },
      {
        ask: '再帮小篮子装满水果。找出下面的水果，把它们都点进篮子。',
        goal: 'pick-all',
        options: [
          { kind: 'emoji', emoji: '🍓', label: '草莓' },
          { kind: 'emoji', emoji: '🥒', label: '黄瓜' },
          { kind: 'emoji', emoji: '🍑', label: '桃子' },
          { kind: 'emoji', emoji: '🍗', label: '鸡腿' },
          { kind: 'emoji', emoji: '🍕', label: '披萨' },
        ],
        answer: [0, 2],
      },
    ],
  },

  /* ========== 6. 动物住哪里 ========== */
  {
    id: 'habitat',
    emoji: '🏡',
    title: '动物住哪里',
    intro: '每个小动物都有自己的家。想一想，它们住在哪里呢？',
    bg: '#e6f6f5',
    accent: '#0f766e',
    rounds: [
      {
        ask: '谁会在天上飞呀？找出会飞的小动物，把它们都点出来。',
        goal: 'pick-all',
        quantity: { emoji: '☁️', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🐦', label: '小鸟' },
          { kind: 'emoji', emoji: '🐶', label: '小狗' },
          { kind: 'emoji', emoji: '🦋', label: '蝴蝶' },
          { kind: 'emoji', emoji: '🐘', label: '大象' },
          { kind: 'emoji', emoji: '🐝', label: '蜜蜂' },
        ],
        answer: [0, 2, 4],
      },
      {
        ask: '谁生活在水里呀？找出生活在水里的小动物，把它们都点出来。',
        goal: 'pick-all',
        quantity: { emoji: '🌊', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🐟', label: '小鱼' },
          { kind: 'emoji', emoji: '🐰', label: '小兔' },
          { kind: 'emoji', emoji: '🐬', label: '海豚' },
          { kind: 'emoji', emoji: '🦁', label: '狮子' },
          { kind: 'emoji', emoji: '🦀', label: '螃蟹' },
        ],
        answer: [0, 2, 4],
      },
      {
        ask: '谁住在农场里呀？找出农场里的小动物，把它们都点出来。',
        goal: 'pick-all',
        quantity: { emoji: '🌾', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🐄', label: '奶牛' },
          { kind: 'emoji', emoji: '🦊', label: '狐狸' },
          { kind: 'emoji', emoji: '🐑', label: '小羊' },
          { kind: 'emoji', emoji: '🐺', label: '大灰狼' },
          { kind: 'emoji', emoji: '🐎', label: '小马' },
        ],
        answer: [0, 2, 4],
      },
    ],
  },

  /* ========== 7. 火眼金睛找不同 ========== */
  {
    id: 'spot',
    emoji: '🧐',
    title: '找不同',
    intro: '小侦探，仔细瞧！下面的图和上面的图比一比，有几个地方悄悄变啦，快把它们都找出来！',
    bg: '#fff0f6',
    accent: '#db2777',
    rounds: [
      {
        ask: '上面和下面是两排水果，有 2 个地方不一样。点出下面不一样的水果！',
        goal: 'spot-diff',
        reference: [
          { kind: 'emoji', emoji: '🍎', label: '苹果' },
          { kind: 'emoji', emoji: '🍌', label: '香蕉' },
          { kind: 'emoji', emoji: '🍇', label: '葡萄' },
          { kind: 'emoji', emoji: '🍓', label: '草莓' },
          { kind: 'emoji', emoji: '🍑', label: '桃子' },
        ],
        options: [
          { kind: 'emoji', emoji: '🍎', label: '苹果' },
          { kind: 'emoji', emoji: '🍊', label: '橙子' },
          { kind: 'emoji', emoji: '🍇', label: '葡萄' },
          { kind: 'emoji', emoji: '🍓', label: '草莓' },
          { kind: 'emoji', emoji: '🥝', label: '猕猴桃' },
        ],
        answer: [1, 4],
      },
      {
        ask: '玩具也变了样，有 2 个地方不一样。点出下面不一样的小玩具！',
        goal: 'spot-diff',
        reference: [
          { kind: 'emoji', emoji: '🚗', label: '小汽车' },
          { kind: 'emoji', emoji: '✈️', label: '飞机' },
          { kind: 'emoji', emoji: '🚂', label: '小火车' },
          { kind: 'emoji', emoji: '🪁', label: '风筝' },
          { kind: 'emoji', emoji: '⚽', label: '皮球' },
        ],
        options: [
          { kind: 'emoji', emoji: '🚗', label: '小汽车' },
          { kind: 'emoji', emoji: '🚢', label: '轮船' },
          { kind: 'emoji', emoji: '🚂', label: '小火车' },
          { kind: 'emoji', emoji: '🪁', label: '风筝' },
          { kind: 'emoji', emoji: '🏀', label: '篮球' },
        ],
        answer: [1, 4],
      },
      {
        ask: '小动物们排排站，有 2 个小家伙变了样。点出下面不一样的小动物！',
        goal: 'spot-diff',
        reference: [
          { kind: 'emoji', emoji: '🐱', label: '小猫' },
          { kind: 'emoji', emoji: '🐶', label: '小狗' },
          { kind: 'emoji', emoji: '🐰', label: '小兔' },
          { kind: 'emoji', emoji: '🐼', label: '熊猫' },
          { kind: 'emoji', emoji: '🦊', label: '狐狸' },
          { kind: 'emoji', emoji: '🐸', label: '青蛙' },
        ],
        options: [
          { kind: 'emoji', emoji: '🐱', label: '小猫' },
          { kind: 'emoji', emoji: '🐶', label: '小狗' },
          { kind: 'emoji', emoji: '🐺', label: '大灰狼' },
          { kind: 'emoji', emoji: '🐼', label: '熊猫' },
          { kind: 'emoji', emoji: '🦊', label: '狐狸' },
          { kind: 'emoji', emoji: '🐥', label: '小鸡' },
        ],
        answer: [2, 5],
      },
    ],
  },

  /* ========== 8. 谁不见了 ========== */
  {
    id: 'hidden',
    emoji: '🙈',
    title: '谁不见了',
    intro: '小眼睛看仔细，把每个小动物都记住。等它们躲起来，看看谁不见啦！',
    bg: '#eef2ff',
    accent: '#4f46e5',
    rounds: [
      {
        ask: '仔细看，记住这几位小动物朋友。',
        after: '有一个小动物躲起来啦！谁不见了？点一点它。',
        goal: 'whats-missing',
        memory: [
          { kind: 'emoji', emoji: '🐱', label: '小猫' },
          { kind: 'emoji', emoji: '🐶', label: '小狗' },
          { kind: 'emoji', emoji: '🐰', label: '小兔' },
          { kind: 'emoji', emoji: '🐸', label: '青蛙' },
        ],
        options: [
          { kind: 'emoji', emoji: '🐶', label: '小狗' },
          { kind: 'emoji', emoji: '🐰', label: '小兔' },
          { kind: 'emoji', emoji: '🐱', label: '小猫' },
          { kind: 'emoji', emoji: '🐸', label: '青蛙' },
        ],
        answer: [3],
      },
      {
        ask: '仔细看，记住这些好吃的水果。',
        after: '有个水果被吃掉啦！谁不见了？点一点它。',
        goal: 'whats-missing',
        memory: [
          { kind: 'emoji', emoji: '🍎', label: '苹果' },
          { kind: 'emoji', emoji: '🍌', label: '香蕉' },
          { kind: 'emoji', emoji: '🍇', label: '葡萄' },
          { kind: 'emoji', emoji: '🍓', label: '草莓' },
        ],
        options: [
          { kind: 'emoji', emoji: '🍇', label: '葡萄' },
          { kind: 'emoji', emoji: '🍎', label: '苹果' },
          { kind: 'emoji', emoji: '🍌', label: '香蕉' },
          { kind: 'emoji', emoji: '🍓', label: '草莓' },
        ],
        answer: [3],
      },
      {
        ask: '仔细看，记住路上的小车子。',
        after: '有一辆车开走啦！谁不见了？点一点它。',
        goal: 'whats-missing',
        memory: [
          { kind: 'emoji', emoji: '🚗', label: '小汽车' },
          { kind: 'emoji', emoji: '🚂', label: '小火车' },
          { kind: 'emoji', emoji: '✈️', label: '飞机' },
          { kind: 'emoji', emoji: '🚌', label: '公交车' },
        ],
        options: [
          { kind: 'emoji', emoji: '✈️', label: '飞机' },
          { kind: 'emoji', emoji: '🚌', label: '公交车' },
          { kind: 'emoji', emoji: '🚗', label: '小汽车' },
          { kind: 'emoji', emoji: '🚂', label: '小火车' },
        ],
        answer: [3],
      },
      {
        ask: '仔细看，记住菜篮里的蔬菜。',
        after: '有一棵蔬菜被拿走啦！谁不见了？点一点它。',
        goal: 'whats-missing',
        memory: [
          { kind: 'emoji', emoji: '🥕', label: '胡萝卜' },
          { kind: 'emoji', emoji: '🍆', label: '茄子' },
          { kind: 'emoji', emoji: '🍅', label: '番茄' },
          { kind: 'emoji', emoji: '🥦', label: '西兰花' },
        ],
        options: [
          { kind: 'emoji', emoji: '🥦', label: '西兰花' },
          { kind: 'emoji', emoji: '🥕', label: '胡萝卜' },
          { kind: 'emoji', emoji: '🍆', label: '茄子' },
          { kind: 'emoji', emoji: '🍅', label: '番茄' },
        ],
        answer: [3],
      },
    ],
  },

  /* ========== 9. 影子找朋友 ========== */
  {
    id: 'shadows',
    emoji: '🌙',
    title: '影子找朋友',
    intro: '天黑啦，小动物们要和自己的影子手拉手。看看上面的小动物，帮它找到黑黑的影子吧！',
    bg: '#f3e8ff',
    accent: '#7c3aed',
    rounds: [
      {
        ask: '小猫要找自己的影子，下面哪个黑影子是它的？点一点。',
        goal: 'shadow',
        quantity: { emoji: '🐱', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🐱', label: '小猫' },
          { kind: 'emoji', emoji: '🐶', label: '小狗' },
          { kind: 'emoji', emoji: '🐷', label: '小猪' },
          { kind: 'emoji', emoji: '🦆', label: '小鸭' },
        ],
        answer: [0],
      },
      {
        ask: '小猪要找自己的影子，下面哪个黑影子是它的？点一点。',
        goal: 'shadow',
        quantity: { emoji: '🐷', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🦆', label: '小鸭' },
          { kind: 'emoji', emoji: '🐰', label: '小兔' },
          { kind: 'emoji', emoji: '🐷', label: '小猪' },
          { kind: 'emoji', emoji: '🐔', label: '公鸡' },
        ],
        answer: [2],
      },
      {
        ask: '青蛙要找自己的影子，下面哪个黑影子是它的？点一点。',
        goal: 'shadow',
        quantity: { emoji: '🐸', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🐶', label: '小狗' },
          { kind: 'emoji', emoji: '🐸', label: '青蛙' },
          { kind: 'emoji', emoji: '🐮', label: '奶牛' },
          { kind: 'emoji', emoji: '🦁', label: '狮子' },
        ],
        answer: [1],
      },
      {
        ask: '小鸭要找自己的影子，下面哪个黑影子是它的？点一点。',
        goal: 'shadow',
        quantity: { emoji: '🦆', count: 1 },
        options: [
          { kind: 'emoji', emoji: '🦆', label: '小鸭' },
          { kind: 'emoji', emoji: '🐸', label: '青蛙' },
          { kind: 'emoji', emoji: '🐱', label: '小猫' },
          { kind: 'emoji', emoji: '🐘', label: '大象' },
        ],
        answer: [0],
      },
    ],
  },
]
