require('dotenv').config();
const request = require("./await-request");

async function post_log_message(title, desc, url = "https://akriya.co.in") {
    let headers = { 'Content-Type': 'application/json' };
    console.log('------------------');
    var msg = await request({
        method: 'post',
        url: process.env.discord_webhook,
        body: JSON.stringify({
            "embeds": [{

                "title": title,
                "description": JSON.stringify(desc),
                "url": url,
                color: 15844367,
                "fields": [
                    {
                        "name": "🏗️ How to submit",
                        "value": `HTML/JS/CSS zip
                        A git repo with HTML/JS/CSS or Vue Component
                        A Merge request to tj-client repo (a Vue Component)
                        
                        Codepen/Glitch Link
                        
                        `
                    },
                    {
                        "name": "🔺 Point System",
                        "value": `
                        Widget/Component posted once approved/added by either @kaaro or @sourabh.k.ed get 5 point

                        Any widget already defined in the Go-Mad Issue get 2 points

                        Best preforming widget will get 2 points
                        
                        `
                    },
                    {
                        "name": "📢 Who can participate",
                        "value": `
                        If you can write HTML, you are eligible!
                        
                        `
                    },
                    {
                        "name": "👑 What do you win",
                        "value": `
                        Swags (personally shipped by me)
                        Special badge on Discord for 1 week.
                        Amazon Gift Card worth ₹ 314
                        
                        `
                    },



                ],
                "footer": {
                    "icon_url": "https://cdn.discordapp.com/attachments/815608793059557387/847112294117933076/IMG-20201021-WA0009.jpg",
                    "text": "Eddy Approved"
                },
                "image": {
                    url: "https://cdn.discordapp.com/attachments/815608793059557387/846764547669884928/Screenshot_2021-05-25_at_8.29.26_PM.png",
                },
                "thumbnail": {
                    url: "https://gitlab.com/edvanta/go-mad/uploads/7417c603289103a5ff0da83de19818f8/image.png",
                }
            }]
        }),
        headers: headers
        // json: true
    });
    console.log(msg);
    console.log('------------------');
}


async function init() {
    await post_log_message('Announcing ComponentCompetitionx31', `mini-hackathon for ThoughtJumper ecosystem.`, 'https://gitlab.com/edvanta/go-mad/-/issues/136');

}

init();