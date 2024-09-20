import { CommonActions } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from "./AuthController";
import Brands from "../database/models/Brands";
import Vehicles from "../database/models/Vehicles";
import Utils from "./Utils";

const firebaseConfig = {
    // Your Firebase project configuration here
};

class InitController{

    /**
     * Init function run on start app, load initial data and check logged user
     * @param {*} navigation 
     */
    static async init(navigation){
        console.log('INIT InitController.init');
        let nextRoute = {
            name:"Login",
            params:{
                email:'', 
                senha:''
            }
        }        
        try {            

            //load brands of server in "singleton" request
            await Brands.getDBData();
            
            const currentUser = auth().currentUser;
            console.log('currentUser in init',currentUser);
            if (Utils.hasValue(currentUser)) {

                //load user register of server
                console.log('currentUser',currentUser.email); 
                console.log('getting user of collection...');                                
                let loggedUser = await firestore().collection('Users').where('authUserId','==',currentUser.uid).get();
                console.log('getting user of collection... ok');
                if (loggedUser && loggedUser.docs && loggedUser.docs.length > 0) {
                    console.log('loggedUser',loggedUser);
                    AuthController.setLoggedUser(loggedUser.docs[0]);                    
                    console.log('loggedUser setted');
                    await Vehicles.getDBData();
                }   
                
                //navigate to home
                nextRoute = {name:"Tab",params:{route:'StackVehicle'}};
            } 
        } catch (e) {
            console.log('error',e);
        } finally {
            console.log('INIT InitController.init finally block');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [nextRoute]
                })
            );
            console.log('END InitController.init');
        }        
    }
}

export {InitController}