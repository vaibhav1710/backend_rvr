const Organization = require("../models/Organization");
require('dotenv').config();
const Users = require("../models/users");
const uuid4 = require("uuid4");
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const jwt = require('jsonwebtoken');
const Counter = require("../models/Counter");



const renderCreateIAMUser = async (req,res) => {

    console.log("GET <== Endpoint hit: /api/v2/createIAMUser ==>");

    try{
  
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const role = req.user.role;
    const org = await Organization.findOne({orgId:orgId});
    const user = org.orgUsers;

    res.render('createIAMUser', {
        message: "Create IAM Users",
        IAMUsers: user
    });
  }catch(error){
    console.log("ERROR RENDERING CreateIAMUSERS: ", error);
    res.status(400).send("Oops!! Error Occurred")
  }


}

const renderDashboard = async (req,res) => {
    console.log("GET <== Endpoint hit: /api/v2/dashboard ==>");
    
    try{
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const role = req.user.role;

    const org = await Organization.findOne({orgId:orgId});
    const counter = await Counter.find({orgId:orgId}, {counterId:1, title:1 ,counter:1, _id:0});
    res.render('dashboard', {
        message: "Dashboard",
        user: {
            orgName: org.orgName,
            accountId: org.accountId,
            role
        },
    });
  }catch(error){
    console.log("ERROR RENDERING DASHBOARD: ", error);
    res.status(400).send("Oops!! Error Occurred")
  }
    
}

const createIAMUserController = async (req, res) => {
    console.log("POST <== Endpoint hit: /api/v2/createIAMUser ==>");
    const {name, password, role} = req.body;
    //console.log(role);
    try{
  
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const org = await Organization.findOne({orgId});
    const user = org.orgUsers;
    user.forEach(item => {
        if(user.name === name){
            res.redirect('/api/v2/createIAMUser');
        }
    })  
    const updateOrg = await Organization.findOneAndUpdate({orgId:orgId},
        {
            $push:{
                orgUsers: {
                    name: name,
                    password: password,
                    userPermissions: role
                }
            }
        }
    )

    console.log("Successfully added");

    res.redirect('/api/v2/dashboard');

   }catch(error){
     
      console.log("ERROR CREATING IAM USER: ", error);
      res.status(400).send("Oops!! Error Occurred")

   }

}
 
const createCounterController = async(req,res) => {
   
    console.log("<= POST /api/v2/createCounter =>");

    try{
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const role = req.user.role;

    const {title} = req.body;

    const org = await Organization.findOne({orgId:orgId});
    const counterId = uuid4();
    const newCounter = await Counter.create({
        orgId: orgId,
        counterId:counterId,
        title:title
    });

    await Organization.findOneAndUpdate({orgId:orgId},
        {
            $push:{
                orgCounter: {
                    counterId:counterId,
                }
            }
        }
    )
     
    res.status(201).redirect('/api/v2/viewCounter')

    }catch(error){
        console.log("ERROR CREATING COUNTER: ", error);
    }
}

const deleteCounterController = async(req,res) => {
   
    console.log("<= POST /api/v2/deleteCounter/:counterId =>");
     
    try{
        
        const orgId = req.user.orgId;
        const counterId = req.params.counterId;

        const organization = await Organization.updateOne(
            { orgId }, 
            { $pull: { orgCounter: { counterId } } }
          );
          if (organization.modifiedCount === 0) {
            return res.status(404).json({ message: 'Counter not found in the organization.' });
          }
          const counter = await Counter.findOneAndDelete({ counterId });
      
          if (!counter) {
            return res.status(404).json({ message: 'Counter document not found.' });
          }

         return res.status(200).redirect('/api/v2/dashboard');


     }catch(error){
       console.log("ERROR DELETING COUNTER: ",error);
     }
     
}

const incrementCounterController = async (req,res) => {
    console.log("<= POST /api/v2/incrementCounter/:counterId =>");
     
    const counterId = req.params.counterId;

    try{
          
        const counter = await Counter.findOneAndUpdate({ counterId },
            {
                $inc: { counter: 1 }
            }
        );

        res.status(201).redirect("/api/v2/viewCounter");

    }catch(error){
        console.log("ERROR INCREMENTING COUNTER: ", error);
    }
}


const viewCounterController = async(req,res) => {
    console.log("<= GET /api/v2/viewCounter =>");
    try{
        
        const orgId = req.user.orgId;

        const counters = await Counter.find({orgId});

        res.status(200).render("Counter",{
           message:"Org's Counter",
           counters: counters
        })

    }catch(error){
        console.log("ERROR VIEWING COUNTER: ", error);
    }
}


module.exports = {renderDashboard ,incrementCounterController ,deleteCounterController ,renderCreateIAMUser, createIAMUserController, createCounterController, viewCounterController};