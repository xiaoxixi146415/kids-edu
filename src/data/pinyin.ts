export interface PinyinItem {
  id: string
  /** 分组：声母 / 韵母 / 整体认读音节 */
  group: string
  /** 拼音字母/音节 */
  pinyin: string
  /** 例词（含该音的幼儿常用词） */
  example: string
  emoji: string
  /** 幼儿向一句话讲解 */
  text: string
}

export const pinyin: PinyinItem[] = [
  // ===== 声母 =====
  { id: 'b', group: '声母', pinyin: 'b', example: '玻璃', emoji: '🧊', text: 'b 的发音像「玻」，玻 璃的玻。' },
  { id: 'p', group: '声母', pinyin: 'p', example: '皮球', emoji: '⚽', text: 'p 的发音像「泼」，吹气很用力。' },
  { id: 'm', group: '声母', pinyin: 'm', example: '妈妈', emoji: '👩', text: 'm 的发音像「摸」，闭上嘴巴哼哼。' },
  { id: 'f', group: '声母', pinyin: 'f', example: '飞机', emoji: '✈️', text: 'f 的发音像「佛」，上牙碰下嘴唇。' },
  { id: 'd', group: '声母', pinyin: 'd', example: '大象', emoji: '🐘', text: 'd 的发音像「得」，舌头点在上牙后。' },
  { id: 't', group: '声母', pinyin: 't', example: '太阳', emoji: '☀️', text: 't 的发音像「特」，比 d 更多一口气。' },
  { id: 'n', group: '声母', pinyin: 'n', example: '牛奶', emoji: '🥛', text: 'n 的发音像「讷」，鼻子嗡嗡响。' },
  { id: 'l', group: '声母', pinyin: 'l', example: '老虎', emoji: '🐯', text: 'l 的发音像「勒」，舌头轻轻翘。' },
  { id: 'g', group: '声母', pinyin: 'g', example: '哥哥', emoji: '🧑', text: 'g 的发音像「歌」，喉咙深处发声。' },
  { id: 'k', group: '声母', pinyin: 'k', example: '卡车', emoji: '🚚', text: 'k 的发音像「科」，比 g 多一口气。' },
  { id: 'h', group: '声母', pinyin: 'h', example: '花朵', emoji: '🌸', text: 'h 的发音像「喝」，热热的气息。' },
  { id: 'j', group: '声母', pinyin: 'j', example: '积木', emoji: '🧱', text: 'j 的发音像「鸡」，舌尖轻轻翘起。' },
  { id: 'q', group: '声母', pinyin: 'q', example: '气球', emoji: '🎈', text: 'q 的发音像「七」，和 j 差不多的位置。' },
  { id: 'x', group: '声母', pinyin: 'x', example: '星星', emoji: '⭐', text: 'x 的发音像「西」，牙齿轻轻咬。' },
  { id: 'zh', group: '声母', pinyin: 'zh', example: '竹子', emoji: '🎋', text: 'zh 的发音像「知」，翘起舌头。' },
  { id: 'ch', group: '声母', pinyin: 'ch', example: '虫子', emoji: '🐛', text: 'ch 的发音像「吃」，比 zh 多一口气。' },
  { id: 'sh', group: '声母', pinyin: 'sh', example: '狮子', emoji: '🦁', text: 'sh 的发音像「诗」，舌头翘翘吹气。' },
  { id: 'r', group: '声母', pinyin: 'r', example: '日出', emoji: '🌅', text: 'r 的发音像「日」，舌头翘起轻轻颤。' },
  { id: 'z', group: '声母', pinyin: 'z', example: '足球', emoji: '⚽', text: 'z 的发音像「资」，牙齿轻轻咬。' },
  { id: 'c', group: '声母', pinyin: 'c', example: '草莓', emoji: '🍓', text: 'c 的发音像「雌」，比 z 多一口气。' },
  { id: 's', group: '声母', pinyin: 's', example: '松鼠', emoji: '🐿️', text: 's 的发音像「丝」，像小蛇的声音。' },
  { id: 'y', group: '声母', pinyin: 'y', example: '鸭子', emoji: '🦆', text: 'y 的发音像「一」，大家叫它小衣。' },
  { id: 'w', group: '声母', pinyin: 'w', example: '袜子', emoji: '🧦', text: 'w 的发音像「屋」，小屋顶顶圆圆。' },

  // ===== 韵母 =====
  { id: 'a', group: '韵母', pinyin: 'a', example: '阿姨', emoji: '👧', text: 'a 张大嘴巴，医生看喉咙的声音。' },
  { id: 'o', group: '韵母', pinyin: 'o', example: '喔喔', emoji: '🐓', text: 'o 圆圆嘴巴，公鸡叫喔喔喔。' },
  { id: 'e', group: '韵母', pinyin: 'e', example: '白鹅', emoji: '🦢', text: 'e 扁扁嘴巴，大白鹅的鹅。' },
  { id: 'i', group: '韵母', pinyin: 'i', example: '衣服', emoji: '👕', text: 'i 露牙齿，像一根小棍子。' },
  { id: 'u', group: '韵母', pinyin: 'u', example: '乌鸦', emoji: '🐦⬛', text: 'u 圆圆小嘴，乌云的乌。' },
  { id: 'ü', group: '韵母', pinyin: 'ü', example: '小鱼', emoji: '🐟', text: 'ü 像 u 加两点，小鱼的鱼。' },
  { id: 'ai', group: '韵母', pinyin: 'ai', example: '爱心', emoji: '❤️', text: 'ai 先张大再变小，爱心的爱。' },
  { id: 'ei', group: '韵母', pinyin: 'ei', example: '杯子', emoji: '🥤', text: 'ei 嘿嘿笑的声音，杯子的杯。' },
  { id: 'ui', group: '韵母', pinyin: 'ui', example: '乌龟', emoji: '🐢', text: 'ui 先乌后衣，乌龟的龟。' },
  { id: 'ao', group: '韵母', pinyin: 'ao', example: '猫咪', emoji: '🐱', text: 'ao 先啊后喔，小猫喵喵叫。' },
  { id: 'ou', group: '韵母', pinyin: 'ou', example: '小狗', emoji: '🐶', text: 'ou 先喔后乌，小狗汪汪叫。' },
  { id: 'iu', group: '韵母', pinyin: 'iu', example: '小牛', emoji: '🐮', text: 'iu 先衣后乌，小牛的牛。' },
  { id: 'ie', group: '韵母', pinyin: 'ie', example: '叶子', emoji: '🍃', text: 'ie 先衣后鹅，树叶的叶。' },
  { id: 'üe', group: '韵母', pinyin: 'üe', example: '月亮', emoji: '🌙', text: 'üe 先小鱼后鹅，月亮的月。' },
  { id: 'er', group: '韵母', pinyin: 'er', example: '耳朵', emoji: '👂', text: 'er 是卷舌音，耳朵的耳。' },
  { id: 'an', group: '韵母', pinyin: 'an', example: '大山', emoji: '⛰️', text: 'an 先啊后嗯，大山的山。' },
  { id: 'en', group: '韵母', pinyin: 'en', example: '大门', emoji: '🚪', text: 'en 先鹅后嗯，大门的门。' },
  { id: 'in', group: '韵母', pinyin: 'in', example: '脚印', emoji: '👣', text: 'in 先衣后嗯，脚印的印。' },
  { id: 'un', group: '韵母', pinyin: 'un', example: '春天', emoji: '🌸', text: 'un 先乌后嗯，春天的春。' },
  { id: 'ün', group: '韵母', pinyin: 'ün', example: '白云', emoji: '☁️', text: 'ün 先小鱼后嗯，白云的云。' },
  { id: 'ang', group: '韵母', pinyin: 'ang', example: '山羊', emoji: '🐐', text: 'ang 先啊再昂起头，山羊的羊。' },
  { id: 'eng', group: '韵母', pinyin: 'eng', example: '灯光', emoji: '💡', text: 'eng 先鹅再昂头，灯光的灯。' },
  { id: 'ing', group: '韵母', pinyin: 'ing', example: '苹果', emoji: '🍎', text: 'ing 先衣再昂头，苹果的苹。' },
  { id: 'ong', group: '韵母', pinyin: 'ong', example: '恐龙', emoji: '🦖', text: 'ong 先喔再昂头，恐龙的龙。' },

  // ===== 整体认读音节 =====
  { id: 'zhi', group: '整体认读', pinyin: 'zhi', example: '蜘蛛', emoji: '🕷️', text: 'zhi 翘起舌头整体读，蜘蛛的蜘。' },
  { id: 'chi', group: '整体认读', pinyin: 'chi', example: '尺子', emoji: '📏', text: 'chi 翘起舌头整体读，尺子的尺。' },
  { id: 'shi', group: '整体认读', pinyin: 'shi', example: '石头', emoji: '🪨', text: 'shi 翘起舌头整体读，石头的石。' },
  { id: 'ri', group: '整体认读', pinyin: 'ri', example: '日历', emoji: '📅', text: 'ri 翘起舌头整体读，日历的日。' },
  { id: 'zi', group: '整体认读', pinyin: 'zi', example: '自己', emoji: '🙋', text: 'zi 牙齿咬咬整体读，自己的自。' },
  { id: 'ci', group: '整体认读', pinyin: 'ci', example: '刺猬', emoji: '🦔', text: 'ci 牙齿咬咬整体读，刺猬的刺。' },
  { id: 'si', group: '整体认读', pinyin: 'si', example: '丝瓜', emoji: '🥒', text: 'si 牙齿咬咬整体读，丝瓜的丝。' },
  { id: 'yi', group: '整体认读', pinyin: 'yi', example: '蚂蚁', emoji: '🐜', text: 'yi 整体读成衣，蚂蚁的蚁。' },
  { id: 'wu', group: '整体认读', pinyin: 'wu', example: '跳舞', emoji: '💃', text: 'wu 整体读成屋，跳舞的舞。' },
  { id: 'yu', group: '整体认读', pinyin: 'yu', example: '下雨', emoji: '🌧️', text: 'yu 整体读成鱼，下雨的雨。' },
  { id: 'ye', group: '整体认读', pinyin: 'ye', example: '树叶', emoji: '🍂', text: 'ye 整体读成叶，树叶的叶。' },
  { id: 'yue', group: '整体认读', pinyin: 'yue', example: '音乐', emoji: '🎵', text: 'yue 整体读成月，音乐的乐。' },
  { id: 'yuan', group: '整体认读', pinyin: 'yuan', example: '圆圈', emoji: '⭕', text: 'yuan 整体读成圆，圆圈的圆。' },
  { id: 'yin', group: '整体认读', pinyin: 'yin', example: '声音', emoji: '🔊', text: 'yin 整体读成因，声音的音。' },
  { id: 'yun', group: '整体认读', pinyin: 'yun', example: '云朵', emoji: '☁️', text: 'yun 整体读成云，云朵的云。' },
  { id: 'ying', group: '整体认读', pinyin: 'ying', example: '老鹰', emoji: '🦅', text: 'ying 整体读成英，老鹰的鹰。' },
]
