

let session = [];

const problem = {
    operation: String,
    firstTerm: Number,
    secondTerm: Number,
    problem: String,
    correctResponse: String, //for ease of DOM manipulation
    userResponse: String,
    wasCorrect: Boolean
}

function generateTerm( min, max ){
  return Math.floor( Math.random() * ( max - min ) + min );
}

function generateSession( operation, num, min, max ){
  for ( let i = 0; i < num; i++ ){
    let item = Object.assign( {}, problem );
    item.operation = operation;
    item.firstTerm = generateTerm( min, max );
    item.secondTerm = generateTerm( min, max );
    item.problem = `${ item.firstTerm } ${ item.operation } ${ item.secondTerm }`;
    item.correctResponse = eval( item.problem );
    session.push( item );
  }
}
