import React, { useEffect, useState } from 'react'
import { Dimensions, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { DefaultStyles } from '../../DefaultStyles'
import StackIncludeExpense from './StackIncludeExpense'
import StackVehicle from './StackVehicle'
import ViewExpense from '../expenses/ViewExpense'
import StackUser from './StackUser'
import Dashboard from '../expenses/Dashboard'
import StackEditExpense from './StackEditExpense'


const Tabs = createBottomTabNavigator()
const { height } = Dimensions.get('window')

function Tab(props: React.PropsWithChildren): JSX.Element {
    const view = props.route?.params?.route

    return (
        <Tabs.Navigator initialRouteName={`${view}`} {...props}
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: DefaultStyles.colors.fundoInput,
                tabBarInactiveTintColor: DefaultStyles.colors.fundo,
                tabBarShowLabel: false,
                backgroundColor: 'black',
                tabBarStyle: {
                    backgroundColor: DefaultStyles.colors.tabBar,
                    borderTopColor: DefaultStyles.colors.tabBar,
                    borderTopLeftRadius: 25,
                    height: height / 14,
                },
            }}
            backBehavior='history'>
            <Tabs.Screen
                name='Dashboard'
                component={Dashboard}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <FeatherIcon name="pie-chart" size={focused ? 30 : size} color={DefaultStyles.colors.fundoInput} />
                    )
                }}
            />
            <Tabs.Screen
                name='ViewExpense'
                component={ViewExpense}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <FeatherIcon name="file-text" size={focused ? 30 : size} color={DefaultStyles.colors.fundoInput} />
                    )
                }}
            />
            <Tabs.Screen
                name='StackIncludeExpense'
                component={StackIncludeExpense}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <Image source={require('../../assets/iconDespesa.png')} style={focused ? { height: 45, width: 45 } : { height: 35, width: 35 }} />
                    )
                }}
            />
            <Tabs.Screen
                name='StackVehicle'
                component={StackVehicle}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Fontisto name="automobile" size={focused ? 45 : 35} color={DefaultStyles.colors.fundoInput} />
                    )
                }}
            />
            <Tabs.Screen
                name='StackUser'
                component={StackUser}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <FeatherIcon name="user" size={focused ? 30 : size} color={DefaultStyles.colors.fundoInput} />
                    )
                }}
            />
            <Tabs.Screen 
                name='StackEditExpense'                 
                component={StackEditExpense} 
                options={{
                    tabBarButton: (props2) => false
                }}
            />
        </Tabs.Navigator>
    )
}

export default Tab;