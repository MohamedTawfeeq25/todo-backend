const task=(sql)=>{
    var query="USE todo_list; CREATE TABLE Tasks (t_id INT PRIMARY KEY AUTO_INCREMENT,u_id INT NOT NULL,task_name TEXT NOT NULL,description TEXT,due_date DATE NOT NULL,completed BOOLEAN DEFAULT FALSE,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,priority enum('high','medium','low') DEFAULT 'low' NOT NULL);";
    sql.query(query,(err,out)=>{
        if(err==null){
            if(out[1].serverStatus==2){
                console.log("task table created");

            }
            else{
                console.log(out);
            }
        }
        else{
            console.log(err);
        }
    })
};
const Table=(sql)=>{
    var query="USE todo_list;CREATE TABLE users ( u_id INT PRIMARY KEY AUTO_INCREMENT,username VARCHAR(40) NOT NULL,email VARCHAR(50) NOT NULL UNIQUE,password TEXT NOT NULL,Phone INT(10) NOT NULL UNIQUE,Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP)AUTO_INCREMENT=1;";
    sql.query(query,(err,out)=>{
        if(err==null){
           
            if(out[1].serverStatus==2){
                console.log("user table created");
                task(sql);
            }
            else{
                console.log(out);
            }
        }
        else{
            console.log(err);
        }
    })
};

module.exports={Table};