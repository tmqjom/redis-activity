import { Vent } from "meteor/cultofcoders:redis-oplog";

const EVENTS = [
    // default events
    "update", "insert", "remove", "upsert",
    //custom event
    "mutate"
];
class RedisVent {
    #pre;
    constructor() { }
    get Notifier() {
        this.#pre = "notifier";
        return this;
    }
    get Attachment() {
        this.#pre = "attachment";
        return this;
    }
    get Todos() {
        this.#pre = "todos";
        return this;
    }
    get Names() {
        this.#pre = "names";
        return this;
    }


    publish() {
        const pub = function (namespace, key, id) {
            EVENTS.forEach((event) => {
                if (typeof id == "string")
                    this.on(`${namespace}::${key}::${id}::${event}`, (data) => {
                        return { data, event };
                    });
                else if (id instanceof Array)
                    id.forEach((id_) => {
                        this.on(`${namespace}::${key}::${id_}::${event}`, (data) => {
                            return { data, event };
                        });
                    });
            });
            // ADD CUSTOM EVENTS HERE
            return this.ready();
        };
        Vent.publish({
            "listen"({ namespace, key, id }) {
                pub.call(this, namespace, key, id);
            }
        });
    }
    triggerUpdate(key, id, data) {
        if (this.#pre) {
            Vent.emit(`${this.#pre}::${key}::${id}::update`, { _id: id, data });
            this.#pre = null;
        }
    }
    triggerUpsert(key, id, data) {
        if (this.#pre) {
            Vent.emit(`${this.#pre}::${key}::${id}::upsert`, { _id: id, data });
            this.#pre = null;
        }
    }
    triggerInsert(key, id, data) {
        if (this.#pre) {
            Vent.emit(`${this.#pre}::${key}::${id}::insert`, { data });
            this.#pre = null;
        }
    }
    triggerRemove(key, id, data) {
        if (this.#pre) {
            Vent.emit(`${this.#pre}::${key}::${id}::remove`, { _id: data });
            this.#pre = null;
        }
    }
    triggerCustom(key, event, id, data) {
        if (this.#pre) {
            Vent.emit(`${this.#pre}::${key}::${id}::${event}`, { data });
            this.#pre = null;
        }
    }
}

export default new RedisVent();