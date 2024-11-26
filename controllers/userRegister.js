require('dotenv').config();
const Organization = require("../models/Organization");
const Users = require("../models/users");
const uuid4 = require("uuid4");
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const jwt = require('jsonwebtoken');

const register = async (req,res) => {
   
    try{ 
        const {email, password, name, orgName} = req.body;
        const user = await Users.findOne({email});
        if(user) return res.status(400).json({msg: "Email already exists"});
        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = uuid4();
        const orgId = uuid4();

        const newUser = await Users.create(
            {userId: userId,
            email, 
            password: hashedPassword,
            name});
        
        const id = generator.generate(
        {
            length: 8,
            numbers:true,
            uppercase:true,
            excludeSimilarCharacters:true
        })   
             
        const newOrg = await Organization.create({
            orgId: orgId,
            orgName,
            userId: newUser.userId,
            accountId:id,
            orgUsers: [
                {
                    password:hashedPassword,
                    name:name,
                    userPermissions:'all'
                }
            ]
        });
         

        await Users.findOneAndUpdate(
            {userId:userId}, 
            {
              $push: { organizations: { organizationId: newOrg.orgId, permission: 'all' } }, 
            }
          );

        const data = {
            orgId: newOrg.orgId,
            userId: newUser.userId,
            role:'admin'
        }

        const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '48hr' });    

        res.cookie('authToken', authToken, {
            maxAge: 48 * 60 * 60 * 1000, 
          });
        
          return res.status(200).redirect('/api/v2/dashboard');

    }catch(error){
        console.log("ERROR REGISTERING USER: ",error);
    }

}

async function renderRegister(req,res){
    res.render('register',  {error:null});

}

module.exports = {register , renderRegister};