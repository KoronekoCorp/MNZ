import { UseDB } from "@/Data/UseDB"
import { ServerError } from "@/app/error.Server"

export default ServerError(Test)
async function Test() {
    const [db] = UseDB()
    await new Promise((resolve, reject) => {
        setTimeout(() => reject(Error('CWM')), 1000)
    })
    return <></>
}

