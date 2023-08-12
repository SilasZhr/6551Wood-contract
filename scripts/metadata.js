const fs = require('fs');

// Generate a random rarity based on the given ratio
function getRandomRarity() {
  const ratio = Math.random();
  return ratio < 0.9 ? 'Common' : 'Rare';
}

// Generate a unique name for each file
function getUniqueName(index) {
  return `AEX #${index}`;
}

// Generate a JSON object with the specified attributes
function generateJSON(index) {
  const json = {
    image: 'ipfs://bafybeih2dgax2a2dclnrerzqfxz5iug6w66m67qcazy4rovb4o63mjuqlu/axe.jpg',
    name: getUniqueName(index),
    attributes: [
      { trait_type: 'Rarity', value: getRandomRarity() },
      { trait_type: 'Type', value: 'Axe' }
    ]
  };

  return JSON.stringify(json, null, 2);
}

// Create 1000 JSON files
function createBatch() {
  const batchFolder = './metadata/';

  if (!fs.existsSync(batchFolder)) {
    fs.mkdirSync(batchFolder);
  }

  for (let i = 0; i < 1000; i++) {
    const filename = `${batchFolder}${i}`;
    const jsonContent = generateJSON(i);

    fs.writeFileSync(filename, jsonContent);
    console.log(`Generated ${filename}`);
  }
}

createBatch();
