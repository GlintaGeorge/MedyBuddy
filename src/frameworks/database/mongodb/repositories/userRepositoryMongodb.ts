import { userEntityType,googleSignInUserEntityType} from "../../../../entities/userEntity";
import { UserInterface } from "../../../../types/userInterface";
import User from "../../models/user"
import OTPModel from "../../models/OTPmodel"
import wallet from "../../models/wallet"
import transations from "../../models/transations";




export const userRepositoryMongodb = () =>{



const addUser = async (user:userEntityType)=>{
    const newUser:any = new User({
        name:user.name(),
        email:user.getEmail(),
        phoneNumber:user.getphoneNumber(),
        password:user.getPassword(),
        authenticationMethod:user.getAuthenticationMethod(),
    });
    await newUser.save();
    return newUser;


};
const AddOTP = async (OTP: string, userId: string)=>{
    await OTPModel.create({OTP, userId});

};

const getUserbyEmail = async (email: string)=>{
    const user: UserInterface | null = await User.findOne({email});
    return user;
}

const findOtpUser = async (userId:string)=>await OTPModel.findOne({userId: userId});

const deleteOtpUser = async (userId: string) =>await OTPModel.deleteOne({ userId });

const getUserbyId = async (id: string) => await User.findById(id);

const updateUserInfo = async (id: string, updateData:Record<string,any>)=>await User.findByIdAndUpdate(id,updateData,{new:true});

const getAllUsers = async () => await User.find({ isVerified: true });

const updateVerificationCode = async (email: string, code: string) => await User.findOneAndUpdate({ email }, { verificationCode: code });

    const findVerificationCodeAndUpdate = async (
        code: string,
        newPassword: string
      ) =>
        await User.findOneAndUpdate(
          { verificationCode: code },
          { password: newPassword, verificationCode: null },
          { upsert: true }
        );

        const registerGoogleSignedUser = async (user: googleSignInUserEntityType) =>
            await User.create({
              name: user.name(),
              email: user.email(),
              profilePicture: user.picture(),
              isVerified: user.email_verified(),
              authenticationMethod:user.authenticationMethod(),
            });

            const updateUserBlock = async (id: string, status: boolean) =>{
                await User.findByIdAndUpdate(id, { isBlocked: status });
            }
            const addWallet = async (userId: string) => await wallet.create({ userId });

            const getWalletUser = async (userId:string) => {
                const response = await wallet.findOne({userId:userId}); 
                 return response;
         
             }

             const getAllTransaction = async (userId:any) =>{
                const transactions = await transations.find({userId:userId});
                return transactions;
            }     



return{
    addUser,
    AddOTP,
    getUserbyEmail,
    findOtpUser,
    deleteOtpUser,
    getUserbyId,
    updateUserInfo,
    getAllUsers,
    updateVerificationCode,
    findVerificationCodeAndUpdate,
    registerGoogleSignedUser,
    updateUserBlock,
    addWallet,
    getWalletUser,
    getAllTransaction,

}

};



export type userRepositoryMongodbType = typeof userRepositoryMongodb

