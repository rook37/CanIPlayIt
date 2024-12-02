import fs from 'fs';

const doStuff = async () => {
    let games = JSON.parse(fs.readFileSync(`data/games.json`));

    let over4 = 0;
    let longDesc = ''
    for(const game of games){
        if(game.description.length>longDesc.length){
            longDesc = game.description;
        }
        if(game.description.length>8000){
            over4++;
        }
    }
    console.log(longDesc)
    console.log(longDesc.length)
    console.log(over4);
    // const titleMap = new Map();

    // // Identify games with the same title
    // for (const game of games) {
    //     if (titleMap.has(game.title)) {
    //         titleMap.get(game.title).push(game);
    //     } else {
    //         titleMap.set(game.title, [game]);
    //     }
    // }

    // // Append (Windows) to the ones with only "PC" in their platforms property
    // for (const [title, gamesWithTitle] of titleMap) {
    //     if (gamesWithTitle.length > 1) {
    //         for (const game of gamesWithTitle) {
    //             if (game.platforms.length === 1 && game.platforms.includes('PC')) {
    //                 game.title += ' (Windows)';
    //             }
    //         }
    //     }
    // }

    // // Write the updated games back to the file
    // fs.writeFileSync(`data/games.json`, JSON.stringify(games, null, 2));
};

doStuff();
