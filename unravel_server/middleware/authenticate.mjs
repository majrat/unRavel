import firebaseAdmin from "../services/firebase.mjs";
import userModel from "../models/user.mjs";

export default async function (req, res, next) {
  try {
    const firebaseToken = req.headers.authorization?.split(" ")[1];
    console.log(
      "inside firebase authenticate--------------------------------------------------------------------------"
    );
    console.log("firebaseToken ===> " + firebaseToken);
    let firebaseUser;
    if (firebaseToken) {
      console.log(
        "inside ftoken if-----------------------------------------------------------"
      );
      await firebaseAdmin.auth
        .verifyIdToken(firebaseToken)
        .then((decodedToken) => {
          firebaseUser = decodedToken;
          console.log("firebaseUser ===> " + JSON.stringify(decodedToken));
        });
    }
    if (!firebaseUser) {
      // Unauthorized
      console.log("Unauthorized");
      return res.sendStatus(401);
    }
    
    console.log("authorized");

    const user = await userModel.findOne({
      firebase_id: firebaseUser.user_id,
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
