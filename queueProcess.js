/**
 * Author : madhavkaneriya
 * Processes tasks based on time and priority
 */

'use strict';
var csv = require('csvtojson'),             //Library to convert csv data to json
    moment = require('moment'),
    schedule = require('node-schedule'),
    fileName = process.argv[2],             //Get filename/path from second argument
    startTime = new Date(process.argv[3]),  //Get start time from third argument
    queue = [];

csv()
  .fromFile(fileName)
  .on('json',function(jsonObj){
    if(jsonObj.priority == null || jsonObj.priority == "") jsonObj.priority = Infinity; //It will help while sorting based on 'priority'
    queue.push(jsonObj);
  })
  .on('done',function(error){
    if(error) console.log(error);
    else{
      queue = queue.sort(function(a,b){             //Sort queue based on 'time_to_expire' and 'priority'
        return (new Date(a.time_to_expire) - new Date(b.time_to_expire)) || (a.priority - b.priority)
      });

      schedule.scheduleJob(startTime, function(){   //Schedule at start time
        queue.forEach(function(item){
          schedule.scheduleJob(new Date(item.time_to_expire), function(){
            console.log('Current time ['+ moment().format("YYYY/MM/DD hh:mm") +'] , Event "' + item.event_name+'" Processed');//Output string
          });
        });
      });
    }
  });
