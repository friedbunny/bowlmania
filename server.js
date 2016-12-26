var express = require('express');
var app = express();
app.set('title', 'ESPN Bowl Mania Scraper');
app.set('jsonp callback', true);

app.use(express.logger());
app.use(express.compress());
app.use(express.favicon(__dirname + '/favicon.ico', { maxAge: (86400000 * 365) }));
app.use(express.errorHandler());

var nodeio = require('node.io');
var options = {timeout: 10, max: 2, benchmark: true};
var bowlmania = {};


// heroku logging
var logfmt = require("logfmt");
app.use(logfmt.requestLogger());


app.use('/bowlmania.json', function(req, res) {

    res.header('Access-Control-Allow-Origin', 'http://kulturny.com');
    res.header('Access-Control-Allow-Methods', 'GET');

    nodeio.start(scraper, function (err, output) {
    
        if (err) {
            console.log('ERROR', err);
        } else {
            /*res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");*/
            res.setHeader("Cache-Control", "public, max-age=60");// + (10 * 60));
            
            res.jsonp(bowlmania);
        }
    }, true);
    
});


var port = (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT) || 5000;
var host = process.env.OPENSHIFT_NODEJS_IP || null;
app.listen(port, host, function() { console.log( "Listening on " + host + ":" + port) });


var scraper = new nodeio.Job(options, {

    input: ['confidence'/*, 'straight'*/],
    run: function (entryType) {
    
        //console.log('JOB:', entryType);
    
        var self = this;
        
        var year = 2016;
        //var url = 'http://games.espn.go.com/college-bowl-mania/' + year + '/en/format/ajax/scoresheetSnapshot?groupID=';
        var url = 'http://games.espn.go.com/college-bowl-mania/' + year + '/en/scoresheet?groupID=';
        switch(entryType) {             
            case 'confidence': var e = (year >= 2015) ? 106564 : 25569; break;
            case 'straight': var e = 28172; break;
        }
        
        this.getHtml(url + e, function (err, $) {
        
            if (err) {
            
                console.log("ERROR", err);
                self.retry();
                
            } else {         
            
                // TODO: Fix crash if the right DOM elements aren't found
                //if (!$('table.scoresheet tbody tr')) self.skip();

                $('table.scoresheet tbody tr').each(function(listing) {

                    try {
                    
                        var entryName = $('td.entry-owner a', listing).first().fulltext;
                        var player = $('td.entry-owner a', listing).last().fulltext;
                        
                    } catch (err) {
                    
                        // 2013: skip onto the next <tr></tr> if there's no player
                        console.error("No players found");
                        return false;
                        
                    }

                    //console.log(player + ': ' + entryName);
                    
                    var realName = whoIsThis(player);
                    if (bowlmania[realName] === undefined) bowlmania[realName] = {};

                    bowlmania[realName][entryType] = {};
                    var obj = bowlmania[realName][entryType]; 

                    obj.entryName = entryName;   


                    var picks = {};
                    //var picksEcho = '';
                
                    $('td.pick', listing).each(function(pick) {
                        
                        try {
                        
                            var team = $('img', pick).attribs.alt;
                            var confidencePoints = $('span', pick).text;
                            
                        } catch (err) {
                        
                            // 2013: skip onto the next <td></td> if there's no pick
                            return;
                            
                        }
                        
                        // so brittle
                        var winLose = pick.attribs.class.split(" ")[3];

                        // There are two teams that ESPN say are 'MSU', check if it's Mississippi State (MSST)
                        if (team == 'MSU') {
                            var url = $('img', pick).attribs.src;
                            if (url.search(/344\.png/) != -1) team = 'MSST';
                        }

                        picks[team] = {};
                        if (entryType == 'confidence') picks[team].pts = parseInt(confidencePoints);
                        picks[team].win = (winLose == 'win') ? 1 : (winLose == 'loss') ? 0 : -1; 
                        
                        //picksEcho += team + ' ' + confidencePoints + ' (' + winLose + '), ';
                        
                    });
                    
                    obj.picks = picks;

                    //console.log(picksEcho);
                    
                });
                
                //self.emit(bowlmania);
                self.skip();
                
            }
            
        });
        
    },
    complete: function () {
        
        //console.log(JSON.stringify(bowlmania));
        return (JSON.stringify(bowlmania));

    }
    
});


function whoIsThis(data) {

    switch(data) {              
        case 'jasonthefool':       return 'jason'; break;
        case 'FightingOnInOregon': return 'akiyo'; break;
        case 'arjayw':             return 'dad'; break;
        case 'Superelf7':          return 'nathan'; break;
        case 'Meerazha':           return 'meera'; break;
        case 'mwray':              return 'meera'; break;
        case 'robins422003':       return 'robin'; break;

        default: return data;
    }

};
