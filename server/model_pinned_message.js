/**
 * Created by Aloyan Dmitry on 14.11.2015.
 */
var mongoose = require('mongoose');

var Scheme = mongoose.Schema({
    channel_id: String,
    messages: []
});

Scheme.statics.pinMessage = function (channelId, message, callback) {
    var model = mongoose.model('PinnedMessage');
    message.dmuid = 'duid_' + Date.now();
    
    var searchChannel = {channel_id: channelId};
    if( channelId.indexOf('_') !== -1 ){
        channelId = channelId.split('_');
        searchChannel = {
            $or: [
                {channel_id: channelId[0] + '_' + channelId[1]},
                {channel_id: channelId[1] + '_' + channelId[0]}
            ]
        };
    }
    model.findOneAndUpdate( searchChannel, {
            $set: {channel_id: channelId[0] + '_' + channelId[1]},
            $addToSet: {messages: message }
        },
        {upsert: true, new: true}, function (err, doc) {
            callback && callback(err, doc);
        });
};

Scheme.statics.unpinMessage = function (channelId, messageDmuid, callback) {
    var model = mongoose.model('PinnedMessage');
    var searchChannel = {channel_id: channelId};
    if( channelId.indexOf('_') !== -1 ){
        channelId = channelId.split('_');
        searchChannel = {
            $or: [
                {channel_id: channelId[0] + '_' + channelId[1]},
                {channel_id: channelId[1] + '_' + channelId[0]}
            ]
        };
    }
    model.findOneAndUpdate( searchChannel, {
            //$set: {channel_id: channelId[0] + '_' + channelId[1]},
            $pull: {messages: { dmuid: messageDmuid}}
        },
        {upsert: true, new: true}, function (err, doc) {
            callback && callback(err, doc);
        });
};

module.exports = mongoose.model('PinnedMessage', Scheme);