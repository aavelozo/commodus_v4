import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { DefaultStyles } from "../DefaultStyles";
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { AndroidColor } from '@notifee/react-native';
import Trans from "../../controllers/internatiolization/Trans";
import _ from 'lodash';

const createChannelId = async () => {
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        vibration: true,
        vibrationPattern: [300, 500],
    });

    return channelId
}


export const showNotification = async (date) => {
    await notifee.requestPermission()
    const channelId = await createChannelId() 

    await notifee.displayNotification({
        title: `<strong>${_.capitalize(Trans.t('revision reminder'))}</strong>`,
        body: Trans.t('notification'),
        android: { channelId },
    });
}




export const scheduleNotification = async () => {
    const channelId = await createChannelId() 
    const date = new Date(Date.now());
    
    date.setSeconds(date.getSeconds() + 3);

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: `${_.capitalize(Trans.t('revision reminder'))} ⚠️`,
        body: _.capitalize(Trans.t(`today is the day to do the job again`)),
        android: {
            channelId,
            largeIcon: require('../assets/logoCommodusEscuro.png'),
            circularLargeIcon: true,
            smallIcon: 'ic_stat_name',
            color: '#1B2040'
        }
        

      },
      trigger,
    );
}