import { Dimensions} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

class DefaultStyles {

    static windowWidth =  Dimensions.get('window').width;
    static windowHeight =  Dimensions.get('window').height;

    static colors = {
        black: '#000',
        fundo: '#DDDDDD',
        tabBar: '#0E0D13',
        botao: '#F4FF00',
        fundoInput: '#F4F4F4',
    }

    static dimensions = {
        width:{
            formElement : Dimensions.get('window').width * 0.9
        },
        height:{
            formElement : RFValue(50)
        },
        defaultLabelFontSize: RFValue(16),
        defaultInputFontSize: RFValue(14),
        defaultInputMaginButton : RFValue(7)
    }

    static formElement = {       
        width:DefaultStyles.dimensions.width.formElement,
        marginBottom: DefaultStyles.dimensions.defaultInputMaginButton,        
        backgroundColor: DefaultStyles.colors.fundoInput,
        color: DefaultStyles.colors.tabBar,
        paddingLeft: RFValue(5),
        borderRadius: RFValue(5),
        alignSelf: 'center',
        fontSize: DefaultStyles.dimensions.defaultInputFontSize,
        fontFamily: 'verdana'        
    }

    static textInput = {
        width: DefaultStyles.dimensions.width.formElement,
        marginBottom: RFValue(7),        
        borderRadius: RFValue(5),
        backgroundColor: DefaultStyles.colors.fundoInput,                    
        fontSize: RFValue(14),
        fontFamily: 'verdana',
    }

    static dropdownMenuStyle = {
        backgroundColor: DefaultStyles.colors.fundoInput, 
        borderWidth: 1, 
        borderColor: DefaultStyles.colors.tabBar 
    }

    static dropdownTextView = {
        backgroundColor: 'transparent', 
        width:'100%',
        padding: RFValue(4),
        height: Dimensions.get('window').height / 15,
        alignItems: 'center',
        justifyContent: 'center'
    }

    static dropdownText = {
        backgroundColor: 'transparent', 
        fontSize: DefaultStyles.dimensions.defaultInputFontSize, 
        fontFamily: 'verdana',
        color: 'black'
    }

    static viewSwitch =  {
        width: '100%', 
        alignItems: 'center', 
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        marginBottom: 10
    } 

    static buttonConclude = {
        position: 'absolute',
        right: RFValue(10)
    }
    static buttonCancel = {
        position: 'absolute',
        left: RFValue(10),
    }
    static textButton = {
        fontSize: RFValue(20),
        color: DefaultStyles.colors.tabBar
    }

}
export {DefaultStyles}