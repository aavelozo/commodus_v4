import { CommonActions } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AuthController from "./AuthController";

const firebaseConfig = {
    // Your Firebase project configuration here
};

class InitController{
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
            const currentUser = auth().currentUser;
            if (currentUser) {
                console.log('currentUser',currentUser.email); 
                console.log('getting user of collection...');
                let loggedUser = await firestore().collection('Users').where('authUserId','==',currentUser.uid).get();
                console.log('getting user of collection... ok');
                if (loggedUser && loggedUser.docs && loggedUser.docs.length > 0) {
                    loggedUser = {
                        id: loggedUser.docs[0].id,
                        ...loggedUser.docs[0].data()
                    };
                    console.log('loggedUser',loggedUser);
                    AuthController.setLoggedUser(loggedUser);
                    console.log('loggedUser setted');
                }              
                nextRoute = {name:"Tab"}
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