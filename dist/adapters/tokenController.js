"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../types/httpStatus");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const userAuth_1 = require("../app/use-cases/user/auth/userAuth");
const authDoctor_1 = require("../app/use-cases/doctor/authDoctor");
const tokenContoller = (authServiceInterface, authServiceImpl, userDbRepository, userDbRepositoryImpl, doctorDbRepository, doctorDbRepositoryImpl) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const dbRepositoryDoctor = doctorDbRepository(doctorDbRepositoryImpl());
    /**
     ** method : POST
     */
    // refresh access token
    const getNewAccessToken = (req, res) => {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res
                .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                .json({ success: false, error: "Invalid refresh token" });
        }
        // verify the recieved refresh token and create new access token
        jsonwebtoken_1.default.verify(refresh_token, config_1.default.REFRESH_SECRET, (err, user) => {
            if (err) {
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Refresh token is expired" });
            }
            else {
                console.log(user, "Decoded User from Refresh Token");
                const { id, name, role } = user;
                const { accessToken } = authService.createTokens(id, name, role);
                res.status(httpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Token refreshed successfully",
                    access_token: accessToken,
                });
            }
        });
    };
    /*
     * METHOD:GET,
     * Return acces token to client
     */
    const returnAccessToClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { access_token } = req.query;
            if (!access_token)
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Access token is required" });
            const token = jsonwebtoken_1.default.decode(access_token);
            if ((token === null || token === void 0 ? void 0 : token.role) === "user") {
                const user = yield (0, userAuth_1.getUserById)(token.id, dbRepositoryUser);
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, access_token, user });
            }
            else if ((token === null || token === void 0 ? void 0 : token.role) === "doctor") {
                const doc = yield (0, authDoctor_1.getDoctorById)(token.id, dbRepositoryDoctor);
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, access_token, user: doc });
            }
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, access_token });
        }
        catch (error) {
            console.error("Error in token controller:", error);
            return res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Internal server error" });
        }
    });
    return { returnAccessToClient, getNewAccessToken };
};
exports.default = tokenContoller;
