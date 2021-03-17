import monk from "monk";

const db = monk(process.env.mongo_url)

export const usersdb = db.get('users')
export const filesdb = db.get('files')