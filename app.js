const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

// new instance of express
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;

    const data = {
        //the members, status,merge_fields ---comes from mailChimp api
        'members':[
          {
            email_address:email,
            status:"subscribed",
            merge_fields:{
              FNAME:firstName,
              LNAME:lastName
            }
          }
        ],
      }
      const jsonData=JSON.stringify(data);
      const url="https://us13.api.mailchimp.com/3.0/lists/9ac5a485c0";
      const options = {
        method:"POST",
        auth:"Tejas:c36e36ec9eed6b897d9ff81f75eb6c9b-us13"

      }
      
     
      const request= https.request(url,options,function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
          }else {
            res.sendFile(__dirname + "/failure.html");
          }
       
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
      })
      request.write(jsonData);
      request.end();

})

app.post("/failure", function (req, res){
    res.redirect("/");
  });

app.listen(process.env.PORT ||3000,function(){
    console.log("server running on port 3000");
});

// apijkey
// c36e36ec9eed6b897d9ff81f75eb6c9b-us13
// mailchipUID
// 9ac5a485c0