import { Meteor } from 'meteor/meteor';
import DB from '../../DB';
import RedisVent from "../../classes/server/RedisVent"

class Server {
    #settings = null
    #redisClient = null
    #redisPubSub = null
    #idToRemove;
    constructor(settings) {
        this.#settings = settings
    }
    get Config() {
        return this.#settings
    }

    initDB() {
        return new Promise((resolve, reject) => {
            if (!DB.Names.find().fetch().length) {
                const datas = [{ name: "Kelsie Anthony", },
                { name: "Tessa Huynh", },
                { name: "Londyn Jensen", },
                { name: "Justine Snow", }]
                DB.Names.rawCollection().insertMany(datas).then(resolve).catch(reject)
            } else resolve()
        })
    }
    startRedis() {
        return new Promise((resolve) => {
            const red = RedisVent.publish();
            console.log("Redis ready!", red)
            resolve()
        });
    }
    run() {
        return Promise.all([this.initMethods(), this.initDB(), this.startRedis()]).then(() => {
            console.log("Server is ready")
        })
    }
    initMethods() {
        return new Promise((resolve, reject) => {
            console.log("Initializing methods")
            Meteor.methods({
                "getData": function (id) {
                    const retval = DB.Names.find().fetch()
                    const idToRemove = "";

                    Meteor.setTimeout(() => {
                        // RedisVent.Names.triggerCustom("names", "mutate", id, { name: "Jomel Polistico", id: retval[0]._id._str })
                        // RedisVent.Names.triggerRemove("names", id, retval[0]._id._str)
                        // RedisVent.Names.triggerUpdate("names", id, { name: "George Washington", id: retval[0]._id._str })
                        RedisVent.Names.triggerUpsert("names", id, { name: "George Washington", occupation: "President", id: retval[0]._id._str })
                        // RedisVent.Names.triggerInsert("names", id, { name: "newName", id: retval[0]._id._str })
                    }, 2000)
                    return retval.map((t) => ({ name: t.name, id: t._id._str }))
                }
            })
            resolve()
        })
    }
}

export default new Server(Meteor.settings)