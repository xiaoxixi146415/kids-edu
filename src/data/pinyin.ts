export interface PinyinItem {
  id: string
  /** 分组：声母 / 韵母 / 整体认读音节 */
  group: string
  /** 拼音字母/音节（用于展示） */
  pinyin: string
  /**
   * 该拼音的中文呼读音（汉字）。
   * 语音合成遇到 b、p、zh 这类拉丁字母时会按英文字母念（"bi"、"pi"），
   * 因此朗读一律用汉字代替，如 b → 玻、zh → 知。
   */
  sound: string
  /** 例词（含该音的幼儿常用词） */
  example: string
  emoji: string
  /** 幼儿向一句话讲解（避免出现拉丁字母，保证朗读正确） */
  text: string
}

export const pinyin: PinyinItem[] = [
  // ===== 声母 =====
  { id: 'b', group: '声母', pinyin: 'b', sound: '玻', example: '玻璃', emoji: '🧊', text: '小嘴唇闭上再打开，玻璃的玻。' },
  { id: 'p', group: '声母', pinyin: 'p', sound: '坡', example: '皮球', emoji: '⚽', text: '和「玻」一样的嘴型，多用点气吹出来，皮球的皮。' },
  { id: 'm', group: '声母', pinyin: 'm', sound: '摸', example: '妈妈', emoji: '👩', text: '闭上嘴巴哼哼，鼻子出声，妈妈的妈。' },
  { id: 'f', group: '声母', pinyin: 'f', sound: '佛', example: '飞机', emoji: '✈️', text: '上牙轻轻碰下嘴唇，吹出气来，飞机的飞。' },
  { id: 'd', group: '声母', pinyin: 'd', sound: '得', example: '大象', emoji: '🐘', text: '舌尖点一下上牙后面，大象的大。' },
  { id: 't', group: '声母', pinyin: 't', sound: '特', example: '太阳', emoji: '☀️', text: '和「得」一样的位置，多吹一口气，太阳的太。' },
  { id: 'n', group: '声母', pinyin: 'n', sound: '讷', example: '牛奶', emoji: '🥛', text: '鼻子嗡嗡响，声音闷闷的，牛奶的牛。' },
  { id: 'l', group: '声母', pinyin: 'l', sound: '勒', example: '老虎', emoji: '🐯', text: '舌尖翘起来顶住上牙床，老虎的老。' },
  { id: 'g', group: '声母', pinyin: 'g', sound: '哥', example: '哥哥', emoji: '🧑', text: '喉咙深处出声，哥哥的哥。' },
  { id: 'k', group: '声母', pinyin: 'k', sound: '科', example: '卡车', emoji: '🚚', text: '和「哥」一样的位置，多吹一口气，卡车的卡。' },
  { id: 'h', group: '声母', pinyin: 'h', sound: '喝', example: '花朵', emoji: '🌸', text: '哈出一口热热的气，花朵的花。' },
  { id: 'j', group: '声母', pinyin: 'j', sound: '基', example: '积木', emoji: '🧱', text: '舌尖轻轻翘起，嘴角往两边拉，积木的积。' },
  { id: 'q', group: '声母', pinyin: 'q', sound: '七', example: '气球', emoji: '🎈', text: '和「基」差不多的位置，气要吹得多一点，气球的气。' },
  { id: 'x', group: '声母', pinyin: 'x', sound: '西', example: '星星', emoji: '⭐', text: '牙齿轻轻咬住，气从缝里出来，星星的星。' },
  { id: 'zh', group: '声母', pinyin: 'zh', sound: '知', example: '竹子', emoji: '🎋', text: '舌头翘起来顶住上牙床后面，竹子的竹。' },
  { id: 'ch', group: '声母', pinyin: 'ch', sound: '吃', example: '虫子', emoji: '🐛', text: '和「知」一样翘舌头，多吹一口气，虫子的虫。' },
  { id: 'sh', group: '声母', pinyin: 'sh', sound: '诗', example: '狮子', emoji: '🦁', text: '舌头翘起来，气从缝里吹出，狮子的狮。' },
  { id: 'r', group: '声母', pinyin: 'r', sound: '日', example: '日出', emoji: '🌅', text: '舌头翘起来轻轻颤一颤，日出的日。' },
  { id: 'z', group: '声母', pinyin: 'z', sound: '资', example: '足球', emoji: '⚽', text: '牙齿轻轻咬住，舌尖抵住上门牙，足球的足。' },
  { id: 'c', group: '声母', pinyin: 'c', sound: '雌', example: '草莓', emoji: '🍓', text: '和「资」一样的位置，多吹一口气，草莓的草。' },
  { id: 's', group: '声母', pinyin: 's', sound: '丝', example: '松鼠', emoji: '🐿️', text: '牙齿轻轻咬住，像小蛇嘶嘶叫，松鼠的松。' },
  { id: 'y', group: '声母', pinyin: 'y', sound: '衣', example: '鸭子', emoji: '🦆', text: '大家都叫它小衣，鸭子的鸭。' },
  { id: 'w', group: '声母', pinyin: 'w', sound: '屋', example: '袜子', emoji: '🧦', text: '小嘴圆圆的像小屋顶，袜子的袜。' },

  // ===== 韵母 =====
  { id: 'a', group: '韵母', pinyin: 'a', sound: '啊', example: '阿姨', emoji: '👧', text: '嘴巴张得大大的，像医生看喉咙，阿姨的阿。' },
  { id: 'o', group: '韵母', pinyin: 'o', sound: '喔', example: '喔喔', emoji: '🐓', text: '嘴巴圆圆的，公鸡喔喔叫。' },
  { id: 'e', group: '韵母', pinyin: 'e', sound: '鹅', example: '白鹅', emoji: '🦢', text: '嘴巴扁扁的，像大白鹅的鹅。' },
  { id: 'i', group: '韵母', pinyin: 'i', sound: '衣', example: '衣服', emoji: '👕', text: '牙齿露出来，像一根小棍子，衣服的衣。' },
  { id: 'u', group: '韵母', pinyin: 'u', sound: '乌', example: '乌鸦', emoji: '🐦⬛', text: '小嘴圆圆地嘟起来，乌云的乌。' },
  { id: 'ü', group: '韵母', pinyin: 'ü', sound: '鱼', example: '小鱼', emoji: '🐟', text: '先做「乌」的嘴型，再把嘴唇扁一扁，就是小鱼的鱼。' },
  { id: 'ai', group: '韵母', pinyin: 'ai', sound: '哀', example: '爱心', emoji: '❤️', text: '先张大嘴再慢慢变小，爱心的爱。' },
  { id: 'ei', group: '韵母', pinyin: 'ei', sound: '诶', example: '杯子', emoji: '🥤', text: '嘿嘿笑的声音，杯子的杯。' },
  { id: 'ui', group: '韵母', pinyin: 'ui', sound: '威', example: '乌龟', emoji: '🐢', text: '先「乌」后「衣」，连起来读，乌龟的龟。' },
  { id: 'ao', group: '韵母', pinyin: 'ao', sound: '熬', example: '猫咪', emoji: '🐱', text: '先「啊」后「乌」，小猫喵喵叫。' },
  { id: 'ou', group: '韵母', pinyin: 'ou', sound: '欧', example: '小狗', emoji: '🐶', text: '先「喔」后「乌」，小狗汪汪叫。' },
  { id: 'iu', group: '韵母', pinyin: 'iu', sound: '优', example: '小牛', emoji: '🐮', text: '先「衣」后「乌」，小牛的牛。' },
  { id: 'ie', group: '韵母', pinyin: 'ie', sound: '耶', example: '叶子', emoji: '🍃', text: '先「衣」后「鹅」，树叶的叶。' },
  { id: 'üe', group: '韵母', pinyin: 'üe', sound: '约', example: '月亮', emoji: '🌙', text: '先「鱼」后「鹅」，月亮的月。' },
  { id: 'er', group: '韵母', pinyin: 'er', sound: '儿', example: '耳朵', emoji: '👂', text: '舌头卷起来，耳朵的耳。' },
  { id: 'an', group: '韵母', pinyin: 'an', sound: '安', example: '大山', emoji: '⛰️', text: '先「啊」再把嘴闭上哼鼻音，大山的山。' },
  { id: 'en', group: '韵母', pinyin: 'en', sound: '恩', example: '大门', emoji: '🚪', text: '先「鹅」再把嘴闭上哼鼻音，大门的门。' },
  { id: 'in', group: '韵母', pinyin: 'in', sound: '因', example: '脚印', emoji: '👣', text: '先「衣」再把嘴闭上哼鼻音，脚印的印。' },
  { id: 'un', group: '韵母', pinyin: 'un', sound: '温', example: '春天', emoji: '🌸', text: '先「乌」再把嘴闭上哼鼻音，春天的春。' },
  { id: 'ün', group: '韵母', pinyin: 'ün', sound: '晕', example: '白云', emoji: '☁️', text: '先「鱼」再把嘴闭上哼鼻音，白云的云。' },
  { id: 'ang', group: '韵母', pinyin: 'ang', sound: '昂', example: '山羊', emoji: '🐐', text: '先「啊」再抬起头，声音从鼻子后面出来，山羊的羊。' },
  { id: 'eng', group: '韵母', pinyin: 'eng', sound: '鞥', example: '灯光', emoji: '💡', text: '先「鹅」再抬起头，像「灯」字后面那一截，灯光的灯。' },
  { id: 'ing', group: '韵母', pinyin: 'ing', sound: '英', example: '苹果', emoji: '🍎', text: '先「衣」再抬起头，声音从鼻子后面出来，苹果的苹。' },
  {
    id: 'ong',
    group: '韵母',
    pinyin: 'ong',
    sound: '翁',
    example: '恐龙',
    emoji: '🦖',
    text: '嘴巴一直是圆圆的，先「喔」再抬起头出鼻音，读起来像老翁的翁，恐龙的龙。',
  },

  // ===== 整体认读音节 =====
  { id: 'zhi', group: '整体认读', pinyin: 'zhi', sound: '知', example: '蜘蛛', emoji: '🕷️', text: '舌头翘起来，一口气整体读出来，蜘蛛的蜘。' },
  { id: 'chi', group: '整体认读', pinyin: 'chi', sound: '吃', example: '尺子', emoji: '📏', text: '舌头翘起来，一口气整体读出来，尺子的尺。' },
  { id: 'shi', group: '整体认读', pinyin: 'shi', sound: '狮', example: '石头', emoji: '🪨', text: '舌头翘起来，一口气整体读出来，石头的石。' },
  { id: 'ri', group: '整体认读', pinyin: 'ri', sound: '日', example: '日历', emoji: '📅', text: '舌头翘起来，一口气整体读出来，日历的日。' },
  { id: 'zi', group: '整体认读', pinyin: 'zi', sound: '字', example: '自己', emoji: '🙋', text: '牙齿轻轻咬住，一口气整体读出来，自己的自。' },
  { id: 'ci', group: '整体认读', pinyin: 'ci', sound: '刺', example: '刺猬', emoji: '🦔', text: '牙齿轻轻咬住，一口气整体读出来，刺猬的刺。' },
  { id: 'si', group: '整体认读', pinyin: 'si', sound: '丝', example: '丝瓜', emoji: '🥒', text: '牙齿轻轻咬住，一口气整体读出来，丝瓜的丝。' },
  { id: 'yi', group: '整体认读', pinyin: 'yi', sound: '衣', example: '蚂蚁', emoji: '🐜', text: '一口气整体读成「衣」，蚂蚁的蚁。' },
  { id: 'wu', group: '整体认读', pinyin: 'wu', sound: '屋', example: '跳舞', emoji: '💃', text: '一口气整体读成「屋」，跳舞的舞。' },
  { id: 'yu', group: '整体认读', pinyin: 'yu', sound: '鱼', example: '下雨', emoji: '🌧️', text: '一口气整体读成「鱼」，下雨的雨。' },
  { id: 'ye', group: '整体认读', pinyin: 'ye', sound: '叶', example: '树叶', emoji: '🍂', text: '一口气整体读成「叶」，树叶的叶。' },
  { id: 'yue', group: '整体认读', pinyin: 'yue', sound: '月', example: '音乐', emoji: '🎵', text: '一口气整体读成「月」，音乐的乐。' },
  { id: 'yuan', group: '整体认读', pinyin: 'yuan', sound: '圆', example: '圆圈', emoji: '⭕', text: '一口气整体读成「圆」，圆圈的圆。' },
  { id: 'yin', group: '整体认读', pinyin: 'yin', sound: '音', example: '声音', emoji: '🔊', text: '一口气整体读成「音」，声音的音。' },
  { id: 'yun', group: '整体认读', pinyin: 'yun', sound: '云', example: '云朵', emoji: '☁️', text: '一口气整体读成「云」，云朵的云。' },
  { id: 'ying', group: '整体认读', pinyin: 'ying', sound: '鹰', example: '老鹰', emoji: '🦅', text: '一口气整体读成「鹰」，老鹰的鹰。' },
]
