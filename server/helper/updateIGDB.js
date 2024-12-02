import axios from 'axios'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' });

let failedGames = [];
let toValidate = [];
/*

So, we need import our games object, run through it and identify missing properties.
First, query to get game id from IGDB. 
    if we can't get this we're toast
    try full string. if result is empty array, try splitting by last white space. repeat until array. 
    this /should/ grab us everything we need. 

Now we have id and the rest of game obj. If not, return an error and I can dig. Some might need manual, but with 1300 games and counting, hopefully not many. 
Assign cover.
Check if we're missing "description". If so, assign response.summary. Honestly might want to overwrite anyways, PS doesn't have and xbox is wooordy
Now, if we're missing dev or publisher, call a function to populate 
    we have involved companies from obj. 
    query for each one
    check if game is in published by or developed by
    query for studio name
    assign both dev and publisher to correct variables.
Now, send to genre function
    genre function will forEach genre array, getting actual names for each
    will have to review, but hopefully just compare to list and add. might need to standardize some with a map.

    I think that covers everything missing. 

*/

const header = {
    headers: {
         'Client-ID': `${process.env.IGDB_CLIENT_ID}`,
          'Authorization': `Bearer ${process.env.IGDB_AUTH}`,
          'Accept':'application/json', 
          'Content-Type': 'text/plain'
        } }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const updateMissing = async () => {

    let games = JSON.parse(fs.readFileSync(`data/games.json`))
//console.log(process.env.IGDB_GAMES)
//let igGame = getGame(games[0].title)
//console.log(`Client-ID:`+process.env.IGDB_CLIENT_ID+`,    'Authorization': Bearer ${process.env.IGDB_AUTH}` )
    for (const gameObj of games) {
        if (
            !gameObj.description ||
            !gameObj.image ||
            !gameObj.developers ||
            !gameObj.publishers ||
            !gameObj.genre
        ) {
            await delay(500)
            let igGame = await getGame(gameObj.title,"where name=",' ')
            if(!gameObj.description){gameObj.description = igGame.summary}
            if(!gameObj.image){gameObj.image = igGame.cover}
            if(!gameObj.developers){gameObj.developers = igGame.developers}
            if(!gameObj.publishers){gameObj.publishers = igGame.publishers}
            if(!gameObj.genre){gameObj.genre=igGame.genres}
            else if(igGame.genres){
                //console.log(gameObj.genre)
                //console.log(igGame)
            for(const genre of igGame.genres){
                if(!gameObj.genre.includes(genre)){
                    gameObj.genre.push(genre);
                }
            }}
           

            if(!gameObj.description || !gameObj.image||!gameObj.developers || !gameObj.publishers || !gameObj.genres){
                failedGames.push(gameObj);
            }
            else if(!gameObj.title.length>igGame.name.length){
                toValidate.push(gameObj)
            }
        }

    }
    fs.writeFileSync(`data/games.json`,JSON.stringify(games))
}

//Receives a company id, 
//Returns the company's plaintext name 
const getName = async (company)=>{
    try{
        let body = `fields name;where id=${company};`
        await delay(250)
        
        let response = await axios.post(process.env.IGDB_COMPANIES,body, header )
        response = response.data[0];
        return response.name;
    }catch(er){
        console.log(`Error retrieving company name: ${er}`)
    }
}

