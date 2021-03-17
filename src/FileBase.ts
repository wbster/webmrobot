import { filesdb } from "./db";

export default class FileBase {
    constructor() {

    }

    find(path: string) {
        return filesdb.findOne({ path })
            .then(doc => doc || Promise.reject('not found'))
    }

    add(path: string) {
        return filesdb.insert({ path })
    }

    remove(path: string) {
        return filesdb.remove({ path })
    }
}