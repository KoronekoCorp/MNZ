import { CacheEveryThing } from "@/cache"
import { revalidateTag } from "next/cache"

interface JWT {
    token_type?: string | null
    scope?: string | null
    expires_in?: number | null
    ext_expires_in?: number | null
    access_token?: string
    refresh_token?: string | null
    expires_on?: number
}

async function access_token() {
    return CacheEveryThing(async () => (await fetch(process.env.OA_URL + `?t=${Date.now()}`, {
        headers: {
            "cookie": process.env.OACOOKIE
        }
    })).json() as Promise<JWT>, [`OnedriveOA`], 1800, (j) => !j.expires_on || j.expires_on <= Date.now() / 1000)()
}


import { join, basename } from "path";

interface ME {
    "@odata.context"?: "https://graph.microsoft.com/v1.0/$metadata#users/$entity",
    "displayName"?: string | null,
    "givenName"?: string | null,
    "jobTitle"?: string | null,
    "mail"?: string | null,
    "mobilePhone"?: string | null,
    "officeLocation"?: string | null,
    "preferredLanguage"?: string | null,
    "surname"?: string | null,
    "userPrincipalName"?: string | null,
    "id"?: string | null,
}

interface MEDIA {
    "aboutVisibility": string,
    "analyticsVisibility": string,
    "chatVisibility": string,
    "isNoiseSuppressionControlShown": boolean,
    "isWatermarkEnabled": boolean,
    "noiseSuppressionEnabledByDefault": boolean,
    "notesVisibility": string,
    "tableOfContentsVisibility": string,
    "viewpoint": {
        "isAutomaticTranscriptionAllowed": boolean,
        "isTranscriptionAllowed": boolean,
        "isTranscriptionTranslationAllowed": boolean
    }
}

/** REST API 单个file/folder信息 */
export interface ITEM {
    "@microsoft.graph.downloadUrl"?: URL | string,
    "createdDateTime"?: string,
    "eTag"?: string,
    "id": string,
    "lastModifiedDateTime"?: string,
    "name": string,
    "webUrl"?: URL | string,
    "cTag"?: string,
    "media"?: MEDIA,
    "size"?: number,
    "createdBy"?: {
        "application"?: {
            "id": string,
            "displayName": string
        },
        "user"?: {
            "email": string,
            "id": string,
            "displayName": string
        }
    },
    "lastModifiedBy"?: {
        "application"?: {
            "id": string,
            "displayName": string
        },
        "user"?: {
            "email": string,
            "id": string,
            "displayName": string
        }
    },
    "parentReference"?: {
        "driveType": string,
        "driveId": string,
        "id": string,
        "path": string,
        "siteId": string
    },
    "file"?: {
        "mimeType": "application/octet-stream" | string,
        "hashes": {
            "quickXorHash": string
        }
    },
    "fileSystemInfo"?: {
        "createdDateTime": string,
        "lastModifiedDateTime": string
    },
    "shared"?: {
        "scope": "users" | string
    },
    "video"?: {
        "bitrate": number,
        "height": number,
        "width": number
    },
    "folder"?: {
        "childCount": number
    },
    "image"?: {
        "height": number,
        "width": number
    },
    "photo"?: {
        "orientation"?: number,
        "takenDateTime"?: string
    },
    "thumbnails"?: [
        {
            "large"?: {
                "width": number,
                "height": number,
                "url": URL | string
            }
        }
    ]
}

/** REST API Error信息 */
interface Error {
    "code": string,
    "message": string,
    "innerError": {
        "date": string,
        'request-id': string,
        'client-request-id': string
    }
}

/** REST API folder列表信息 */
interface CHILDREN {
    "@odata.context"?: string
    "@odata.nextLink"?: string
    "value"?: ITEM[]
    "error"?: Error
}

/** REST API 缩略图信息 */
interface thumbnail extends JSON {
    "@odata.context"?: URL | string,
    "value"?: [
        {
            "large"?: {
                "height": Number,
                "url": URL | string,
                "width": Number
            }
        }
    ]
}

