import axios, { AxiosInstance } from "axios";
import * as yup from 'yup'

const threadSchema = yup.object({
    threads: yup.array(yup.object({
        posts: yup.array(yup.object({
            files: yup.array(yup.object({
                path: yup.string()
            })).default([])
        })).default([])
    })).default([])
})

export default class Dvach {
    private url: string
    private axios: AxiosInstance
    constructor() {
        this.url = `https://2ch.hk`
        this.axios = axios.create({ baseURL: this.url })
    }

    getPage(page: number) {
        return this.axios.get(`/b/${page}.json`).then(({ data }) => data)
    }

    getFiles(page: number) {
        return this.getPage(page)
            .then(data => threadSchema.validate(data, { stripUnknown: true }))
            .then(data => {
                const files: Array<{ path: string }> = []
                data.threads.forEach((thread) => {
                    thread.posts.forEach(post => {
                        post.files.forEach(file => files.push(file))
                    })
                })

                return files.filter((v, i, arr) => arr.indexOf(v) === i)
            })
    }

    getFile(path: string) {
        return this.axios.get(path, {
            responseType: 'arraybuffer'
        }).then(({ data }) => <Buffer>data)
    }
}