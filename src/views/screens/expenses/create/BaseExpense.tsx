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
import { schedulReminderNotification } from '../../../components/Notification';
import moment from 'moment';

/**
 * Create/edit base expense, to reuse in others expenses, contains default fields to reuse and save method
 * @param props 
 * @returns 
 * @author Alencar
 */
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
        console.log('INIT BaseExpense.useFocusEffect.useCallBack', props.loading, props.loaded);
        console.log('xxx', Utils.firstValid([props.hasEstablishment, true]), props.hasEstablishment);
        if (!props.loading && !props.loaded) {
            props.setLoading(true);
            (async () => {
                try {
                    console.log('loading expense...');
                    let newVehicles = await Vehicles.getSingleData();
                    setVehicles(newVehicles);
                    console.log('EditExpenseController.currentExpense', EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) {
                        console.log('loading states...');
                        //default properties    
                        props.setCurrentExpense(EditExpenseController.currentExpense);
                        let vehicleId = EditExpenseController.currentExpense.ref.parent.parent.id;
                        setSelectedVehicle(newVehicles.find(el => el.id == vehicleId));
                        console.log('loading states...2');
                        let dataExpense = EditExpenseController.currentExpense.data();
                        //date in firestore is object {"nanoseconds": 743000000, "seconds": 1713185626}
                        if (EditExpenseController.currentExpense.data().date) {
                            setDate(new Date(dataExpense.date.seconds * 1000 + dataExpense.date.nanoseconds / 1000000));
                        } else {
                            setDate(new Date());
                        }
                        setKM(Utils.toNumericText(dataExpense.actualkm || ''));
                        console.log('loading states...2.1');
                        setEstablishment(dataExpense.establishment || '');
                        setIsEnabledEstablishment(dataExpense.establishment ? true : false);
                        setObservations(dataExpense.observations || '');
                        console.log('loading states...2.2');
                        setIsEnabledObservations(dataExpense.observations ? true : false);

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


    /**
     * save expense on cloud and persist on app
     * @author Alencar
     */
    async function saveExpense() {
        try {
            const getOthersDatas = props.getOthersDatas()
            if (!props.isMissingData() && date && selectedVehicle) {
                props.setSaving(true);
                console.log('idVehicle', selectedVehicle.id);
                let vehicle = (await Vehicles.getDBData())?.docs.find(el => el.id == selectedVehicle.id);

                // if (vehicle._data.reminders.nextOilChange.reminderKM <= vehicle._data.km) {
                //     console.log(vehicle._data.reminders.nextOilChange.reminderKM)
                //     console.log(vehicle._data.km)
                // }
                // console.log('vehicle._data.reminders')
                //COM-75 SAVE NEXT OIL CHANGE REMINDER
                if (typeof props.getVehicleReminders == 'function') {
                    let vehicleReminders = props.getVehicleReminders();
                    if (Utils.hasValue(vehicleReminders)) {
                        if (Utils.hasValue(vehicle.reminders)) {
                            vehicleReminders = { ...vehicle.reminders, ...vehicleReminders };
                        }
                        if (Utils.toNumber(vehicleReminders.nextOilChange?.reminderKM || 0) < Utils.toNumber(vehicle.data().km || 0) && getOthersDatas.reminderMonths <= 0) {
                            throw new Error(Trans.t('msg_error_on_save_reminder_km'));
                        }
                        await vehicle.ref.update({
                            reminders: vehicleReminders
                        });
                    }
                }


                if (props.currentExpense) {
                    //update                    
                    await props.currentExpense.ref.update({
                        type: props.type || 'BASE',
                        date: date,
                        actualkm: Utils.hasValue(km) ? Utils.toNumber(km) : null,
                        totalValue: Utils.hasValue(props.totalValue) ? Utils.toNumber(props.totalValue) : null,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: getOthersDatas
                    });
                } else {
                    //create
                    let newExpense = await vehicle.ref.collection('expenses').add({
                        type: props.type || 'BASE',
                        date: date,
                        actualkm: Utils.hasValue(km) ? Utils.toNumber(km) : null,
                        totalValue: Utils.hasValue(props.totalValue) ? Utils.toNumber(props.totalValue) : null,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: getOthersDatas
                    });
                }
                var title;
                console.log(getOthersDatas)
                console.log('getOthersDatas')
                console.log(props.type)
                console.log('props.type')
                var body;
                if (getOthersDatas.reminderMonths) {
                    const reminderDate = moment(new Date()).add(Number(getOthersDatas.reminderMonths), 'seconds')
                    const dateFormat = moment(reminderDate).format()
                    title = `${_.capitalize(Trans.t('time to change the oil!'))}`
                    body = Trans.t(`It's time to change your vehicle's oil. Keep the engine running smoothly.`)
                    schedulReminderNotification(new Date(dateFormat), title, body)
                } else if (getOthersDatas.dateReminder && props.type == 'MECHANIC') {
                    const dateFormat = moment(getOthersDatas.dateReminder).format()
                    title = `${_.capitalize(Trans.t('pending mechanical review'))}`
                    body = Trans.t(`It's time to schedule a review! Check brakes, engine and other essential components.`)
                    schedulReminderNotification(new Date(dateFormat), title, body)
                } else if (getOthersDatas.dateReminderAlignment) {
                    const dateFormat = moment(getOthersDatas.dateReminderAlignment).format()
                    title = `${_.capitalize(Trans.t('time to align your tires!'))}`
                    body = Trans.t(`Your vehicle needs alignment. Ensure stable and safe driving.`)
                    schedulReminderNotification(new Date(dateFormat), title, body)
                } else if (getOthersDatas.dateReminder && props.type == 'OTHER') {
                       const dateFormat = moment(getOthersDatas.dateReminder).format()
                    title = `${_.capitalize(Trans.t('pending expense reminder'))}`
                    body = Trans.t(`You registered a generic expense. Don't forget to check it or carry out the necessary maintenance.`)
                    schedulReminderNotification(new Date(dateFormat), title, body)
                }
                if (getOthersDatas.dateReminderBalancing) {
                    const dateFormat = moment(getOthersDatas.dateReminderBalancing).format()
                    title = `${_.capitalize(Trans.t('time to balance the tires!'))}`
                    body = Trans.t(`Schedule tire balancing to prevent uneven wear and improve driving comfort`)
                    schedulReminderNotification(new Date(dateFormat), title, body)
                }
                goBack();
                Utils.toast("success", _.capitalize(Trans.t("successfull saved data")));
            } else {
                setMissingData(true);
                Utils.toast("error", _.capitalize(Trans.t("missing data")));
            }
        } catch (e) {
            Utils.showError(e);
        } finally {
            props.setSaving(false);
        }
    }

    function clearStates() {
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
                                            value={selectedItem ? selectedItem.vehicleName || selectedItem?.plate?.toUpperCase() : ''}
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
                                return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Text style={DefaultStyles.dropdownText}>{item.vehicleName || item.plate?.toUpperCase()}</Text>
                                </View>);
                            }}
                            onSelect={(selectedItem, index) => {
                                setKM(Utils.toNumericText(selectedItem.km || ''));
                                setSelectedVehicle(selectedItem);
                            }}
                            ref={selectVehicleRef}
                        />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} error={missingData && !date} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />
                        {!props.childrenAfterEstablishment
                            ? props.children
                            : null
                        }
                        {Utils.firstValid([props.hasEstablishment, true])
                            ? <Establishment
                                isEnabled={isEnabledEstablishment}
                                establishment={establishment}
                                setIsEnabled={setIsEnabledEstablishment}
                                setEstablishment={setEstablishment}
                            /> : null
                        }
                        {Utils.firstValid([props.hasEstablishment, true])
                            ? <HelperText
                                style={DefaultStyles.defaultHelperText}
                                type="error"
                                visible={false}
                            >
                                {_.capitalize(Trans.t('enter a value'))}
                            </HelperText>
                            : null
                        }
                        {props.childrenAfterEstablishment
                            ? props.children
                            : null
                        }
                        {Utils.firstValid([props.hasObservations, true])
                            ? <Observations
                                isEnabled={isEnabledObservations}
                                observations={observations}
                                setIsEnabled={setIsEnabledObservations}
                                setObservations={setObservations}
                            />
                            : null
                        }
                        {Utils.firstValid([props.hasObservations, true])
                            ? <HelperText
                                style={DefaultStyles.defaultHelperText}
                                type="error"
                                visible={false}
                            >
                                {_.capitalize(Trans.t('enter a value'))}
                            </HelperText>
                            : null
                        }
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

export { BaseExpense };