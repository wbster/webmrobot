import { basename } from "node:path";
import { bot } from "./Bot";
import Dvach from "./DvaCh";
import FileBase from "./FileBase";
import Followers from "./Followers";
import sleep from "./utils/sleep";

const dvach = new Dvach()

const followers = new Followers()
bot.on('message', (message) => {
    const id = message.chat.id;
    switch (message.text) {
        case '/follow':
            followers
                .add(id)
                .then(() => bot.sendMessage(id, 'ok'))
            break;
        case '/unfollow':
            followers
                .remove(id)
                .then(() => bot.sendMessage(id, 'ok'))
            break;
        case '/followers':
            followers
                .getList()
                .then(docs => docs.length)
                .then(count => bot.sendMessage(id, `${count}`))
            break;
    }
})

const filebase = new FileBase()
setInterval(() => {
    dvach
        .getFiles(1)
        .then(files => files.filter(({ path }) => /\.(mp4|webm)/i.test(path)))
        .then(async list => {
            for (let { path } of list) {
                const has = await filebase.find(path).then(() => true).catch(() => null)
                if (has) continue
                await filebase.add(path)
                const buffer = await dvach.getFile(path)
                const [main, ...ids] = await followers.getIds()
                const file_id = await bot
                    .sendVideo(main, buffer)
                    .then(message => message.video.file_id)

                for (let id of ids) {
                    await sleep(100)
                    await bot.sendVideo(id, file_id)
                }
            }
        })
}, 5000)