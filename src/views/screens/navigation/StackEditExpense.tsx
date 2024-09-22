import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {FuelExpense} from '../expenses/create/FuelExpense';
import OilExpense from '../expenses/create/OilExpense';
import DocumentationExpense from '../expenses/create/DocumentationExpense';
import OthersExpense from '../expenses/create/OthersExpense';
import MechanicExpense from '../expenses/create/MechanicExpense';
import TireExpense from '../expenses/create/TireExpense';
import AppearanceExpense from '../expenses/create/AppearanceExpense';

/**
 * Edit Expense stack
 * @author Bruno
 */
const Stack = createNativeStackNavigator()
function StackEditExpense(props: React.PropsWithChildren) : JSX.Element {
    return <Stack.Navigator {...props} screenOptions={{ headerShown: false }}>
        <Stack.Screen name='FuelExpense' component={FuelExpense} />
        <Stack.Screen name='OilExpense' component={OilExpense} />
        <Stack.Screen name='DocumentationExpense' component={DocumentationExpense} />
        <Stack.Screen name='OthersExpense' component={OthersExpense} />
        <Stack.Screen name='MechanicExpense' component={MechanicExpense} />
        <Stack.Screen name='TireExpense' component={TireExpense} />
        <Stack.Screen name='AppearanceExpense' component={AppearanceExpense} />
    </Stack.Navigator>
}

export default StackEditExpense;