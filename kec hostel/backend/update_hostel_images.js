const { executeQuery } = require('./config/db');

async function update() {
  await executeQuery("UPDATE hostels SET image = '/assets/hostel-amaravathi.jpg' WHERE id = 'amaravathi'");
  await executeQuery("UPDATE hostels SET image = '/assets/hostel-bhavani.jpg' WHERE id = 'bhavani'");
  await executeQuery("UPDATE hostels SET image = '/assets/hostel-kaveri.jpg' WHERE id = 'kaveri'");
  console.log('✓ SQLite database updated with new hostel images!');
  process.exit(0);
}

update().catch(err => {
  console.error(err);
  process.exit(1);
});
