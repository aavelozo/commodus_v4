import React, { useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Loading } from '../Loading';
import { Login } from '../auth/Login';
import UserRegistration from '../auth/UserRegistration';
import Tab from './Tab';
import RecoverLogin from '../auth/RecoverLogin';
import StackEditExpense from './StackEditExpense';

const StackNative = createNativeStackNavigator()

function Stack(props:Object) : JSX.Element {

    useEffect(()=>{
        console.log('INIT Stack.useEffect');
        console.log('END Stack.useEffect');
    });

    return (
        <StackNative.Navigator {...props} screenOptions={{headerShown: false}} initialRouteName={'Loading'} >
            <StackNative.Screen name='Loading' component={Loading} />
            <StackNative.Screen name='UserRegistration' component={UserRegistration} />
            <StackNative.Screen name='Login' component={Login} />     
            <StackNative.Screen name='RecoverLogin' component={RecoverLogin} />                   
            <StackNative.Screen name='Tab' component={Tab} />            
        </StackNative.Navigator>
    )
}

export default Stack;