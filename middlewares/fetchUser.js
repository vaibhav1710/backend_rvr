require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require("../models/users");
const Organization = require("../models/Organization")
const uuid4 = require('uuid4');
const {roleConstants} = require("../constants/roleConstants");

const fetchUser = async(req,res,next) => {
    console.log("<= VERIFYING USERS =>")
    try{
    const token = req.cookies.authToken; 
    if(!token) {
      res.redirect("/api/v2/login");
    }else{
        jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
          if(error){
            console.log("ERROR VERIFYING TOKEN: ",error);
            res.render("login")  
        }else{
            req.user = {
                userId: decodedToken.userId,
                orgId: decodedToken.orgId, 
                role: decodedToken.role 
            };
        
            next(); 
          }    
        });
    }
   }catch(error){
    console.log("ERROR IN WHILE FETCHING USER: ",error);
   }   
}


const checkPermission = async (req,res, next) => {
       const role = req.user.role;
       const endpoint = req.route.path; 

       if(role === 'admin' || role === 'all'){
        next();
       }else if(role === 'write'){
        const roleEndpoints = roleConstants.write;
        if (roleEndpoints.includes(endpoint)) {
            return next();
        } else {
            return res.status(403).send("Access denied." );
        }
       }else if( role === 'read'){
            const roleEndpoints = roleConstants.read;
            console.log(role);
            if (roleEndpoints.includes(endpoint)) {
                return next();
            } else {
                return res.status(403).send("Access denied." );
            }
        } else {
            console.log(role);
            return res.status(403).send('Invalid role. ');
        }

}


module.exports = {fetchUser , checkPermission}