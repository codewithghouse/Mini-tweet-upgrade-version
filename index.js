const express= require("express");
const app= express();
const port = process.env.PORT || 3000;
const path = require("path");
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
// requiring the mysql 2 package
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
//seeting the ejs to puublic and view folder
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
// post rquest ke liye hai yeh 
app.use(express.urlencoded({extended:true}));
// requie karre mysql2 ku
const mysql = require('mysql2');
// mysql 2 ku backend ke sath connect karre 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'mini_tweet',
  password:'ghouse123'
});

// generating fake data from faker
let  getUser= ()=> {
  return [
     faker.string.uuid(),
     faker.internet.username(), // before version 9.1.0, use userName()
     faker.internet.email(),
     faker.internet.password(),
     faker.hacker.phrase(),
 
  ];
}
// let data=[];
// for( let i=0;i<100;i++){
//   data.push(getUser());
// }
// // / testing the data generated or not
// // console.log(data)
// // data inserting into the database

// let q= `insert into user(id,username,email,password,content) values ?`;
// connection.query(q,[data],(e,result)=>{
//   if(e) throw e;
//   console.log(result)
// })
// 

// data insert hote hee comment kardiye msg taake baar baar insert na ho data

app.get("/",(req,res)=>{

let q=`select count(*) as total_users from user `;
try{
  connection.query(q,(e,result)=>{
    if(e) throw e;
    // console.log(result);
    let count= result[0].total_users;
  res.render("home.ejs",{count});
    // res.send(userdata);
  })
}catch(e){
  console.log(e.message);
  res.send("some error in fetching data from user");
}
// res.render("userslist.ejs")
  // res.send(" hello i am root ");
})

// see all users route
app.get("/users",(req,res)=>{

  let q=`select * from user`;
 try{
  connection.query( q,(e,result)=>{
    if(e)throw e;
    let userdata= result;
    // console.log("❤️data send alhamdulillah");
    // console.log(result);
    res.render("showallusers.ejs",{userdata})
  })

 }catch(e){
  console.log(e.message);
  // render errro ejs
  res.send("some error in db");
 }
})

// edit route 
app.get("/users/:id/edit",(req,res)=>{
  let {id}= req.params;

  let q= `select * from user where id = ?`;
  try {
    connection.query(q,[id],(e,result)=>{
      let userdata= result[0];
      res.render("edit.ejs",{userdata});
      // console.log(userdata);
      // res.send(userdata);
    })
    
  } catch (e) {
    console.log(e.message);
    res.send("some error in db")
    
  }
  // console.log("the user is edited");
  // res.send("the usr is edited");
})

// msking  the patch request for the edit user
app.patch("/users/:id",(req,res)=>{
  let {id}= req.params;
  let {password:formpassword,username:newusername,content:newcontent}=req.body;
  let q=`select * from user where id= ?`
try {
  connection.query(q,[id],(e,result)=>{
    if(e) throw e;
    let userdata=result[0]
    if(formpassword!=userdata.password){
      res.render("wrongpassword.ejs",{userdata})
    }
    else{
      let q=`update user set username=?, content=?  where id = ?`;
      try {
        connection.query(q,[newusername,newcontent,id],(e,result)=>{
          if(e) throw e;
          let userdata= result[0];
          // console.log(userdata);
          res.render("successedit.ejs",{userdata});
        })
        
      } catch (e) {
        console.log(e.message);
        res.send("some error in db");
        
      }
//       res.send("the user is edited");
// // console.log(userdata);
// // res.send(userdata);
  }});
} catch (e) {
  console.log(e.message);
  res.send("some error in db");
  
}
  // console.log("the patch request is working");
  // res.send("the patch is working");
})

// creating the new user
app.get("/users/new",(req,res)=>{
   console.log('the user is created');
  res.render("adduser.ejs");
})

// adding the new user into the database
app.post("/users",(req,res)=>{
  let id= uuidv4();
  let {username,email,password,content}=req.body;
  // console.log(username,email,password,content)
  try{
    // add karne se pehle check karre ki kya username exist karta ya nahi;
   let checkquery=`select * from user where username=? or email=?`;
   connection.query(checkquery,[username,email],(e,result)=>{
    if(e)throw e;
    if( result.length>0){
      // return res.send("the user already exist in the app plz try again with different username and email");
       return res.render("userexist.ejs");
    }
    //agar username and email  nhi hai already tab insert hoga 
     q= `insert into user(id,username,email,password,content) values (?,?,?,?,?)`;
     connection.query(q,[id,username,email,password,content],(e,result)=>{
      if(e)throw e;
    console.log(result);
    // res.send("the new user added successfully");
    res.render("successeadd.ejs");

  })
   });
   
  }catch(e){
    console.log(e.message);
    res.send("some error in Adding  new User");
  }
})
  // console.log("the user is added into the db");
  // res.send("the user is addedd into the db");


  // deleting the user form rendering
  app.get("/users/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id = ?`;
    try{
      connection.query(q,[id],(e,result)=>{
        let userdata= result[0];
        console.log(userdata);
           res.render("delete.ejs",{userdata});
        
      })

    }catch(e){
      console.log("some error in db");
      res.send("some error in db");
    }

  })
  // confirmation deleting
 app.delete("/users/:id",(req,res)=>{
  let {id}= req.params;
  let{password:userpassword}=req.body;
  let q=`select * from user where id = '${id}'`;
  connection.query(q,(e,result)=>{
    let userdata= result[0];
    if(e) throw e;
//     agar user ki info nhi hai tab ye kaam me ata hai
    if (result.length === 0) {
  return res.send("User not found");
}

    if(userpassword!=userdata.password){
      return res.render("wrongpassworddelete.ejs");
      
    }else{
      let q2=`delete from user where id = '${id}'`;
      connection.query(q2,(e,result)=>{

        if(e)throw e;
        let userdata= result[0];
      console.log("the user is deleted");
        res.render("successdelete.ejs",{userdata});
        // res.redirect("/users");


      })
    }
  })
})
// listening to the port
app.listen(port,()=>{
  console.log(`the app is listening in the port ${port}`);
})

