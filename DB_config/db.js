const {Table} =require('./user');
const db_config=(sql)=>{
    //database creation
    sql.query("CREATE DATABASE todo_list",(err,out)=>{
        if(err==null){
            if(out.affectedRows==1){
                console.log("Database created");
                Table(sql);
            }
        }
        else{
            if(err.sqlMessage=="Can't create database 'todo_list'; database exists"){
                console.log("similiar database name exits 'todo_list'");
            }
        }
    })
}
module.exports={db_config};