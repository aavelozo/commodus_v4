import notifee, { TimestampTrigger, TriggerType, AuthorizationStatus } from '@notifee/react-native';
import { useState } from 'react'
import { Appearance } from 'react-native';
import Trans from "../../controllers/internatiolization/Trans";
import _ from 'lodash';


// const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());


const createChannelId = async (type) => {
	if (type == 'insights') {
		const channelId = await notifee.createChannel({
			id: 'financial-insights',
			name: 'Insights financeiros',
		});
		return channelId

	} else if (type == 'reminder') {
		const channelId = await notifee.createChannel({
			id: 'expense-reminder',
			name: 'Lembrete de despesa',
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

const createTrigger = (date) => {
	const now = new Date()
	const nowInMs = now.getTime()
	const futureInMs = nowInMs + 3000
	const trigger: TimestampTrigger = {
		type: TriggerType.TIMESTAMP,
		timestamp: futureInMs, // fire at 11:10am (10 minutes before meeting)
	};
	return trigger
}

export const requestNotificationPermission = async () => {
	const settings = await notifee.requestPermission();
	if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
		console.log('Permissão de notificação concedida.');
	} else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
		console.log('Permissão de notificação negada.');
	}
}




export const scheduleNotification = async (date, type) => {
	const channelId = await createChannelId(type)
	const color = Appearance.getColorScheme()
	const trigger = createTrigger(date)
	console.log(trigger)
	await notifee.createTriggerNotification(
		{
			title: `${_.capitalize(Trans.t('revision reminder'))} ⚠️`,
			body: _.capitalize(Trans.t(`today is the day to do the job again`)),
			android: {
				channelId: channelId,
				largeIcon: color == 'dark' ? require('../assets/logoCommodus.png') : require('../assets/logoCommodusEscuro.png'),
				color: '#1B2040'
			},
		},
		trigger
	);
}

