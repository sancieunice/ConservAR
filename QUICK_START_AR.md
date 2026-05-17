# Quick Start: Adding Your 3D Model to AR Experience

## Option 1: Test with a Public Model (Quick Test)

For immediate testing, you can use a publicly hosted model. Update `server/storage.ts`:

```typescript
modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
```

This lets you test the AR functionality right away!

## Option 2: Use Your Own Model File

### Step 1: Get Your 3D Model

**If you have an APK file:**

1. **Extract the APK:**
   ```bash
   # Rename APK to ZIP
   # Then extract it, or use a tool like:
   # - APKTool: https://ibotpeaches.github.io/Apktool/
   # - Or simply rename .apk to .zip and extract
   ```

2. **Find 3D models in:**
   - `assets/` folder
   - `res/` folder  
   - Look for files: `.glb`, `.gltf`, `.obj`, `.fbx`, `.dae`

3. **Convert if needed:**
   - If you find `.obj` or other formats, convert to `.glb`:
     - Online: https://products.aspose.app/3d/conversion/obj-to-gltf
     - Or use Blender (free): https://www.blender.org/

**If you need to download a model:**
- [Sketchfab](https://sketchfab.com/) - Search "free download"
- [Poly Haven](https://polyhaven.com/models)
- [TurboSquid Free Models](https://www.turbosquid.com/Search/3D-Models/free)

### Step 2: Place Your Model

Copy your `.glb` file to:
```
public/models/your-model-name.glb
```

Example:
```
public/models/elephant.glb
public/models/tiger.glb
```

### Step 3: Update Database

Edit `server/storage.ts` and update the `modelUrl`:

```typescript
{
  name: "African Elephant",
  // ... other fields ...
  modelUrl: "/models/elephant.glb",  // Your model path
  hasArModel: true
}
```

### Step 4: Test!

1. Restart your server if needed
2. Open `http://localhost:5001/`
3. Scroll to "AR Wildlife Experience"
4. Select your animal from the list
5. Click "View in AR" (on mobile) or interact with the 3D viewer (on desktop)

## Troubleshooting

**Model doesn't load:**
- Check file path matches exactly (case-sensitive)
- Ensure file is in `public/models/` directory
- Check browser console for errors

**AR button doesn't work:**
- Must be on mobile device (iOS Safari or Android Chrome)
- Grant camera permissions
- Model must be `.glb` or `.usdz` format

**Model is too large:**
- Keep files under 5MB for best performance
- Use Blender to optimize/compress models

## Need Help?

If you have your APK file and need help extracting models, let me know!

