// Scene graph

var renderer;
var sceneAvatar;
var cameraAvatar;

var cameraController;

var angle = 0;
var bRotateAvatar = true;

var trueWidth = window.innerWidth/2;
var trueHeight = window.innerHeight/2;


var oldTimestamp = Date.now();
var cube;
var endZoom = true;

var L = 1;  //The window's dimension

init();
loadScene();
setupGui();
render();

function rotateAvatar(event){
	
	var x = event.clientX;
	var y = event.clientY;
	
	if(x > trueWidth){
		x -= trueWidth;
	}
	if(y > trueHeight){
		y -= trueHeight;
	}

	// Normalize the ray [-1, 1]
	x = ( x * 2 / trueWidth ) - 1;
	y = -( y * 2/ trueHeight ) + 1;

 	var ray = new THREE.Raycaster();
 	ray.setFromCamera(new THREE.Vector2(x,y), cameraAvatar);
	
	var interseccion = ray.intersectObjects(sceneAvatar.children);
	if(interseccion.length > 0){
		bRotateAvatar = !bRotateAvatar;
	}
}

function calculateDimension(ar){
	if(ar>1){
		//left,right,top,bottom,near,far
		// cameraBasket.left = -L*ar;
		// cameraBasket.right = L*ar;
		// cameraBasket.top = L;
		// cameraBasket.bottom = -L;
		// cameraBasket.near = -1;
		// cameraBasket.far= 100;
		
		// cameraEscuela.left = -L*ar;
		// cameraEscuela.right = L*ar;
		// cameraEscuela.top = L;
		// cameraEscuela.bottom = -L;
		// cameraEscuela.near = -1;
		// cameraEscuela.far= 100;
	}else{
		//left,right,top,bottom,near,far
		// cameraBasket.left = -L;
		// cameraBasket.right = L;
		// cameraBasket.top = L*ar;
		// cameraBasket.bottom = -L*ar;
		// cameraBasket.near = -1;
		// cameraBasket.far= 100;
		
		// cameraEscuela.left = -L;
		// cameraEscuela.right = L;
		// cameraEscuela.top = L*ar;
		// cameraEscuela.bottom = -L*ar;
		// cameraEscuela.near = -1;
		// cameraEscuela.far= 100;
		
	}
}
function setCameras(ar){
	//Camera configuration
	
	//Ortographic camera
	var ortographicCamera;
	if(ar>1){
		//left,right,top,bottom,near,far
		ortographicCamera = new THREE.OrthographicCamera(-L*ar, L*ar, L, -L, -1, 100);
	}else{
		//left,right,top,bottom,near,far
		ortographicCamera = new THREE.OrthographicCamera(-L, L, L*ar, -L*ar, -1, 100);
	}
	ortographicCamera.lookAt(new THREE.Vector3(0,0,0));
	
	//Perspective camera
	var perspectiveCamera = new THREE.PerspectiveCamera(75,ar,0.1,100);
	perspectiveCamera.position.set(-20,2,0);
	perspectiveCamera.lookAt(new THREE.Vector3(0,0,0));
	
	cameraAvatar = perspectiveCamera.clone();
	// cameraAvatar.target.set(0,0,0);

	//Add the cameras to the scene
	sceneAvatar.add(cameraAvatar);
}

function setupGui() {

	// Tabla de valores de interfaz
	// effectController = {
		
	// 	colorEsfera: 'rgb(217, 115, 13)',
	// 	colorLineas: 'rgb(102, 51, 0)',

	// };

	// Widget interface
	// var gui = new dat.GUI();

	// var h = gui.addFolder("Control Basketball");
	// h.addColor(effectController,"colorEsfera").name("Color pelota");
	// h.addColor(effectController,"colorLineas").name("Color lineas");
}

