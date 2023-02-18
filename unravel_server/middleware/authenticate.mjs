import firebaseAdmin from "../services/firebase.mjs";
import userModel from "../model/user.mjs";

export default async function (req, res, next) {
  try {
    let firebaseToken = req.headers.authorization?.split(" ")[1];
    if (firebaseToken === undefined) {
      firebaseToken = req.body.headers.authorization?.split(" ")[1];
    }
    console.log(
      "inside firebase authenticate--------------------------------------------------------------------------"
    );
    let firebaseUser;
    if (firebaseToken) {
      await firebaseAdmin.auth
        .verifyIdToken(firebaseToken)
        .then((decodedToken) => {
          firebaseUser = decodedToken;
        });
    }
    if (!firebaseUser) {
      // Unauthorized
      console.log("Unauthorized - no firebase user FOUND");
      return res.sendStatus(401);
    }
    console.log(firebaseUser);

    const user = await userModel.findOne({
      firebase_id: firebaseUser.user_id,
    });

    if (!user) {
      // Unauthorized
      console.log("inside !user ");
      return res.sendStatus(401);
    }

    req.user = user;
    console.log("node authorized");

    next();
  } catch (err) {
    //Unauthorized
    res.sendStatus(401);
  }
}
