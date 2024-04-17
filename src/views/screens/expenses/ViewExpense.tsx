import React, { useState } from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useFocusEffect } from '@react-navigation/native'
import Swiper from 'react-native-swiper'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../components/TitleView'
import Vehicles from '../../../database/models/Vehicles'
import { DefaultStyles } from '../../DefaultStyles'
import Header from '../../components/Header'
import ButtonCardExpense from '../../components/ButtonCardExpense'
import Utils from '../../../controllers/Utils';
import _ from "lodash";
import EditExpenseController from '../../../controllers/EditExpenseController'
import { ActivityIndicator } from 'react-native-paper'
const { height, width } = Dimensions.get('window');

function ViewExpense(props): JSX.Element {
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false); 
    const [allVehicle, setAllVehicle] = useState(true)
    //const navigation = useNavigation();
    const [vehicles, setVehicles] = useState([]);
    const [expenses, setExpenses] = useState([])
    const [totalValue, setTotalValue] = useState(0)
    
    // const [expensesByCars, setExpensesByCar] = useState([])

    useFocusEffect(React.useCallback(() => {        
        setLoading(true);
        EditExpenseController.currentExpense = null;
        (async () => {
            try {
                console.log('loading expenses...');
                let newVehicles = [];
                let newAllExpenses = [];
                let newTotalValue = 0;
                let newVehiclesCollection = await Vehicles.getDBData();
                console.log('newVehiclesCollection',newVehiclesCollection.size);
                //newVehiclesCollection.forEach(async (docSnap)=>{                    
                for(let k in newVehiclesCollection.docs) {
                    console.log('vehicle',newVehiclesCollection.docs[k].id);
                    let expensesCollection = await newVehiclesCollection.docs[k].ref.collection('expenses').get();
                    console.log('expenses of vehicle size',expensesCollection.size);
                    newVehiclesCollection.docs[k].expenses = expensesCollection.docs || [];
                    newVehiclesCollection.docs[k].vehicleName = `${newVehiclesCollection.docs[k].data().model.id}-${newVehiclesCollection.docs[k].data().plate}`;
                    newVehiclesCollection.docs[k].totalValue = 0;
                    for (let i in newVehiclesCollection.docs[k].expenses) {
                        newVehiclesCollection.docs[k].totalValue += Utils.toNumber(newVehiclesCollection.docs[k].expenses[i].data().totalValue);
                        newVehiclesCollection.docs[k].expenses[i].vehicleName = newVehiclesCollection.docs[k].vehicleName;
                    }
                    newTotalValue += newVehiclesCollection.docs[k].totalValue; 
                    newVehicles.push(newVehiclesCollection.docs[k]);
                    newAllExpenses = newAllExpenses.concat(newVehiclesCollection.docs[k].expenses);
                    console.log('vehicle',newVehiclesCollection.docs[k].id,'end');
                };

                console.log('newVehicles',newVehicles);
                console.log('newAllExpenses',newAllExpenses);
                console.log('newTotalValue',newTotalValue);
                setVehicles(newVehicles);
                setExpenses(newAllExpenses);
                setTotalValue(newTotalValue);
                console.log('loading expenses... ok,size',newAllExpenses.length);
            } catch (e) {
                console.log(e);                    
            } finally {
                setLoaded(true);
                setLoading(false);                
            }
        })();
    }, []))

    return (
        <>
            <Header />
            <View style={style.title}>
                <TitleView title="Despesa" />
                <View style={style.espacoCentral}>

                    {loading
                        ? <View 
                            style={{ 
                                width:'100%', 
                                height:'100%',                
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flex: 1
                            }} >
                            <ActivityIndicator size={'large'}/>
                        </View>
                        : <>
                            {expenses.length > 0 
                                ? <View style={{ flex: 1, paddingTop: RFValue(20) }}>
                                    {/* BOTão MOSTRAR TODAS DESPESAS OU VEICULO POR VEICULO */}
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                                        <TouchableWithoutFeedback onPress={() => setAllVehicle(true)}>
                                            <View style={{ marginLeft: RFValue(10), borderBottomColor: allVehicle ? DefaultStyles.colors.botao : DefaultStyles.colors.tabBar, borderBottomWidth: allVehicle ? RFValue(4) : 1, width: '45%' }}>
                                                <Text style={[style.textExpense, style.textButton]}>Todos os veículos</Text>
                                            </View>
                                        </TouchableWithoutFeedback>

                                        <TouchableWithoutFeedback onPress={() => setAllVehicle(false)}>
                                            <View style={{ marginRight: 10, borderBottomColor: !allVehicle ? DefaultStyles.colors.botao : DefaultStyles.colors.tabBar, borderBottomWidth: !allVehicle ? RFValue(4) : 1, width: '45%' }}>
                                                <Text style={[style.textExpense, style.textButton]}>Escolher o veículo</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    {/* ALLVEHICLE = TRUE, MOSTRA TODAS AS DESPESAS, CASO CONTRARIO MOSTRA VEICULO POR VEICULO*/}
                                    {allVehicle ?
                                        <>
                                            {/* Todos os Veiculo */}
                                            < View style={{ alignSelf: 'center', height: height * 0.06, marginTop: RFValue(20), justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={style.textSummary}>{vehicles.length} veículo{vehicles.length > 1 ? 's' : ''}</Text>
                                                <Text style={[style.textSummary, { fontSize: RFValue(18), paddingBottom: 2 }]}>Total de gastos: R${totalValue.toFixed(2)}</Text>
                                            </View>
                                            <Text style={{ fontWeight: 'bold', fontSize: RFValue(20), marginLeft: RFValue(15), color: DefaultStyles.colors.tabBar, marginTop: RFValue(10) }}>Detalhe dos gastos:</Text>
                                            <FlatList
                                                ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                                                keyExtractor={expenses.id}
                                                data={expenses}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <>
                                                            <ButtonCardExpense data={item} navigate={props.navigation.navigate}/>
                                                        </>
                                                    )
                                                }}
                                            />
                                        </> :
                                        <Swiper containerStyle={style.wrapper} loop={true} showsButtons={true} nextButton={<Text style={style.buttonTextRight}>›</Text>}
                                            prevButton={<Text style={style.buttonTextLeft}>‹</Text>} >
                                            {/* Escolher o Veiculo */}
                                            {
                                                vehicles.map((vehicle, ind) => {
                                                    return (
                                                        <View key={ind}>
                                                            < View style={{ alignSelf: 'center', borderBottomWidth: RFValue(0.5), borderBottomColor: DefaultStyles.colors.tabBar, height: height * 0.06, marginTop: RFValue(20), justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={style.textSummary}>{vehicle.vehicleName}</Text>
                                                                <Text style={[style.textSummary, { fontSize: RFValue(17), paddingBottom: RFValue(5) }]}>Total de gastos: R${vehicle.totalValue.toFixed(2)}</Text>
                                                            </View>
                                                            <Text style={{ fontWeight: 'bold', fontSize: RFValue(20), marginLeft: RFValue(15), color: DefaultStyles.colors.tabBar, marginTop: RFValue(10) }}>Detalhe dos gastos:</Text>
                                                            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: height * 0.12 }}>
                                                                {
                                                                    vehicle.expenses ? vehicle.expenses.map((exp, ind) => {
                                                                        return (
                                                                            <View key={ind}>
                                                                                <ButtonCardExpense data={exp} navigate={props.navigation.navigate} />
                                                                            </View>
                                                                        )
                                                                    }) : false
                                                                }
                                                                <View style={{ height: height * 0.12 }} />
                                                            </ScrollView>

                                                        </View>
                                                    )
                                                })
                                            }
                                        </Swiper>
                                    }
                                </View>
                                : <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: RFValue(30) }}>                        
                                    <Text style={style.info}>Não há despesa cadastrada. </Text>
                                    <View style={[style.info, { flexDirection: 'row' }]}>
                                        <Text style={style.info}>Clique</Text>
                                        <TouchableWithoutFeedback onPress={() => {
                                            EditExpenseController.currentExpense = null;
                                            props.navigation.navigate('StackIncludeExpense');
                                        }}>
                                            <View>
                                                <Text style={[style.info, { fontWeight: 'bold', color: 'blue' }]}> aqui </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <Text style={style.info}>para cadastrar</Text>
                                    </View>
                                    <Text style={style.info}>sua primeira despesa</Text>
                                    <Text style={style.info}>ou no botão de adicionar.</Text>
                                </View>
                            }

                            {/* BOTÃO ACRESCENTAR DESPESA -> Abre modal velocimetro */}
                            <View style={style.button} >
                                <TouchableOpacity onPress={() => {
                                    EditExpenseController.currentExpense = null;
                                    props.navigation.navigate('StackIncludeExpense');
                                }}>
                                    <Icon name='plus' size={RFValue(35)} color={DefaultStyles.colors.botao} />
                                </TouchableOpacity>
                            </View>
                        </>}
                </View>
            </View >
        </>
    )
}

