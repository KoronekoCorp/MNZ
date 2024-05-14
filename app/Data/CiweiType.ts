interface tag {
    "tag_id": string,
    "tag_type": string
    "tag_name": string
}

/** 基础书籍元信息 */
export interface BookOwn {
    "book_id": string,
    "book_name": string,
    "description": string,
    "book_src": "本站首发",
    "category_index": '0' | '1' | '3' | '5' | '6' | '8' | '11' | '24' | '27' | '30'
    "tag": string,
    "total_word_count": string,
    "up_status": string,
    "update_status": string,
    "is_paid": "0" | "1",
    "discount": string,
    "discount_end_time": string,
    "cover": string,
    "author_name": string,
    "uptime": string,
    "newtime": string,
    "review_amount": string,
    "reward_amount": string,
    "chapter_amount": string,
    "is_original": string,
    "total_click": string,
    "month_click": string,
    "week_click": string,
    "month_no_vip_click": string
    "week_no_vip_click": string
    "total_recommend": string
    "month_recommend": string
    "week_recommend": string
    "total_favor": string
    "month_favor": string
    "week_favor": string
    "current_yp": string
    "total_yp": string
    "current_blade": string
    "total_blade": string
    "week_fans_value": string
    "month_fans_value": string
    "total_fans_value": string
    "last_chapter_info": {
        "chapter_id": string,
        "book_id": string,
        "chapter_index": string,
        "chapter_title": string,
        "uptime": string,
        "mtime": string
        "recommend_book_info": "[]"
    },
    "tag_list": tag[]
    "book_type": string,
    "transverse_cover": string
    "glory_tag": {
        "tag_name": string
        "corner_name": string
        "label_icon": string
        "link_url": string
    }
}

interface user {
    "reader_id": string,
    "account": string,
    "reader_name": string,
    "avatar_url": string,
    "avatar_thumb_url": string,
    "base_status": "0" | "1"
    "exp_lv": string
    "exp_value": string
    "gender": string
    "vip_lv": string
    "vip_value": string
    "is_author": string
    "is_uploader": string
    "is_following": string
    /** 装扮 */
    "used_decoration": any[],
    "is_in_blacklist": string
    "ctime": string
}

export interface bookinfo {
    "code": string,
    "data": {
        "book_info": BookOwn,
        "is_inshelf": string
        "is_buy": string
        /** 作者 */
        "up_reader_info": user
        "related_list": BookOwn[],
        "book_shortage_reommend_list": BookOwn[]
    },
    "scroll_chests"?: [],
    "tip"?: string
}

/** 单个章节 */
interface chap {
    "chapter_id": string
    "chapter_index": string
    "chapter_title": string
    "word_count": string
    "tsukkomi_amount": string
    "is_paid": "0" | "1",
    "mtime": string
    "is_valid": "0" | "1",
    "auth_access": "0" | "1",
}

/** 章节列表 */
interface chaplist {
    "chapter_list": chap[],
    "max_update_time": string
    "max_chapter_index": string
    "division_id": string
    "division_index": string
    "division_name": string
}

export interface Catalog {
    "code": "100000" | string,
    "data": {
        "chapter_list": chaplist[]
    },
    "scroll_chests": []
}

export interface Chaper {
    "code": "100000" | string,
    "data": {
        "chapter_info": {
            "chapter_id": string,
            "book_id": string,
            "division_id": string,
            "unit_hlb": string,
            "chapter_index": string,
            "chapter_title": string,
            "author_say": string,
            "word_count": string,
            "discount": "0" | "1",
            "is_paid": "0" | "1",
            "auth_access": "0" | "1",
            "buy_amount": "0" | "1",
            "tsukkomi_amount": "0" | "1",
            "total_hlb": "0" | "1",
            "uptime": string,
            "mtime": string,
            "ctime": string,
            "recommend_book_info": string
            "base_status": "0" | "1",
            "txt_content": string
        }
    },
    "scroll_chests": []
    "error"?: string
}

interface Search_tag {
    "tag_name": string
    "num": string
}

/** 索引返回值 */
export interface Search {
    "code": "100000" | string,
    "data": {
        "tag_list": Search_tag[],
        "book_list": BookOwn[]
    },
    "scroll_chests": []
}

