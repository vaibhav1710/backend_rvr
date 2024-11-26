require('dotenv').config();
const Organization = require("../models/Organization");
const Users = require("../models/users");
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req,res) => {
   console.log(" POST <= /api/v2/login =>")
    try{ 
        const {accountId ,email, password} = req.body;
        

        const user = await Users.findOne({email:email});
        if(!user) return res.status(400).json({message: "No account exists."});
        const orgExist = await Organization.findOne({accountId:accountId},{orgId:1, accountId:1,_id:0});
        if(!orgExist) res.status(400).json({message:"Organization doesn't exists."}); 
        const isMatch = await bcrypt.compare(password, user.password);
        const matchOrg = user.organizations.find(element => element.organizationId === orgExist.orgId);
         
        if(!matchOrg){
          res.status(400).render('login', {
            message:
              "Some error Occured!!"
          })
        }

        
        if(isMatch){             
                const data = {
                      orgId: orgExist.orgId,
                      userId: user.userId,
                      role:  matchOrg.permission === 'all' ? 'admin' : matchOrg.permission === 'read' ? 'reader':'writer'  
                }
                const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '48hr' });
                  
                  res.cookie('authToken', authToken, {
                    maxAge: 48 * 60 * 60 * 1000, 
                  });
        
                  return res.status(200).redirect('/api/v2/dashboard');
             }else{
            return res.status(400).json({ message: 'Invalid credentials' });
           }
        
    }catch(error){
        console.log("ERROR LOGGING USER: ",error);
    }

}


 const IAMLogin = async(req,res) => {
   
   try{ 

    const {accountId, name, password} = req.body;

    const org = await Organization.findOne({accountId:accountId});
    
   if(!org) return res.status(400).json({message: "No organization exists with this Account ID."});
     
    const user = org.orgUsers.find(element => element.name === name);
       
      if (user) {
           if(password === user.password){
            const data = {
              orgId: org.orgId,
              userId:null,
              name: name,
              role:  user.userPermissions
            }

            const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '48hr' });
                  
                  res.cookie('authToken', authToken, {
                    maxAge: 48 * 60 * 60 * 1000, 
                  });
            
            return res.status(200).redirect('/api/v2/dashboard');
            }else{
              return res.status(400).send( 'Invalid Credentials' );
            }
        
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
   }catch(err){
    console.log("ERROR SIGNING IN AS IAM USER: ",err);
   }
   
 }

async function renderLogin(req,res){
    res.render('login',  {error:null});

}


async function renderIAMLogin(req,res){
  res.render('iamlogin', {error:null});
}


const logoutController = (req, res) => {
  try {
      console.log(`<= LOGGING OUT USER =>`);
      res.clearCookie('authToken');
      console.log("User logged out successfully");
      // Redirect to the login page
      return res.status(200).render('login', { message: "Logged out successfully" });
  } catch (error) {
      console.log("ERROR LOGGING OUT: ", error);
      return res.status(500).send("Internal Server Error");
  }
};




module.exports = {loginUser , renderLogin , renderIAMLogin , IAMLogin, logoutController};