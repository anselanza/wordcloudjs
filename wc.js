var WC = {
	Word: function(params) {
		this.text = params.text;
		this.myLevel = params.startLevel;

		console.log("Created Word object for '"+this.text + "' at level "+this.myLevel);

		this.particle = physics.makeParticle();
		var range = DEFAULT_CAM_Z * 0.75;
		this.particle.position.set(Math.random()*range - range/2, Math.random()*range - range/2, 0);

		// Add images into ParticleSystem...
		this.vertex = new THREE.Vector3();
		this.vertex.x = this.particle.position.x;
		this.vertex.y = this.particle.position.y;
		this.vertex.z = this.particle.position.z;
		geometry.vertices.push( this.vertex );
		// console.log("Vertex position: "+geometry.vertices[geometry.vertices.length-1].x+" / Num vertices: "+geometry.vertices.length);

		// Get synonyms, recursively...
		var synonyms = [];
		var nextLevel = this.myLevel + 1;
		if (this.myLevel < MAX_LEVELS) {
			var APIcall = "http://words.bighugelabs.com/api/2/185bb5ddb325382201efac61e7b7b853/"+this.text+"/json?callback=?";
			$.getJSON(APIcall, function(data){
				$.each( data.verb.syn, function (i, syn) {
					countQueries++;
					console.log("Queries so far: "+countQueries +", pendingRecursions: "+pendingRecursions);
					pendingRecursions++;
					var w = new WC.Word({ text:syn, startLevel:nextLevel });
					words.push(w);
					synonyms.push(w);
				});
				console.log("Decrement pendingRecursions");
				pendingRecursions--;
			});
		}
		this.synonyms = synonyms;
	}
};

WC.Word.prototype = {
	update: function(elapsedTime) {
		// this.vertex.set(this.particle.position.x, this.particle.position.y, this.particle.position.z);
		// this.vertex.x = this.particle.position.x;
		// this.vertex.y = this.particle.position.y;
		// this.vertex.z = this.particle.position.z;
	}
};