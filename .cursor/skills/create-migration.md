# Skill: Create a Database Migration

## Principles
- Migrations are **immutable** once deployed. Never edit a merged migration.
- Every migration must be **reversible** — include both \`up\` and \`down\`.
- One logical change per migration file. Don't mix schema + data changes.
- Test migrations against a copy of production data before deploying.

## Safe Migration Patterns
| Change | Safe approach |
|--------|--------------|
| Add column | Add as nullable or with default value |
| Rename column | Add new → backfill → remove old (3 steps) |
| Remove column | Stop reading → deploy → remove column |
| Add index | Use \`CREATE INDEX CONCURRENTLY\` (Postgres) |
| Change type | Add new column → migrate data → swap → drop old |
| Add NOT NULL | Add column nullable → backfill → add constraint |

## Migration Template
\`\`\`
-- Migration: <YYYY-MM-DD>_<description>
-- Description: <what this migration does and WHY>

-- UP
ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL;
CREATE INDEX CONCURRENTLY idx_users_avatar ON users(avatar_url) WHERE avatar_url IS NOT NULL;

-- DOWN
DROP INDEX IF EXISTS idx_users_avatar;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
\`\`\`

## Zero-Downtime Checklist
- [ ] No table locks on large tables (use concurrent operations).
- [ ] New columns are nullable or have defaults (no breaking existing inserts).
- [ ] Application code handles both old and new schema during rollout.
- [ ] Data backfill runs as a separate step, not in the migration.
- [ ] Rollback script tested and verified.
- [ ] Migration tested against staging with production-like data volume.
- [ ] Foreign keys added without locking (where possible).
