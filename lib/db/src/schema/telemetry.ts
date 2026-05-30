import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const telemetryTable = pgTable("telemetry", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: text("device_id").notNull(),
  eventType: text("event_type").notNull(), // e.g., 'search', 'ai_tutor_query'
  eventData: text("event_data"), // e.g., the search query or topic
  location: text("location"), // e.g., 'Dhaka, Bangladesh'
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
