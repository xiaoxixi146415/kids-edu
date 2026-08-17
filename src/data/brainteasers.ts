export interface BrainTeaser {
  id: string
  emoji: string
  question: string
  answer: string
}

export const brainteasers: BrainTeaser[] = [
  {
    id: 'water',
    emoji: '💧',
    question: '什么东西越洗越脏？',
    answer: '是水。水越洗东西，自己反而越来越脏。',
  },
  {
    id: 'table',
    emoji: '🍽️',
    question: '什么东西有腿，却不会走路？',
    answer: '是桌子。桌子有四条腿，可是它不会走路。',
  },
  {
    id: 'breathe',
    emoji: '😤',
    question: '什么东西你天天都在用，却从来没有见过？',
    answer: '是空气。我们每天呼吸空气，可是看不见也摸不着它。',
  },
  {
    id: 'own-name',
    emoji: '👦',
    question: '什么东西是自己的，可是别人用得比你自己还多？',
    answer: '是你的名字。别人常常叫你的名字。',
  },
  {
    id: 'clock',
    emoji: '⏰',
    question: '什么东西一直在走，却从不休息？',
    answer: '是钟表。时钟滴答滴答一直走着，告诉我们现在的时间。',
  },
  {
    id: 'fridge',
    emoji: '🐘',
    question: '把大象放进冰箱，需要几步？',
    answer: '三步：打开冰箱门，把大象放进去，再把门关上。',
  },
  {
    id: 'mirror',
    emoji: '🪞',
    question: '什么东西，你对着它笑，它也对你笑？',
    answer: '是镜子。你对着镜子笑，镜子里的你也对你笑。',
  },
  {
    id: 'broken',
    emoji: '🛠️',
    question: '什么东西一坏掉，反而大家都高兴？',
    answer: '是谜底。谜底一揭晓，大家都知道了答案，特别开心。',
  },
]
