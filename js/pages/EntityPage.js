/**
 * Create an entity page, based on the entity type metadata and the entity content
 * The reason that we do it this way is because so far all of the entites behave the same exact way with slight differences.
 * Icons, Services that they call on toggle, etc...
 */
var EntityPage = (function() {

	var templateSwitch = [
		'<li id="entity-attribute-%1" class="entity-attribute-item li-has-toggle" data-attribute="%1">',
			'<label>',
				'<div class="name-container ui-marquee ui-marquee-gradient">',
					'%2',
				'</div>',
				'<label class="switch %3">',
					'<span class="slider round"></span>',
				'</label>',
			'</label>',
		'</li>'
	]

	var templateEffects = [
		'<li class="entity-attribute-item li-has-toggle" data-attribute="%1">',
			'<label>',
				'<div class="list-item-container ui-marquee ui-marquee-gradient">',
					'%2',
				'</div>',
			'</label>',
		'</li>'
	];
	
	var templateOption = [
	    '<li class="entity-attribute-item li-has-toggle" data-attribute="options" data-option="%1">',
	    	'<label>',
	        	'<div class="list-item-container ui-marquee ui-marquee-gradient">',
	            	'%1',
	            '</div>',
	            '<div class="entity-list-item-icon icon-container selected" style="display: %2" >',
	            	'<div class="mdi mdi-48px mdi-check">',
	            '</div>',
	        '</label>',
	    '</li>'
	];

	var templateListItemWithIcon = [
	    '<li class="entity-attribute-item li-has-toggle" data-attribute="%1" style="background-color: transparent;">',
		    '<label>',
		    	'<div class="list-item-container ui-marquee ui-marquee-gradient">',
		    		'%2',
		    	'</div>',
		    	'<div class="entity-list-item-icon icon-container %3" >',
		    		'<div class="mdi mdi-48px mdi-%4">',
		    	'</div>',
		    '</label>',
	    '</li>'
    ];

	
	/**
	 * Constructor
	 * @param entity The json object with all of the entity information
	 */
	function EntityPage(dataManager) {
		this.currentPage = null;
		this.dataManager = dataManager;

		$('#entity-back-button').click(historyBack);
		$('#effects-back-button').click(historyBack);

		// Blank out the current page on hide
		document.getElementById('entity').addEventListener("pagebeforehide", function() {
			this.currentPage = null;
		}.bind(this));
	}

	EntityPage.prototype.createEntityPage = function(metadata, entity) {
		reloadPage(this.dataManager, entity, metadata);
		this.currentPage = entity.attributes.friendly_name;
	};
	
	function reloadPage(dataManager, entity, metadata) {
		createEntityDom(metadata, entity, dataManager.getHiddenEntities());
		registerEntityEventHandlers(dataManager, entity, metadata);
	}

	// Helper method to create the list dom from the entities
	function createEntityDom(metadata, entity, hiddenEntities) {
		var domString = "";

		domString = createOnOffDom(domString, metadata, entity);

		domString = createEffectsDom(domString, metadata, entity);

		domString = createOptionsDom(domString, metadata, entity);

		domString = createMediaPlayerDom(domString, metadata, entity);

		// Add additional functionalities

		var checked = hiddenEntities.includes(entity.entity_id) ? "switch-checked" : "";
		domString = domString + templateSwitch.join('\n').replace(/%1/g, "hidden")
			.replace(/%2/g, "Hidden")
			.replace(/%3/g, checked);
		
		var name = entity.attributes.friendly_name;
		if(name === undefined)
			name = entity.entity_id;

		$('#entity-attribute-list').html(domString);
		$('#entity-title').html(name);
		
		updateBackgroundImage(entity);
	}
	
	function updateBackgroundImage(entity) {
		if(entity.entity_id.startsWith("media_player"))
			HAServices.getImage(entity.entity_id,
				url => {
					if(url != undefined) {
						$('#entity').css("background-size", "contain");					
						$('#entity').css("background-image", "linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url('" + url + "')");			
					}
					else {
						$('#entity').css("background-size", "");
						$('#entity').css("background-image", "");			
					}
				});
		else {
			$('#entity').css("background-size", "");
			$('#entity').css("background-image", "");			
		}
	}

	function createOnOffDom(domString, metadata, entity){
		// Do nothing if the entity does not support On-Off
		if (!metadata.supports.includes("on-off")){
			return domString;
		}

		var checked = metadata.selectedStates.includes(entity.state) ? "switch-checked" : "";
		return domString + templateSwitch.join('\n').replace(/%1/g, "on-off")
				.replace(/%2/g, "On/Off")
				.replace(/%3/g, checked);
	};

	function createEffectsDom(domString, metadata, entity){
		// Do nothing if the entity does not support effects or has no effects
		if (!metadata.supports.includes("effects")){
			return domString;
		}
		if (!entity.attributes.hasOwnProperty("effect_list")){
			return domString;
		}

		return domString + templateEffects.join('\n').replace(/%1/g, "effects")
				.replace(/%2/g, "Effects");
	};

	function createOptionsDom(domString, metadata, entity){
		// Do nothing if the entity does not support effects or has no effects
		if (!metadata.supports.includes("options")){
			return domString;
		}
		if (!entity.attributes.hasOwnProperty("options")){
			return domString;
		}
		
		for(var i = 0; i < entity.attributes.options.length; i++){
			var option = entity.attributes.options[i];
			var isSelected = entity.state === option ? "visible" : "none";
			domString = domString + templateOption.join('\n').replace(/%1/g, option).replace(/%2/g, isSelected);
		}
		
		return domString;
	};
	
	function isSupported(entity, feature) {
		var e = entity.attributes.supported_features;
		if(e === undefined)
			e = 0;
		return (e & feature) === feature;
	}
	
	function createMediaPlayerDom(domString, metadata, entity){
		var output = domString;
		if (metadata.supports.includes("play-pause") && isSupported(entity, 1)) {
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, "play")
				.replace(/%2/g, "Play")
				.replace(/%3/g, "")
				.replace(/%4/g, "play");
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, "pause")
				.replace(/%2/g, "Pause")
				.replace(/%3/g, "")
				.replace(/%4/g, "pause");
		}
		if(entity.entity_id === "media_player.lg_c9_soundbar") {
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, "enter")
				.replace(/%2/g, "Enter")
				.replace(/%3/g, "")
				.replace(/%4/g, "cursor-default-click");
		}
		if (metadata.supports.includes("next-previous") && isSupported(entity, 16)) {
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, "next")
				.replace(/%2/g, "Next")
				.replace(/%3/g, "")
				.replace(/%4/g, "skip-next");
		}
		if (metadata.supports.includes("next-previous") && isSupported(entity, 32)) {
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, "previous")
				.replace(/%2/g, "Previous")
				.replace(/%3/g, "")
				.replace(/%4/g, "skip-previous");
		}		
		if (metadata.supports.includes("volume-up-down") && (isSupported(entity, 1024) || isSupported(entity, 4)) ) {
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, "volume-up")
				.replace(/%2/g, "Volume Up")
				.replace(/%3/g, "")
				.replace(/%4/g, "volume-high");
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, "volume-down")
				.replace(/%2/g, "Volume Down")
				.replace(/%3/g, "")
				.replace(/%4/g, "volume-low");
		}
		if (metadata.supports.includes("mute") && isSupported(entity, 8)) {
			var isMuted = entity.attributes.is_volume_muted === true;
			output = output + templateListItemWithIcon.join('\n')
				.replace(/%1/g, isMuted ? "unmute" : "mute")
				.replace(/%2/g, isMuted ? "Unmute" : "Mute")
				.replace(/%3/g, isMuted ? "selected" : "")
				.replace(/%4/g, "volume-off");
		}
		return output;
	};
		
	// Process the "Hidden" switch that controls the entity hiding
	function processHidden(dataManager, entity_id, switchElement){
		if (dataManager.getHiddenEntities().includes(entity_id)){
			dataManager.removeHiddenEntity(entity_id);
			switchElement.classList.remove("switch-checked");
		} else {
			dataManager.addHiddenEntity(entity_id);
			switchElement.classList.add("switch-checked");
		}
	}

	// Process the "On-Off" switch that controls the entity hiding
	function processOnOff(metadata, entity, switchElement){
		if (metadata.selectedStates.includes(entity.state)) {
			// TODO FIX makes assumptions that deselect is a function that needs to be invoked in the context of the services class
			metadata.deselect.call(HAServices, entity.entity_id);
			if (metadata.title != "Scenes") {
				entity.state = metadata.deselectedStates[0]
			}
		} else {
			// TODO FIX makes assumptions that deselect is a function that needs to be invoked in the context of the services class
			metadata.select.call(HAServices, entity.entity_id);
			if (metadata.title != "Scenes") {
				entity.state = metadata.selectedStates[0]
			}
		}
	}

	// Helper to register click handlers for the list items
	function registerEntityEventHandlers(dataManager, entity, metadata) {
		function sleep(ms) {
			  return new Promise(resolve => setTimeout(resolve, ms));
			};
		
		$('.entity-attribute-item').click(function(e) {
			var li = e.currentTarget;
			var attribute = li.dataset.attribute;
			switch(attribute){
				case "hidden":
					processHidden(dataManager, entity.entity_id, li.getElementsByClassName("switch")[0]);
					break;
				case "on-off":
					processOnOff(metadata, entity, li.getElementsByClassName("switch")[0]);
					reloadPage(dataManager, entity, metadata);
					break;
				case "effects":
					createEffectPage(entity, metadata);
					tau.changePage('effects');
					break;
				case "options":
					var option = li.dataset.option;
					metadata.select.call(HAServices, entity.entity_id, {"option": option});
					entity.state = option;
					reloadPage(dataManager, entity, metadata);
					break;
				case "volume-up":
					HAServices.mediaPlayerVolumeUp.call(HAServices, entity.entity_id);
					break;
				case "volume-down":
					HAServices.mediaPlayerVolumeDown.call(HAServices, entity.entity_id);
					break;
				case "unmute":
					HAServices.mediaPlayerSetMute.call(HAServices, entity.entity_id, false);
					entity.attributes.is_volume_muted = false;
					reloadPage(dataManager, entity, metadata);
					break;
				case "mute":
					HAServices.mediaPlayerSetMute.call(HAServices, entity.entity_id, true);
					entity.attributes.is_volume_muted = true;
					reloadPage(dataManager, entity, metadata);
					break;
				case "play":
					HAServices.mediaPlayerPlay.call(HAServices, entity.entity_id);
					break;
				case "pause":
					HAServices.mediaPlayerPause.call(HAServices, entity.entity_id);
					break;
				case "next":
					HAServices.mediaPlayerNext.call(HAServices, entity.entity_id);
					sleep(1000).then(() => reloadPage(dataManager, entity, metadata));
					break;
				case "previous":
					HAServices.mediaPlayerPrevious.call(HAServices, entity.entity_id);
					sleep(1000).then(() => reloadPage(dataManager, entity, metadata));
					break;
				case "enter":
					HAServices.webosButton.call(HAServices, entity.entity_id, "ENTER");
					break;
			}
		});
	}

	return EntityPage;
})();

