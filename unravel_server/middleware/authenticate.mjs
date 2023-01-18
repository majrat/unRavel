import firebaseAdmin from "../services/firebase.mjs";
import userModel from "../models/user.mjs";

export default async function (req, res, next) {
  try {
    const firebaseToken = req.headers.authorization?.split(" ")[1];
    
    let firebaseUser;
    if (firebaseToken) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(firebaseToken);
    }
    
    if (!firebaseUser) {
      // Unauthorized
      console.log("Unauthorized");
      return res.sendStatus(401);
    }
    
    const user = await userModel.findOne({
      firebase_id: firebaseUser.user_id
    });
    
    if (!user) {
      // Unauthorized
      return res.sendStatus(401);
    }
    
    req.user = user;
    
    next();
  } catch (err) {
    //Unauthorized
    res.sendStatus(401);
  }
}