
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
import { TextInput } from 'react-native-paper';
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
const { width, height } = Dimensions.get('window');

/*********************************************************************************************************
 *                                      TELA EDITVEICULO
 **********************************************************************************************************/
function EditVehicle(props: React.PropsWithChildren): JSX.Element {
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false);
    const [idVehicle,setIdVehicle] = useState<string | null>(null);
    const [vehicle,setVehicle] = useState(null);
    const [brands, setBrands] = useState(Brands.data || []);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [models, setModels] = useState(Models.data || []);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [isColorEnabled, setIsColorEnabled] = useState(false);
    const [color, setColor] = useState(null);
    const [km, setKm] = useState(null);
    const [idEngineType, setIdEngineType] = useState(0);
    const [plate, setPlate] = useState(null);
    const [photo, setPhoto] = useState(null);
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

                    //load vehicle
                    let newIdvehicle : string | null = ((props?.route || {}).params || {}).idVehicle || props?.idVehicle || null; 
                    let newVehicle = null;
                    setIdVehicle(newIdvehicle);
                    if (newIdvehicle) {
                        newVehicle = await firestore().collection('Vehicles').doc(newIdvehicle).get();
                        console.log('newVehicle',newVehicle);
                        setVehicle({
                            id :newVehicle.id,
                            ...newVehicle.data()
                        });
                    }

                    //load brands and models
                    let newModels = await handleSelectedBrand(newVehicle?.data().idBrand);

                    if (newVehicle) {                        
                        if (newVehicle.data().idModel && newModels.length > 0) {
                            setSelectedModel(newModels.find(el=>el.id == newVehicle.data().idModel)||null)
                        }
                        setSelectedYear(newVehicle.data().year);
                        setSelectedFuel(newVehicle.data().preferedFuel);
                        setColor(newVehicle.data().color);
                        setIsColorEnabled(newVehicle.data().color ? true : false);
                        setKm(newVehicle.data().km);
                        setPlate(newVehicle.data().plate);
                        setPhoto(newVehicle.data().photo);
                        setIdEngineType(newVehicle.data().idEngineType || 0);
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

    async function handleSelectedBrand(newSelectedIdBrand : string | null) {
        try {
            let newBrands = Brands.data || [];
            if (!newBrands?.length) {                        
                const newBrandsCollection = await firestore().collection('Brands').get();
                if (newBrandsCollection && newBrandsCollection.size > 0) {

                    newBrandsCollection.forEach(documentSnapshot => {
                        newBrands.push({
                            id: documentSnapshot.id,
                            name: documentSnapshot.data().name
                        });
                    });    
                    console.log('newBrands',newBrands);                                        
                }
                Brands.data = newBrands;
                setBrands(newBrands);                        
            } 


            let newModels = [];
            const newModelsCollection = await firestore().collection('Models').get();
            if (newModelsCollection && newModelsCollection.size > 0) {
                newModelsCollection.forEach(documentSnapshot => {                                
                    newModels.push({
                        id: documentSnapshot.id,
                        ...documentSnapshot.data()
                    });
                });    
            }
            
            if (newSelectedIdBrand) {
                console.log('find',newSelectedIdBrand,newBrands.find(el=>el.id == newSelectedIdBrand));
                setSelectedBrand(newBrands.find(el=>el.id == newSelectedIdBrand));
                newModels = newModels.filter(el=>el.idBrand == newSelectedIdBrand)
            } else {
                setSelectedBrand(null);            
            }
            console.log('seted',newModels);
            setModels(newModels);
            return newModels;
        } catch (e) {
            return [];
        }
    }



    const saveVehicle = async () => {
        try {
            if (!selectedModel || !selectedBrand || !selectedYear || !km || !plate) {
                setShowAlert(true)
            } else {
                let newVehicle = null;
                if (idVehicle) {
                    newVehicle = await firestore().collection('Vehicles').doc(idVehicle);
                    await newVehicle.update({
                        //idUser: auth().currentUser.id,
                        idBrand:selectedBrand?.id,
                        idModel: selectedModel?.id,
                        idEngineType: idEngineType,
                        year: selectedYear,
                        km: Utils.toNumber(km),
                        plate: plate,
                        color: color,
                        preferedFuel: selectedFuel,
                        photo: photo
                    });
                    
                } else {
                    console.log(AuthController.getLoggedUser().id)
                    //create
                    newVehicle = await firestore().collection('Vehicles').add({
                        authUserId: auth().currentUser.uid,
                        idUser: AuthController.getLoggedUser().id,
                        idBrand:selectedBrand?.id,
                        idModel: selectedModel?.id,
                        idEngineType: idEngineType,
                        year: selectedYear,                        
                        km: Utils.toNumber(km),
                        plate: plate,
                        color: color,
                        preferedFuel: selectedFuel,
                        photo: photo
                    });

                    
                }
                console.log('newVehicle',newVehicle.id,newVehicle);
                navigation.navigate('ViewVehicle', { idVehicle: idVehicle || newVehicle.id });
            }
        } catch (e) {
            console.log(e);
            Utils.showError(e);
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
            <Header withButtons={true} onPressConclude={saveVehicle} onPressCancel={() => navigation.goBack()} />
            <View style={style.title}>
                <TitleView title={idVehicle ? 'Edição de veículo' : 'Cadastro de veículo'} />
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
                            {...DefaultProps.selectDropdown}
                            data={brands}
                            label="Marca"
                            rowTextForSelection={(item, index) => {
                                return item.name;
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.name;
                            }}
                            defaultButtonText={selectedBrand ? selectedBrand?.name || ' ' : ' '}
                            onSelect={async (selectedItem, index) => {
                                await handleSelectedBrand(selectedItem.id);
                                setSelectedModel(null);
                            }}
                        />

                        {/*SELECT MODEL*/}                        
                        {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                        <SelectDropdown
                            {...DefaultProps.selectDropdown}
                            data={models}
                            label="Modelo"
                            onSelect={(selectedItem, index) => {
                                setSelectedModel(selectedItem);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    selectedModel
                                        ? (selectedItem ? selectedItem.name : null)
                                        : null
                                );
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.name;
                            }}
                            defaultButtonText={selectedModel ? selectedModel?.name || ' ' : ' '}
                        />

                        {/*SELECT YEAR*/}                        
                        {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                        <SelectDropdown
                            {...DefaultProps.selectDropdown}
                            data={years}
                            label="Ano modelo"
                            onSelect={(selectedItem, index) => {
                                setSelectedYear(selectedItem);
                            }}

                            defaultButtonText={selectedYear ? selectedYear.toString() || ' ' : ' '}
                        />

                        {/*SELECT FUEL*/}                        
                        {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                        <SelectDropdown
                            {...DefaultProps.selectDropdown}
                            data={fuels}
                            label="Combustível preferido"
                            onSelect={(selectedItem, index) => {
                                setSelectedFuel(selectedItem);
                            }}

                            defaultButtonText={selectedFuel ? selectedFuel.toString() || ' ' : ' '}
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
                            defaultValue={(km || '').toString()}
                        />

                        {/*TEXTINPUT PLACA*/}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={[DefaultStyles.textInput, { marginTop: RFValue(7) }]}
                            label='Placa do veículo'
                            onChangeText={plate => setPlate(plate)}
                            defaultValue={plate}
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
                                value={color ? color : null}
                                onChangeText={color => setColor(color)}
                                defaultValue={color}
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
    }
});

export default EditVehicle;