const style = StyleSheet.create({
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        borderTopLeftRadius: RFValue(25),
        width: '100%',
    },
    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',

    },
    cardExpense: {
        height: height * 0.14,
        padding: RFValue(10),
        flexDirection: 'row',
        width: '100%'
    },
    icon: {
        width: width * 0.128,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textExpense: {
        fontSize: RFValue(20),
        color: '#333'
    },
    textButton: {
        textAlign: 'center',
        color: DefaultStyles.colors.tabBar,
        fontWeight: '500'
    },
    textSummary: {
        fontSize: RFValue(22),
        color: DefaultStyles.colors.tabBar,
    },
    button: {
        height: height > 700 ? RFValue(height * 0.082) : RFValue(height * 0.099),
        width: height > 700 ? RFValue(height * 0.082) : RFValue(height * 0.099),
        backgroundColor: DefaultStyles.colors.tabBar,
        borderRadius: height > 700 ? RFValue(height * 0.082 / 2) : RFValue(height * 0.099 / 2),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: RFValue(15),
        right: RFValue(15)
    },
    wrapper: {

    },
    buttonTextRight: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        right: RFValue(50),
        bottom: RFPercentage(height < 700 ? 25 : 28)
    },
    buttonTextLeft: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        left: RFValue(50),
        bottom: RFPercentage(height < 700 ? 25 : 28)
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width: width,
        height: RFValue(400),
        marginTop: RFValue(20)
    },
    info: {
        fontFamily: 'verdana',
        fontSize: RFValue(16),
        textAlign: 'center',
        color: '#000'
    }
})

export default ViewExpense;