/** Tag索引返回值 */
export interface Tags {
    "code": "100000" | string,
    "data": {
        "book_list": BookOwn[]
    },
    "scroll_chests": []
}

interface booklistsBookOwn {
    "book_id": string
    "book_name": string
    "cover": string
    "book_type": "0" | "1",
    "discount": "0" | "1",
    "discount_end_time": string
    "glory_tag": {
        "tag_name": string
        "corner_name": string
        "label_icon": string
        "link_url": string
    }
}

interface booklistsuser {
    "reader_id": string
    "reader_name": string
    "gender": "0" | "1",
    "avatar_thumb_url": string
    "used_decoration": any[]
}

interface booklist {
    "list_id": string
    "list_name": string
    "list_introduce": string
    "list_cover": string
    "book_num": string
    "favor_num": string
    "is_favor": "0" | "1"
    "reader_info": booklistsuser,
    "book_info_list": booklistsBookOwn[],
    "base_status": "0" | "1"
}

export interface booklists {
    "code": "100000",
    "data": {
        "booklists": booklist[],
        "list_url": "https://app.hbooker.com/setting/booklist_detail"
    },
    "scroll_chests": []
}

interface list_info extends user, booklist {

}
interface BookOwnplus extends BookOwn {
    book_comment: string
}

export interface booklistinfo {
    "code": "100000",
    "data": {
        "book_list": BookOwnplus[]
        "list_info": list_info
    },
    "scroll_chests": []
}

/** 购买后获得的信息说明 */
export interface Buy {
    "code": "100000",
    "data": {
        "reader_info": user,
        "prop_info": {
            "rest_gift_hlb": string
            /** 剩余欢乐币 */
            "rest_hlb": string
            "rest_yp": string
            "rest_recommend": string
            "rest_total_blade": string
            "rest_month_blade": string
            "rest_total_100": string
            "rest_total_588": string
            "rest_total_1688": string
            "rest_total_5000": string
            "rest_total_10000": string
            "rest_total_100000": string
            "rest_total_50000": string
            "rest_total_160000": string
        },
        "book_info": {
            "is_buy": "",
            "book_info": BookOwn
        },
        "shelf_id": "",
        "chapter_info": {
            "chapter_id": string
            "book_id": string
            "division_id": string
            "unit_hlb": string
            "chapter_index": string
            "chapter_title": string
            "author_say": string
            "word_count": string
            "discount": "0" | "1",
            "is_paid": "0" | "1",
            "auth_access": "0" | "1",
            /** 该章节总计购买次数 */
            "buy_amount": string
            "tsukkomi_amount": string
            /** 该章节总计欢乐币收入 */
            "total_hlb": string
            "uptime": string
            "mtime": string
            "ctime": string
            "recommend_book_info": string
        }
    },
    "scroll_chests": []
    "tip"?: string
}

export interface Register {
    "code": "100000",
    "data": {
        "login_token": string
        "user_code": string
        "reader_info": {
            "reader_id": string
            "account": string
            "is_bind": "0",
            "is_bind_qq": "0",
            "is_bind_weixin": "0",
            "is_bind_huawei": "0",
            "is_bind_apple": "0",
            "phone_num": "",
            "phone_crypto": "",
            "mobileVal": "1",
            "email": "",
            "license": "",
            "reader_name": string
            "avatar_url": "",
            "avatar_thumb_url": "",
            "base_status": "1",
            "exp_lv": "1",
            "exp_value": "0",
            "gender": "1",
            "vip_lv": "0",
            "vip_value": "0",
            "is_author": "0",
            "is_uploader": "0",
            "book_age": "0",
            "category_prefer": [],
            "used_decoration": [],
            "rank": "0",
            "first_login_ip": string
            "ctime": string
        },
        "prop_info": {
            "rest_gift_hlb": "0",
            "rest_hlb": "0",
            "rest_yp": "0",
            "rest_recommend": "0",
            "rest_total_blade": "0",
            "rest_month_blade": "0",
            "rest_total_100": "0",
            "rest_total_588": "0",
            "rest_total_1688": "0",
            "rest_total_5000": "0",
            "rest_total_10000": "0",
            "rest_total_100000": "0",
            "rest_total_50000": "0",
            "rest_total_160000": "0"
        },
        "is_set_young": "0"
    }
}

