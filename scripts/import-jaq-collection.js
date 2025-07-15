const fs = require('fs');
const path = require('path');

// Parse Jaq's movie collection from the markdown file
function parseJaqCollection() {
  const filePath = path.join(__dirname, '..', 'jaq-notion.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const lines = content.split('\n');
  const movies = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, headers, and CSV references
    if (!trimmed || trimmed.startsWith('#') || trimmed.includes('.csv') || trimmed === '**Others that need to be logged**') {
      continue;
    }
    
    // Parse movie entries
    let title = trimmed;
    let status = 'RECOMMENDED';
    let enthusiasmLevel = 3;
    let jaqNotes = null;
    let type = 'MOVIE';
    
    // Check if completed (crossed out)
    if (title.includes('~~') && title.endsWith('~~')) {
      status = 'COMPLETED';
      title = title.replace(/~~/g, '');
    }
    
    // Check if it's a series
    if (title.includes('(episodes)')) {
      type = 'SERIES';
      title = title.replace('(episodes)', '').trim();
    }
    
    // Extract enthusiasm and notes
    if (title.includes('!')) {
      enthusiasmLevel = 5;
      // Extract notes if there are explanatory comments
      const noteMatch = title.match(/(.+?)\s+(.+this.+|.+incredible.+|.+mind blowing.+)/i);
      if (noteMatch) {
        title = noteMatch[1].trim();
        jaqNotes = noteMatch[2].trim();
      }
    }
    
    // Check for currently watching indicators
    if (title.includes('starting') || title.includes('😊')) {
      status = 'WATCHING';
      title = title.replace(/starting|😊/g, '').trim();
    }
    
    // Clean up title
    title = title.replace(/[👀😊]/g, '').trim();
    if (title.endsWith('.')) {
      title = title.slice(0, -1);
    }
    
    // Skip if title is too short or invalid
    if (title.length < 2) continue;
    
    movies.push({
      title: title,
      type: type,
      status: status,
      enthusiasmLevel: enthusiasmLevel,
      jaqNotes: jaqNotes,
      recommendedBy: 'jaq'
    });
  }
  
  return movies;
}

// Export the parsed data
const jaqMovies = parseJaqCollection();

console.log('Parsed Jaq\'s collection:');
console.log(`Total items: ${jaqMovies.length}`);
console.log('\nSample entries:');
jaqMovies.slice(0, 5).forEach(movie => {
  console.log(`- ${movie.title} (${movie.type}) - ${movie.status} - Level: ${movie.enthusiasmLevel}`);
  if (movie.jaqNotes) console.log(`  Notes: ${movie.jaqNotes}`);
});

// Save to JSON for import
fs.writeFileSync(
  path.join(__dirname, 'jaq-collection.json'), 
  JSON.stringify(jaqMovies, null, 2)
);

console.log('\nSaved to jaq-collection.json');

module.exports = { jaqMovies };