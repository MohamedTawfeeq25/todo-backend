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
/*JSON payload for creating task
{
    "username":"user",
    "email":"email25@xyz.com",
    "password":"password123",
    "phone":987654321

}
*/
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
/*JSON payload for login
{
    "email":"example24@email.com",
    "password":"password123"
}
(or)
{
    "phone":987654321,
    "password":"password123"
}
*/
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
        //fetch the password from db with phone number
        sql.query("SELECT password FROM users WHERE phone=?;",[req.body.phone],(err1,out1)=>{
            if(err1==null){
                //if phone number does not exits
                if(out1.length==0){
                    console.log("user not exits");
                    res.send({message:"user not exits"});
                }
                else{
                    //decrypting and compare the password
                    bcrypt.compare(req.body.password,out1[0].password,(err,ret)=>{
                        if(err==null){
                            //verified
                            if(ret===true){
                                res.send({u_id:out1[0].u_id,message:"verfied"});
                            }
                            //incorrect password
                            else{
                                res.send({message:"incorrect password"});
                            }
                        }
                        //error handler for decryption
                        else{
                            console.log(err);
                        }
                    })
                }
            }
            //error handler for fetch password query
            else{
                console.log(err1);
            }
        })
    }
});
//API for updating the password
/*JSON payload for creating task
{
    "u_id":1,
    "current_password":"current password",
    "new_password":"new password"

}
*/
app.put('/to-do/auth/changePassword',(req,res)=>{
    //check whether the data is valid or not
    if(req.body.current_password!=undefined && req.body.new_password!=undefined && req.body.u_id){
       //fetch the password from database with u_id
        sql.query("SELECT password FROM users WHERE u_id=?",[req.body.u_id],(err1,out1)=>{
                if(err1==null){
                    //compare the encrypted password with current password
                    bcrypt.compare(req.body.current_password,out1[0].password,(err,resu)=>{
                        if(err==null){
                            //if password correct
                            if(resu==true){
                                //encrypt the new password
                                bcrypt.hash(req.body.new_password,10,(err2,out2)=>{
                                    if(err2==null){
                                        //update the exiting password with new password in db
                                        sql.query("UPDATE  users SET password=? WHERE u_id=?;",[out2,req.body.u_id],(err3,out3)=>{
                                            if(err3==null){
                                                //send response to user
                                                if(out3.affectedRows==1){
                                                    res.send({message:"password updated"});
                                                }
                                            }
                                            //error handler for update query
                                            else{
                                                console.log(err3);
                                            }
                                        })
                                    }
                                    //error handler for encryption
                                    else{
                                        console.log(err2);
                                    }
                                })
                            }
                            //current password is wrong
                            else if(resu==false){
                                res.send({message:"incorrect current password"});
                            }
                        }
                        //error handler for decrypting current password
                        else{
                            console.log(err);
                        }
                    });
                }
                //error handler for fetch password query from db with u_id   
                else{
                    console.log(err1);
                }
        })
    }
    //if data missing or data error request message
    else{
        res.send({message:"data error"});
    }
});
//retrieve all task for specific user
app.get('/to-do/task/retrieve/')
//creating a task
/*JSON payload for creating task
{
    "u_id":1,
    "task_name":"Complete project title",
    "description":"draft and finalize the title od the project",
    "due_date":"2024-03-10",
    "priority":"medium",

}
*/

app.post('/to-do/task/add',(req,res)=>{
    sql.query("SELECT u_id FROM users WHERE u_id=?",[req.body.u_id],(err1,out1)=>{
        if(err1==null){
            if(out1.length==0){
                res.send({message:"user id error"});
            }
            else{
                sql.query("INSERT INTO tasks (u_id,task_name,description,due_date,priority) VALUES(?,?,?,?,?)",[req.body.u_id,req.body.task_name,req.body.description,req.body.due_date,req.body.priority],(err2,out2)=>{
                    if(err2==null){
                        if(out2.affectedRows==1){
                            res.send({message:"task added"});
                        }
                    }
                    else{
                        console.log(err2);
                    }
                })
            }
        }
        else{
            console.log(err1);
        }
    })
})
//updating a task
/*JSON payload for updating task
{
    "t_id":1,
    "task_name":"Complete project title",
    "description":"draft and finalize the title of the project",
    "due_date":"2024-03-10",
    "priority":"medium",

}
*/
app.put('/to-do/task/update',(req,res)=>{
    sql.query("UPDATE tasks SET task_name=?,description=?,due_date=?,priority=? WHERE t_id=?",[req.body.task_name,req.body.description,req.body.due_date,req.body.priority,req.body.t_id],(err1,out1)=>{
        if(err1==null){
            if(out1.affectedRows==1){
                res.send({message:"task updated"});
            }
            else{
                console.log(out1);
                res.send({message:"t_id error"});
            }
        }
        else{
            console.log(err1);
        }
    })
})
//deleting the task
/*JSON payload for deleting task
{
 "t_id":1
}
*/
app.delete('/to-do/task/delete',(req,res)=>{
    if(req.body.t_id!=undefined){
        sql.query("DELETE FROM tasks WHERE t_id=?",[req.body.t_id],(err1,out1)=>{
            if(err1==null){
                if(out1.affectedRows==1){
                    res.send({message:"task deleted"});
                }
                else{
                   res.send({message:"invalid task id"});
                }
            }
            else{
                console.log(err1);
            }
        })
    }
})
app.listen(2000,()=>{console.log("server started")});
