import * as fs from 'fs';
import * as path from 'path';
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

interface DbSchema {
  users: any[];
  hostels: any[];
  rooms: any[];
  complaints: any[];
  visitors: any[];
  laundry: any[];
  payments: any[];
  notices: any[];
  notifications: any[];
  attendance: any[];
  auditLogs: any[];
}

class MockDatabase {
  private dbPath: string;
  private memoryData: DbSchema;

  constructor() {
    this.dbPath = path.resolve(process.cwd(), '..', '..', 'prisma', 'db.json');
    this.memoryData = this.loadInitialData();
  }

  private loadInitialData(): DbSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('⚠️ Could not load prisma/db.json, initializing from memory seedData');
    }

    return {
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
        }
      ],
      auditLogs: []
    };
  }

  public get data(): DbSchema {
    return this.memoryData;
  }

  public save(): void {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist mock database file:', e);
    }
  }

  public logAudit(userId: string, action: string, entity: string, entityId: string, metadata?: any): void {
    const entry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      action,
      entity,
      entityId,
      metadata: metadata || null,
      createdAt: new Date().toISOString()
    };
    this.memoryData.auditLogs.unshift(entry);
    this.save();
  }
}

export const db = new MockDatabase();
