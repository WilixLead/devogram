/**
 * Created by Aloyan Dmitry on 14.11.2015.
 */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var mongoose = require('mongoose');

var PinnedMessage = require('./server/model_pinned_message.js');

var port = 8000;
var app = express();
var appPath = path.join(__dirname, './dist');

mongoose.connect('mongodb://localhost:27017/devogram');

app.use(express.static(appPath));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/pinnedMessages/:channelId', function(req, res, next){
    var channelId = req.params.channelId;
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
    PinnedMessage.findOne(searchChannel, function(err, channel){
        if( err ) return next(err);
        return res.send({success: true, messages: channel ? channel.messages : []});
    });
});

app.post('/api/v1/pinnedMessages/:channelId', function(req, res, next){
    PinnedMessage.pinMessage(req.params.channelId, req.body.message, function(err, channel){
        if( err ) return next(err);
        return res.send({success: true, messages: channel ? channel.messages : []});
    });
});

app.delete('/api/v1/pinnedMessages/:channelId/:messageGmuid', function(req, res, next){
    PinnedMessage.unpinMessage(req.params.channelId, req.params.messageGmuid, function(err, channel){
        if( err ) return next(err);
        return res.send({success: true, messages: channel ? channel.messages : []});
    });
});

app.use(function(req, res){
    res.send({success: false, err: {code: 404, msg: 'not found'}});
});

app.use(function(err, req, res){
    res.send({success: false, err: {code: 503, msg: 'internal error'}});
});


app.listen(port, function(){
    console.log('Server started at ' + port + ' port');
});