/** REST API 预览信息 */
interface preview extends JSON {
    "@odata.context"?: URL | string,
    "getUrl"?: URL | string,
    "postParameters"?: string | null,
    "postUrl"?: string | null
}

interface createUploadSession extends JSON {
    '@odata.context': string
    expirationDateTime: string
    nextExpectedRanges: string[],
    uploadUrl?: string
    error?: Error
}


/**
 * 默认API服务
 */
class defaultAPI {
    BASEv1: string = "https://graph.microsoft.com/v1.0/"
    /** 远程路径,必须以/开头 */
    remote: string
    constructor(remote: string = "/") {
        this.remote = remote
    }

    /**
     * 标准GET
     * @param url 请求路径
     * @returns 
     */
    async get(url: URL | string,) {
        // console.log(url)
        const JWT = await access_token()
        const r = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + JWT.access_token
            },
        })
        return await r.json()
    }

    /**
     * 标准POST
     * @param url 请求路径
     * @param body 请求体
     * @returns 
     */
    async post(url: URL | string, body: string | null | undefined) {
        // console.log(url)
        const JWT = await access_token()
        const r = await fetch(url, {
            method: "POST",
            body: body,
            headers: {
                Authorization: 'Bearer ' + JWT.access_token,
                "Content-Type": "application/json"
            },
        })
        return await r.json()
    }

    async patch(url: URL | string, body: string | null | undefined) {
        // console.log(url)
        const JWT = await access_token()
        const r = await fetch(url, {
            method: "PATCH",
            body: body,
            headers: {
                Authorization: 'Bearer ' + JWT.access_token,
                "Content-Type": "application/json"
            },
        })
        return await r.json()
    }

    async me(): Promise<ME> {
        return await this.get(this.BASEv1 + "me")
    }

    /**
     * 列出文件列表
     * @param path 文件路径
     * @returns 
     */
    async children(path: string): Promise<CHILDREN> {
        return JSON.parse("{}")
    }

    /**
     * 获取文件信息
     * @param id 文件唯一ID标识符
     * @returns 
     */
    async file(id: string): Promise<ITEM> {
        return JSON.parse("{}")
    }

    /** 获取缩略图 */
    async thumbnail(id: string): Promise<thumbnail> {
        return JSON.parse("{}")
    }

    /** 获取文件夹下属所有缩略图 */
    async thumbnails(id: string): Promise<CHILDREN> {
        return JSON.parse("{}")
    }

    /**获取预览 */
    async preview(id: string): Promise<preview> {
        return JSON.parse("{}")
    }
}

class GraphAPI extends defaultAPI {
    constructor(remote: string) {
        super(remote)
    }

    async children(path: string, nexturl?: string) {
        if (nexturl) {
            return this.get(nexturl) as Promise<CHILDREN>
        }
        const p = join(this.remote, path)
        if (p === "/") {
            return this.get(`${this.BASEv1}me/drive/root/children?$select=id,name,folder`) as Promise<CHILDREN>
        } else {
            return this.get(`${this.BASEv1}me/drive/root:${p}:/children?$select=id,name,folder`) as Promise<CHILDREN>
        }
    }

    async file(id: string): Promise<ITEM> {
        return this.get(`${this.BASEv1}me/drive/items/${id}`) as Promise<ITEM>
    }

    async fileBypath(path: string): Promise<ITEM> {
        const p = join(this.remote, path)
        return this.get(`${this.BASEv1}me/drive/root:${p}:/`) as Promise<ITEM>
    }

    async thumbnail(id: string): Promise<thumbnail> {
        return await this.get(`${this.BASEv1}me/drive/items/${id}/thumbnails?$select=large`)
    }

    async thumbnails(id: string): Promise<CHILDREN> {
        return await this.get(`${this.BASEv1}me/drive/items/${id}/children?$expand=thumbnails&$select=thumbnails,id,name`)
    }

    async preview(id: string): Promise<preview> {
        return await this.post(`${this.BASEv1}me/drive/items/${id}/preview`, null)
    }

