# Quick Fix for AssetStudio Error

## ⚡ Fast Solution

**The error is about Shaders, NOT your 3D models!**

### Do This:

1. **Click `OK`** on the error dialog
2. **Continue using AssetStudio** - it will skip the problematic shader
3. **Look in the left panel** for **`Mesh`** objects
4. **Select Mesh objects** (these are your 3D models)
5. **Export them** - Shaders aren't needed for models!

### Alternative: Load Individual File

Instead of loading the whole folder:

1. `File` → `Load file` (not "Load folder")
2. Select: `sharedassets0.resource`
3. This smaller file might work better

### Still Not Working?

**Download free models instead:**
- Go to: https://sketchfab.com/
- Search: "elephant glb free"
- Download `.glb` files
- Place in: `public/models/`

**This is often faster than extracting!** 🚀

