import { scheduleJob, RecurrenceRule } from 'node-schedule';


const rule = new RecurrenceRule();
rule.minute = 42;
rule.hour = 18;
rule.tz = 'Africa/Cairo'; 

console.log('Scheduled job rule:', rule);

export const cronTwo = () => {
    console.log('CronTwo function started');
    scheduleJob(rule, function() {
        console.log("CronJob runs");
    });
}

export const cronOne = ()=>{
    scheduleJob('* 50 * * * *' , function(){
        console.log("CronJob runs every second");
    })
}









