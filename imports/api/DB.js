import { Mongo } from 'meteor/mongo';

export default {
    Names: new Mongo.Collection('names', { idGeneration: 'MONGO' })
}
