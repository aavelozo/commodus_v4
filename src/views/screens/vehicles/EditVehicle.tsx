
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../../DefaultStyles';
import Header from '../../components/Header';
import Utils from '../../../controllers/Utils';
import Vehicles from '../../../database/models/Vehicles';
import AuthController from '../../../controllers/AuthController';
import { useNavigation } from '@react-navigation/native';
import TitleView from '../../components/TitleView';
import ContentContainer from '../../components/ContentContainer';
import FormLayout from '../../components/FormLayout';
import Radio from '../../components/Radio';
import { DefaultProps } from '../../DefaultProps';
import SelectDropdown from 'react-native-select-dropdown';
import { getAuth } from '@react-native-firebase/auth';
import { Switch } from 'react-native';
import storage from '@react-native-firebase/storage';
import { TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native';
import Camera from '../../assets/iconSvg/camera.svg'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Brands from '../../../database/models/Brands';
import { setCurrentViewVehicle } from './ViewVehicle';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash';


let currentVehicle;
function setCurrentVehicle(newCurrentVehicle) {
    currentVehicle = newCurrentVehicle;
}


/*********************************************************************************************************
 *                                      TELA EDITVEICULO
 **********************************************************************************************************/
function EditVehicle(props: React.PropsWithChildren): JSX.Element {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [vehicle, setVehicle] = useState(currentVehicle);
    const [brands, setBrands] = useState([]);
    const [missingData, setMissingData] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [isColorEnabled, setIsColorEnabled] = useState(false);
    const [color, setColor] = useState('');
    const [km, setKm] = useState('');
    const [idEngineType, setIdEngineType] = useState(currentVehicle?.data()?.idEngineType || 0);
    const [plate, setPlate] = useState('');
    const [photo, setPhoto] = useState('');
    const [pathOldPhoto, setPathOldPhoto] = useState('');

    const years = (function () {
        let anos = [];
        let anoFinal = new Date().getFullYear() + 1;
        let anoInicial = anoFinal - 100;
        for (let i = anoFinal; i > anoInicial; i--) {
            anos.push(i);
        }
        return anos;
    }());

    const navigation = useNavigation();


    useEffect(() => {
        if (!loading && !loaded) {
            setLoading(true);

            (async () => {
                try {
                    let newBrands = await Brands.getSingleData();
                    console.log('newBrands', newBrands);
                    setBrands(newBrands);

                    //use currentVehicle otherise vehicle, because setState is async
                    if (currentVehicle) {
                        console.log('current vehicle', currentVehicle.data());
                        if (currentVehicle.data().model && newBrands.length > 0) {
                            console.log('selecting model');
                            let newSelectedBrand = null;
                            let newSelectedModel = null;
                            for (let i = 0; i < newBrands.length; i++) {
                                newSelectedModel = newBrands[i].models.find(el => el.id == currentVehicle.data().model.id);
                                if (newSelectedModel) {
                                    newSelectedBrand = newBrands[i];
                                    break;
                                }
                            }
                            console.log('selected model and brand', newSelectedBrand, newSelectedModel);
                            setSelectedBrand(newSelectedBrand);
                            setSelectedModel(newSelectedModel)
                        }
                        setSelectedYear(currentVehicle.data().year ? currentVehicle.data().year.toString() : '');
                        setSelectedFuel(currentVehicle.data().preferedFuel);
                        setColor(currentVehicle.data().color || '');
                        setIsColorEnabled(currentVehicle.data().color ? true : false);
                        setKm(Utils.toNumericText(currentVehicle.data()?.km || ''));
                        setPlate(currentVehicle.data().plate || '');
                        setPhoto(currentVehicle.data().photo || '');
                        setPathOldPhoto(currentVehicle.data().photo || '');
                        setIdEngineType(currentVehicle.data().idEngineType || 0);
                    }
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoaded(true);
                    setLoading(false);
                }
            })();
        }
    }, [navigation]);

    const uploadPhoto = async (idCar: string) => {
        const authUserId = await getAuth().currentUser.uid
        const filenameFull = `images/${authUserId}/cars/${idCar}/${authUserId}`
        const uri = photo.replace('file://', '')
        const task = storage().ref(filenameFull).putFile(uri)
        return new Promise((resolve, reject) => {
            task.on(
                'state_changed',
                null,
                (error) => reject(error),
                async () => {
                    const downloadURL = await task.snapshot.ref.getDownloadURL();
                    resolve(downloadURL);
                }
            );
        });

    }




    const saveVehicle = async () => {
        var fullPath: string;
        try {
            if (!selectedModel || !selectedBrand || !selectedYear || !km || !plate) {
                setMissingData(true);
                //setShowAlert(true);                
                Utils.toast("error", _.capitalize(Trans.t('missing data')));
            } else {
                setMissingData(false);
                setSaving(true);
                let dbBrands = await Brands.getDBData();
                let dbBrand = dbBrands?.docs.find(el => el.id == selectedBrand.id);
                let dbModel = await dbBrand?.models.docs.find(el => el.id == selectedModel.id);
                if (vehicle) {
                    //edit
                    if (photo != pathOldPhoto) {
                        fullPath = await uploadPhoto(vehicle._ref._documentPath._parts[3]) as string
                    } else {
                        fullPath = photo
                    }
                    await vehicle.ref.update({
                        model: dbModel?.ref,
                        idEngineType: idEngineType,
                        year: selectedYear,
                        km: Utils.hasValue(km) ? Utils.toNumber(km) : null,
                        plate: plate,
                        color: color,
                        preferedFuel: selectedFuel,
                        photo: fullPath
                    });

                    //reload to update current view
                    let newVehicle = await AuthController.getLoggedUser().ref.collection('vehicles').doc(vehicle.id).get();
                    console.log('newVehicleData');
                    setCurrentViewVehicle(newVehicle);
                } else {
                    //cria o veiculo sem foto               
                    let newVehicle = await AuthController.getLoggedUser().ref.collection('vehicles').add({
                        model: dbModel.ref,
                        idEngineType: idEngineType,
                        year: selectedYear,
                        km: Utils.hasValue(km) ? Utils.toNumber(km) : null,
                        plate: plate,
                        color: color,
                        preferedFuel: selectedFuel,
                        photo: null
                    });
                    console.log('newVehicleData1', newVehicle);                    
                    if (photo) {
                        //se tiver foto, sobe a foto no storage e atualiza a url da foto no veiculo
                        fullPath = await uploadPhoto(newVehicle._documentPath._parts[3]) as string
                        await newVehicle.update({ photo: fullPath })
                    }
                    newVehicle = await AuthController.getLoggedUser().ref.collection('vehicles').doc(newVehicle.id).get();                    
                    console.log('newVehicleData2', newVehicle);
                    setCurrentViewVehicle(newVehicle);
                }
                setCurrentVehicle(null);
                navigation.navigate('ViewVehicle');
            }
        } catch (e) {
            console.log(e);
            Utils.showError(e);
        } finally {
            setSaving(false);
        }
    }



    // mostra alert para selecionar camera ou galeria
    const handleImageCar = () => {
        Alert.alert(_.capitalize(Trans.t('image')), `${_.capitalize(Trans.t('select the location where your photo is'))}:`, [
            {
                text: _.capitalize(Trans.t('galery')),
                onPress: () => pickImageGalery(),
                style: 'default'
            },
            {
                text: _.capitalize(Trans.t('camera')),
                onPress: () => pickImageCamera(),
                style: 'default'
            }
        ],
            {
                cancelable: true,
                onDismiss: () => console.log("to implement")
            })
    }

    const pickImageGalery = async () => {
        const options = {
            mediaType: 'photo'
        }
        const result = await launchImageLibrary(options)
        if (result.assets) {
            setPhoto(result.assets[0].uri.toString());
            showToast()
            return
        }
    }

    const pickImageCamera = async () => {
        const options = {
            mediaType: 'photo',
            saveToPhotos: false,
            cameraType: 'front',
            quality: 1
        }
        const result = await launchCamera(options)
        if (result.assets) {
            setPhoto(result.assets[0].uri.toString());
            showToast()
            return
        }
    }

    const showToast = () => {
        ToastAndroid.showWithGravity(Trans.t('msg_successfull_image_inserted'), ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };




    return (<View style={style.container}>
        <Header
            withButtons={true}
            onPressConclude={saveVehicle}
            saving={saving}
            onPressCancel={() => navigation.navigate('ListVehicle')}
        />
        <View style={style.title}>
            <TitleView title={_.capitalize(Trans.t(vehicle ? 'vehicle edition' : 'vehicle register'))} />
            <ContentContainer  >
                <FormLayout>
                    <Radio
                        enginesTypes={
                            Vehicles.ENGINES_TYPES.map((engineType, index) => { return { label: _.capitalize(Trans.t(engineType)), value: index } })
                        }
                        selected={idEngineType}
                        funcao={index => {
                            setIdEngineType(index)
                            if (index === 2) setSelectedFuel(null)
                        }}
                    />

                    {/*SELECT BRAND*/}

                    {/* dropdown: usado para selecionar marca e atualizar o txtinput */}
                    <SelectDropdown
                        dropdownStyle={DefaultStyles.dropdownMenuStyle}
                        search={true}
                        showsVerticalScrollIndicator={true}
                        data={brands}
                        defaultValue={selectedBrand}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View>
                                    <TextInput
                                        {...DefaultProps.textInput}
                                        style={DefaultStyles.textInput}
                                        label={`* ${_.capitalize(Trans.t('brand'))}`}
                                        value={selectedItem?.id}
                                        pointerEvents="none"
                                        readOnly
                                    />
                                    <HelperText
                                        style={DefaultStyles.defaultHelperText}
                                        type="error"
                                        visible={missingData && !selectedBrand}
                                    >
                                        {_.capitalize(Trans.t('select a brand'))}
                                    </HelperText>
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                <Text style={DefaultStyles.dropdownText}>{item.id}</Text>
                            </View>);
                        }}
                        onSelect={(selectedItem, index) => {
                            setSelectedBrand(selectedItem);
                        }}
                    />

                    {/*SELECT MODEL*/}
                    {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                    <SelectDropdown
                        dropdownStyle={DefaultStyles.dropdownMenuStyle}
                        search={true}
                        showsVerticalScrollIndicator={true}
                        data={selectedBrand?.models || []}
                        defaultValue={selectedModel}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View>
                                    <TextInput
                                        {...DefaultProps.textInput}
                                        style={DefaultStyles.textInput}
                                        label={`* ${_.capitalize(Trans.t('model'))}`}
                                        value={selectedItem?.id}
                                        pointerEvents="none"
                                        readOnly
                                    />
                                    <HelperText
                                        style={DefaultStyles.defaultHelperText}
                                        type="error"
                                        visible={missingData && !selectedModel}
                                    >
                                        {_.capitalize(Trans.t('select a model'))}
                                    </HelperText>
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                <Text style={DefaultStyles.dropdownText}>{item.id}</Text>
                            </View>);
                        }}
                        onSelect={(selectedItem, index) => {
                            setSelectedModel(selectedItem);
                        }}
                    />

                    {/*SELECT YEAR*/}
                    {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                    <SelectDropdown
                        dropdownStyle={DefaultStyles.dropdownMenuStyle}
                        search={true}
                        showsVerticalScrollIndicator={true}
                        data={years}
                        defaultValue={selectedYear}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View>
                                    <TextInput
                                        {...DefaultProps.textInput}
                                        style={DefaultStyles.textInput}
                                        label={`* ${_.capitalize(Trans.t('model year'))}`}
                                        value={selectedItem ? selectedItem.toString() : ''}
                                        pointerEvents="none"
                                        readOnly
                                    />
                                    <HelperText
                                        style={DefaultStyles.defaultHelperText}
                                        type="error"
                                        visible={missingData && !selectedYear}
                                    >
                                        {_.capitalize(Trans.t('select a year'))}
                                    </HelperText>
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                <Text style={DefaultStyles.dropdownText}>{item}</Text>
                            </View>);
                        }}
                        onSelect={(selectedItem, index) => {
                            setSelectedYear(selectedItem);
                        }}
                    />

                    {/*SELECT FUEL*/}
                    {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                    {
                        idEngineType === 2 ?
                            false
                            :
                            <SelectDropdown
                                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                                search={true}
                                showsVerticalScrollIndicator={true}
                                data={Vehicles.FUELS_LIST}
                                defaultValue={selectedFuel}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View>
                                            <TextInput
                                                {...DefaultProps.textInput}
                                                style={DefaultStyles.textInput}
                                                label={_.capitalize(Trans.t('preferred fuel'))}
                                                value={_.capitalize(Trans.t(selectedItem))}
                                                pointerEvents="none"
                                                readOnly
                                            />
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                        <Text style={DefaultStyles.dropdownText}>{_.capitalize(Trans.t(item))}</Text>
                                    </View>);
                                }}
                                onSelect={(selectedItem, index) => {
                                    setSelectedFuel(selectedItem);
                                }}
                            />
                    }

                    {/*TEXTINPUT KM*/}
                    <TextInput
                        {...DefaultProps.textInput}
                        style={DefaultStyles.textInput}
                        keyboardType='numeric'
                        inputMode='decimal'
                        label={`* ${_.capitalize(Trans.t('actual kilometers'))}`}
                        onChangeText={km => {
                            setKm(Utils.toNumericText(km || ''));
                        }}
                        maxLength={10}
                        value={km}
                    />
                    <HelperText
                        style={DefaultStyles.defaultHelperText}
                        type="error"
                        visible={missingData && !Utils.hasValue(km)}
                    >
                        {_.capitalize(Trans.t('enter actual kilometers'))}
                    </HelperText>

                    {/*TEXTINPUT PLACA*/}
                    <TextInput
                        {...DefaultProps.textInput}
                        style={[DefaultStyles.textInput, { marginTop: RFValue(7) }]}
                        label={`* ${_.capitalize(Trans.t('vehicle plate'))}`}
                        value={plate}
                        onChangeText={plate => setPlate(plate)}
                        maxLength={7}
                    />
                    <HelperText
                        style={DefaultStyles.defaultHelperText}
                        type="error"
                        visible={missingData && !Utils.hasValue(plate)}
                    >
                        {_.capitalize(Trans.t('enter a plate'))}
                    </HelperText>

                    <View style={DefaultStyles.viewSwitch}>
                        {/* se ativo, liberar input de Cor */}
                        <Switch
                            trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                            thumbColor={isColorEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={enabled => setIsColorEnabled(enabled)}
                            value={isColorEnabled}
                        />
                        {<TouchableWithoutFeedback onPress={() => setIsColorEnabled(!isColorEnabled)}>
                            <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                {_.capitalize(Trans.t('color'))}
                            </Text>
                        </TouchableWithoutFeedback>}
                    </View>

                    {isColorEnabled
                        ? <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            label={_.capitalize(Trans.t('color'))}
                            value={color ? color : ''}
                            onChangeText={color => setColor(color)}
                            //defaultValue={color}
                            maxLength={15}
                        />
                        : null
                    }

                    <TouchableOpacity
                        style={{ alignItems: 'center', marginTop: RFValue(10), alignSelf: 'flex-end' }}
                        onPress={() => {
                            handleImageCar()
                        }}
                    >
                        <Camera width={RFValue(50)} height={RFValue(50)} />
                    </TouchableOpacity >

                </FormLayout>
            </ContentContainer>
        </View>
    </View >
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
    },
    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export { EditVehicle, setCurrentVehicle };


