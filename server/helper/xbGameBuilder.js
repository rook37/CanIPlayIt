import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });



//We want to bring in our data for GP Ultimate, PC, Standard, and GP Core, going through each, updating their objects. 
//It'll check for the title by xbox_id first. If it's there, just update subscription. If it's not, call the API and update.

//Parameters: 0 will initialize games.json, anything else (or nothing) will try to update existing. 
const updateGamePass = async (init) => {
 let ult = JSON.parse(fs.readFileSync(`json/xbAllGames.json`)) 
 let core = JSON.parse(fs.readFileSync(`json/xbCore.json`))
 let standard = JSON.parse(fs.readFileSync(`json/xbStandard.json`))
 let pc = JSON.parse(fs.readFileSync(`json/xbPC.json`))
 let ea = JSON.parse(fs.readFileSync(`json/xbEAPlay.json`))
 let games = (init ===0) ? []:JSON.parse(fs.readFileSync(`data/games.json`))

 ult.shift();
 core.shift();
 standard.shift();
 pc.shift();
 ea.shift();
 ult = ult.concat(ea);//everything on EA is also on ultimate, just making sure everything is checked.

 games = await updateXBGames(games,ult,"Game Pass Ultimate")
 console.log("Done Ult 1")
 games = await updateXBGames(games,core,"Game Pass Core");
 console.log("Done Core 2")
 games = await updateXBGames(games,standard,"Game Pass Standard");
 console.log("Done Standard 3")
 games = await updateXBGames(games,pc,"Game Pass PC")
 console.log("Done PC 4")
 console.log(`Saving update - ${games.length} games stored`)

 games.sort((a, b) => (a.title < b.title ? -1 : 1));
 
 fs.writeFileSync(`data/games.json`,JSON.stringify(games))
 return

}

const updateXBGames = async (games,list,serviceName)=>{
let updatedGames = games;
let newCount = 0;
for(let gameObj of list){
   
    let found = updatedGames.findIndex((elem)=>elem.xbox_id==gameObj.id)
    if(found>-1){
        if(!updatedGames[found].subscriptions.includes(serviceName)){
            updatedGames[found].subscriptions.push(serviceName)
        };
    }
    else{
        try {
            
            let response = await axios.get(process.env.XB_GET_INFO1+''+gameObj.id+process.env.XB_GET_INFO2)
            response = response.data;
            let game = {
                title: response.Products[0].LocalizedProperties[0].ProductTitle,
                description: response.Products[0].LocalizedProperties[0].ProductDescription,
                image: "",
                developers: [response.Products[0].LocalizedProperties[0].DeveloperName],
                publishers: [response.Products[0].LocalizedProperties[0].PublisherName],
                release_date: response.Products[0].MarketProperties[0].OriginalReleaseDate,
                xbox_id:response.Products[0].ProductId
            }
            game.genre = (response.Products[0].Properties.Categories !==null) ? response.Products[0].Properties.Categories : [response.Products[0].Properties.Category] 
            
            //console.log(`Adding ${game.title} - ${serviceName}`)
            let platforms = response.Products[0].DisplaySkuAvailabilities[0].Availabilities[0].Conditions.ClientConditions.AllowedPlatforms;
    
            //if it's on two platforms in the xbAllupdatedGames list, that means PC + Xbox
    
            if(serviceName == "Game Pass PC"){game.platforms = ["PC"]}
            else{
            let consoleCompat = (platforms.length > 1 || platforms[0].PlatformName == "Windows.Desktop") ? ["PC"] : [];
            
            if (platforms.length > 1 || platforms[0].PlatformName === "Windows.Xbox") {
                
                let consoleCompatInfo = response.Products[0].Properties.XboxConsoleGenCompatible;
                if(!consoleCompatInfo){ consoleCompat.push("Xbox One","Xbox Series X/S")

                }else{
                if (consoleCompatInfo.includes("ConsoleGen8")) { consoleCompat.push("Xbox One") }
                if (consoleCompatInfo.includes("ConsoleGen9")) { consoleCompat.push("Xbox Series X/S") }}
            }
            game.platforms = consoleCompat;}
    
            let affirm = response.Products[0].LocalizedProperties[0].EligibilityProperties.Affirmations;
            let subscriptions = (serviceName==="Game Pass Ultimate") ? ["Game Pass Ultimate"]: ["Game Pass Ultimate",serviceName];
            affirm.forEach( (obj)=>{      
                if(obj.Description.includes(" EA ")){
                    subscriptions.push("EA Play")
                }
            })
            game.subscriptions = subscriptions;
            
            newCount++;
            updatedGames.push(game);

        } catch (er) { console.log(er);
            console.log(gameObj.id)
            }
    }
 }
 console.log(`\nFinished updating ${serviceName}. Current length: ${updatedGames.length} (+${newCount})\n`)
return updatedGames;
}

updateGamePass(0);
export {updateGamePass}


