"use client"
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LoginIcon from '@mui/icons-material/Login';
// import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNote from '@mui/icons-material/MusicNote';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import TagIcon from '@mui/icons-material/Tag';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slide, SwipeableDrawer, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useTheme } from './Theme';

const DRAWER_WIDTH = 240;

const LINKS = [
    { text: 'UserChap', href: '/userchap/1', icon: LocalCafeIcon },
    { text: 'Search', href: '/search', icon: SearchIcon },
    { text: 'Tags', href: '/tag', icon: TagIcon },
    { text: "Booklists", href: "/booklists", icon: LibraryBooksIcon },
    // { text: 'Subscription', href: '/watched', icon: LoyaltyIcon },
    { text: 'Bookmark', href: '/bookmark', icon: BookmarksIcon },
];

const PLACEHOLDER_LINKS = [
    { text: 'Settings', href: '/settings', icon: SettingsIcon },
    { text: 'Music', href: '/music', icon: MusicNote },
    { text: 'Server', href: '/server', icon: StorageIcon },
    { text: 'Login', href: '/login', icon: LoginIcon },
    // { text: 'Logout', href: '/api/auth/signout', icon: LogoutIcon },
];

export function Root({ darkmode, children }: { darkmode?: boolean, children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [dark, setdark] = useState(darkmode ?? false);
    const router = useRouter()
    const theme = useTheme(dark ? "dark" : "light")
    const trigger = useScrollTrigger({ target: typeof window !== "undefined" ? window : undefined });

    return <ThemeProvider theme={theme}>
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar position="fixed" sx={{ zIndex: 1205, minHeight: '64px' }} color='inherit'>
                <Toolbar sx={{ backgroundColor: 'palette.main', minHeight: '64px' }}>
                    {/* <IconButton onClick={() => { setOpen(!open) }}>
                <MenuIcon sx={{ color: '#444', transform: 'translateY(-2px)' }} />
              </IconButton> */}
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => { setOpen(!open) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" color="inherit" onClick={() => { router.push("/") }}>
                        Nhimmeo Mui
                    </Typography>
                    {/* <MenuItem> */}
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton sx={{ ml: 1 }} onClick={() => {
                        document.cookie = `dark=${!dark}; max-age=604800; path=/; domain=${document.location.hostname.replace(/.*?\./, ".")}`;
                        setdark(!dark)
                    }} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    {/* </MenuItem> */}
                </Toolbar>
            </AppBar>
        </Slide>
        <SwipeableDrawer onClose={() => { setOpen(false) }} onOpen={() => { setOpen(true) }} open={open}>
            <Drawer
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        top: ['56px', '64px'],
                        height: 'auto',
                        bottom: 0,
                    },
                    // display: { xs: 'none', sm: 'block' },
                }}
                variant="permanent"
                anchor="left"
                open={open}
            >
                <Divider />
                <List>
                    {LINKS.map(({ text, href, icon: Icon }) => (
                        <ListItem key={href} disablePadding>
                            <ListItemButton component={Link} href={href}>
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ mt: 'auto' }} />
                <List>
                    {PLACEHOLDER_LINKS.map(({ text, href, icon: Icon }) => (
                        <ListItem key={href} disablePadding>
                            <ListItemButton component={Link} href={href}>
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </SwipeableDrawer>

        <Box
            component="main"
            sx={{
                flexGrow: 1,
                bgcolor: 'background.default',
                // ml: `${DRAWER_WIDTH}px`,
                pt: ['72px', '80px', '88px'],
                pb: ['48px', '56px', '64px'],
                // p: 3,
                // mt: 3,
                minHeight: "100vh",
                "img": { maxWidth: "100%" }
            }}
        >
            {children}
        </Box>
    </ThemeProvider>
}