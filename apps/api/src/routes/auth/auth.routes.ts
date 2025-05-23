//#region Import
import { Router } from "express";
import { Login } from "../../controller/authentication/login.controller";
import { AccessToken } from "../../controller/authentication/accessToken.controller";
//#endregion

//#region Action
const AuthenticationRouter = Router();
AuthenticationRouter.get("/accessToken", AccessToken)
AuthenticationRouter.post("/login", Login);
//#endregion

export { AuthenticationRouter };
