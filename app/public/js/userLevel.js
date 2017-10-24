function returnUserBelt(number){
    if (number < 50){ 
        return { beltName: 'White Belt', beltColor: 'white'};
    }
    if (number >= 50 && number < 200){ 
        return { beltName: 'Yellow Belt', beltColor: 'yellow' };
    }
    if (number >= 200 && number < 400){
        return { beltName: 'Orange Belt', beltColor: 'orange'};
    }
    if (number >= 400 && number < 600){ 
        return { beltName: 'Green Belt', beltColor: 'green'};
    }
    if (number >= 600 && number < 800){ 
        return { beltName: 'Blue Belt', beltColor: 'blue'};
    }
    if (number >= 800 && number < 900){
        return { beltName: 'Brown Belt', beltColor: 'brown'};
    }
    if (number >= 900 && number < 1000){ 
        return { beltName: 'Black Belt', beltColor: 'black'};
    }
    if (number >= 1000){ 
        return { beltName: 'FULL NINJA!', beltColor: 'black'};
    }
};
 
function assessUserRank(number){
    const presentBelt = returnUserBelt(number);
    console.log( presentBelt );
    return {
        currentRank: `You are currently a ${presentBelt.beltName}.`,
        colorDiv: presentBelt.beltColor
    }
};

