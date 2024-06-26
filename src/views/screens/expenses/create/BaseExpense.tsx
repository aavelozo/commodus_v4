import React, { useRef, useState, useCallback } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import TitleView from '../../../components/TitleView';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import { DefaultStyles } from '../../../DefaultStyles';
import { HelperText, Text, TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { DefaultProps } from '../../../DefaultProps';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import Establishment from '../../../components/expenses/Establishment';
import Observations from '../../../components/expenses/Observations';
import Utils from '../../../../controllers/Utils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import Vehicles from '../../../../database/models/Vehicles';
import Trans from '../../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';




/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function BaseExpense(props): JSX.Element {
    const navigation = useNavigation();
    const selectVehicleRef = useRef();
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [vehicles, setVehicles] = useState([]);   
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [date, setDate] = useState(new Date());
    const [km, setKM] = useState('');
    const [establishment, setEstablishment] = useState('');
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(false);
    const [observations, setObservations] = useState('');
    const [isEnabledObservations, setIsEnabledObservations] = useState(false);
    


    useFocusEffect(useCallback(() => {
        console.log('INIT BaseExpense.useFocusEffect.useCallBack',props.loading,props.loaded);
        console.log('xxx',Utils.firstValid([props.hasEstablishment,true]),props.hasEstablishment);
        if (!props.loading && !props.loaded) {
            props.setLoading(true);
            (async()=>{
                try {
                    console.log('loading expense...');
                    let newVehicles = await Vehicles.getSingleData();
                    setVehicles(newVehicles);                                        
                    console.log('EditExpenseController.currentExpense',EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) { 
                        console.log('loading states...');             
                        //default properties    
                        props.setCurrentExpense(EditExpenseController.currentExpense);  
                        let vehicleId = EditExpenseController.currentExpense.ref.parent.parent.id;
                        setSelectedVehicle(newVehicles.find(el=>el.id == vehicleId));
                        console.log('loading states...2');
                        let dataExpense = EditExpenseController.currentExpense.data();
                        //date in firestore is object {"nanoseconds": 743000000, "seconds": 1713185626}
                        if (EditExpenseController.currentExpense.data().date) {
                            setDate(new Date(dataExpense.date.seconds * 1000 + dataExpense.date.nanoseconds / 1000000));
                        } else {
                            setDate(new Date());
                        }                        
                        setKM(dataExpense.actualkm||'');
                        console.log('loading states...2.1');
                        setEstablishment(dataExpense.establishment||'');
                        setIsEnabledEstablishment(dataExpense.establishment?true:false);
                        setObservations(dataExpense.observations||'');
                        console.log('loading states...2.2');
                        setIsEnabledObservations(dataExpense.observations?true:false);

                    } else {
                       clearStates();
                    }

                    console.log('loading expense... ok');
                } catch (e) {
                    console.log(e);                    
                } finally {
                    //props.setLoaded(true);
                    //props.setLoading(false);                    
                }
            })();
        }
    }, [navigation]));

 
    async function saveExpense() {
        try {
            if (!props.isMissingData() && date && selectedVehicle) {      
                props.setSaving(true);     
                console.log('idVehicle',selectedVehicle.id);
                let vehicle = (await Vehicles.getDBData())?.docs.find(el=>el.id == selectedVehicle.id);
                if (props.currentExpense) {
                    //update                    
                    await props.currentExpense.ref.update({
                        type: props.type || 'BASE',
                        date: date,
                        actualkm: km,
                        totalValue: props.totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: props.getOthersDatas()
                    });                    
                } else {
                    //create
                    let newExpense = await vehicle.ref.collection('expenses').add({
                        type: props.type || 'BASE',
                        date: date,
                        actualkm: km,
                        totalValue: props.totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: props.getOthersDatas()
                    });                    
                }
                goBack();
                Utils.toast("success",_.capitalize(Trans.t("successfull saved data")));
            } else {
                setMissingData(true);
                Utils.toast("error",_.capitalize(Trans.t("missing data")));
            }
        } catch (e) {
            Utils.showError(e);
        } finally {
            props.setSaving(false);
        }
    }

    function clearStates(){
        console.log('clearing states ...');
        props.setCurrentExpense(null);                
        setSelectedVehicle(null);
        setDate(new Date());
        setKM('');
        setEstablishment('');
        setIsEnabledEstablishment(false);
        setObservations('');
        setIsEnabledObservations(false);

        //specific properties
        props.clearStates();

        if (selectVehicleRef) {
            selectVehicleRef.current?.reset();
        }
    }

    goBack = () => {
        EditExpenseController.currentExpense = null;
        clearStates();
        navigation.goBack();
    };


    return (
        <View style={style.container}>
            <Header 
                withButtons={true} 
                onPressConclude={saveExpense} 
                onPressCancel={goBack} 
                saving={props.loading || props.saving}
            />
            <View style={style.espacoCentral}>
                <TitleView title={_.capitalize(Trans.t(props?.title || props.route.title || 'Base Expense'))} />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}                        
                        <SelectDropdown
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true}                            
                            data={vehicles}
                            defaultValue={selectedVehicle}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label={`* ${_.capitalize(Trans.t('vehicle'))}`}
                                            value={selectedItem ? selectedItem.vehicleName || selectedItem.plate : ''}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                        <HelperText
                                            style={DefaultStyles.defaultHelperText}            
                                            type="error"
                                            visible={missingData && !selectedVehicle}
                                        >
                                            {_.capitalize(Trans.t('select a vehicle'))}
                                        </HelperText> 
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                        <Text style={DefaultStyles.dropdownText}>{item.vehicleName || item.plate }</Text>
                                </View>);
                            }}
                            onSelect={(selectedItem, index) => {
                                setKM(selectedItem.km)
                                setSelectedVehicle(selectedItem);
                            }}
                            ref={selectVehicleRef}
                        />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} error={missingData && !date} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />  
                        {!props.childrenAfterEstablishment && props.children}
                        {Utils.firstValid([props.hasEstablishment,true]) && <Establishment
                            isEnabled={isEnabledEstablishment}
                            establishment={establishment}
                            setIsEnabled={setIsEnabledEstablishment}
                            setEstablishment={setEstablishment}
                        /> && <HelperText
                            style={DefaultStyles.defaultHelperText}            
                            type="error"
                            visible={false}
                        >
                            {_.capitalize(Trans.t('enter a value'))}
                        </HelperText>
                        }
                        {props.childrenAfterEstablishment && props.children}
                        {Utils.firstValid([props.hasObservations,true]) && <Observations
                            isEnabled={isEnabledObservations}
                            observations={observations}
                            setIsEnabled={setIsEnabledObservations}
                            setObservations={setObservations}
                        /> && <HelperText
                            style={DefaultStyles.defaultHelperText}            
                            type="error"
                            visible={false}
                        >
                            {_.capitalize(Trans.t('enter a value'))}
                        </HelperText>}                      
                    </ScrollView>
                </ContentContainer>
            </View >
        </View>
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
    }
});

export {BaseExpense};