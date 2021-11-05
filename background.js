const directionalLightColor = 0xff51a8;
const ambientLightColor = 0x002266;
const fogColor = 0x002266;
const light1Color = 0xcc6600;
const light2Color = 0xd8547e;
const light3Color = 0x3677ac;

let scene, camera, renderer, cloudParticles = [],
    composer;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    let ambient = new THREE.AmbientLight(ambientLightColor);
    scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight(directionalLightColor);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    let light1 = new THREE.PointLight(light1Color, 50, 200, 1.7);
    light1.position.set(200, 300, 100);
    scene.add(light1);

    let light2 = new THREE.PointLight(light2Color, 50, 400, 1.7);
    light2.position.set(100, 300, 100);
    scene.add(light2);

    let light3 = new THREE.PointLight(light3Color, 50, 200, 1.7);
    light3.position.set(300, 300, 200);
    scene.add(light3);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.fog = new THREE.FogExp2(fogColor, 0.001);
    renderer.setClearColor(scene.fog.color);
    document.body.appendChild(renderer.domElement);

    let loader = new THREE.TextureLoader();
    loader.load('assets/smoke.png', (texture) => {
        cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });
        for (let p = 0; p < 50; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                500,
                Math.random() * 500 - 500
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
    })
    loader.load("assets/stars.jpg", function(texture) {

        const textureEffect = new POSTPROCESSING.TextureEffect({
            blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
            texture: texture
        });
        textureEffect.blendMode.opacity.value = 0.2;

        const bloomEffect = new POSTPROCESSING.BloomEffect({
            blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
            kernelSize: POSTPROCESSING.KernelSize.SMALL,
            useLuminanceFilter: true,
            luminanceThreshold: 0.3,
            luminanceSmoothing: 0.75
        });
        bloomEffect.blendMode.opacity.value = 1.5;

        let effectPass = new POSTPROCESSING.EffectPass(
            camera,
            bloomEffect,
            textureEffect
        );
        effectPass.renderToScreen = true;

        composer = new POSTPROCESSING.EffectComposer(renderer);
        composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));
        composer.addPass(effectPass);

        window.addEventListener("resize", onWindowResize, false);
        render();
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.001;
    });
    composer.render(0.1);
    requestAnimationFrame(render);
}
init();