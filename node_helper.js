/* Magic Mirror
 * Module: MMM-EveryNews
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },
    getNatGeo: function(url) {

	var today = new Date();
	var yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);
	today = today.toISOString().substr(0,10);
	yesterday = yesterday.toISOString().substr(0,10);
	
	    var urlString = 'https://newsapi.org/v2/everything?q='+this.config.source+'&from=' + yesterday + '&to=' + today + '&sortBy=publishedAt&apiKey='+this.config.apiKey;
	// console.log(urlString);

	    
        /* url: 'https://newsapi.org/v2/top-headlines?country='+this.config.source+'&pageSize=50&sortBy=popularity&apiKey='+this.config.apiKey, */
	// @TODO the request api is deprecated.  use a different API here to get these results.  Perhaps the NewsAPI module?
        request({
                url: urlString,
                headers: {'User-Agent':this.config.userAgent},
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).articles;
                this.sendSocketNotification('NATGEO_RESULT', result);
            } else {
		// add error checking so the user gets a visible error they will need to do some troubleshooting
		// this will be in lieu of the infinite loading indicator
		var errorString = "Error loading NewsAPI data. <br>  Error # " + response.statusCode + ", " + JSON.parse(body).code + "<br>" + JSON.parse(body).message;
		this.sendSocketNotification('NATGEO_ERROR', errorString);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_NATGEO') {
            this.getNatGeo(payload);
        }
        if (notification === 'CONFIG') {
            this.config = payload;
      //  console.log(this.config);
        }
    }
});
