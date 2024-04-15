import { DefaultStyles } from "./DefaultStyles"

class DefaultProps {
    static textInput = {
        color:DefaultStyles.colors.tabBar,
        activeOutlineColor:DefaultStyles.colors.tabBar,
        selectionColor:'#DDDDDD',
        mode: 'outlined',
        outlineColor:DefaultStyles.colors.tabBar,
        //dense: true
    }

    /*static selectDropdown = {
        search: true,/*
        buttonStyle: DefaultStyles.selectDropdown,
        buttonTextStyle:{
            color: DefaultStyles.colors.tabBar, 
            textAlign: 'left', 
            fontSize: DefaultStyles.dimensions.defaultInputFontSize, 
            fontFamily: 'verdana',
            backgroundColor:'transparent'
        },dropdownStyle:{
            backgroundColor: DefaultStyles.colors.fundoInput, 
            borderWidth: 1, 
            borderColor: DefaultStyles.colors.tabBar 
        },
        rowStyle:{
            backgroundColor: 'transparent'
        },
        rowTextStyle:{
            backgroundColor: 'transparent', 
            fontSize: DefaultStyles.dimensions.defaultInputFontSize, 
            fontFamily: 'verdana'  
        }
    }*/

    /*static selectDropdownWithTextInput = {
        search: true,
        buttonStyle: DefaultStyles.selectDropdownWithTextInput,
        buttonTextStyle:{
            color: DefaultStyles.colors.tabBar, 
            textAlign: 'left', 
            fontSize: DefaultStyles.dimensions.defaultInputFontSize, 
            fontFamily: 'verdana',
            
        },
        dropdownStyle:{
            backgroundColor: DefaultStyles.colors.fundoInput, 
            borderWidth: 1, 
            borderColor: DefaultStyles.colors.tabBar 
        },
        rowStyle:{
            backgroundColor: 'white'
        },
        rowTextStyle:{
            backgroundColor: 'white', 
            fontSize: DefaultStyles.dimensions.defaultInputFontSize, 
            fontFamily: 'verdana'  
        }
    }*/
}

export {DefaultProps}