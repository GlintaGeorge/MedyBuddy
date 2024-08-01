import { userEntityType,googleSignInUserEntityType} from "../../entities/userEntity";
import { userRepositoryMongodbType} from "../../frameworks/database/mongodb/repositories/userRepositoryMongodb";



export const userDbRepository = (
    repository : ReturnType<userRepositoryMongodbType>
)=>{
    
    
    const addUser = async (user:userEntityType)=> await repository.addUser(user);

    const addOTP = async (otp: string, id:string) => await repository.AddOTP(otp,id);

    const getUserbyEmail = async (email: string)=>await repository.getUserbyEmail(email);

    const findOtpUser = async (userId:string)=>await repository.findOtpUser(userId);

    const deleteOtpUser = async (userId: string) =>await repository.deleteOtpUser(userId);

    const getUserbyId = async (id: string)=> {
        const res = await repository.getUserbyId(id); 
        return res
    }
    
    const updateProfile = async (userID:string, userData : Record<string,any>)=>await repository.updateUserInfo(userID,userData);

    const getAllUsers = async () => await repository.getAllUsers();

    const updateVerificationCode = async (email:string, verificationCode: string)=> await repository.updateVerificationCode(email,verificationCode);
    
    const verifyAndResetPassword = async (verificationCode: string,password: string) =>await repository.findVerificationCodeAndUpdate(verificationCode, password);

    const registerGoogleSignedUser = async (user: googleSignInUserEntityType) =>await repository.registerGoogleSignedUser(user);

    const updateUserBlock = async (id: string, status: boolean) =>{
        await repository.updateUserBlock(id, status);
    }

    const getWallet = async (userId:string) =>await repository.getWalletUser(userId);

    const addWallet = async (userID: string) =>
        await repository.addWallet(userID); 

    const getTransactions = async (userId:any) =>{
        const response = await repository.getAllTransaction(userId);
        return response;
     }

    return {
        addUser,
        addOTP,
        getUserbyEmail,
        findOtpUser,
        deleteOtpUser,
        getUserbyId,
        updateProfile,
        getAllUsers,
        updateVerificationCode,
        verifyAndResetPassword,
        registerGoogleSignedUser,
        updateUserBlock,
        getWallet,
        addWallet,
        getTransactions,


        



        
        

        
    };
};

export type userDbInterface = typeof userDbRepository