import { Button, Container, Stack } from '@mui/material'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '标签',
    description: '黑猫科技,毛线球Corp',
}

let tags = ['2020年度最佳',
    '2021年度最佳',
    '2022年度最佳',
    '2023年度最佳',
    "2024年度最佳",
    'ACG',
    'fate',
    '修罗场',
    '俺春物',
    '克苏鲁',
    '冒险',
    '升级',
    '单女主',
    '卡牌',
    '原神',
    '变嫁',
    '变身',
    '同人',
    '后宫',
    '圣杯战争',
    '坏女人',
    '型月',
    '好书不火',
    '好看',
    '孤独摇滚',
    '实教',
    '密教',
    '崩坏',
    '幕后',
    '恋爱',
    '慢热',
    '战斗',
    '技术流',
    '推理',
    '搞笑',
    '无女主',
    '无敌',
    '无限流',
    '明日方舟',
    '智斗',
    '末世',
    '机甲',
    '校园',
    '橘子',
    '武侠',
    '死神',
    '沙雕',
    '治愈',
    '海贼王',
    '温馨',
    '游戏王',
    '火影',
    '灵异',
    '炒股',
    '热血',
    '爆笑',
    '爽文',
    '生活',
    '白学',
    '短小无力',
    '社团',
    '神作',
    '科幻',
    '穿越',
    '约会大作战',
    '纯爱',
    '综漫',
    '聊天群',
    '脑洞大开',
    '腹黑',
    '艾尔登法环',
    '萝莉控',
    '赛博朋克',
    '赛马娘',
    '路人女主',
    '轻小说',
    '追夫火葬场',
    '都市',
    '青春',
    '非变嫁',
    '魔法',
    '第四天灾']

export default async function Page() {
    return <Container>
        {/* <div className="center">
            <form>
                <input
                    type="text"
                    name="q"
                    style={{ width: "60%" }}
                    placeholder="输入您要找的标签"
                    className="s search-input"
                />
                <button type="submit">
                    <i className="fa fa-tags" aria-hidden="true" /> 搜索标签
                </button>
            </form>
        </div> */}
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
            {tags.map((t) => <Button LinkComponent={Link} href={`/tag/${t}`} key={t}>
                {t}
            </Button>)}
        </Stack>
    </Container>
}