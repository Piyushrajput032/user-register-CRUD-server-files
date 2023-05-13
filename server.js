import express from "express";
import mysql from "mysql2";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "devil",
});

app.post("/register", upload.single("image"), (req, res) => {

  const sql =
    "INSERT INTO myusers(name,phone,email,password,image)VALUES(?,?,?,?,?)";
  const image = req.file.filename;
  const data = req.body;
  console.log(data)
  console.log(image)
  db.query(
    sql,
    [data.name, data.phone, data.email, data.password, image],
    (err, result, fields) => {
      if (err) {
        return res.json({ Message: "Error on Upload" });
      }
      return res.json({ Status: "Success" });
    }
  );
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM myusers";
  
    db.query(sql,(err,result)=>{
      if(err){
          return res.json({Message:"Error on download"})
      }
      return res.json(result)
  });
  
});
app.get("/details/:id", (req, res) => {
  const sql = "SELECT * FROM myusers WHERE id = ?";
  const id=req.params.id;
  
    db.query(sql,[id],(err,result)=>{
      if(err){
          return res.json({Message:"Error on server"})
      }
      return res.json(result)
  })
  
});
app.get("/login/:password", (req, res) => {
  const sql = "SELECT * FROM myusers WHERE password = ?";
  const password=req.params.password;
  
    db.query(sql,[password],(err,result)=>{
      if(err){
          return res.json({Message:"Error on server"})
      }
      return res.json(result)
  })
  
});
app.put("/update/:id", (req, res) => {
  const sql = "UPDATE myusers set `name` =?, `phone`=?,`email`=? WHERE id = ?";
  const id=req.params.id;
  
    db.query(sql,[req.body.name,req.body.phone,req.body.email,id],(err,result)=>{
      if(err){
          return res.json({Message:"Error on server"})
      }
      return res.json(result)
  })
  
});
app.delete('/delete/:id',(req,res)=>{
  const sql="DELETE FROM myusers where id=?";
  const id=req.params.id;
  
    db.query(sql,[id],(err,result)=>{
      if(err){
          return res.json({Message:"Error on server"})
      }
      return res.json(result)
  })
})

const PORT = process.env.PORT || 5173;


app.listen(PORT, () => console.log("server started on Port :" + `${PORT}`));
