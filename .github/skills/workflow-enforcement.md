# Skill: Structured Development Workflow

## Five-Phase Development Cycle
Apply this workflow to every task, from small features to entire projects.

### Phase 1: Requirements & Clarification
**Goal**: Make requirements crystal clear before any work begins.

**Actions**:
1. Read and understand the request thoroughly
2. Ask clarifying questions:
   - What is the expected behavior?
   - What are the edge cases?
   - What are the acceptance criteria?
   - Are there performance/security constraints?
3. Document requirements in `docs/active_context.md`
4. Identify potential bottlenecks or risks upfront

**Output**: Clear, unambiguous requirements document

### Phase 2: Exhaustive Search & Optimal Plan
**Goal**: Explore all solution approaches and choose the best one.

**Actions**:
1. Search codebase for existing patterns to follow
2. Consider multiple approaches:
   - Simplest solution
   - Most maintainable solution
   - Highest performance solution
3. Evaluate trade-offs for each approach
4. Select optimal approach with clear reasoning
5. Break down into incremental steps

**Output**: Detailed implementation plan with justification

### Phase 3: User Validation
**Goal**: Confirm plan before implementation.

**Actions**:
1. Present the plan to user/team
2. Clearly state assumptions and design decisions
3. Explain why this approach is optimal
4. Get explicit approval before proceeding

**Output**: Approved plan ready for implementation

### Phase 4: Incremental Implementation
**Goal**: Build iteratively with continuous validation.

**Actions**:
1. Implement one functionality at a time
2. Test exhaustively after each increment:
   - Happy path
   - Edge cases
   - Error conditions
3. Update `active_context.md` with progress
4. Commit working increments (not broken code)
5. Move to next functionality only when current is solid

**Output**: Fully tested, working implementation

### Phase 5: Optimization & Suggestions
**Goal**: Improve and future-proof the solution.

**Actions**:
1. Review for optimization opportunities
2. Check security implications
3. Suggest additional features or improvements
4. Update documentation and memory files
5. Document lessons learned

**Output**: Polished solution + recommendations

## Workflow Checklist
- [ ] Requirements clarified and documented
- [ ] Multiple approaches considered
- [ ] Optimal plan selected with reasoning
- [ ] Plan validated before implementation
- [ ] Implemented incrementally with tests
- [ ] Each increment works before moving on
- [ ] Optimizations identified and applied
- [ ] Documentation updated
- [ ] Lessons learned captured
