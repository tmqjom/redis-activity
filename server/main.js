import { Meteor } from 'meteor/meteor';
import Server from '../imports/api/classes/server/Server.js';

Meteor.startup(async () => {
  Server.run();
});