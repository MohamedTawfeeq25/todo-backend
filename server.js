const express=require('express');
const app=new express();
const mysql=require('mysql');
const dotenv=require('dotenv').config();
const bcrypt=require('bcrypt');
const body_parser=require('body-parser');
app.use(body_parser.json());
const sql=mysql.createConnection({host:'localhost',user:'root',password:process.env.password,database:"todo_list",multipleStatements: true});
sql.connect((err)=>{
    if(err==null){
        console.log("Database connected")
    }
    else{
        console.log(err);
    }
});

app.get('/test',(req,res)=>{
    
    console.log(req.url);
    res.send({message:"working"});
});
app.post('/to-do/auth/register',(req,res)=>{
    // checks whether the user exists 
    sql.query("SELECT u_id FROM users WHERE email=?",[req.body.email],(err2,ret)=>{
        if(err==null){
            if(ret.length==0){
                //password encryption
                bcrypt.hash(req.body.password,10,(err1,hash)=>{
                    if(err==null){
                        //adding user to table
                       sql.query("INSERT INTO users(username,email,password,phone) VALUES(?,?,?,?);",[req.body.username,req.body.email,hash,req.body.phone],(err,out)=>{
                           if(err==null){
                               if(out.affectedRows==1){
                                   //user added
                                   res.send({message:"User added"});
                               }
                               else{

                                console.log(out);
                               }
                           }
                           else{
                               //error handling for adding user
                               console.log(err);
                           }
                       })
                    }
                    else{
                        //error handling for encryption
                        console.log(err1);
                    }
                })
            }
            else{
                res.send({message:"user exits"});
            }
        }
        else{
            //error handling for checking user exists
            console.log(err2);
        }
    })

    
});
app.listen(2000,()=>{console.log("server started")});