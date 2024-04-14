import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import ChangePassword from '../auth/ChangePassword';
import Account from '../auth/Account';

const Stack = createNativeStackNavigator()

function StackUser(props) : JSX.Element {

    return (
        <Stack.Navigator {...props} initialRouteName='Account' screenOptions={{headerShown: false}}>
            <Stack.Screen name='Account' component={Account} />
            <Stack.Screen name='ChangePassword' component={ChangePassword} />            
        </Stack.Navigator>
    )
}

export default StackUser;