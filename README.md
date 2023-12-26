# MUI X Nhimmeo

[mn.koroneko.co](https://mn.koroneko.co/)

## Mysql2

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