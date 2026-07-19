import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { 
  DEMO_USERS, 
  DEMO_HOSTELS, 
  DEMO_ROOMS, 
  DEMO_COMPLAINTS, 
  DEMO_VISITORS, 
  DEMO_LAUNDRY, 
  DEMO_PAYMENTS, 
  DEMO_NOTICES, 
  DEMO_NOTIFICATIONS 
} from './seedData.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('🌱 Starting HostelHub Demo Seeding...');

  const dbPath = path.resolve(__dirname, 'db.json');
  
  const mockDbState = {
    users: [...DEMO_USERS],
    hostels: [...DEMO_HOSTELS],
    rooms: [...DEMO_ROOMS],
    complaints: [...DEMO_COMPLAINTS],
    visitors: [...DEMO_VISITORS],
    laundry: [...DEMO_LAUNDRY],
    payments: [...DEMO_PAYMENTS],
    notices: [...DEMO_NOTICES],
    notifications: [...DEMO_NOTIFICATIONS],
    attendance: [
      {
        id: 'att-1',
        studentId: 'user-student-1',
        date: new Date().toISOString().split('T')[0],
        status: 'PRESENT',
        markedById: 'user-warden-1'
      },
      {
        id: 'att-2',
        studentId: 'user-student-1',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        status: 'PRESENT',
        markedById: 'user-warden-1'
      }
    ],
    auditLogs: [
      {
        id: 'log-1',
        userId: 'user-admin-1',
        action: 'SEED_SYSTEM',
        entity: 'System',
        entityId: 'root',
        metadata: { info: 'Initial database seeding executed successfully' },
        createdAt: new Date().toISOString()
      }
    ]
  };

  fs.writeFileSync(dbPath, JSON.stringify(mockDbState, null, 2), 'utf-8');
  console.log(`✅ Demo database successfully seeded. Mock file written to: ${dbPath}`);
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
