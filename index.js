const micro = require('micro');
const fs = require('fs');
const path = require('path');
const {buffer, text, json} = require('micro')
const document = path.join(__dirname, 'index.html');
const html = fs.readFileSync(document);

var recursive_function = function(array){
  if(array.children > 0){
   
    recursive_function(array.children.slice(1))
  }else{
    console.log("\n\n" + array.name + ":\t\t" +array.children.length);
    array.children.forEach(function (v) {
      if(v.children>0){
        console.log("\t-"+v.name+"["+v.children.length+"]")
      }else{
        console.log("\t-"+v.name)
      }
    });
  }
  
}

const server = micro(async (req, res) => {
  const buf = await buffer(req)
  console.log(buf)
  // <Buffer ?>
  try {
    //const txt = await text(req)
    //console.log(`txt: ${txt}`);    
    const js = await json(req)
    const children = js._source.children;
    children.forEach(function (value) {
      recursive_function(value)
    }); 
    console.log("\n#done");
  } catch (err) {
    //console.log(`error: ${err}`);
  }
  res.end(html);
  console.log('served:');
});

const io = require('socket.io')(server);

// socket-io handlers are in websocket-server.js
require('./websocket-server.js')(io);

server.listen(4000, () => console.log('Listening on localhost:4000'));
