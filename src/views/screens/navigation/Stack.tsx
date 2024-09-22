import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { InitLoading } from '../InitLoading';
import { Login } from '../auth/Login';
import UserRegistration from '../auth/UserRegistration';
import Tab from './Tab';
import RecoverLogin from '../auth/RecoverLogin';
import Terms from '../auth/Terms';
import Privacy from '../auth/Privacy';


/**
 * Root stack of this app
 * @author Bruno
 */
const StackNative = createNativeStackNavigator()
function Stack(props:Object) : JSX.Element {
    return <StackNative.Navigator {...props} screenOptions={{headerShown: false}} initialRouteName={'InitLoading'} >
        <StackNative.Screen name='InitLoading' component={InitLoading} />
        <StackNative.Screen name='UserRegistration' component={UserRegistration} />
        <StackNative.Screen name='Login' component={Login} />     
        <StackNative.Screen name='RecoverLogin' component={RecoverLogin} />                   
        <StackNative.Screen name='Tab' component={Tab} />            
        <StackNative.Screen name='Terms' component={Terms} />            
        <StackNative.Screen name='Privacy' component={Privacy} />            
    </StackNative.Navigator>    
}

export default Stack;