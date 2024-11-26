const express = require("express");
const router = express.Router();
const {loginUser,renderLogin, renderIAMLogin, IAMLogin,logoutController} = require("../controllers/userLogin");
const {renderRegister,register} = require("../controllers/userRegister")
const {fetchUser} = require("../middlewares/fetchUser");

router.post("/login", loginUser);
router.get("/login", renderLogin);
router.get("/iamLogin", renderIAMLogin);
router.post("/iamLogin", IAMLogin);
router.get("/register", renderRegister);
router.post("/register",register)
router.delete("/logout", logoutController);



module.exports = router;