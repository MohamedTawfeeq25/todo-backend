const express=require('express');
const app=new express();
const body=require('body-parser');
const mysql=require('mysql');
const dotenv=require('dotenv').config();
const {db_config}=require('./DB_config/db');
app.use(body.json());

const sql=mysql.createConnection({host:'localhost',user:'root',password:process.env.password,multipleStatements: true});
sql.connect((err)=>{
    if(err==null){
        console.log("Database connected")
    }
    else{
        console.log(err);
    }
});

//database initilization and configuration
sql.query("use todo_list;",(err,res)=>{
   if(err==null){
        if(res.serverStatus==2){
            console.log("Database Initialized");
        }
   }
   else{
      if(err.sqlMessage=="Unknown database 'todo_list'"){
          db_config(sql);
      }
      else{
          console.log(err);
      }
   }
})
app.get('/test',(req,res)=>{
    
    console.log(req.url);
    res.send({message:"working"});
})
app.listen(2000,()=>{console.log("server started")});