//Receives a cover art ID
//Returns the formatted IGDB url with the image.
const getCoverArt = async (coverId)=>{
    try{
        let body = `fields image_id;where id=${coverId};`
        await delay(250)
        let response = await axios.post(process.env.IGDB_COVERS,body, header )
        response = response.data[0];//API returns an array, 1 object since it's by id. 
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${response.image_id}.jpg`;
    } catch(er){
        console.log(`Error retrieving cover from IGDB: ${er}`)
    }
}

//Receives an array of involved company IDs. 
//Returns a nested array of company names [[developers],[publishers]]
const getCompanies = async(involved) =>{
   
    let devs = [];
    let pub = [];
    for(const company of involved){

        try{
            let body = `fields company,developer,publisher,supporting;where id=${company};`
            await delay(250)
            let response = await axios.post(process.env.IGDB_INVOLVED,body, header )
            response = response.data[0]
            if(response.supporting == false){
                let companyName = await getName(response.company)
                if(response.developer===true){
                    devs.push(companyName);
                }
                else if(response.publisher===true){
                    pub.push(companyName);
                }
            }
        
        } catch(er){
            console.log(`Error retrieving company involvement from IGDB: ${er}`)
        }
    }
    return [devs,pub]
}

//Receives an array of genre IDs.
//Returns an array of genre names
const getGenres = async(genres)=>{
    let genreNames = [];

    for(const genre of genres){
        try{
            let body = `fields name;where id=${genre};`
            await delay(250)
            let response = await axios.post(process.env.IGDB_GENRES,body, header )
            response = response.data[0];
            genreNames.push(response.name);
        } catch(er){
            console.log(`Error retrieving genre name from IGDB: ${er}`)
        }
    }
    return genreNames;
}

const getGame = async (name,finder,char) =>{
   let nameSplit = name.split(`${char}`);
   let game = []
  while(nameSplit.length>0 && game.length==0){
    nameSplit = nameSplit.join(`${char}`)
    try{
        let body = `fields *;${finder}"${nameSplit}";`
        await delay(250)
        let response = await axios.post(process.env.IGDB_GAMES,body, header )
        game = response.data; 
        if(game.length>0){
            game = game[0]
            console.log(`Local: ${name} - retrieved: ${game.name} with ${nameSplit}`)
            
            //We have the game object, we need the cover art URL. 
            game.cover = await getCoverArt(game.cover);
            
            //now lets get the devs and publisher
            //console.log(game.involved_companies)
            let involved = await getCompanies(game.involved_companies);
            game.developers = involved[0];
            game.publishers = involved[1]      
            game.genres = await getGenres(game.genres);   
            break;
        }
    }     
    catch(er){
        console.log(`Error retrieving game from IGDB: ${er} - ${game} - ${nameSplit}`)
        game=[];
    }
    
    nameSplit = nameSplit.split(`${char}`)
    nameSplit.pop();
    }
    if(nameSplit.length<1){ 
    // No successful results! Try search and slug, 
    // then add to failed output to be manually validated if necessary.
        
        if(finder==="search "){
            console.log(`${name} - failed by name and search, trying slug`)
            console.log(name)
            let slug=name.toLowerCase().trim().split(' ').join('-')    
            console.log(name)    
            game = await getGame(slug,"where slug=",'-')           
            //NOTE: this isnt currently trimming since its no longer space separated
            // eg "Atlas Fallen: Reign of Sand (Windows)" -> atlas-fallen-reign-of-sand-windows
        }
        else if(finder==="where slug="){
            console.log(`${name} - failed final. Manual input necessary`)
        }
        else{
            console.log(`${name} - failed by name. Trying search.`)
            name = name.replace(/[':™©®]/g, '');
            game = await getGame(name,"search ")          
        }
    }   
    else{
    console.log(`${name} processed.`)
    //console.log(game)
   }
    return game;
}




//getCoverArt(383881);
await updateMissing().then( ()=>{
    if(failedGames.length===0 && toValidate.length===0){
        console.log("\nAll games retrieved successfully!\n")
    }
    else{
        if(failedGames.length>0){console.log("Failed games:\n"+failedGames.map(g=>g.title)) 
            fs.writeFileSync(`data/failedGames.json`,JSON.stringify(failedGames))
        }
        if(toValidate.length>0){console.log("\nGames in need of validation:\n"+toValidate.map(g=>g.title))
            fs.writeFileSync(`data/failedGames.json`,JSON.stringify(toValidate))
        }       
    }
});


//getGame("A Plague Tale: Requiem - Windows")