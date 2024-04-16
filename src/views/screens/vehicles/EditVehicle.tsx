
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, ToastAndroid, Image } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../../DefaultStyles';
import ModalAlert from '../../components/ModalAlert';
import Header from '../../components/Header';
import Utils from '../../../controllers/Utils';
import Vehicles from '../../../database/models/Vehicles';
import AuthController from '../../../controllers/AuthController';
import { useNavigation } from '@react-navigation/native';
import TitleView from '../../components/TitleView';
import ContentContainer from '../../components/ContentContainer';
import FormLayout from '../../components/FormLayout';
import Radio from '../../components/Radio';
import { Icon, TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';
import SelectDropdown from 'react-native-select-dropdown';
import { Switch } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native';
import Camera from '../../assets/iconSvg/camera.svg'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Svg } from 'react-native-svg';
import SvgImage from 'react-native-svg/lib/typescript/elements/Image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Brands from '../../../database/models/Brands';
import Models from '../../../database/models/Models';
import { setCurrentViewVehicle } from './ViewVehicle';
const { width, height } = Dimensions.get('window');


let currentVehicle;
function setCurrentVehicle(newCurrentVehicle) {
    currentVehicle = newCurrentVehicle;
}


/*********************************************************************************************************
 *                                      TELA EDITVEICULO
 **********************************************************************************************************/
