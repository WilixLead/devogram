/**
 * Created by Aloyan Dmitry on 14.11.2015.
 */
var express = require('express');
var path = require('path');
var cors = require('cors');
var mongoose = require('mongoose');

var PinnedMessage = require('./server/model_pinned_message.js');

var port = 8000;
var app = express();
var appPath = path.join(__dirname, './dist');

mongoose.connect('mongodb://localhost:27017/devogram');

app.use(express.static(appPath));
app.use(cors());

app.get('/api/v1/pinnedMessages/:channelId', function(req, res, next){
    PinnedMessage.findOne({channel_id: req.params.channelId}, function(err, channel){
        if( err ) return next(err);
        return res.send({success: true, messages: channel ? channel.messages : []});
    });
});

app.post('/api/v1/pinnedMessages/:channelId/:messageId', function(req, res, next){
    PinnedMessage.pinMessage(req.params.channelId, req.params.messageId, function(err, obj){
        if( err ) return next(err);
        return res.send({success: true});
    });
});

app.delete('/api/v1/pinnedMessages/:channelId/:messageId', function(req, res, next){
    PinnedMessage.unpinMessage(req.params.channelId, req.params.messageId, function(err, obj){
        if( err ) return next(err);
        return res.send({success: true});
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