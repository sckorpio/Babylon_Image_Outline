//---------------Basics----------------------------
var canvas = document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas,true);
var scene;
var camera;
//----------------Materials------------------------
var materialRed;
var materialGreen;
var materialBlue;
var materialYellow;
var materialTeal;
var materialMagenta;
var materialWhite;

var materialmask;
var materialoutline;
//----------------Render_target_texture------------
var simpleTarget;
var maskTarget;
//------------------------------------------------
var outLineThickness = 5;
var outLineColor = new BABYLON.Vector4(1.0,1.0,0.0,1.0);
//------------------------------------------------

function createMaterials()
{
    materialRed = new BABYLON.StandardMaterial("materialRed",scene);
    materialRed.diffuseColor = BABYLON.Color3.Red();

    materialGreen = new BABYLON.StandardMaterial("materialRed",scene);
    materialGreen.diffuseColor = BABYLON.Color3.Green();

    materialBlue = new BABYLON.StandardMaterial("materialRed",scene);
    materialBlue.diffuseColor = BABYLON.Color3.Blue();

    materialYellow = new BABYLON.StandardMaterial("materialYellow",scene);
    materialYellow.diffuseColor = BABYLON.Color3.Yellow();

    materialTeal = new BABYLON.StandardMaterial("materialCyan",scene);
    materialTeal.diffuseColor = BABYLON.Color3.Teal();

    materialMagenta = new BABYLON.StandardMaterial("materialMagenta",scene);
    materialMagenta.diffuseColor = BABYLON.Color3.Magenta();

    materialWhite = new BABYLON.StandardMaterial("materialWhite",scene);
    materialWhite.diffuseColor = BABYLON.Color3.White();
               

    //-------Material_Custom-----
    //---------------maskling_material------------
    materialmask = new BABYLON.ShaderMaterial(
        "shaderMask",
        scene,
        "./MASK",
        {
            attributes: ["position"],
            uniforms: ["worldViewProjection"],
        },
    );

    //---------------outline_material------------
    materialoutline = new BABYLON.ShaderMaterial(
        "shaderOutline",
        scene,
        "./OUTLINE",
        {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "textureMaskSampler", "textureSimpleSampler","outline_pixel_width","outline_color"],
        },
    );
    
}

function createRenderTargetTextures()
{
     //----------Simple Target------------------------------------
     simpleTarget = new BABYLON.RenderTargetTexture(
        "simpleTarget",
        {
            width: 1024,
            height: 512,
        },
        scene,
        {
            generateDepthTexture: false,
            generateStencilBuffer: false,
        }
    );

    simpleTarget.clearColor = new BABYLON.Color3.Blue();
    simpleTarget.activeCamera = scene.activeCamera
    scene.customRenderTargets.push(simpleTarget);

    
    //----------Mask Target---------------------------------------
    maskTarget = new BABYLON.RenderTargetTexture(
        "maskTarget",
        {
            width: 1024,
            height: 512,
        },
        scene,
        {
            generateDepthTexture: false,
            generateStencilBuffer: false,
        }
    );

    maskTarget.clearColor = new BABYLON.Color3.Black();
    maskTarget.activeCamera = scene.activeCamera
    scene.customRenderTargets.push(maskTarget);
}


function createObjects()
{
    //------SCENE_OBJECTS----------------------------------------------------------------

    var floorBox = BABYLON.MeshBuilder.CreateBox("FloorBox1");
    floorBox.position = new BABYLON.Vector3(0,0,0);
    floorBox.scaling = new BABYLON.Vector3(100,1,100);
    floorBox.material = materialGreen;
    //-----------Mesh_Builder-------------------
    
    var sphere1 = BABYLON.MeshBuilder.CreateSphere("Sphere1");
    sphere1.position = new BABYLON.Vector3(3,20,-2);
    sphere1.scaling = new BABYLON.Vector3(7,7,7);
    sphere1.material = materialMagenta;
    

    var sphere2 = BABYLON.MeshBuilder.CreateSphere("Sphere2");
    sphere2.position = new BABYLON.Vector3(0,15,0);
    sphere2.scaling = new BABYLON.Vector3(7,7,7);
    sphere2.material = materialRed;

    var sphere3 = BABYLON.MeshBuilder.CreateSphere("Sphere3");
    sphere3.position = new BABYLON.Vector3(-8,17,0);
    sphere3.scaling = new BABYLON.Vector3(3,3,3);
    sphere3.material = materialYellow;
    

    var sphere4 = BABYLON.MeshBuilder.CreateSphere("Sphere4");
    sphere4.position = new BABYLON.Vector3(-5,17,0);
    sphere4.scaling = new BABYLON.Vector3(6,6,6);
    sphere4.material = materialTeal;

    var sphere5 = BABYLON.MeshBuilder.CreateSphere("Sphere5");
    sphere5.position = new BABYLON.Vector3(5,20,-5);
    sphere5.scaling = new BABYLON.Vector3(4,4,4);
    sphere5.material = materialGreen;
    

    var sphere6 = BABYLON.MeshBuilder.CreateSphere("Sphere6");
    sphere6.position = new BABYLON.Vector3(-2,15,8);
    sphere6.scaling = new BABYLON.Vector3(8,8,8);
    sphere6.material = materialBlue;

    var sphere7 = BABYLON.MeshBuilder.CreateSphere("Sphere7");
    sphere7.position = new BABYLON.Vector3(-2,10,2);
    sphere7.scaling = new BABYLON.Vector3(4,4,4);
    sphere7.material = materialGreen;

    var sphere8 = BABYLON.MeshBuilder.CreateSphere("Sphere8");
    sphere8.position = new BABYLON.Vector3(6,16,4);
    sphere8.scaling = new BABYLON.Vector3(9,9,9);
    sphere8.material = materialYellow;
    

    //------------Mesh_Loading------------------

    var tree1=BABYLON.SceneLoader.ImportMesh("", "scenes/", "dead_tree.obj", scene, function (meshes) {          
        var mesh1 = meshes[0];
        mesh1.material = materialWhite;
        mesh1.scaling = new BABYLON.Vector3(8,8,8);
        mesh1.position = new BABYLON.Vector3(0,0,0);

        simpleTarget.renderList.push(mesh1);
        simpleTarget.setMaterialForRendering(mesh1,materialWhite);
    });
    

    //------------Adding all objects to render target-----------
    function addAllObjectToTarget()
    {
        scene.meshes.forEach(mesh => {
        if (mesh) {
            console.log(mesh.name);
            simpleTarget.renderList.push(mesh);
            simpleTarget.setMaterialForRendering(mesh,mesh.material);
            }
        });
    }

    addAllObjectToTarget();

}


