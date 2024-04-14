import React, { useEffect, useState } from 'react';
import moment from 'moment'
import 'moment/locale/pt-br'
import DatePicker from 'react-native-date-picker';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';
import { DefaultStyles } from '../../DefaultStyles';
import { RFValue } from 'react-native-responsive-fontsize';

interface DateComponentProps {
    setDate : (date:any)=>void,
    date ? : any,
    ref ? : React.RefObject<HTMLElement>
}

//Date
function DateComponent(props : DateComponentProps) : JSX.Element {
    const [opened,setOpened] = useState(false);
    let date = props.date || new Date();

    useEffect(()=>{
        if (typeof date == "string") {
            date = new Date(date);
        }
    });
    
        
    return (
        <>
            {/* DATE MODAL */}
            <DatePicker
                title={'Informe a data'} 
                modal mode="date" 
                open={opened} 
                date={date} 
                onCancel={() => setOpened(false)}
                onConfirm={(date) => {
                    props.setDate(date);
                    setOpened(false);                   
                }}
            />                               
            <TextInput            
                {...DefaultProps.textInput}
                style={[DefaultStyles.textInput]}                
                label='Data'
                keyboardType='default'
                showSoftInputOnFocus={false}
                onPressIn={()=>{
                    setOpened(true);
                }}
                value={moment(date).locale('pt-br').format('DD[/]MM[/]YY')}
            />                    
        </>
    );
};

export default DateComponent;