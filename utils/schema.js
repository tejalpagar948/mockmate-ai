import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const mockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),

  jsonMockResp: text('jsonMockResp').notNull(),

  jobPosition: varchar('jobPosition', {
    length: 255,
  }).notNull(),

  jobDesc: text('jobDesc').notNull(),

  jobExperience: varchar('jobExperience', {
    length: 100,
  }).notNull(),

  createdBy: varchar('createdBy', {
    length: 255,
  }).notNull(),

  createdAt: timestamp('createdAt').defaultNow().notNull(),

  mockId: varchar('mockId', {
    length: 255,
  })
    .notNull()
    .unique(),
});