function EditVehicle(props: React.PropsWithChildren): JSX.Element {
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false);
    const [saving,setSaving] = useState(false);
    const [vehicle,setVehicle] = useState(currentVehicle);
    const [brands, setBrands] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [isColorEnabled, setIsColorEnabled] = useState(false);
    const [color, setColor] = useState('');
    const [km, setKm] = useState('');
    const [idEngineType, setIdEngineType] = useState(0);
    const [plate, setPlate] = useState('');
    const [photo, setPhoto] = useState('');
    const fuels = ['Álcool', 'Gasolina', 'Diesel'];
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


    useEffect(()=>{
        if (!loading && !loaded) {
            setLoading(true);

            (async () => {
                try {  
                    let newBrands = await Brands.getSingleData();
                    console.log('newBrands',newBrands);
                    setBrands(newBrands);

                    //use currentVehicle otherise vehicle, because setState is async
                    if (currentVehicle) {    
                        console.log('current vehicle',currentVehicle.data());                    
                        if (currentVehicle.data().model && newBrands.length > 0) {
                            console.log('selecting model');
                            let newSelectedBrand = null;
                            let newSelectedModel = null;
                            for(let i = 0; i < newBrands.length; i++) {
                                newSelectedModel = newBrands[i].models.find(el=>el.id == currentVehicle.data().model.id);
                                if (newSelectedModel) {
                                    newSelectedBrand = newBrands[i];
                                    break;
                                }
                            }
                            console.log('selected model and brand',newSelectedBrand,newSelectedModel);
                            setSelectedBrand(newSelectedBrand);
                            setSelectedModel(newSelectedModel)
                        }
                        setSelectedYear(currentVehicle.data().year ? currentVehicle.data().year.toString() : '');
                        setSelectedFuel(currentVehicle.data().preferedFuel);
                        setColor(currentVehicle.data().color||'');
                        setIsColorEnabled(currentVehicle.data().color ? true : false);
                        setKm(currentVehicle.data().km ? currentVehicle.data().km.toString() : '');
                        setPlate(currentVehicle.data().plate||'');
                        setPhoto(currentVehicle.data().photo||'');
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
    },[navigation]);

 


    const saveVehicle = async () => {
        try {
            if (!selectedModel || !selectedBrand || !selectedYear || !km || !plate) {
                setShowAlert(true)
            } else {
                setSaving(true);
                let dbBrands = await Brands.getDBData();
                let dbBrand = dbBrands?.docs.find(el=>el.id == selectedBrand.id);
                let dbModel = await dbBrand?.models.docs.find(el=>el.id == selectedModel.id);
                if (vehicle) {
                    await vehicle.ref.update({
                        model: dbModel?.ref,
                        idEngineType: idEngineType,
                        year: selectedYear,
                        km: Utils.toNumber(km),
                        plate: plate,
                        color: color,
                        preferedFuel: selectedFuel,
                        photo: photo
                    });

                    //reload to update current view
                    let newVehicle = await AuthController.getLoggedUser().ref.collection('vehicles').doc(vehicle.id).get();
                    console.log('newVehicleData');
                    setCurrentViewVehicle(newVehicle);                 
                } else {
                    //create                    
                    let newVehicle = await AuthController.getLoggedUser().ref.collection('vehicles').add({
                        model: dbModel.ref,
                        idEngineType: idEngineType,
                        year: selectedYear,                        
                        km: Utils.toNumber(km),
                        plate: plate,
                        color: color,
                        preferedFuel: selectedFuel,
                        photo: photo
                    });
                    newVehicle = await AuthController.getLoggedUser().ref.collection('vehicles').doc(newVehicle.id).get();
                    console.log('newVehicleData',newVehicle);
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
        Alert.alert("IMAGEM", "Selecione o local em que está a foto:", [
            {
                text: 'Galeria',
                onPress: () => pickImageGalery(),
                style: 'default'
            },
            {
                text: 'Câmera',
                onPress: () => pickImageCamera(),
                style: 'default'
            }
        ],
            {
                cancelable: true,
                onDismiss: () => console.log("tratar depois")
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
        ToastAndroid.showWithGravity("Imagem salva com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };




    return (<View style={style.container}>
            {showAlert
                ? <ModalAlert
                    onlyConfirm={false}
                    title="Dados incompletos"
                    message='Preecha todos os campos obrigatórios'
                    textConfirm='Confirmar'
                    textCancel="Cancelar"
                    updateShowAlert={pBool => setShowAlert(pBool)}
                />
                : false
            }
            <Header 
                withButtons={true} 
                onPressConclude={saveVehicle} 
                saving={saving}
                onPressCancel={() => navigation.goBack()} 
            />
            <View style={style.title}>
                <TitleView title={vehicle ? 'Edição de veículo' : 'Cadastro de veículo'} />
                <ContentContainer  >
                    <FormLayout>
                        <Radio
                            enginesTypes={
                                Vehicles.ENGINES_TYPES.map((engineType, index) => { return { label: engineType, value: index } })
                            }
                            selected={idEngineType}
                            funcao={index => setIdEngineType(index)}
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
                                            label='Marca'
                                            value={selectedItem?.id}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
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
                            data={selectedBrand?.models}
                            defaultValue={selectedModel}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label='Modelo'
                                            value={selectedItem?.id}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
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
                                            label='Ano Modelo'
                                            value={selectedItem ? selectedItem.toString() : ''}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                        <Text style={DefaultStyles.dropdownText}>{item}</Text>
                                </View>);
                            }}
                            onSelect={(selectedItem, index) => {
                                setSelectedYear(selectedItem);
                            }}
                        />

                        {/*SELECT FUEL*/}                        
                        {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                        <SelectDropdown
                            dropdownStyle={DefaultStyles.dropdownMenuStyle}
                            search={true}
                            showsVerticalScrollIndicator={true} 
                            data={fuels}
                            defaultValue={selectedFuel}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View>
                                        <TextInput
                                            {...DefaultProps.textInput}
                                            style={DefaultStyles.textInput}
                                            label='Combustível preferido'
                                            value={selectedItem}
                                            pointerEvents="none"
                                            readOnly
                                        />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                        <Text style={DefaultStyles.dropdownText}>{item}</Text>
                                </View>);
                            }}
                            onSelect={(selectedItem, index) => {
                                setSelectedFuel(selectedItem);
                            }}
                        />

                        {/*TEXTINPUT KM*/}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='numeric'
                            label='Quilometragem atual'
                            onChangeText={km => {
                                if (km.includes('.')) return
                                if (km.includes(',')) return
                                if (km.includes('-')) return
                                if (km.includes(' ')) return
                                setKm(km);
                            }}
                            maxLength={7}
                            value={(km || '').toString()}
                        />

                        {/*TEXTINPUT PLACA*/}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={[DefaultStyles.textInput, { marginTop: RFValue(7) }]}
                            label='Placa do veículo'
                            value={plate}
                            onChangeText={plate => setPlate(plate)}
                            maxLength={7}
                        />

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
                                    Cor
                                </Text>
                            </TouchableWithoutFeedback>}
                        </View>

                        {isColorEnabled 
                            ? <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Cor'
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
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 9,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopLeftRadius: RFValue(25),
        width: '100%',
    },
    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: width * 0.9,
        backgroundColor: DefaultStyles.colors.fundoInput,
        height: height / 14,
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 5,
        color: DefaultStyles.colors.tabBar,
        fontSize: 20,
        alignSelf: 'center'
    },
    textSwitch: {
        fontSize: 20,
        color: DefaultStyles.colors.tabBar,

    },
    picker: {
        borderWidth: 1,
        height: height / 14,
        width: width * 0.9,
        backgroundColor: DefaultStyles.colors.fundoInput,
        marginBottom: 10,
        borderRadius: 5,
    },
    pickerItem: {
        backgroundColor: DefaultStyles.colors.fundoInput,
        color: DefaultStyles.colors.tabBar,
        marginLeft: 20,
        color: DefaultStyles.colors.tabBar,
        fontSize: 20,
        borderColor: 'transparent',
    },
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
      dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownButtonArrowStyle: {
        fontSize: 28,
      },
      dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
     
      dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      },
      dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
});


export {EditVehicle, setCurrentVehicle};


