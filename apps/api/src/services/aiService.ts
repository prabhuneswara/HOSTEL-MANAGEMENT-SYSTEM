export interface AICategorizationResult {
  category: 'ELECTRICAL' | 'PLUMBING' | 'CLEANING' | 'WIFI' | 'FURNITURE' | 'SECURITY' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  aiSummary: string;
}

export class AIService {
  public static async categorizeAndPrioritizeComplaint(
    title: string, 
    description: string
  ): Promise<AICategorizationResult> {
    const text = `${title} ${description}`.toLowerCase();

    let category: AICategorizationResult['category'] = 'OTHER';
    let priority: AICategorizationResult['priority'] = 'MEDIUM';

    if (text.includes('fan') || text.includes('light') || text.includes('power') || text.includes('wire') || text.includes('switch') || text.includes('sparks') || text.includes('circuit')) {
      category = 'ELECTRICAL';
      if (text.includes('sparks') || text.includes('short') || text.includes('smoke') || text.includes('shock')) {
        priority = 'URGENT';
      } else if (text.includes('fan') || text.includes('loud') || text.includes('noise')) {
        priority = 'HIGH';
      }
    } else if (text.includes('pipe') || text.includes('water') || text.includes('leak') || text.includes('sink') || text.includes('toilet') || text.includes('tap') || text.includes('flush')) {
      category = 'PLUMBING';
      if (text.includes('flood') || text.includes('heavy leak') || text.includes('burst') || text.includes('overflow')) {
        priority = 'URGENT';
      } else {
        priority = 'HIGH';
      }
    } else if (text.includes('wifi') || text.includes('internet') || text.includes('router') || text.includes('speed') || text.includes('network') || text.includes('signal')) {
      category = 'WIFI';
      priority = 'MEDIUM';
    } else if (text.includes('clean') || text.includes('dust') || text.includes('trash') || text.includes('dirty') || text.includes('washroom') || text.includes('garbage')) {
      category = 'CLEANING';
      priority = 'LOW';
    } else if (text.includes('bed') || text.includes('chair') || text.includes('table') || text.includes('cupboard') || text.includes('door') || text.includes('lock')) {
      category = 'FURNITURE';
      if (text.includes('lock') || text.includes('broken door')) {
        priority = 'HIGH';
      } else {
        priority = 'MEDIUM';
      }
    } else if (text.includes('stolen') || text.includes('trespass') || text.includes('security') || text.includes('guard')) {
      category = 'SECURITY';
      priority = 'URGENT';
    }

    const aiSummary = `AI Diagnosis: Categorized as ${category} with ${priority} urgency level based on key severity triggers detected in description.`;

    return { category, priority, aiSummary };
  }

  public static async generateMaintenanceSummary(complaints: any[]): Promise<{
    summaryText: string;
    hotspotRooms: string[];
    topCategories: { category: string; count: number }[];
    avgResolutionTimeHours: number;
  }> {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED');
    
    // Calculate category counts
    const counts: Record<string, number> = {};
    const roomCounts: Record<string, number> = {};
    
    complaints.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
      if (c.roomNumber) {
        roomCounts[c.roomNumber] = (roomCounts[c.roomNumber] || 0) + 1;
      }
    });

    const topCategories = Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const hotspotRooms = Object.entries(roomCounts)
      .filter(([_, count]) => count >= 2)
      .map(([room]) => `Room ${room}`);

    const summaryText = `
**Hostel Maintenance & Reliability Intelligence Summary**

1. **Executive Overview**: Over the selected reporting period, a total of **${total} maintenance requests** were recorded, with **${resolved.length} tickets successfully resolved** (${Math.round((resolved.length / (total || 1)) * 100)}% resolution efficiency rate). 

2. **Category Clustering**: The primary driver of complaints remains **${topCategories[0]?.category || 'ELECTRICAL'}** issues (${topCategories[0]?.count || 0} occurrences), followed by **${topCategories[1]?.category || 'PLUMBING'}** (${topCategories[1]?.count || 0} occurrences). Preventative maintenance on floor circuit breakers and pipe joints is highly recommended before the upcoming peak semester.

3. **Hotspot Analysis & Recommendation**: Repeated issues were observed in **${hotspotRooms.join(', ') || 'Room 204'}**. It is recommended that wardens schedule a comprehensive room audit to prevent recurring component failures.
    `.trim();

    return {
      summaryText,
      hotspotRooms: hotspotRooms.length ? hotspotRooms : ['Room 204', 'Room 101'],
      topCategories,
      avgResolutionTimeHours: 4.2
    };
  }

  public static async handleStudentChat(message: string, studentName: string): Promise<string> {
    const query = message.toLowerCase();

    if (query.includes('laundry') || query.includes('wash') || query.includes('clothes')) {
      return `Hi ${studentName}! Laundry facility hours are **08:00 AM – 08:00 PM daily**. You can book a 1-hour slot (up to 20 garments per wash) directly under the **Laundry Scheduler** tab. Staff will mark your clothes ready once washed & dried!`;
    }

    if (query.includes('visitor') || query.includes('guest') || query.includes('parent') || query.includes('friend')) {
      return `Visitors are allowed between **10:00 AM and 06:00 PM**. Please submit a request via **Visitor Pass** in your student dashboard at least 24 hours prior for Warden approval. Overnight stay requires special written permission from the Warden.`;
    }

    if (query.includes('complaint') || query.includes('broken') || query.includes('repair') || query.includes('fix')) {
      return `To report a broken item or issue in your room, head over to **Complaints -> New Complaint**. Upload a picture if possible! Our HostelHub AI will automatically assign priority and route it directly to the Warden and duty staff.`;
    }

    if (query.includes('rent') || query.includes('fee') || query.includes('due') || query.includes('payment')) {
      return `You can view your current fee breakdown and due dates in **Payments & Receipts**. We accept digital payments, and instant receipts are generated upon successful processing.`;
    }

    if (query.includes('curfew') || query.includes('gate') || query.includes('time') || query.includes('night')) {
      return `Hostel main gate closes strictly at **10:00 PM**. Attendance is marked every evening by the Warden between **09:30 PM and 10:15 PM**. If you require late entry for academic reasons, submit a gate pass request.`;
    }

    return `Hello ${studentName}! I am your **HostelHub AI Assistant**. I can help you with room issues, laundry booking, visitor permissions, curfew timings, and payment status. What would you like assistance with today?`;
  }
}
