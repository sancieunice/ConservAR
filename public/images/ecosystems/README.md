# Ecosystem Target Images

This directory contains the Vuforia image targets that users will scan with the Unity + Vuforia AR mobile app.

## How to Add Images

1. Place your ecosystem target images in this folder
2. Update the image filenames in the `ARExperience.tsx` component to match your actual files
3. The image targets should be clear, high-contrast images that the Vuforia Image Target system can reliably detect

## Required Images

Create or add the following target images (JPG or PNG format):

- **savanna-target.jpg** - Savanna ecosystem target for African wildlife (rhino, elephant, etc.)
- **rainforest-target.jpg** - Rainforest ecosystem target for tropical species
- **mountain-target.jpg** - Mountain ecosystem target for alpine species

## Image Specifications

For optimal Vuforia detection:

- **Resolution:** At least 640x480 pixels (recommend 1024x768 or higher)
- **Format:** JPG or PNG
- **Characteristics:** High contrast, distinct features, minimal repetition
- **Content:** Can be wildlife, habitat, ecosystem visual, or QR-code hybrid design

## Workflow

1. User browses the website's AR section
2. System displays ecosystem target images one-by-one with navigation controls
3. User opens the Unity + Vuforia mobile app
4. User scans the displayed target image with their device camera
5. Vuforia recognizes the target and displays the corresponding AR animal model
6. User interacts with AR model using in-app Q&A buttons

## Configuration

To modify ecosystem targets, edit the `ecosystemTargets` array in `client/src/components/ARExperience.tsx`:

```typescript
const ecosystemTargets: EcosystemTarget[] = [
  {
    id: "ecosystem-id",
    name: "Ecosystem Name",
    imageUrl: "/images/ecosystems/your-image.jpg",
    description: "Scan instructions and ecosystem context",
  },
];
```

## Testing Vuforia Targets

Before deploying:

1. Upload images to Vuforia Target Manager
2. Generate and test Unity target database
3. Verify detection reliability in Unity app
4. Test on actual Android/iOS devices

---

For AR model setup, see `QUICK_START_AR.md` in the project root.