function castRay()
{       
    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera, false);	

    var hit = scene.pickWithRay(ray); 
    maskTarget.renderList.pop();
    if (hit.pickedMesh)
    {
        maskTarget.renderList.push(hit.pickedMesh);
        maskTarget.setMaterialForRendering(hit.pickedMesh,materialmask);
    }      
}

function createCamera()
{
//-----Free Camera----------
    camera = new BABYLON.FreeCamera("camera1",new BABYLON.Vector3(0,10,-40),scene);
    camera.setTarget(new BABYLON.Vector3(0,10,0));
    
    camera.attachControl(canvas,true);
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);

}

function createLight()
{
    //-----Hemisphere light----
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 50, 0), scene);
    light.diffuse = new BABYLON.Color3(1,1,1);
}

function createObjectOutlinePlane()
{
    //------Adding Plane for rendering RTT's----------
    var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:10, width: 10});  
    plane.scaling.y = 1.0 / engine.getAspectRatio(scene.activeCamera);
    var camera_fov = scene.activeCamera.fov;

    plane.position = new BABYLON.Vector3(0,0,5.8);
    plane.isPickable = false;

    materialoutline.setTexture("textureSimpleSampler", simpleTarget);
    materialoutline.setTexture("textureMaskSampler", maskTarget);
    materialoutline.setInt("outline_pixel_width", outLineThickness);

    plane.material = materialoutline;
    plane.parent = camera;
}



function createGUI()
{
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "300px";
    panel.isVertical = true;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(panel);

    var textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = "SnapTrude Test - KARTIK";
    textBlock.height = "60px";
    textBlock.width = "300px";
    textBlock.color = "white";
    textBlock.fontSize = 25;
    panel.addControl(textBlock);  
    //----COLOR_PICKER---------------
    var textBlockColor = new BABYLON.GUI.TextBlock();
    textBlockColor.text = "Outline color:";
    textBlockColor.height = "30px";
    textBlockColor.color = "white";
    panel.addControl(textBlockColor);     

    var picker = new BABYLON.GUI.ColorPicker();
    picker.height = "150px";
    picker.width = "150px";
    picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    picker.onValueChangedObservable.add(function(value) { 
        materialoutline.setVector4("outline_color", new BABYLON.Vector4(value.r,value.g,value.b,1.0));
    });

    panel.addControl(picker);

    //--------SLIDER-----------
    var header = new BABYLON.GUI.TextBlock();
    header.text = "Outline Thickness";
    header.height = "30px";
    header.color = "white";
    panel.addControl(header); 

    var slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 20;
    slider.value = outLineThickness;
    slider.height = "20px";
    slider.width = "200px";
    slider.onValueChangedObservable.add(function(value) {
        outLineThickness = (Number)(value);
        header.text = "Thickness: " + Math.floor(outLineThickness) + " px";
        materialoutline.setInt("outline_pixel_width", outLineThickness);
    });
    
    panel.addControl(slider);    
}


function createScene()
{
    //--------------SCENE--------------------------------------------------------------------------------
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Blue();

    createMaterials();
    createRenderTargetTextures();
    createObjects();
    createCamera();
    createLight();
    createObjectOutlinePlane();
    createGUI();

    return scene;

}

window.addEventListener("DOMContentLoaded",function(){
   
    scene = createScene();
    //------------UPDATION------------------
    scene.registerBeforeRender(function(){
        castRay();
    });

    engine.runRenderLoop(function(){
        scene.render();
    });

    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});