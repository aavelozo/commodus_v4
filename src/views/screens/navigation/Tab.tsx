import React from 'react'
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
import StackEditExpense from './StackEditExpense';
import FontAwsomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwsomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';


/**
 * Bottom tab navigator of app
 * @author Bruno
 */
const Tabs = createBottomTabNavigator()
const { height } = Dimensions.get('window');
const focusedIconIncSize = 3;
function Tab(props: React.PropsWithChildren): JSX.Element {
    const view = props.route?.params?.route
    return <Tabs.Navigator initialRouteName={`${view}`} {...props}
        backBehavior='history'
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
    >
        <Tabs.Screen
            name='Dashboard'
            component={Dashboard}
            options={{
                tabBarIcon: ({ focused, size, color }) => 
                    //<Icon name="pie-chart" color={DefaultStyles.colors.fundoInput} size={focused ? 30 : size}/>
                    focused
                        ?<Fontisto name="pie-chart-1" size={focused ? size + focusedIconIncSize : size} color={DefaultStyles.colors.fundoInput}/>
                        : <FeatherIcon name="pie-chart" size={focused ? size + focusedIconIncSize : size} color={DefaultStyles.colors.fundoInput}/>
                
            }}
        />
        <Tabs.Screen
            name='ViewExpense'
            component={ViewExpense}
            options={{
                tabBarIcon: ({ focused, size, color }) => 
                    focused 
                        ? <FontAwsomeIcon name="file-text" size={focused ? size + focusedIconIncSize : size} color={DefaultStyles.colors.fundoInput}/>
                        : <FeatherIcon name="file-text" size={focused ? size + focusedIconIncSize : size} color={DefaultStyles.colors.fundoInput}/>
                
            }}
        />
        <Tabs.Screen
            name='StackIncludeExpense'
            component={StackIncludeExpense}
            options={{
                tabBarIcon: ({ focused, size, color }) => (
                    <Image source={require('../../assets/iconDespesa.png')} style={focused ? { height: 45, width: 45 } : { height: 35, width: 35 }}/>
                )
            }}
        />
        <Tabs.Screen
            name='StackVehicle'
            component={StackVehicle}
            options={{
                tabBarIcon: ({ focused, size }) => 
                    focused
                        ? <IonIcon name="car-sharp" size={focused ? size + focusedIconIncSize + 10 : size + 5} color={DefaultStyles.colors.fundoInput}/>
                        : <IonIcon name="car-outline" size={focused ? size + focusedIconIncSize + 10 : size + 5} color={DefaultStyles.colors.fundoInput}/>
            }}
        />
        <Tabs.Screen
            name='StackUser'
            component={StackUser}
            options={{
                tabBarIcon: ({ focused, size, color }) => 
                    focused
                        ? <FontAwsomeIcon5 name="user-alt" size={focused ? size + focusedIconIncSize - 2 : size} color={DefaultStyles.colors.fundoInput}/>
                        : <FeatherIcon name="user" size={focused ? size + focusedIconIncSize - 2: size} color={DefaultStyles.colors.fundoInput}/>
                
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
}

export default Tab;