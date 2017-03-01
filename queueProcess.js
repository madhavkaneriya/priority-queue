/**
 * Created by madhav on 28/2/17.
 * Processes tasks based on time and priority
 */
'use strict';
var fileName = process.argv[2];//Get filename/path from argument
var queue = [];
var csv = require('csvtojson');
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

      (function checkStartTime(){
        var now = new Date();
        var startTime = new Date(process.argv[3]); //Get start time for execution

        if (now.getDate() === startTime.getDate() && now.getHours() === startTime.getHours() && now.getMinutes() === startTime.getMinutes()) {
          executeTask();                           //Start task execution
        }else{
          now = new Date();
          var delay = 60000 - (now % 60000);       //Exact ms to next minute interval
          setTimeout(checkStartTime, delay);
        }
      })()
    }
  });

function executeTask(){
  (function loop(){
    var now = new Date();
    var timeToExpire = new Date(queue[0].time_to_expire);

    if (now.getDate() === timeToExpire.getDate() && now.getHours() === timeToExpire.getHours() && now.getMinutes() === timeToExpire.getMinutes()) {

      console.log('Current time ['+ now.getFullYear() +"/"+ (now.getMonth()+1) + '/'+ now.getDate() + " "+ now.getHours() + ":" + now.getMinutes() +'] , Event "'+queue[0].event_name+'" Processed');     //Output string

      queue.shift();                      //Remove task from head

      if(queue.length > 0) executeTask(); //Execute next task
      else return;                        //Queue empty

    }else{
      now = new Date();
      var delay = 60000 - (now % 60000);  //Exact ms to next minute interval
      setTimeout(loop, delay);
    }
  })();
}