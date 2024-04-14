import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SpeedometerModal from '../expenses/create/SpeedometerModal';
import FuelExpense from '../expenses/create/FuelExpense';
import OilExpense from '../expenses/create/OilExpense';
import DocumentationExpense from '../expenses/create/DocumentationExpense';
import OthersExpense from '../expenses/create/OthersExpense';
import MechanicExpense from '../expenses/create/MechanicExpense';
import TyreExpense from '../expenses/create/TyreExpense';
import AppearanceExpense from '../expenses/create/AppearanceExpense';

const Stack = createNativeStackNavigator()

function StackIncludeExpense(props: React.PropsWithChildren) : JSX.Element {

    return (
        <Stack.Navigator {...props} initialRouteName={'SpeedometerModal'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name='SpeedometerModal' component={SpeedometerModal} />
            <Stack.Screen name='FuelExpense' component={FuelExpense} />
            <Stack.Screen name='OilExpense' component={OilExpense} />
            <Stack.Screen name='DocumentationExpense' component={DocumentationExpense} />
            <Stack.Screen name='OthersExpense' component={OthersExpense} />
            <Stack.Screen name='MechanicExpense' component={MechanicExpense} />
            <Stack.Screen name='TyreExpense' component={TyreExpense} />
            <Stack.Screen name='AppearanceExpense' component={AppearanceExpense} />
        </Stack.Navigator>
    )
}

export default StackIncludeExpense;