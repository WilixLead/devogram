/**
 * Created by Aloyan Dmitry on 14.11.2015.
 */
var mongoose = require('mongoose');

var Scheme = mongoose.Schema({
    channel_id: String,
    messages: Array
});

Scheme.statics.pinMessage = function (channelId, messageId, callback) {
    var model = mongoose.model('PinnedMessage');
    model.findOneAndUpdate(
        {channel_id: channelId},
        {
            $set: {channel_id: channelId},
            $addToSet: {messages: messageId }
        },
        {upsert: true, new: true}, function (err, doc) {
            callback && callback(err, doc);
        });
};

Scheme.statics.unpinMessage = function (channelId, messageId, callback) {
    var model = mongoose.model('PinnedMessage');
    model.findOneAndUpdate(
        {channel_id: channelId},
        {
            $set: {channel_id: channelId},
            $pull: {messages: messageId }
        },
        {upsert: true, new: true}, function (err, doc) {
            callback && callback(err, doc);
        });
};

module.exports = mongoose.model('PinnedMessage', Scheme);