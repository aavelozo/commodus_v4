import React, { useState, useCallback, useRef } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView, TouchableWithoutFeedback, Switch, Text } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import Observations from '../../../components/expenses/Observations';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import Establishment from '../../../components/expenses/Establishment';
import AuthController from '../../../../controllers/AuthController';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import Vehicles from '../../../../database/models/Vehicles';
import { BaseExpense } from './BaseExpense';

const { width, height } = Dimensions.get('window')


/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function MechanicsExpense(props): JSX.Element {
    const selectServiceRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const [serviceList, setServiceList] = useState(['Manutenção de freios', 'Alinhamento e balanceamento', 'Troca de correias e tensores', 'Troca de velas', 'Diagnóstico', 'Reparo de suspensão', 'Troca de bateria', 'Troca de sistema de escape', 'Serviço de ar condicionado']);
    const [service, setService] = useState('Serviço realizado');
    const [isEnabled, setIsEnabled] = useState(false);
    const [dateReminder, setDateReminder] = useState(null);


    useFocusEffect(useCallback(() => {
        console.log('INIT MechanicExpense.useFocusEffect.useCallBack', props.navigation);
        if (!loaded) {
            if (!loading) setLoading(true);
            (async () => {
                try {
                    console.log('loading expense...');
                    if (EditExpenseController.currentExpense) {
                        console.log('loading states...');

                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);
                        let dataExpense = EditExpenseController.currentExpense.data();

                        setTotalValue(dataExpense.totalValue || 0);

                        //specific properties             
                        setService(dataExpense.othersdatas.service || null);
                        if (dataExpense.othersdatas.dateReminder) {
                            setDateReminder(new Date(dataExpense.othersdatas.dateReminder.seconds * 1000 + dataExpense.othersdatas.dateReminder.nanoseconds / 1000000));
                        } else {
                            setDateReminder(null);
                        }
                        setIsEnabled(dataExpense.othersdatas.dateReminder ? true : false);
                    } else {
                        clearStates();
                    }

                    console.log('loading expense... ok');
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoaded(true);
                    setLoading(false);
                }
            })();
        }        
    }, []));


    function clearStates() {
        console.log('clearing states ...');
        setCurrentExpense(null);
        setTotalValue(0);

        //specific properties
        setService(null);
        setDateReminder(null);
        setIsEnabled(false);
        if (selectServiceRef) {
            selectServiceRef.current?.reset();
        }
    }


    function isMissingData() {
        let result = false;
        if (!totalValue) {
            result = true;
        } 
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            service: service,
            dateReminder: isEnabled ? dateReminder : false
        }
    }

    return (
        <BaseExpense
            title='mechanic expense'
            type='MECHANIC'
            loading={loading}
            setLoading={setLoading}
            loaded={loaded}
            setLoaded={setLoaded}
            saving={saving}
            setSaving={setSaving}
            currentExpense={currentExpense}
            setCurrentExpense={setCurrentExpense}
            clearStates={clearStates}
            isMissingData={isMissingData}
            getOthersDatas={getOthersDatas}
            totalValue={totalValue}
        >
        
            {/* dropdown: usado para selecionar o serviço e atualizar o txtinput */}
            <SelectDropdown
                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                search={true}
                showsVerticalScrollIndicator={true}
                data={serviceList}
                defaultValue={service}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Serviço'
                                value={selectedItem}
                                pointerEvents="none"
                                readOnly
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                        <Text style={DefaultStyles.dropdownText}>{item}</Text>
                    </View>);
                }}
                onSelect={(selectedItem, index) => {
                    setService(selectedItem);
                }}
                ref={selectServiceRef}
            />


            {/* PREÇO TOTAL */}
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInput}
                error={missingData && !totalValue}
                keyboardType='numeric'
                label='* Preço Total'
                onChangeText={value => setTotalValue(Utils.toNumber(value))}
                value={totalValue.toString()}
            />

            <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                <Switch
                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                    thumbColor={isEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={enabled => setIsEnabled(enabled)}
                    value={isEnabled}
                />
                <TouchableWithoutFeedback
                    onPress={() => setIsEnabled(!isEnabled)}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        Lembrete revisão do serviço
                    </Text>
                </TouchableWithoutFeedback>
            </View>

            {
                isEnabled ? <DateComponent date={dateReminder} setDate={setDateReminder} /> : false
            }

        </BaseExpense>
    );
};

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
    },
    espacoCentral: {
        backgroundColor: 'black',
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: "100%",
        backgroundColor: DefaultStyles.colors.fundoInput,
        height: height / 14,
        marginBottom: RFValue(15),
        borderRadius: RFValue(5),
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(20),
        alignSelf: 'center',
        justifyContent: 'center',

    },
    viewExpense: {
        flex: 1,
        width: width * 0.9,
        alignItems: 'center',
    },

});

export default MechanicsExpense;