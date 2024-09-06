import { HelperText, TextInput } from "react-native-paper";
import { DefaultProps } from "../../DefaultProps";
import { DefaultStyles } from "../../DefaultStyles";
import Trans from "../../../controllers/internatiolization/Trans";
import _ from 'lodash';
import Utils from "../../../controllers/Utils";
import { RFValue } from "react-native-responsive-fontsize";
import { View } from "react-native";

function TotalValue(props) {
    let otherProps = {};
    if (Utils.hasValue(props.maxLength||null)) {
        otherProps.maxLength = props.maxLength
    }

    function handleChange(newValue) {
        console.log(newValue);
        newValue = Utils.toNumericText(newValue);
        console.log(newValue);
        props.setTotalValue(newValue);
    }
    
    return <View>
        <TextInput
            {...DefaultProps.textInput}
            style={[DefaultStyles.textInput,props.style || {}]}
            keyboardType="numeric"
            label={`* ${_.capitalize(Trans.t(props.label || 'total value'))}`}
            onChangeText={handleChange}
            placeholder={Trans.getCurrencySymbol()}
            placeholderTextColor='#666'
            value={props.totalValue ? props.totalValue.toString() : null}
            inputMode="decimal"
            {...otherProps}
        />
        <HelperText
            style={[DefaultStyles.defaultHelperText,props.helperTextStyle||{}]}            
            type="error"
            visible={props.missingData && !props.totalValue}
        >
            {_.capitalize(Trans.t('enter value'))}
        </HelperText>
    </View>
}

export {TotalValue};