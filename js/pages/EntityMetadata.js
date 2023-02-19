var EntityMetadata = {
	'Lights': {
		name: 'light',
		title: 'Lights',
		selectedStates: ['on'],
		deselectedStates: ['off'],
		select: HAServices.lightOn,
		deselect: HAServices.lightOff,
		defaultIcon: 'mdi-lightbulb',
		supports: [
			"on-off",
			"brightness",
			"colour",
			"effects"
		]
	},
	'Covers': {
		name: 'cover',
		title: 'Covers',
		selectedStates: ['closed'],
		deselectedStates: ['opened'],
		select: HAServices.coverClose,
		deselect: HAServices.coverOpen,
		defaultIcon: 'mdi-blinds',
		supports: [
			"on-off"
		]
	},
	'Switches': {
		name: 'switch',
		title: 'Switches',
		selectedStates: ['on'],
		deselectedStates: ['off'],
		select: HAServices.switchOn,
		deselect: HAServices.switchOff,
		defaultIcon: 'mdi-flash',
		supports: [
			"on-off"
		]
	},
	'Media Players': {
		name: 'media_player',
		title: 'Media Players',
		selectedStates: ['on', 'playing', 'paused', 'buffering'],
		deselectedStates: ['off', 'idle'],
		select: HAServices.homeassistantOn,
		deselect: HAServices.homeassistantOff,
		defaultIcon: 'mdi-cast',
		supports: [
			"on-off",
			"volume-up-down",
			"next-previous",
			"play-pause",
			"mute"
		]
	},
	'Input Booleans': {
		name: 'input_boolean',
		title: 'Input Booleans',
		selectedStates: ['on'],
		deselectedState: ['off'],
		select: HAServices.inputBooleanOn,
		deselect: HAServices.inputBooleanOff,
		defaultIcon: 'mdi-checkbox-marked-outline',
		supports: [
			"on-off"
		]
	},
	'Input Selects': {
		name: 'input_select',
		title: 'Input Selects',
		selectedStates: [],
		deselectedStates: [],
		select: HAServices.inputSelectSelectOption,
		deselect: HAServices.inputSelectSelectOption,
		defaultIcon: 'mdi-format-list-bulleted',
		supports: [
			"options"
		]
	},
	'Scripts': {
		name: 'script',
		title: 'Scripts',
		selectedStates: ['on'],
		deselectedState: ['off'],
		select: HAServices.scriptOn,
		deselect: HAServices.scriptOff,
		defaultIcon: 'mdi-file-document',
		supports: [
			"on-off"
		]
	},
	'Groups': {
		name: 'group',
		title: 'Groups',
		selectedStates: ['on'],
		deselectedStates: ['off'],
		select: HAServices.homeassistantOn,
		deselect: HAServices.homeassistantOff,
		defaultIcon: 'mdi-account-multiple',
		supports: [
			"on-off"
		]
	},
	'Scenes': {
		name: 'scene',
		title: 'Scenes',
		selectedStates: [],
		deselectedStates: [],
		select: HAServices.sceneOn,
		deselect: HAServices.sceneOn,
		defaultIcon: 'mdi-palette',
		supports: [
			"on-off"
		]
	}
};