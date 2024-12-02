import axios from 'axios';
import fs from 'fs';



const regex = /(\s?-\s?PS5[™®]? & PS4[™®]?\s?|\s?\(PS4[™®]? & PS5[™®]?\)|\s?PS4[™®]? & PS5[™®]?|\s?\(PS4[™®]?&PS5[™®]?\)|\s?PS4[™®]?&PS5[™®]?|\s?\(PS5[™®]? & PS4[™®]?\)|\s?PS5[™®]? & PS4[™®]?|\s?\(PS5[™®]?&PS4[™®]?\)|\s?PS5[™®]?&PS4[™®]?)$/i;
//grabs (PS4 & PS5) and all the most common variants of that
//some games have specific PS4/PS5 editions but if its one for both, it should map to
//the same game object as the xbox or PC equivalent. 


const psJSONToGamesList = (list) =>{
  return list.flatMap(obj => obj.games)
}

function capsFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const updatePSPlus = async () => {
    

let plus =  psJSONToGamesList(JSON.parse(fs.readFileSync(`json/PSPlus.json`)))
let plusClassic =  psJSONToGamesList(JSON.parse(fs.readFileSync(`json/PSClassics.json`)))
let psUbiClassic = psJSONToGamesList(JSON.parse(fs.readFileSync(`json/PSUbiClassics.json`)))
let games = JSON.parse(fs.readFileSync(`data/games.json`))


 
 let s = ["PS+ Premium","PS+ Extra","Ubi+ Classics"];

 games = await updatePSGames(games,plus,[s[0],s[1]])
 games = await updatePSGames(games,psUbiClassic,s);
 games = await updatePSGames(games,plusClassic,[s[0]]);

 console.log(`Saving update - ${games.length} games stored`)

 let problemc=0;

console.log(problemc)

 games.sort((a,b)=>{
    return (a.title < b.title)
 })

 
 
 fs.writeFileSync(`data/games.json`,JSON.stringify(games))

}

const updateFromArr = (arr, targ) => {
  if (targ !== null) {
    arr.forEach((elem) => {
      if (!targ.includes(elem)) {
        targ.push(elem);
      }
    })
    return targ;
  }
  return arr //if it's null, no need to add, this is the entire array.
}

const updatePSGames = async (games,list,services)=>{
let updatedGames = games;
let newCount = 0;

for(let gameObj of list){

    gameObj.name = gameObj.name.replace(regex, '').trim()
    gameObj.genre = gameObj.genre.map( g => {
      g=capsFirst(g);
      if(g==="Role_playing_games"){
        g="Role playing"
      }
      return g;
    })

    let found = updatedGames.findIndex((elem)=>elem.title===gameObj.name)
    if(found>-1){ //its already in the db. what might we want to grab?
      try{
      updatedGames[found].subscriptions=updateFromArr(services,updatedGames[found].subscriptions)
      updatedGames[found].platforms=updateFromArr(gameObj.device,updatedGames[found].platforms);
      updatedGames[found].genre=updateFromArr(gameObj.genre,updatedGames[found].genre);
      }catch(er){console.log(er);console.log(gameObj.name)}
     
      updatedGames[found].ps_id=gameObj.productId
    }
    else{
        try {
            let game = {
                title: gameObj.name,
                description:"",
                image: "",
                developers: "",
                publishers: "",
                release_date: gameObj.releaseDate,
                genre: gameObj.genre,
                ps_id: gameObj.productId,
                platforms: gameObj.device,
                subscriptions:services
            }
    
            newCount++;
            updatedGames.push(game);

        } catch (er) { console.log(er);
            console.log(gameObj.id)
            }
    }
 }
 console.log(`\nFinished updating ${services[services.length-1]}. Current length: ${updatedGames.length} (+${newCount})\n`)
return updatedGames;
}


const checkDupes = async ()=>{
  let plus =  JSON.parse(fs.readFileSync(`json/PSPlus.json`))
let plusClassic =  JSON.parse(fs.readFileSync(`json/PSClassics.json`))
let psUbiClassic = JSON.parse(fs.readFileSync(`json/PSUbiClassics.json`))

let plusT = []
let plusC = []
let ubi = []

plus.forEach( obj =>{
  obj.games.forEach( (g) =>{
    plusT.push(g.name)
  }
)})
plusClassic.forEach( obj =>{
  obj.games.forEach( (g) =>{
    plusC.push(g.name)
  }
)})
psUbiClassic.forEach( obj =>{
  obj.games.forEach( (g) =>{
    ubi.push(g.name)
  }
)})

plusT.forEach( t=>{
  plusC.forEach( c=>{
    if(t==c){console.log(`DUPE! t${t} - c${c}`)}
  })
})

plusT.forEach( t=>{
  ubi.forEach( c=>{
    if(t==c){console.log(`DUPE! t ${t} - u ${c}`)}
  })
})
ubi.forEach( t=>{
  plusC.forEach( c=>{
    if(t==c){console.log(`DUPE! u${t} - c${c}`)}
  })
})

}



updatePSPlus();

export {updatePSPlus};