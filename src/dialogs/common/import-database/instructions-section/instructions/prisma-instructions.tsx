import React from 'react';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DatabaseEdition } from '@/lib/domain/database-edition';
import { CodeSnippet } from '@/components/code-snippet/code-snippet';

export interface PrismaInstructionsProps {
    databaseType: DatabaseType;
    databaseEdition?: DatabaseEdition;
}

export const PrismaInstructions: React.FC<PrismaInstructionsProps> = () => {
    return (
        <>
            <div className="flex flex-col gap-1 text-sm text-primary">
                <div>Paste your Prisma schema definition here →</div>
            </div>

            <div className="flex h-64 flex-col gap-1 text-sm text-primary">
                <h4 className="text-xs font-medium">Example:</h4>
                <CodeSnippet
                    className="h-full"
                    allowCopy={false}
                    code={`model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}`}
                    language={'prisma'}
                />
            </div>
        </>
    );
};