function init(){
	//motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(trueWidth, trueHeight);
	renderer.setClearColor(new THREE.Color("#FFFFF"));
	//Necesario manejar el borrado manualmente
	renderer.autoClear = false;
	renderer.shadowMap.enabled = true;
	
	var container = document.getElementById("avatar");
	
	//canvas
	container.appendChild(renderer.domElement);
	
	//Scene
	sceneAvatar = new THREE.Scene();
	
	//Set the cameras
	setCameras(trueWidth/trueHeight);
	//camera.lookAt(new THREE.Vector3(0,-1,0)); No es mas ecesario porque estoy dicendo donde estoy mirando con cameraControl.target.set(0,0,0)
	
	//Lights
	var ambientLight = new THREE.AmbientLight(0x888888);
	sceneAvatar.add(ambientLight);
	
	var directionalLight = new THREE.DirectionalLight(0xFFFFFF,0.4);
	directionalLight.position.set(0,1,0);
	sceneAvatar.add(directionalLight);
	
	var pointLight = new THREE.PointLight(0xFFFFFF,0.3);
	pointLight.position.set(-2,2,-2);
	sceneAvatar.add(pointLight);
	
	var focalLight = new THREE.SpotLight(0xFFFFFF,0.5);
	focalLight.position.set(4,4,4);
	focalLight.target.position.set(0,0,0);
	focalLight.penumbra = 0.3;
	focalLight.angle = Math.PI/4;
	focalLight.castShadow = true;
	focalLight.shadow.camera.fov = 70;
	
	sceneAvatar.add(focalLight);
	
	//Camera controller
	// cameraController = new THREE.OrbitControls( cameraAvatar, renderer.domElement );
	// cameraController.target.set(0,0,0);
	
	//Evento de resize para controlar la razon de aspecto y el viewport
	window.addEventListener('resize',updateAspectRatio);
}

function loadScene(){
	var path="images/";
	
	var paredes = [
					path+"mar/posX.jpg",path+"mar/negX.jpg",
					path+"mar/posY.jpg",path+"mar/negY.jpg",
					path+"mar/posZ.jpg",path+"mar/negZ.jpg"
					];
	var mapaE = new THREE.CubeTextureLoader().load(paredes);
	
	var foto = new THREE.ImageUtils.loadTexture( path + "avatar.jpg" );
	foto.magFilter = THREE.LinearFilter;
	foto.minFilter = THREE.LinearFilter;
	
	//Geometria
	// var sphereGeometry = new THREE.SphereGeometry(1,30,30);
	// var geometriaFila = new THREE.TorusGeometry( 9, 0.3, 30, 200 );
	var cubeGeometry = new THREE.CubeGeometry( 30, 30, 30 );
	
	//material
	// var material = new THREE.MeshBasicMaterial( {color:"#d9730d"} );
	// var materialFila = new THREE.MeshBasicMaterial( { color: "#663300", side: THREE.DoubleSide } );
	// var materialTexto = new THREE.MeshPhongMaterial( { color: "#00e600", specular:"#d9730d", shininess:5} );
	// var materialTextoNombre = new THREE.MeshPhongMaterial({ color: "#996633", specular:"#d9730d", shininess:5  } );
	// var materialTextoTitulo = new THREE.MeshPhongMaterial({ color: "#ffffcc", specular:"#d9730d", shininess:5  } );
	// var materialPelota = new THREE.MeshPhongMaterial({color:"#d9730d", specular:"#d9730d", shininess:9 });
	var cubeMaterial = new THREE.MeshBasicMaterial( { ambient:0xFFFFFF,	color:0xFFFFFF, specular:0xFFFFFF, shininess:50, map: foto } );
	// var materialEsfera = new THREE.MeshBasicMaterial({color:'white', envMap: mapaE});	
	
	//Meshes
	// esfera = new THREE.Mesh(geometriaEsfera,materialPelota);
	// esfera2 = new THREE.Mesh(geometriaEsfera,materialPelota);
	// fila1 = new THREE.Mesh( geometriaFila, materialFila );
	// fila2 = new THREE.Mesh( geometriaFila, materialFila );
	// fila3 = new THREE.Mesh( geometriaFila, materialFila );
	// fila4 = new THREE.Mesh( geometriaFila, materialFila );
	cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	// var esferaValencia = new THREE.Mesh(geometriaEsfera,materialEsfera);

	
	cube.receiveShadow = cube.castShadow = true;
	//Coordinates.drawGround( { size: 100, color: "#de8a00" } );
	
	//External models
	
	//Habitacion
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = mapaE;
	
	// var matParedes = new THREE.ShaderMaterial({
	// 											vertexShader: shader.vertexShader,
	// 											fragmentShader: shader.fragmentShader,
	// 											uniforms: shader.uniforms,
	// 											depthWrite: false,
	// 											side: THREE.BackSide
	// 										});
	// var habitacion = new THREE.Mesh(new THREE.CubeGeometry(30,30,30), matParedes);
	// habitacion.receiveShadow = true;

	//Transform operations
	/*
	 *ORDEN:
	 *1) Escalado
	 *2) Rotacion
	 *3) Translacion
	 * Para modificar el orden tengo que crear un nuevo objeto contenedor a lo cual aplicaré la traslacion,
	 * y despues a los objetos hijos vamos a aplicar otras trasformaciones que queremos
	 */
	
	cube.position.set(0,0,0);
	cube.scale.set(0.4,0.4,0.4);

	//Add objects to the scene
	sceneAvatar.add( cube );
	//sceneEscuela.add(esferaValencia);
	
	//Interaction with the scene
	renderer.domElement.addEventListener('click',rotateAvatar);
	// renderer.domElement.addEventListener('dblclick',dribbleAvatar);
	
}

