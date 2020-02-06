//Dependencies
//===============================================
const express = require("express");
const path = require('path'); 
const fs = require('fs');
//Port and Server
const app = express();
const PORT = process.env.PORT || 7000; 

// Sets up the Express app to handle data parsing
//MiddleWare=======================================
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//API ROUTES
//Read NOTES
//===========================================
app.get("/api/notes", function(req, res) {
  fs.readFile('./db/db.json','utf-8', function(err, data){
    const json = JSON.parse(data)
    res.send(json);
  } )
});

//POST NOTES
//==============================================
app.post("/api/notes", function(req, res) {
  const newNote = req.body; 
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    //ADDING ID TO EVERY NOTE
    const parsedArray = JSON.parse(data); 
    parsedArray.push(newNote);
    let idArray = []; 
    for(var i = 0; i < parsedArray.length; i++){
      let note = parsedArray[i];
      note.id = i; 
      idArray.push(note); 
    }
    //console.log(idArray);
    const stringArray = JSON.stringify(idArray);
    //WRITING THE UPDATED NOTE TO DATABASE 
    fs.writeFile('./db/db.json', stringArray,'utf-8', (err) => {
      if(err) throw err
      //console.log('writing')
    })
    //SENDING RESPONSE
    res.json(idArray);
  })
});

//DELETE A NOTE
 //=================================================
app.delete("/api/notes/:id", function(req, res) {
  //GET AN ID FROM THE NOTE TO BE DELETED
  //IF ID MATCHES NOTE IN DATABASE DELETE THE NOTE
  const idToDelete = parseInt(req.params.id);
  let dbJSON = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'))
  const filteredArr = dbJSON.filter(note =>note.id !== idToDelete)
  const stringDB = JSON.stringify(filteredArr);
  fs.writeFile('./db/db.json', stringDB, 'utf-8', err => {
    if (err) throw err; 
  });
  res.json(filteredArr)
})
  

//HTML ROUTES
//===================================================
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html" ));
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

//Listener
//=============================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


