import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Velo from '../../assets/iconSvg/velo.svg'
import Oil from '../../assets/iconSvg/oil.svg'
import Media from '../../assets/iconSvg/media.svg'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Header from '../../components/Header'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from 'moment'
import 'moment/locale/pt-br'
import { DefaultStyles } from '../../DefaultStyles'
import ExpenseComparison from '../../components/graphs/ExpenseComparison'
import CashFlow from '../../components/graphs/CashFlow'
import PercentageExpenses from '../../components/graphs/PercentageExpenses'
import ExpenseLastYear from '../../components/graphs/ExpenseLastYear'
import _ from "lodash";
import Utils from '../../../controllers/Utils'
import EditExpenseController from '../../../controllers/EditExpenseController'
import Vehicles from '../../../database/models/Vehicles'
import Trans from '../../../controllers/internatiolization/Trans'
const { height, width } = Dimensions.get('window')


function Dashboard(props): JSX.Element {
    const [expensesFirstGraph, setExpensesFirstGraph] = useState([])
    const [expensesSecondGraph, setExpensesSecondGraph] = useState([])
    const [expensesThirdGraph, setExpensesThirdGraph] = useState([])
    const [expensesFourthGraph, setExpensesFourthGraph] = useState([])
    const [carsThisUser, setCarsThisUser] = useState([])
    const [months, setMonths] = useState([])
    const [changeCar, setChangeCar] = useState(0)
    const [refreshing, setRefreshing] = useState(false);
    const [change, setChange] = useState(false);


    const [changeOil, setChangeOil] = useState([])
    // const [showModal, setShowModal] = useState(true)
    const [loading, setLoading] = useState(true)
    const indexDateFlatlist = useRef(0)
    const monthlyExpensesRef = useRef(0)
    const [date, setDate] = useState(moment(new Date()).format("MM/YY"))
    const anoatual = moment(new Date()).format("YY")


    useEffect(() => {
        async function getExpenses() {
            try {
                setLoading(true)
                const cars = await getExpensesThisUser()
                setCarsThisUser(cars)
                getDataForGraph(cars[changeCar])
                getExpensesForMonth(cars[changeCar]);
            } catch (e) {
                console.log('error in Dashboard.useEffect -> async getExpenses', e);
            }
        }
        getExpenses()
        setLoading(false)
    }, [date, changeCar])


    useFocusEffect(useCallback(() => {
        EditExpenseController.currentExpense = null;
        async function getExpenses() {
            try {
                setLoading(true)
                const cars = await getExpensesThisUser()
                getDataForGraph(cars[changeCar])
                getExpensesForMonth(cars[changeCar])
                console.log('cars', cars[changeCar])
                setLoading(false);
            } catch (e) {
                console.log('error in Dashboard.useFocusEffect -> async getExpenses', e);
            }
        }
        getExpenses();
    }, []))

    const montaMeses = (datamenor: Number, datamaior: Number) => {
        var quantidade = (Math.ceil((Number(datamaior) - Number(datamenor)) / 1000 / 60 / 60 / 24 / 30))
        if (quantidade < 3) quantidade = 3;
        
        let inicio = moment(Number(datamenor)).format('MM/YY')
        let meses = []
        for (let i = 0; i < quantidade; i++) {
            let [mes, ano] = inicio.split('/')
            mes = parseInt(mes)
            ano = parseInt(ano)
            let mesStr = Utils.abbreviatedMonths[mes - 1]
            let texto = Trans.t(mesStr) + '/' + ano;
            let id = mes.toString().padStart(2, '0') + '/' + ano;
            meses.push({ "id": id, "text": texto })
            if (date == id) {
                indexDateFlatlist.current = i
            }
            mes++
            if (mes > 12) {
                mes = 1
                ano++
            }
            inicio = mes.toString().padStart(2, '0') + '/' + ano
        }
        setMonths(meses)
    }

    async function getExpensesThisUser() {
        let carros = [];
        let maior = 0;
        let menor = 9999999999999;

        let newVehicles = await Vehicles.getDBData();
        for (let k in newVehicles.docs) {
            let newVehicle = {
                id: newVehicles.docs[k].id,
                plate: newVehicles.docs[k].data().plate,
                idEngineType: newVehicles.docs[k].data().idEngineType,
                km: newVehicles.docs[k].data().km,
                model: newVehicles.docs[k].data().model.id,
                brand: newVehicles.docs[k].data().model.parent.parent.id,
                preferedFuel: newVehicles.docs[k].data().preferedFuel,
                color: newVehicles.docs[k].data().color,
                photo: newVehicles.docs[k].data().photo,
                vehicleName: `${newVehicles.docs[k].data().model.id}-${newVehicles.docs[k].data().plate}`,
                expenses: []
            };
            let despesas = []
            let completo = {}
            let newExpensesCollection = await newVehicles.docs[k].ref.collection('expenses').get();

            for (let j in newExpensesCollection.docs) {
                let newExpense = {
                    id: newExpensesCollection.docs[j].id,
                    ...newExpensesCollection.docs[j].data()
                }
                var miliseg = newExpense.date.seconds * 1000 + newExpense.date.nanoseconds / 1000000
                console.log(miliseg)
                if (maior < miliseg) {
                    maior = miliseg;
                }
                if (menor > miliseg) {
                    menor = miliseg;
                }
                if (newExpense.date && typeof newExpense.date == 'object' && newExpense.date.seconds) {
                    newExpense.date = new Date(miliseg);
                }
                newExpense.totalValue = Utils.toNumber(newExpense.totalValue || null);
                despesas.push(newExpense);
                newVehicle.expenses.push(newExpense);
            };
            completo.vehicle = newVehicle;
            completo.despesas = despesas;
            carros.push(completo)
        };
        montaMeses(menor, maior)
        return carros;
    }

    const convertDate = () => {
        var parts = date.split('/')
        var month = parts[0]
        var year = parts[1]
        if (month == '01') {
            year = Number(year) - 1
            month = Number(12)
        } else {
            var dateAdjusted;
            month = Number(month) - 1
            if (Number(month) < 11) {
                dateAdjusted = `0${month}/${year}`
            } else {
                dateAdjusted = `${month}/${year}`
            }
        }
        return dateAdjusted
    }

    const getDataForGraph = (car) => {
        try {
            var gastodomesanterior = 0
            var gastodomes = 0
            var gastoCombustivel = 0
            var gastoOleo = 0
            var gastoDocumentos = 0
            var gastoMecanica = 0
            var gastoBorracharia = 0
            var gastoAparencia = 0
            var gastoOutros = 0
            var totalizador01 = 0
            var totalizador05 = 0
            var totalizador10 = 0
            var totalizador15 = 0
            var totalizador20 = 0
            var totalizador25 = 0
            var totalizador31 = 0

            car?.despesas?.map(despesa => {
                var dateFormatted = moment(despesa.date).format('MM/YY');
                var dateLastMonth = convertDate()
                var dayExpense = moment(despesa.date).format('DD')
                if (dateFormatted == date) {
                    if (Number(dayExpense) <= 1) {
                        totalizador01 += despesa.totalValue
                    } else if (Number(dayExpense) <= 5) {
                        totalizador05 += despesa.totalValue
                    } else if (Number(dayExpense) <= 10) {
                        totalizador10 += despesa.totalValue
                    } else if (Number(dayExpense) <= 15) {
                        totalizador15 += despesa.totalValue
                    } else if (Number(dayExpense) <= 20) {
                        totalizador20 += despesa.totalValue
                    } else if (Number(dayExpense) <= 25) {
                        totalizador25 += despesa.totalValue
                    } else if (Number(dayExpense) <= 31) {
                        totalizador31 += despesa.totalValue
                    }
                    if (despesa.type == 'FUEL') {
                        gastoCombustivel += despesa.totalValue
                    } else if (despesa.type == 'OIL') {
                        gastoOleo += despesa.totalValue
                    } else if (despesa.type == 'MECHANIC') {
                        gastoMecanica += despesa.totalValue
                    } else if (despesa.type == 'DOCUMENT') {
                        gastoDocumentos += despesa.totalValue
                    } else if (despesa.type == 'RUBBER') {
                        gastoBorracharia += despesa.totalValue
                    } else if (despesa.type == 'APPEARANCE') {
                        gastoAparencia += despesa.totalValue
                    } else if (despesa.type == 'OTHER') {
                        gastoOutros += despesa.totalValue
                    } else {
                        console.log('erro' + despesa.type)
                    }
                    gastodomes += despesa.totalValue
                } else if (dateFormatted == dateLastMonth) {
                    gastodomesanterior += despesa.totalValue
                }
            })
            monthlyExpensesRef.current = gastodomes
            setExpensesFirstGraph([{ x: 'anterior', y: gastodomesanterior }, { x: 'atual', y: gastodomes }])
            setExpensesSecondGraph([{
                x: `01/${date?.slice(0, 2)}`, y: totalizador01
            }, {
                x: `05/${date?.slice(0, 2)}`, y: totalizador05 + totalizador01
            }, {
                x: `10/${date?.slice(0, 2)}`, y: totalizador10 + totalizador05 + totalizador01
            }, {
                x: `15/${date?.slice(0, 2)}`, y: totalizador15 + totalizador10 + totalizador05 + totalizador01
            }, {
                x: `20/${date?.slice(0, 2)}`, y: totalizador20 + totalizador15 + totalizador10 + totalizador05 + totalizador01
            }, {
                x: `25/${date?.slice(0, 2)}`, y: totalizador25 + totalizador20 + totalizador15 + totalizador10 + totalizador05 + totalizador01
            }, {
                x: `31/${date?.slice(0, 2)}`, y: totalizador31 + totalizador25 + totalizador20 + totalizador15 + totalizador10 + totalizador05 + totalizador01
            }])
            setExpensesThirdGraph([{ x: 'fuel', y: gastoCombustivel, color: "#f47476" }, { x: 'oil', y: gastoOleo, color: "#B8DBF2" }, { x: 'document', y: gastoDocumentos, color: "#9BC995" }, { x: 'mechanic', y: gastoMecanica, color: "#FFD38E" }, { x: 'appearence', y: gastoAparencia, color: "#D0A9F5" }, { x: 'others', y: gastoOutros, color: "#e9f143" }, { x: 'tyre', y: gastoBorracharia, color: "#F8B6D3" }])
        } catch (e) {
            console.log('e1', e);
        }
    }

    const getExpensesForMonth = (car) => {
        try {
            var datames01 = moment(new Date()).format('MM/YY')
            var datames02 = moment(new Date()).subtract(1, 'months').format('MM/YY')
            var datames03 = moment(new Date()).subtract(2, 'months').format('MM/YY')
            var datames04 = moment(new Date()).subtract(3, 'months').format('MM/YY')
            var datames05 = moment(new Date()).subtract(4, 'months').format('MM/YY')
            var datames06 = moment(new Date()).subtract(5, 'months').format('MM/YY')
            var datames07 = moment(new Date()).subtract(6, 'months').format('MM/YY')
            var datames08 = moment(new Date()).subtract(7, 'months').format('MM/YY')
            var datames09 = moment(new Date()).subtract(8, 'months').format('MM/YY')
            var datames10 = moment(new Date()).subtract(9, 'months').format('MM/YY')
            var datames11 = moment(new Date()).subtract(10, 'months').format('MM/YY')
            var datames12 = moment(new Date()).subtract(11, 'months').format('MM/YY')

            var mes01 = 0
            var mes02 = 0
            var mes03 = 0
            var mes04 = 0
            var mes05 = 0
            var mes06 = 0
            var mes07 = 0
            var mes08 = 0
            var mes09 = 0
            var mes10 = 0
            var mes11 = 0
            var mes12 = 0
            car?.despesas?.map(desp => {
                var dateDesp = moment(desp.date).format('MM/YY')
                if (datames01 == dateDesp) {
                    mes01 += desp.totalValue
                } else if (datames02 == dateDesp) {
                    mes02 += desp.totalValue
                } else if (datames03 == dateDesp) {
                    mes03 += desp.totalValue
                } else if (datames04 == dateDesp) {
                    mes04 += desp.totalValue
                } else if (datames05 == dateDesp) {
                    mes05 += desp.totalValue
                } else if (datames06 == dateDesp) {
                    mes06 += desp.totalValue
                } else if (datames07 == dateDesp) {
                    mes07 += desp.totalValue
                } else if (datames08 == dateDesp) {
                    mes08 += desp.totalValue
                } else if (datames09 == dateDesp) {
                    mes09 += desp.totalValue
                } else if (datames10 == dateDesp) {
                    mes10 += desp.totalValue
                } else if (datames11 == dateDesp) {
                    mes11 += desp.totalValue
                } else if (datames12 == dateDesp) {
                    mes12 += desp.totalValue
                }
            })
            setExpensesFourthGraph([{ x: datames12, y: mes12 }, { x: datames11, y: mes11 }, { x: datames10, y: mes10 }, { x: datames09, y: mes09 },
            { x: datames08, y: mes08 }, { x: datames07, y: mes07 }, { x: datames06, y: mes06 }, { x: datames05, y: mes05 },
            { x: datames04, y: mes04 }, { x: datames03, y: mes03 }, { x: datames02, y: mes02 }, { x: datames01, y: mes01 }])
        } catch (e) {
            console.log('e2', e);
        }

    }   

    const handlePreviousCar = () => {
        if (changeCar == 0) {
            setLoading(true)
            setChangeCar(carsThisUser.length - 1)
        } else {
            setLoading(true)
            setChangeCar(changeCar - 1)
        }

    }

    const handleNextCar = () => {
        if (changeCar < carsThisUser.length - 1) {
            setChangeCar(changeCar + 1)
        } else {
            setChangeCar(0)
        }

    }

    return (
        <>
            <Header />
            <View style={style.title}>
                {/* barra de rolagem no topo, onde mostra as datas */}
                <View style={{ flex: 1, width: '100%' }}>

                    <FlatList
                        horizontal={true}
                        data={months}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        // initialScrollIndex={months.length - 2}
                        // getItemLayout={getItemLayout}
                        renderItem={({ item }) => {
                            const actualDate = { borderBottomWidth: 2, borderColor: '#fff' }
                            return (
                                <View style={{ width: width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableWithoutFeedback onPress={() => {
                                        setLoading(true)
                                        setDate(item.id)
                                    }}>
                                        <Text style={[date == item.id ? actualDate : false, { color: '#fff' }]}>{item.text}</Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        }}
                    />
                </View>


                <View style={style.espacoCentral}>
                    <View style={{ flex: 1, paddingTop: RFValue(20) }}>
                        <View >
                            <View style={{ width: '100%', flexDirection: 'row' }}>

                                <View style={{ width: '20%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    {carsThisUser.length > 1 ?
                                        <TouchableWithoutFeedback onPress={() => handlePreviousCar()}>
                                            <FontAwesome name='chevron-left' size={RFValue(25)} color={DefaultStyles.colors.tabBar} />
                                        </TouchableWithoutFeedback>
                                        : false}
                                </View>

                                < View style={{ alignSelf: 'center', borderBottomWidth: RFValue(0.5), borderBottomColor: DefaultStyles.colors.tabBar, height: height * 0.06, justifyContent: 'center', alignItems: 'center', width: '60%' }}>
                                    <Text style={style.textSummary}>{carsThisUser[changeCar]?.vehicle?.vehicleName}</Text>
                                    <Text style={[style.textSummary, { fontSize: RFValue(16), paddingBottom: RFValue(5) }]}>{_.capitalize(Trans.t('expenses of the month'))}: R${((expensesFirstGraph[1] || {}).y || 0).toFixed(2)}</Text>

                                </View>

                                <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    {carsThisUser.length > 1 ?
                                        <TouchableWithoutFeedback onPress={() => handleNextCar()}>
                                            <FontAwesome name='chevron-right' size={RFValue(25)} color={DefaultStyles.colors.tabBar} />
                                        </TouchableWithoutFeedback>
                                        : false}
                                </View>


                            </View>

                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: RFValue(10), }}>
                                <Velo width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), marginLeft: RFValue(5), color: DefaultStyles.colors.tabBar, }}>{_.capitalize(Trans.t('odometer'))}:</Text>
                                <Text style={{ fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}> {carsThisUser[changeCar]?.vehicle?.km} km</Text>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', }}>
                                <Media width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), marginLeft: RFValue(5), color: DefaultStyles.colors.tabBar, }}>{_.capitalize(Trans.t('average'))}: </Text>
                                <Text style={{ fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>10km / {Trans.t('liter')}</Text>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', }}>
                                <Oil width={RFValue(21)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), marginLeft: RFValue(5), color: DefaultStyles.colors.tabBar, }}>{_.capitalize(Trans.t('next oil change'))}: </Text>
                                <Text style={{ fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>{carsThisUser[changeCar]?.vehicle?.oilChange != null ? carsThisUser[changeCar]?.vehicle?.oilChange : '--'} km</Text>
                            </View>


                        </View>
                        {loading ?
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.0)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'black' }}>
                                <ActivityIndicator size="large" color={DefaultStyles.colors.tabBar} />
                            </View> :
                            <ScrollView >

                                <>
                                    <ExpenseComparison data={expensesFirstGraph} monthlyExpenses={monthlyExpensesRef} />
                                    <CashFlow data={expensesSecondGraph} monthlyExpenses={monthlyExpensesRef} />
                                    <PercentageExpenses data={expensesThirdGraph} monthlyExpenses={monthlyExpensesRef} />
                                    <ExpenseLastYear data={expensesFourthGraph} />
                                    <View style={{ height: RFValue(50) }}></View>
                                </>

                            </ScrollView>
                        }
                    </View>
                </View >
            </View >
        </>

    )
}

const style = StyleSheet.create({
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 15,
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
    textLegend: {
        fontSize: RFValue(17)
    },
    textSummary: {
        fontSize: RFValue(22),
        color: DefaultStyles.colors.tabBar,
    },
    button: {
        height: height * 0.082,
        width: height * 0.082,
        backgroundColor: DefaultStyles.colors.tabBar,
        borderRadius: height * 0.082 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: RFValue(15),
        right: RFValue(15)
    },
    titleGraph: {
        alignSelf: 'flex-start',
        marginTop: RFValue(5),
        fontSize: RFValue(14),
        marginLeft: RFValue(10),
        color: DefaultStyles.colors.tabBar,
    },
    buttonTextRight: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        right: RFValue(50),
        bottom: RFPercentage(height < 700 ? 30 : 32)
    },
    buttonTextLeft: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        left: RFValue(50),
        bottom: RFPercentage(height < 700 ? 30 : 32)
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width: width,
        height: RFValue(400),
        marginTop: RFValue(20)
    }
});

export default Dashboard;