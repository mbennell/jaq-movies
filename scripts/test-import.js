// Test script to import Jaq's collection
async function testImport() {
  try {
    console.log('Starting import of Jaq\'s collection...');
    
    const response = await fetch('http://localhost:3000/api/import/jaq-collection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    console.log('Import completed!');
    console.log('Results:', result);
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

testImport();