# Babylon_Image_Outline
<img width="1713" alt="screenshot1" src="https://github.com/sckorpio/Babylon_Image_Outline/assets/26852658/46fa46e5-6b90-4045-a8bf-f70232624c3a">

# Build Instructions
- Clone the Repo
- Open the folder in VS Code
- Run the index.html file in browser

# Implementation
- Rendering the object outlines are not that easy
- There are multiple ways to do that 
- I have used the "Post Processing method"
- It used multiple FrameBuffers( RenderTargetTexture in Babylon )

# Steps:
1) The whole scene is rendered on a RenderTargetTexture(Simple)
3) Using Ray casting the selected object is picked
4) Only the selected object is rendered on another RenderTargetTexture(Mask) using custom "MASK shader"
5) Inside the custom MASK shader only white color is used to render the selected object
6) Then a plane is rendered on the whole screen using a custom "OUTLINE shader"
7) Inside the custom OUTLINE shader the textures A & B are used
8) The intensity of outline is calculated by considring the nearby pixels (number of px= thickness)
9) If Intensity = 0 , then fragment from Simple RenderTargetTexture is used
10) If Intensity > 0, then fragcolor = outlineColor is used
11) if The fragment in Mask RenderTargetTexture is white, then the fragment color is discarded and Simple is used 

<img width="1716" alt="screenshot2" src="https://github.com/sckorpio/Babylon_Image_Outline/assets/26852658/d8adb90b-af6c-46d7-be0a-8007242b564d">
