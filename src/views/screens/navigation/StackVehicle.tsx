import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import ListVehicle from '../vehicles/ListVehicle'
import ViewVehicle from '../vehicles/ViewVehicle'
import EditVehicle from '../vehicles/EditVehicle'

const Stack = createNativeStackNavigator()

function StackVehicle(props:React.PropsWithChildren) : JSX.Element {

    return (
        <Stack.Navigator {...props} initialRouteName='ListVehicle' screenOptions={{headerShown: false}}>
            <Stack.Screen name='ListVehicle' component={ListVehicle} />
            <Stack.Screen name='ViewVehicle' component={ViewVehicle} />
            <Stack.Screen name='EditVehicle' component={EditVehicle} />
        </Stack.Navigator>
    )
}

export default StackVehicle;