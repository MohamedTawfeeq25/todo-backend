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
//Login and Register 
app.post('/to-do/auth/register',(req,res)=>{
    // checks whether the user exists 
    sql.query("SELECT u_id FROM users WHERE email=?",[req.body.email],(err2,ret)=>{
        if(err2==null){
            if(ret.length==0){
                //password encryption
                bcrypt.hash(req.body.password,10,(err1,hash)=>{
                    if(err1==null){
                        //adding user to table
                       sql.query("INSERT INTO users(username,email,password,phone) VALUES(?,?,?,?);",[req.body.username,req.body.email,hash,req.body.phone],(err,out)=>{
                           if(err2==null){
                               if(out.affectedRows==1){
                                   //user added
                                   sql.query("SELECT u_id FROM users WHERE email=?",[req.body.email],(err4,out4)=>{
                                       if(err4==null){
                                        res.send({u_id:out4[0].u_id,message:"User added"});
                                       }
                                       else{
                                           console.log(err4);
                                       }
                                   })
                                  
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
app.post('/to-do/auth/login',(req,res)=>{
    //if email is used to login
       if(req.body.email!=undefined){
           //check user exits
        sql.query("SELECT u_id,password FROM users WHERE email=?;",[req.body.email],(err1,out1)=>{
            if(err1==null){
                //user not exits
                if(out1.length==0){
                    console.log("user not exits");
                    res.send({message:"user not exits"});
                }
                //user exits
                else{
                    //compare the password
                    bcrypt.compare(req.body.password,out1[0].password,(err,ret)=>{
                        if(err==null){
                            // verified
                            if(ret===true){
                                      res.send({u_id:out1[0].u_id,message:"verfied"});
                            }
                            //password error
                            else{
                                res.send({message:"incorrect password"});
                            }
                        }
                        //error handler for passord decryption
                        else{
                            console.log(err);
                        }
                    })
                }
            }
            //error handler for login query
            else{
                console.log(err1);
            }
        })
    }
    // if phone number is used for login
    else if(req.body.phone!=undefined){
        sql.query("SELECT password FROM users WHERE phone=?;",[req.body.phone],(err1,out1)=>{
            if(err1==null){
                if(out1.length==0){
                    console.log("user not exits");
                    res.send({message:"user not exits"});
                }
                else{
                    bcrypt.compare(req.body.password,out1[0].password,(err,ret)=>{
                        if(err==null){
                            if(ret===true){
                                res.send({u_id:out1[0].u_id,message:"verfied"});
                            }
                            else{
                                res.send({message:"incorrect password"});
                            }
                        }
                        else{
                            console.log(err);
                        }
                    })
                }
            }
            else{
                console.log(err1);
            }
        })
    }
});
app.put('/to-do/auth/changePassword',(req,res)=>{
    if(req.body.current_password!=undefined && req.body.new_password!=undefined && req.body.u_id){
        sql.query("SELECT password FROM users WHERE u_id=?",[req.body.u_id],(err1,out1)=>{
                if(err1==null){
                    bcrypt.compare(req.body.current_password,out1[0].password,(err,resu)=>{
                        if(err==null){
                            if(resu==true){
                                bcrypt.hash(req.body.new_password,10,(err2,out2)=>{
                                    if(err2==null){
                                        sql.query("UPDATE  users SET password=? WHERE u_id=?;",[out2,req.body.u_id],(err3,out3)=>{
                                            if(err3==null){
                                                if(out3.affectedRows==1){
                                                    res.send({message:"password updated"});
                                                }
                                            }
                                            else{
                                                console.log(err3);
                                            }
                                        })
                                    }
                                    else{
                                        console.log(err2);
                                    }
                                })
                            }
                            else if(res==false){
                                res.send({message:"incorrect current password"});
                            }
                        }
                    });
                }   
                else{
                    console.log(err1);
                }
        })
    }
    else{
        res.send({message:"data error"});
    }
})
//profile management

app.listen(2000,()=>{console.log("server started")});