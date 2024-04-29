import { H2 } from '@/components/H2';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge, Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import { type Theme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function ColorDemo({ theme }: { theme: Theme }) {
    return <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', maxHeight: "100%", bgcolor: 'background.default' }}>
            <Box
                sx={{ width: '100%', height: 0 }}
                style={{ backgroundColor: 'primary.main' }}
            />
            <AppBar position="static" style={{ backgroundColor: 'primary.main' }}>
                <Toolbar style={{ color: 'primary.contrastText' }}>
                    <IconButton
                        edge="start"
                        sx={{ mr: '20px' }}
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="div" variant="h6" color="inherit">
                        脑叶公司：光之种剧本
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container sx={{
                textAlign: "center",
                color: "text.primary",
                "a": { textDecoration: 'none' },
                "article": { color: "text.secondary", bgcolor: 'background.paper', p: 1, "img": { width: "100%" }, fontSize: (theme) => theme.typography.body1.fontSize },
                "p": { wordBreak: 'break-word' },
                mt: 2
            }}>
                <Badge sx={{ width: "100%" }} badgeContent={"99"} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} color="secondary">
                    <H2 sx={{ width: "100%" }}>
                        正卡巴拉生命树
                    </H2>
                </Badge>
                (大标题文本与头文字不受主题色控制)
                <article
                    itemScope={true}
                    itemType="http://schema.org/BlogPosting"
                    style={{
                        // fontSize: 20,
                        fontFamily: "Bookerly",
                        textAlign: 'start',
                        borderRadius: 12
                    }}
                >
                    <div>
                        10（王国）——Malkhuth/马库特——控制部主管——昂首阔步的信念
                    </div><br />
                    <div>
                        9（基础）——Yesod/耶索德——情报部主管——卓尔不凡的理性
                    </div><br />
                    <div>
                        8（荣耀）——Hod/霍德——培训部主管——愈加善良的希望
                    </div><br />
                    <div>
                        7（胜利）——Netzach/尼扎克——安保部主管——生存下去的勇气
                    </div><br />
                    <div>
                        6（美丽）——Tiphereth/缇夫瑞夫——中央本部主管——存在意义的憧憬
                    </div><br />
                    <div>
                        5（严厉）——Geburah/戈白拉——惩戒部主管——守护他人的决意
                    </div><br />
                    <div>
                        4（慈悲）——Chesed/何塞德——福利部主管——值得托付的信任
                    </div><br />
                    <div>
                        3（理解）——Binah/宾娜——研发部主管——直面恐惧，斩断循环
                    </div><br />
                    <div>
                        2（智慧）——Hokma/霍克马——记录部主管——拥抱过去，创造未来
                    </div><br />
                    <div>
                        1 构造部 ——Day47——Abel/埃伯——倦怠＆厌倦＆守候
                    </div><br />
                    <div>
                        1 构造部 ——Day48——Abram/亚伯兰——后悔＆悔恨＆赎罪
                    </div><br />
                    <div>
                        1 构造部 ——Day49——Adam/亚当——疯狂＆自由＆拯救
                    </div><br />
                    <div>
                        1（王冠）——X、Ayin/艾因、Kether/凯泽——脑叶总部主管——最纯真的自我
                    </div>
                </article>
            </Container>
            <Fab
                sx={{
                    position: 'absolute',
                    bottom: theme.spacing(2),
                    right: theme.spacing(2),
                }}
                style={{ backgroundColor: 'secondary.main' }}
                aria-label="add"
            >
                <AddIcon htmlColor={'secondary.contrastText'} />
            </Fab>
        </Box>
    </Box>
}

// ColorDemo.propTypes = {
//     data: PropTypes.object.isRequired,
// };

export default ColorDemo;