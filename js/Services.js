/**
 * Class that controls all of the xhr calls to HomeAssistant
 * @author Jerrod Lankford
 */
var HAServices = (function() {

	// Private function for building the service post request
	function HAServices() {
	    this.url = localStorage.getItem('ha-url');
		this.token = localStorage.getItem('ha-token');
	}

	/**
	 * Update the url and password and save them to local storage
	 * @param url
	 * @param password
	 */
	HAServices.prototype.updateCredentials = function(url, token) {
		if (url.endsWith("/")) {
			url = url.slice(0,url.length-1);
		}
		localStorage.setItem('ha-url', url);
		localStorage.setItem('ha-token', token);
		localStorage.setItem('ha-has-credentials', true);

		this.url = url;
		this.token = token;
	}

	/**
	 * Fetch saved credentials
	 * @returns creds
	 */
	HAServices.prototype.getCredentials = function() {
		return {
			url: this.url,
			token: this.token
		}
	};

	/**
	 * Get a list of entities from HomeAssistant
	 * @param success callback function for success
	 * @param error callback function for error
	 */
	HAServices.prototype.getEntities = function(success, error) {
		$.ajax({
			url: this.url + "/api/states",
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			success: success,
			error: error
		});
	};
	
	HAServices.prototype.getImage = function(entity, success) {
		
		
		$.ajax({
			url: this.url + "/api/states/" + entity,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			success: v => {
				if(v.attributes != undefined && v.attributes.entity_picture != undefined) {
					var p = v.attributes.entity_picture;
					if(p.startsWith("/api/"))
						success(this.url + p);
					else success(p);
				}
				else success(undefined);
			}
		});
	};

	// Function should only be used privately
	HAServices.prototype.buildPostRequest = function(path, entity_id, attributes) {

		if (attributes) {
			attributes.entity_id = entity_id;
		} else {
			attributes = {"entity_id": entity_id};
		}
		return {
			type: "POST",
			url: this.url + "/api/services/" + path,
			data: JSON.stringify(attributes),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.token
			}
		};
	}

	// Service calls

	HAServices.prototype.switchOn = function(entity_id, attributes) {
		$.ajax(this.buildPostRequest("switch/turn_on", entity_id, attributes));
	};

	HAServices.prototype.switchOff = function (entity_id) {
		$.ajax(this.buildPostRequest("switch/turn_off", entity_id));
	};

	HAServices.prototype.inputBooleanOn = function(entity_id, attributes) {
		$.ajax(this.buildPostRequest("input_boolean/turn_on", entity_id, attributes));
	};

	HAServices.prototype.inputBooleanOff = function (entity_id) {
		$.ajax(this.buildPostRequest("input_boolean/turn_off", entity_id));
	};

	HAServices.prototype.inputSelectSelectOption = function (entity_id, attributes) {
		$.ajax(this.buildPostRequest("input_select/select_option", entity_id, attributes));
	};

	
	HAServices.prototype.lightOn = function(entity_id, attributes) {
		$.ajax(this.buildPostRequest("light/turn_on", entity_id, attributes));
	};

	HAServices.prototype.lightOff = function(entity_id) {
		$.ajax(this.buildPostRequest("light/turn_off", entity_id));
	};

	HAServices.prototype.scriptOn = function(entity_id, attributes) {
		$.ajax(this.buildPostRequest("script/turn_on", entity_id, attributes));
	};

	HAServices.prototype.scriptOff = function (entity_id) {
		$.ajax(this.buildPostRequest("script/turn_off", entity_id));
	};

	HAServices.prototype.coverOpen = function(entity_id, attributes) {
		$.ajax(this.buildPostRequest("cover/open_cover", entity_id, attributes));
	};

	HAServices.prototype.coverClose = function(entity_id) {
		$.ajax(this.buildPostRequest("cover/close_cover", entity_id));
	};

	HAServices.prototype.homeassistantOn = function(entity_id, attributes) {
		$.ajax(this.buildPostRequest("homeassistant/turn_on", entity_id, attributes));
	};

	HAServices.prototype.homeassistantOff = function(entity_id) {
		$.ajax(this.buildPostRequest("homeassistant/turn_off", entity_id));
	};

	HAServices.prototype.sceneOn = function(entity_id, attributes) {
		$.ajax(this.buildPostRequest("scene/turn_on", entity_id, attributes));
	};

	HAServices.prototype.mediaPlayerVolumeUp = function(entity_id) {
		$.ajax(this.buildPostRequest("media_player/volume_up", entity_id));
	};

	HAServices.prototype.mediaPlayerVolumeDown = function(entity_id) {
		$.ajax(this.buildPostRequest("media_player/volume_down", entity_id));
	};

	HAServices.prototype.mediaPlayerSetMute = function(entity_id, mute) {
		$.ajax(this.buildPostRequest("media_player/volume_mute", entity_id, {"is_volume_muted": mute}));
	};

	HAServices.prototype.mediaPlayerPlay = function(entity_id) {
		$.ajax(this.buildPostRequest("media_player/media_play", entity_id));
	};

	HAServices.prototype.mediaPlayerPause = function(entity_id) {
		$.ajax(this.buildPostRequest("media_player/media_pause", entity_id));
	};

	HAServices.prototype.mediaPlayerNext = function(entity_id) {
		$.ajax(this.buildPostRequest("media_player/media_next_track", entity_id));
	};

	HAServices.prototype.mediaPlayerPrevious = function(entity_id) {
		$.ajax(this.buildPostRequest("media_player/media_previous_track", entity_id));
	};

	HAServices.prototype.webosButton = function(entity_id, button) {
		$.ajax(this.buildPostRequest("webostv/button", entity_id, {"button": button}));
	};

	return new HAServices();

})();