// function dribbleAvatar(event){
	
// 	var x = event.clientX;
// 	var y = event.clientY;
// 	var derecha = false, abajo = false;
// 	var cam = null;
	
// 	if(x > window.innerWidth/2){
// 		derecha = true;
// 		x -= window.innerWidth/2;
// 	}
// 	if(y > window.innerHeight/2){
// 		abajo = true;
// 		y -= window.innerHeight/2;
// 	}
	
// 	//if(derecha && abajo) cam = cameraEscuela;
// 	//if(!derecha && abajo) cam = cameraBasket;
// 	//if(!derecha && !abajo) cam = cameraTitulo;
// 	//if(derecha && !abajo) cam = cameraTitulo;
// 	cam = cameraBasket;
// 	//Cuadrado normalizado de -1 a 1
// 	x = ( x * 4 / window.innerWidth ) - 1;
// 	y = -( y * 4/ window.innerHeight ) + 1;
	
// 	var rayo = new THREE.Raycaster();
// 	rayo.setFromCamera(new THREE.Vector2(x,y),cam);
	
// 	var interseccion = rayo.intersectObjects(sceneBasket.children);
// 	if(interseccion.length > 0){
// 		//interseccion[0].object.rotation.x += Math.PI/10;
// 		var position = {y:0};
// 		var tween = new TWEEN.Tween(position)
// 							.to({y:-3},300)
// 							.delay(100)
// 							.onUpdate(function(){
// 								esfera2.position.y = position.y;
// 								avatar.position.y = position.y;

// 							});
							
							
// 		var tweenBack = new TWEEN.Tween(position)
// 						.to({y:0},300)
// 						.delay(100)
// 						.onUpdate(function(){
// 							esfera2.position.y = position.y;
// 							avatar.position.y = position.y;
// 						});
// 		tween.chain(tweenBack);
// 		tween.start();
		
// 	}
// }

function updateAspectRatio(){
	// Set the new dimension of the viewport
	renderer.setSize(truewidth, trueHeight);
	
	// Update the camera aspect ratio
	cameraAvatar.aspect = trueWidth/trueHeight;
	cameraAvatar.updateProjectionMatrix();
}


function update(){
	//Timestamp in ms
	var timestamp = Date.now();

	//Increment the angle by 10°/sg
	if(bRotateAvatar)	angle += 10 * Math.PI/180 * (timestamp - oldTimestamp)/1000;
	
	// Actualizar EffectControl

	// esfera.material.color.set(effectController.colorEsfera);
	// fila1.material.color.set(effectController.colorLineas);
	// fila2.material.color.set(effectController.colorLineas);
	// fila3.material.color.set(effectController.colorLineas);
	// fila4.material.color.set(effectController.colorLineas);
	
	//Updae old timestamp
	oldTimestamp = timestamp;
	//Actualizamos el angulo de rotacion del objeto cubo+esfera
	cube.rotation.y = angle;
	
	TWEEN.update();	
	
}

function render(){
	requestAnimationFrame(render);
	update();
	
	renderer.clear();
	
	//Multiviewport
	renderer.setViewport( 0, 0, trueWidth, trueHeight);
	renderer.render( sceneAvatar, cameraAvatar );

	// renderer.setViewport( 0, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
	// renderer.render( sceneBasket, cameraBasket );

	// renderer.setViewport( window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
	// renderer.render( sceneEscuela, cameraEscuela );

}