import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap';
// import vertex from './shaders/vertex.glsl'
// import fragment from './shaders/fragment.glsl'

export default class Scketch {
    constructor(opt) {
        this.container = opt.domElement;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.viewSize = 550;
        this.aspectRation = this.width / this.height;

        
        this.camera = new THREE.OrthographicCamera(-this.aspectRation * this.viewSize / 2, this.aspectRation * this.viewSize / 2, this.viewSize / 2, -this.viewSize / 2, -1000, 1000);
        // this.camera.position.z = 700;

        // this.camera.fov = 2 * Math.atan( ((this.height / 2) / 700) * 180/Math.PI );
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);

        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.groups = [];

        this.blank = new THREE.Group();

        this.time = 0;

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshNormalMaterial({ color: 0x00ff00 });

        this.addObjects();
        this.addSlickElement();
        this.render();
        this.setupSettings();
    }

    addSlickElement() {
        this.#addLine();
    }

    addObjects() {
        // this.geometry = new THREE.PlaneGeometry( 1, 1, 100, 100 );
       
        
        // this.material = new THREE.ShaderMaterial({
        //     uniforms: {
        //         time: {value: 1.0},
        //     },
        //     vertexShader: vertex,
        //     fragmentShader: fragment,
        // })
        let startY = -200;
        let angle = 0;
        for(let j = 0; j < 7; j++) {
            const group = this.#addLine();
            group.position.y = startY + j*70
            group.position.x += -(j* Math.cos(angle)) * 10
            angle += Math.PI / 45
            this.scene.add(group)
            this.groups.push(group)
        }
       
        
    }

    #addLine() {
        let widthElement = 45;
        let startX = -(this.width / 5);

        const group = new THREE.Group();
        for(let i = 0; i < 18; i++) {
            let mesh = new THREE.Mesh( this.geometry, this.material );
            // this.mesh.position.x = 300;
            mesh.scale.set(widthElement, widthElement, widthElement / 4);
            const positionForMesh = startX + widthElement * i
            // mesh.rotateY((1 - Math.min((i + 1) * 1, 1)))
            // mesh.rotateY(0);
            mesh.rotateX(-0.3);
            mesh.position.x = positionForMesh;
            
            group.add(mesh)
            group.rotation.y = 0.5
            // group.rotateX(-0.003) 
        }
        return group;
    }

    setupResize() {
        window.addEventListener('resize', this.setupResize.bind(this))
    }

    setupSettings() {
         this.settings = {
            rotateY: 0
        }

        this.gui = new dat.GUI();

        this.gui.add(this.settings, 'rotateY', 0, 0.5, 0.01).onChange( () => {
            this.groups.forEach(group => {
                group.children.forEach(child => {
                    child.rotation.y = this.settings.rotateY
                })
            })
        })
    }

    render() {
        this.time += 0.05;
        // this.material.uniforms.time.value = this.time;
        // this.setPosition();
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render( this.scene, this.camera );
       
    }
}

new Scketch({
    domElement: document.getElementById('container')
});
