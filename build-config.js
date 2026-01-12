// Build script to generate config.js from environment variables
const fs = require('fs');

const config = `// Supabase Configuration
const SUPABASE_CONFIG = {
    url: '${process.env.SUPABASE_URL}',
    key: '${process.env.SUPABASE_ANON_KEY}'
};
`;

fs.writeFileSync('config.js', config);
console.log('config.js generated successfully');
