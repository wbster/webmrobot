import { usersdb } from "./db";

export default class Followers {
    getList() {
        return usersdb.find({})
    }

    add(id: number) {
        return usersdb.insert({ id })
    }

    remove(id) {
        return usersdb.remove({ id })
    }

    getIds() {
        return this.getList().then(docs => docs.map(({ id }) => id)).then(ids => ids.map(Number))
    }
}