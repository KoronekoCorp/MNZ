# MUI X Nhimmeo

## 技术栈

React+Nextjs、Redis、Mysql

[mnz.koroneko.co](https://mnz.koroneko.co/)

## 相关说明

使用 `bash move.sh`  切换本地和服务模式

本地部署正在支持中，用户分享章节（shchap）未开放

请自行配置环境变量

```
DB_PROXY=https://capi.koroneko.co
TurnstileS=1x0000000000000000000000000000000AA	
```

## 往期碎碎念（无用）

<details>
<summary>往期碎碎念（无用）</summary>

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
