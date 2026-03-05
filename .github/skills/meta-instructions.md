# Skill: Writing Effective AI Instructions

## Purpose
This meta-skill defines how to write, structure, and validate instruction files for AI coding assistants.

## Instruction File Structure

### 1. Header
- Start with category and specific topic
- Include purpose statement (one sentence)
- Define when to apply (specific conditions)

### 2. Core Rules
- Use imperative mood: "Use X" not "You should use X"
- Be specific and actionable: "Cache in Awake" not "Cache early"
- Provide rationale: "Use X because Y"
- Include anti-patterns: "Never do X because Y"

### 3. Examples
- Show correct implementation
- Show incorrect implementation with explanation
- Use realistic, project-relevant examples

### 4. Checklist
- Actionable verification items
- Binary yes/no checks
- Ordered by importance

## Instruction Quality Criteria

### Clarity
- [ ] No ambiguous terms or vague guidance
- [ ] Technical terms defined or linked
- [ ] Examples match the instruction level (beginner/advanced)

### Completeness
- [ ] Covers happy path and edge cases
- [ ] Includes error handling guidance
- [ ] Addresses common mistakes

### Consistency
- [ ] Aligns with other instructions in the project
- [ ] Uses same terminology as codebase
- [ ] Follows project coding standards

### Actionability
- [ ] Every rule can be verified
- [ ] Checklist items are testable
- [ ] Examples can be copy-pasted and adapted

## Validation Process
Before finalizing an instruction file:

1. **Clarity Check**: Can a junior developer understand it?
2. **Completeness Check**: Does it cover all scenarios?
3. **Consistency Check**: Does it align with existing rules?
4. **Test**: Apply it to real code and verify it works
5. **Review**: Get feedback from team members

## Checklist
- [ ] Instruction follows the standard template
- [ ] All sections are complete and clear
- [ ] Examples are realistic and tested
- [ ] Checklist items are actionable
- [ ] No contradictions with other instructions
- [ ] Validated against real code
