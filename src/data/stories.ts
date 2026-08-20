export interface StoryPage {
  /** 本页大字插图 emoji */
  emoji: string
  /** 幼儿向短句（1-2 句） */
  text: string
}

export interface Story {
  id: string
  title: string
  emoji: string
  pages: StoryPage[]
}

export const stories: Story[] = [
  {
    id: 'kitten-fishing',
    title: '小猫钓鱼',
    emoji: '🐱',
    pages: [
      {
        emoji: '🌤️',
        text: '早晨，太阳升起来。猫妈妈带着小猫，一起去河边钓鱼。',
      },
      {
        emoji: '🦋',
        text: '小猫没有耐心，看见蝴蝶飞过来，就跑着去追蝴蝶。',
      },
      {
        emoji: '🐟',
        text: '猫妈妈专心钓鱼，钓上了一条大鱼，小猫一条也没钓着。',
      },
      {
        emoji: '🎣',
        text: '小猫回到河边，认认真真地钓鱼。不一会儿，它也钓上了一条大鱼，开心极了。',
      },
    ],
  },
  {
    id: 'three-pigs',
    title: '三只小猪',
    emoji: '🐷',
    pages: [
      {
        emoji: '🏡',
        text: '三只小猪长大了，离开妈妈，要盖自己的新房子。',
      },
      {
        emoji: '🌾',
        text: '猪老大盖了一间草房子，猪老二盖了一间木房子。',
      },
      {
        emoji: '🧱',
        text: '猪老三最勤劳，认认真真地盖了一间结实的砖房子。',
      },
      {
        emoji: '🐺',
        text: '大灰狼来了，一口气吹倒了草房子，又推倒了木房子。',
      },
      {
        emoji: '🧱',
        text: '大灰狼怎么也吹不倒砖房子，只好灰溜溜地走了，三只小猪安全啦。',
      },
    ],
  },
  {
    id: 'tadpole-mama',
    title: '小蝌蚪找妈妈',
    emoji: '🐸',
    pages: [
      {
        emoji: '🥚',
        text: '池塘里，青蛙妈妈生了许多小宝宝，黑黑的小蝌蚪游了出来。',
      },
      {
        emoji: '🐟',
        text: '小蝌蚪游啊游，看见鲤鱼，问：「你是我的妈妈吗？」鲤鱼说：「不是，你们的妈妈有白肚皮。」',
      },
      {
        emoji: '🐢',
        text: '小蝌蚪看见乌龟，又问：「你是我的妈妈吗？」乌龟说：「不是，你们的妈妈穿绿衣裳。」',
      },
      {
        emoji: '🐸',
        text: '小蝌蚪终于找到了青蛙妈妈，高兴地大喊：「妈妈，妈妈！」',
      },
      {
        emoji: '🐸',
        text: '小蝌蚪一天天长大，也变成了绿衣裳、白肚皮的小青蛙。',
      },
    ],
  },
]
