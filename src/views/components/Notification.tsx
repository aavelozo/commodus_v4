import notifee, { TimestampTrigger, TriggerType, AuthorizationStatus, AndroidStyle } from '@notifee/react-native';
import { useState } from 'react'
import { Alert, Appearance, ToastAndroid } from 'react-native';
import Trans from "../../controllers/internatiolization/Trans";
import _ from 'lodash';


// const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());


const createChannelId = async (type: string) => {
	if (type == 'insights') {
		const channelId = await notifee.createChannel({
			id: 'financial-insights',
			name: Trans.t('Financial insights'),
		});
		return channelId

	} else if (type == 'reminder') {
		const channelId = await notifee.createChannel({
			id: 'expense-reminder',
			name: Trans.t('Lembrete de despesa'),
		});
		return channelId
	} else {
		const channelId = await notifee.createChannel({
			id: 'default',
			name: 'Default Channel',
			vibration: true,
			vibrationPattern: [300, 500],
		})
		return channelId
	}
}

const createTrigger = (date: any) => {
	console.log(date.getTime())
	console.log('createTrigger date.getTime()')
	// const now = new Date();

	// now.setTime(now.getTime() + 5 * 1000);
	const trigger: TimestampTrigger = {
		type: TriggerType.TIMESTAMP,
		timestamp: date.getTime()
	};
	return trigger
}

export const requestNotificationPermission = async () => {
	console.log('requestNotificationPermission')
	const settings = await notifee.requestPermission();
	if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
		console.log('Permissão de notificação concedida.');
		return true
	} else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
		Alert.alert(`${Trans.t('Permission disabled')}`, `${Trans.t('You will need to enable permission to receive notification')}`)
		console.log('Permissão de notificação negada.');
		return false
	}
}

const createAndroid = (channelId: any, colorDefault: any, body: any) => {
	const android = {
		channelId: channelId,
		largeIcon: colorDefault == 'dark' ? require('../assets/logoCommodus.png') : require('../assets/logoCommodusEscuro.png'),
		color: '#1B2040',
		style: {
			type: AndroidStyle.BIGTEXT,
			text: body,
		},
	}
	return android
}

export const schedulReminderNotification = async (date: any, title: string, body: string) => {
	const channelId = await createChannelId('reminder')
	const colorDefault = Appearance.getColorScheme()
	const trigger = createTrigger(date)
	const android = createAndroid(channelId, colorDefault, body)
	await notifee.createTriggerNotification({
		title: title,
		body: body,
		android: android
	},
		trigger
	);
}



