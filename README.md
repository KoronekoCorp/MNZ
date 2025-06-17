# MUI X Nhimmeo

## 技术栈

React+Nextjs、MUI、Redis、Mysql

```
docker run --rm -d -p 3000:3000/tcp koronekobot/mnz:latest
```

## 往期碎碎念（无用）

<details>
<summary>往期碎碎念（无用）</summary>


## 相关说明

使用 `bash move.sh`  切换本地和服务模式

本地部署正在支持中，用户分享章节（shchap）未开放

请自行配置环境变量

```bash
DB_PROXY=https://db.elysia.rip
TurnstileS=1x0000000000000000000000000000000AA	
```

> 特别提示
>
>    db.elysia.rip偶尔可能触发cloudflare的自动程序攻击模式，如果经常遇到，可以将IP提供给我，我会单独为你设置白名单

</details>


## 知识

<details>
<summary>知识</summary>

### npm包年久失修，依赖冲突如何修复

```bash
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: aplayer-react@1.6.0
npm error Found: react@19.1.0
npm error node_modules/react
npm error   react@"^19.1.0" from the root project
npm error   peer react@"^17.0.0 || ^18.0.0 || ^19.0.0" from @mui/utils@7.1.1
npm error   node_modules/@mui/utils
npm error     @mui/utils@"^7.1.1" from @mui/material@7.1.1
npm error     node_modules/@mui/material
npm error       @mui/material@"^7.1.1" from the root project
npm error       2 more (@mui/icons-material, @mui/x-charts)
npm error     @mui/utils@"^7.1.1" from @mui/x-charts@8.5.1
npm error     node_modules/@mui/x-charts
npm error       @mui/x-charts@"^8.5.1" from the root project
npm error     3 more (@mui/system, @mui/x-internals, @mui/private-theming)
npm error   16 more (@emotion/react, notistack, @mui/styled-engine, ...)
npm error
npm error Could not resolve dependency:
npm error peer react@"^18.2.0" from aplayer-react@1.6.0
npm error node_modules/aplayer-react
npm error   aplayer-react@"^1.6.0" from the root project
npm error
npm error Conflicting peer dependency: react@18.3.1
npm error node_modules/react
npm error   peer react@"^18.2.0" from aplayer-react@1.6.0
npm error   node_modules/aplayer-react
npm error     aplayer-react@"^1.6.0" from the root project
npm error
```

使用 `overrides` 强制锁定版本（npm v8.3+）

在 `package.json` 中添加：

```json
{
  "overrides": {
    "aplayer-react": {
      "react": "$react",
      "react-dom": "$react-dom"
    }
  }
}
```

### Mysql2

连接池自动使用中不会自动释放连接

需要手动获取连接并手动安排定时销毁没用的连接

```ts
async get_connet() {
    const connect = await this.pool.getConnection()
    if (this.Timer[connect.threadId]) {
        clearTimeout(this.Timer[connect.threadId])
    }
    console.log(connect.threadId)
    this.Timer[connect.threadId] = setTimeout(() => {
        console.log("[RELEASED]")
        connect.destroy()
    }, 60000);
    return connect
}
```

但是这样从连接池取出连接之后需要手动放回连接池，否则迟早到达上限

```ts
const connect = await this.get_connet()
const [rows, fields] = await connect.query(sql, values);
connect.release()
return rows as mysql.RowDataPacket[];
```

`connection.release()` 当一个连接不需要使用时，使用该方法将其归还到连接池中

`connection.destroy()` 当一个连接不需要使用且需要从连接池中移除时，可以使用该方法

`pool.end()`当一个连接池不需要使用时，可以使用该方法关闭连接池

</details>
