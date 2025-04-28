import fs from "fs-extra";
import path from "path";

async function copyManifest() {
  console.log("Copying manifest.json to dist folder...");

  try {
    // Copy manifest.json to dist
    await fs.copy(
      path.resolve("public/manifest.json"),
      path.resolve("dist/manifest.json")
    );

    // Create placeholder icons
    const sizes = [16, 48, 128];
    for (const size of sizes) {
      console.log(`Creating placeholder ${size}x${size} icon...`);
      await createPlaceholderIcon(`dist/icon${size}.png`, size);
    }

    console.log("Manifest and icons copied successfully!");
  } catch (err) {
    console.error("Error copying files:", err);
    process.exit(1);
  }
}

// Simple function to create placeholder icon files
async function createPlaceholderIcon(filepath, size) {
  try {
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    // Write a simple text file as placeholder
    // In a real extension, you'd use actual PNG files
    await fs.writeFile(filepath, `Placeholder for ${size}x${size} icon`);
  } catch (err) {
    console.error(`Error creating icon ${filepath}:`, err);
  }
}

// Run the copy function
copyManifest();
