import fs from 'fs'


const createGenreSet = () =>{
    let games = JSON.parse(fs.readFileSync('data/games.json')) 
    let genreSet = new Set();
    let genreMap = new Map([
        [10, 'Racing'],
        [14, 'Sport'],
        [15, 'Strategy'],
        [5, 'Shooter'],
        [31, 'Adventure'],
        [12, 'Role-playing (RPG)'],
        [13, 'Simulator'],
        [16, 'Turn-based strategy (TBS)'],
        [32, 'Indie'],
        [25, `Hack and slash / Beat 'em up`]
      ]);

      const genreNameMap = new Map([ 
        ['Sport', 'Sports'], 
        ['Puzzle & trivia','Puzzle'],
        ['Card & board','Card & Board Game'],
        ['Family & kids','Family'],
        ["Multi-player Online Battle Arena",'MOBA'],
        ["Platform",'Platformer'],
        ["Role playing","Role-playing (RPG)"],
        ["Simulator","Simulation"]
        ]);

      for(const game of games){
        try{//10,14,5,15,31,12,16,13,32
        if(game.genres){
        for(const genre of game.genres){
            if(typeof genre === 'number'){
                genre=genreMap.get(genre)}

            if(!game.genre.includes(genre)){
                game.genre.push(genre);
            }
        }}}catch(er){console.log(er);console.log(game)}
    }

    for (const game of games) {
        for (let i = 0; i < game.genre.length; i++) {
            let genre = game.genre[i]; if (typeof genre === 'number') {
                console.log(game); let tempGen = genreMap.get(genre); game.genre[i] = tempGen; 
                genre = tempGen;
            }
            if(genre===null){continue;}
             genreSet.add(genre);
        }
    }
    for (const game of games) { 
        for (let i = 0; i < game.genre.length; i++) {
          let genre = game.genre[i];
          if (genreNameMap.has(genre)) {
            genre = genreNameMap.get(genre);
            game.genre[i] = genre;
          }
        }
        game.genre = game.genre.filter(genre => genre !==null)
        game.genre = [...new Set(game.genre)];
        delete game.genres
    }
   
    let genArr = [...genreSet];
    genArr.sort((a, b) => a.localeCompare(b));
    fs.writeFileSync('data/games.json',JSON.stringify(games))
    fs.writeFileSync('data/genres.json',JSON.stringify(genArr))


}

createGenreSet();