    async content(id: string) {
        const JWT = await access_token()
        return fetch(`${this.BASEv1}me/drive/items/${id}/content`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + JWT.access_token
            },
        })
    }
    async contentBypath(path: string) {
        const p = join(this.remote, path)
        const JWT = await access_token()
        return fetch(`${this.BASEv1}me/drive/root:${p}:/content`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + JWT.access_token
            },
        })
    }

    async u_creatUploadsession(path: string): Promise<createUploadSession> {
        const p = join(this.remote, path)
        return await this.post(`${this.BASEv1}me/drive/root:${p}:/createUploadSession`, JSON.stringify({
            "item": {
                "@microsoft.graph.conflictBehavior": "replace",
                "name": basename(path)
            }
        })) as createUploadSession
    }

    sliceFile(file: Blob, chunkSize: number = 5 * 1024 * 1024) {
        const slices = [];
        let start = 0;
        while (start < file.size) {
            slices.push(file.slice(start, start + chunkSize));
            start += chunkSize;
        }
        return slices;
    }

    async uploadChunks(uploadSessionUrl: string, data: any, chunkSize: number = 5 * 1024 * 1024) {
        const jsonString = JSON.stringify(data);
        const file = new Blob([jsonString], { type: 'application/json' });
        const slices = this.sliceFile(file);
        let index = 0;
        async function uploadNextChunk() {
            if (index >= slices.length) {
                // console.debug('文件上传完成');
                return;
            }
            const currentChunk = slices[index];
            const chunkStart = index * chunkSize;
            const chunkEnd = chunkStart + currentChunk.size - 1;

            const headers = {
                'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${file.size}`,
                'Content-Length': currentChunk.size.toString(),
            };

            // fetch(uploadSessionUrl, {
            //     method: 'PUT',
            //     headers,
            //     body: currentChunk,
            // }).then(response => {
            //     if (!response.ok) {
            //         console.error(`Chunk upload failed: ${response.status} ${response.statusText}`);
            //         throw new Error(`Chunk upload failed: ${response.status} ${response.statusText}`);
            //     }
            //     // console.debug(`Uploaded chunk ${index + 1}/${slices.length}`);
            //     index++;
            //     uploadNextChunk();
            // }).catch(error => {
            //     console.error(`Chunk upload failed: ${error}`);
            //     throw new Error(`Chunk upload failed: ${error}`)
            // });

            const response = await fetch(uploadSessionUrl, {
                method: 'PUT',
                headers,
                body: currentChunk,
            })
            if (!response.ok) {
                console.error(`Chunk upload failed: ${response.status} ${response.statusText}`);
                throw new Error(`Chunk upload failed: ${response.status} ${response.statusText}`);
            }
            // console.debug(`Uploaded chunk ${index + 1}/${slices.length}`);
            index++;
            await uploadNextChunk();
        }
        await uploadNextChunk();
    }

    async Upload(path: string, data: any) {
        const url = (await this.u_creatUploadsession(path)).uploadUrl
        if (url) {
            // console.log(`文件${name}开始上传`)
            await this.uploadChunks(url, data)
        } else {
            console.error(`${path}创建上传会话失败`)
            throw new Error(`${path}创建上传会话失败`)
        }
    }

    async createFolder(path: string, folder: string) {
        const p = join(this.remote, path)
        let url
        if (p === "/") {
            url = `${this.BASEv1}me/drive/root/children`
        } else {
            url = `${this.BASEv1}me/drive/root:/${p}:/children`
        }
        return this.post(url, JSON.stringify({
            "name": folder,
            "folder": {},
            "@microsoft.graph.conflictBehavior": "fail"
        })) as Promise<ITEM>
    }

    async move(oldpath: string, finalfolderid: string) {
        const p = join(this.remote, oldpath)
        let url
        if (p === "/") {
            url = `${this.BASEv1}me/drive/root/`
        } else {
            url = `${this.BASEv1}me/drive/root:/${p}:/`
        }

        return this.patch(url, JSON.stringify({
            "parentReference": {
                "id": finalfolderid
            },
            "name": basename(p)
        })) as Promise<ITEM>
    }
}

export { GraphAPI }