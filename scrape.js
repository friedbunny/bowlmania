var express = require('express');
var app = express();
app.set('title', 'ESPN Bowl Mania Scraper');
app.set('jsonp callback', true);

var nodeio = require('node.io');
var options = {timeout: 10, max: 2, benchmark: true};
var bowlmania = {};

app.configure(function(){
    app.use(express.logger());
});

// heroku logging
var logfmt = require("logfmt");
app.use(logfmt.requestLogger());


app.use('/bowlmania.json', function(req, res){

    nodeio.start(scraper, function (err, output) {
    
        if (err) {
            console.log('ERROR', err);
        } else {
            //console.log(output);
            //console.log('SENT');
            /*res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");*/
            res.setHeader("Cache-Control", "public, max-age=60");// + (10 * 60));
            
            res.jsonp(bowlmania);
        }
    }, true);
    
});

/*var fs = require('fs');
fs.stat(__filename, function(err, stats) { console.log('Last modified', stats.mtime); });
delete fs;*/

app.listen(9898);
console.log('Started server on port 9898.');

var scraper = new nodeio.Job(options, {

    input: ['confidence', 'straight'],
    run: function (entryType) {
    
        //console.log('JOB:', entryType);
    
        var self = this;
        
        this.getHtml('http://localhost/bowls/espn-passthru.php?type=' + entryType, function (err, $) {
        
            if (err) {
            
                console.log("ERROR", err);
                self.retry();
                
            } else {
            
                $('table.scoresheet tbody tr').each(function(listing) {

					try {
					
	                    var entryName = $('td.games-left a', listing).first().fulltext;
	                    var player = $('td.games-left a', listing).last().fulltext;
	                    
	                } catch (err) {
	                
	                	// 2013: skip onto the next <tr></tr> if there's no player 
	                	return false;
	                	
	                }
                    
                    //self.emit(player + ': ' + entryName);
                    
                    var realName = whoIsThis(player);
                    if (bowlmania[realName] === undefined) bowlmania[realName] = {};
                            
                    bowlmania[realName][entryType] = {};
                    var obj = bowlmania[realName][entryType]; 

                    obj.entryName = entryName;   


                    var picks = {};
                    //var picksEcho = '';
                
                    $('td.pick', listing).each(function(pick){
                        
						try {
						
		                    var team = $('span img', pick).attribs.alt;
	                        var confidencePoints = $('span', pick).text;
		                    
		                } catch (err) {
		                
		                	// 2013: skip onto the next <td></td> if there's no pick 
		                	return;
		                	
		                }
                        
                        var winLose = $('span', pick).attribs.class;
                        
                        // redundant: if (team == '--'/* || !winLose*/) return;
                        
                        picks[team] = {};
                        if (entryType == "confidence") picks[team].pts = parseInt(confidencePoints);
                        picks[team].win = (winLose == 'win') ? 1 : (winLose == 'loss') ? 0 : -1; 
                        
                        //picksEcho += team + ' ' + confidencePoints + ' (' + winLose + '), ';
                        
                    });
                    
                    obj.picks = picks;

                    //self.emit(picksEcho);
                    
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
    	case 'robins422003':       return 'robin'; break;

		default: return data;
	}

};


/*

        this.getHtml('http://games.espn.go.com/college-bowl-mania/en/m/scoresheet?groupID=' + encodeURIComponent(groupID), function (err, $) {
        
            if (err) {
            
                console.log("ERROR", err);
                self.retry();
                
            } else {
            
                $('table.scoresheet tbody tr').each(function(listing) {
                    var entryName = $('td.games-left a', listing).first().fulltext;
                    var player = $('td.games-left a', listing).last().fulltext;
                    
                    self.emit(player + ': ' + entryName);
                    
                    var pickCount = 0;
                    var picks = '    ';
                    $('td.pick', listing).each(function(pick){
                        pickCount++;
                        
                        picks += $('span', pick).fulltext + ' ';
                        
                    });
                    
                    self.emit(picks);
                    self.emit('    (' + pickCount + ' picks)');
                    
                });
                
            }
            
        });
  



        this.getHtml('http://games.espn.go.com/college-bowl-mania/en/m/entry?entryID=' + encodeURIComponent(entryID), function (err, $) {
        
            if (err) {
            
                console.log("ERROR", err);
                self.retry();
                
            } else {
            
                var pickCount = 0;
                var picks = '    ';
            
                $('table.pickemTable tbody tr').each(function(game) {
                    var gameTitle = $('td.title', game).fulltext;
                    var gameUserPick;
                    var gameTeam1 = $('td.teams span.pickem-teamName', game).first.fulltext;
                    var gameTeam2 = $('td.teams span.pickem-teamName', game).last.fulltext;
                    
                    var gameUserPoints = $('td.points span.entryPoints', game).fulltext;
                    
                    if ($('td.teams td.incorrect', game).notNull) {
                        gameUserPick = $('td.teams td.incorrect', game).fulltext;
                    } else if ($('td.teams td.correct', game).notNull) {
                        gameUserPick = $('td.teams td.correct', game).fulltext;
                    } else {
                        gameUserPick = "dunno";
                    }
                    

                    pickCount++;
                    
                    self.emit(gameTitle + ': ' + gameUserPick + ' (' + gameUserPoints + ')');
                   
                    
                });
                
                self.emit('    (' + pickCount + ' picks)');
                
            }
            
        });

        
*/