const mysql=require('mysql');
const dotenv=require('dotenv').config();
const {db_config}=require('./DB_config/db');
const sql=mysql.createConnection({host:'localhost',user:'root',password:process.env.password,multipleStatements: true});
sql.connect((err)=>{if(err!=null){console.log(err);}});
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