interface single_tsukkomi {
    "chapter_id": string
    "paragraph_index": string
    "tsukkomi_num": string
    "reply_num": string
    "_id": {
        "$id": string
    }
}

export interface tsukkomi {
    "code": "100000",
    "data": {
        "tsukkomi_num_info": single_tsukkomi[]
    },
    "scroll_chests": []
}

export interface tsukkomis {
    [paragraph_index: string]: single_tsukkomi
}

export interface tsukkomi_info_single {
    "tsukkomi_id": string
    "paragraph_index": string
    "reader_info": {
        "reader_id": string
        "reader_name": string
        "gender": "0" | "1",
        "avatar_thumb_url": string
        "is_author": "0" | "1",
        "used_decoration": [],
        "book_fans_value": "0" | "1",
        "vip_lv": string
        "ip_home": string
        "is_following": "0" | "1",
    },
    "tsukkomi_content": string
    "like_amount": string
    "unlike_amount": string
    "is_like": "0" | "1",
    "is_unlike": "0" | "1",
    "abscissa": string
    "ordinate": string
    "member_lou": string
    "hot_reply": [],
    "reply_num": string
    "ctime": string
    "base_status": "0" | "1"
}

/** 某段落间贴具体内容 */
export interface tsukkomi_info {
    "code": "100000",
    "data": {
        "tsukkomi_list": tsukkomi_info_single[]
        "paragraph_info": {
            /** 当前章节段落间贴数目 */
            "paragraph_tsukkomi_amount": string
            "paragraph_content": string
            "book_id": string
            "book_name": string
            "chapter_id": string
            "chapter_title": string
        },
        "speak_fans_value": string
        "close_speak_show": "",
        "is_book_review_admin": "",
        "reader_book_fans_value": string
    },
    "scroll_chests": []
}


export interface tsukkomi_reply_info {
    "tsukkomi_id": string
    "tsukkomi_reply_id": string
    "reader_info": {
        "reader_id": string
        "reader_name": string
        "gender": "0" | "1",
        "avatar_thumb_url": string
        "is_author": "0" | "1",
        "used_decoration": [],
        "book_fans_value": "0" | "1"
        "vip_lv": string
        "ip_home": string
    },
    "tsukkomi_reply_content": string
    "like_amount": string
    "is_like": string
    "reader_name2": string
    "ctime": string
    "base_status": "0" | "1"
}

export interface tsukkomi_reply {
    "code": "100000",
    "data": {
        "tsukkomi_reply_list": tsukkomi_reply_info[]
        "speak_fans_value": "0",
        "close_speak_show": "",
        "is_book_review_admin": "",
        "reader_book_fans_value": "0"
    },
    "scroll_chests": []
}

export interface geetest {
    "code": "100000",
    "tip": "验证完毕",
    "data": {
        "need_use_geetest": "0" | "1",
        "code_len": "0" | "1"
    }
}

export interface login {
    "code": "100000",
    "data": {
        /** 登录用token */
        "login_token": string
        "user_code": string
        "reader_info": {
            "reader_id": string
            /** 登录用账户名 */
            "account": string
            "is_bind": "0" | "1",
            "is_bind_qq": "0" | "1",
            "is_bind_weixin": "0" | "1",
            "is_bind_huawei": "0" | "1",
            "is_bind_apple": "0" | "1",
            "phone_num": string
            "phone_crypto": string
            "mobileVal": "0" | "1",
            "email": string
            "license": string
            "reader_name": string
            "avatar_url": string
            "avatar_thumb_url": string
            "base_status": string
            "exp_lv": string
            "exp_value": string
            "gender": string
            "vip_lv": string
            "vip_value": string
            "is_author": "0" | "1",
            "is_uploader": "0" | "1",
            "book_age": string
            "category_prefer": [],
            "used_decoration": [],
            "rank": "0",
            "first_login_ip": string
            "ctime": string
        },
        "prop_info": {
            "rest_gift_hlb": string
            "rest_hlb": string
            "rest_yp": string
            "rest_recommend": string
            "rest_total_blade": string
            "rest_month_blade": string
            "rest_total_100": string
            "rest_total_588": string
            "rest_total_1688": string
            "rest_total_5000": string
            "rest_total_10000": string
            "rest_total_100000": string
            "rest_total_50000": string
            "rest_total_160000": string
        },
        "is_set_young": string
    }
}