var templateEffect = [
	'<li class="entity-effect-item li-has-toggle" data-effect="%1">',
		'<label>',
			'<div class="list-item-container ui-marquee ui-marquee-gradient">',
				'%1',
			'</div>',
		'</label>',
	'</li>'
];

/**
 * Populate the effects page, based on the entity content
 */
function createEffectPage(entity, metadata) {
	createEffectDom(entity);
	registerEffectEventHandlers(entity, metadata);
};

// Helper method to create the list dom from the entities
function createEffectDom(entity) {
	var domString = "";

	for(var i = 0; i < entity.attributes.effect_list.length; i++){
		var effect = entity.attributes.effect_list[i];
		domString = domString + templateEffect.join('\n').replace(/%1/g, effect);
	}

	$('#effects-list').html(domString);
}

// Helper to register click handlers for the list items
function registerEffectEventHandlers(entity, metadata) {
	$('.entity-effect-item').click(function(e) {
		var li = e.currentTarget;
		var effect = li.dataset.effect;

		// TODO call HA service to set the effect.
		metadata.select.call(HAServices, entity.entity_id, {"effect": effect});
		entity.attributes.effect = effect;

		// The effect is set by turning on the entity, so we need to reflect that change
		if (metadata.selectedStates.includes(entity.state)) {
			entity.state = metadata.selectedStates[0]

			// Set the entity On-off switch to on
			var onOffLi = document.getElementById("entity-attribute-on-off")
			onOffLi.getElementsByClassName("switch")[0].classList.add("switch-checked");

			// Set the icon to selected
			var icon = document.getElementById("entity-obj-" + entity.entity_id);
			icon.getElementsByClassName("entity-list-item-icon")[0].classList.add("selected");
		}
		history.back();
		return;
	});
}
