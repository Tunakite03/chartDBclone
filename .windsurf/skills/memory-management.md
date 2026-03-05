# Skill: Project Memory & Context Management

## Core Memory Files
Maintain these files to provide persistent context across AI sessions:

### 1. Product Requirements (docs/product_requirements.md)
- **Purpose**: Define project goals, problems solved, core requirements
- **Update**: When scope changes or new features are planned
- **Contents**: User stories, success metrics, constraints, stakeholders

### 2. Architecture (docs/architecture.md)
- **Purpose**: System design, component relationships, dependencies
- **Update**: When adding major components or changing architecture
- **Contents**: Diagrams, data flow, integration points, tech stack

### 3. Technical Specs (docs/technical.md)
- **Purpose**: Development environment, key decisions, patterns
- **Update**: When adopting new patterns or making technical decisions
- **Contents**: Setup instructions, design patterns, coding standards, dependencies

### 4. Active Context (docs/active_context.md)
- **Purpose**: Current development focus and recent changes
- **Update**: At start/end of each work session
- **Contents**: Current focus, recent changes, next steps, blockers

### 5. Lessons Learned (docs/lessons_learned.md)
- **Purpose**: Capture patterns, mistakes, and solutions
- **Update**: When encountering and solving non-trivial issues
- **Contents**: Problem -> Solution -> Why it worked

### 6. Error Documentation (docs/error_log.md)
- **Purpose**: Reusable fixes for recurring issues
- **Update**: When fixing bugs that might recur
- **Contents**: Error signature -> Root cause -> Fix -> Prevention

## Memory Update Workflow
1. **Session Start**: Read `active_context.md` to resume work
2. **During Work**: Update `active_context.md` with decisions and changes
3. **Session End**: Summarize progress, update next steps
4. **Major Changes**: Update architecture/technical docs
5. **Lessons**: Document non-obvious solutions in `lessons_learned.md`

## Checklist
- [ ] All core memory files exist and are up-to-date
- [ ] Active context reflects current work accurately
- [ ] Architecture docs match actual implementation
- [ ] Technical decisions are documented with rationale
- [ ] Lessons learned capture reusable knowledge
- [ ] Error log prevents repeat mistakes
