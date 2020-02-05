//Dependencies
//===============================================
const express = require("express");
const path = require('path'); 
const fs = require('fs');
//Port and Server
const app = express();
const PORT = 7000 ; 

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

    const parsedArray = JSON.parse(data); 
    parsedArray.push(newNote);
   // console.log('Before ID ARRAy ' + parsedArray); 
    idArray = parsedArray.map((note, index) => {
      note.id = index; 
    })
   // console.log('id array is ' + idArray); 
    //console.log('after ID array ' + parsedArray); 

    const stringArray = JSON.stringify(parsedArray);

    //console.log(stringArray); 
    
    fs.writeFile('./db/db.json', stringArray,'utf-8', (err) => {
      if(err) throw err
      console.log('writing')
    })


    res.json(parsedArray);
  })
});

//DELETE A NOTE
 //=================================================
app.delete("/api/notes/:id", function(req, res) {
  //GET AN ID FROM THE NOTE IN THE DB
  //IF ID MATCHES DELETE
  const idToDelete = parseInt(req.params.id);
  let dbJSON = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'))
  //console.log(dbJSON); 
  const filteredArr = dbJSON.filter(note =>note.id !== idToDelete)
  JSON.stringify(filteredArr);
  fs.writeFile('./db/db.json', filteredArr, 'utf-8', err => {
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



//idArray = parsedArray.map((note,index) => {
  //   note['id'] = index
  //   return note;
  // })