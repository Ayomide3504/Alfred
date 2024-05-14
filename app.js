const express= require('express')
const app=express()
const db= require('./db')
const ejs= require('ejs')
const bodyparser=require('body-parser')
const session=require('express-session');
const pgsession=require("connect-pg-simple")(session);
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs')
// Example query to test the connection

app.use(session({
    store: new pgsession({
        pool: db.pool, // Connection pool
        tableName: 'session' // Use another table name if you have a specific one
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));



app.get('/', async (req,res)=>{
   res.render('home');
  

});

app.post('/',async (req,res)=>{
    console.log(req.body.username);
    //Create Database and Table
    const { username, email, password } = req.body;
    try {
        const sqlQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        const values = [username, email, password];
        const insert = await db.query(sqlQuery, values);
        console.log("User Credentials inserted Successfully");
       // res.send("User added.");
       res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in inserting user data.");
    }
    
});
app.get('/login',async(req,res)=>{
res.render('login');
});

app.post('/login',async (req,res)=>{
//Test details
const {username, password}=req.body;
try{
    const verify="SELECT FROM users WHERE name=$1 AND password=$2";
    const vd= await db.query(verify,[username,password]);
    if(vd.rows.length==1){
        req.session.userId=vd.rows[0].id;
        res.redirect('/home');
    }else{
        res.status(401).send("Invalid credentials");
    }
}catch(err){
    console.error(err);
    res.status(500).send("Error in Fetching user data.");
   
}

});
app.get('/home', async (req,res)=>{
if(req.session.userId){
    res.send('Welcome to Home page '+req.session.userId);
}else{
    res.redirect('/login');
    
}
});

app.listen(3000,function(){
    console.log('Server running on port 3000');
});