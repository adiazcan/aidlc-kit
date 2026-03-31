# Testing Standards

## Overview

Rules for building testable systems and maintaining test quality across all
AI-DLC phases. Each rule is a blocking constraint: a phase or stage cannot
complete until all applicable checks pass or are marked N/A.

### Relationship to EGS

EGS defines test policy (§4.5: minimum coverage thresholds, acceptance criteria
tests, naming conventions; §9.5: load testing; §8.5: failure testing). This
extension covers testability in architecture, test pyramid strategy, contract
testing, test data management, and mutation testing. It does not redefine
coverage thresholds or testing cadence.

### Blocking Behavior

When a check fails:
1. List the finding in the phase/stage completion message under "Testing
   Findings" with the rule ID and failed check.
2. Do NOT present "Continue to Next Stage" until resolved.
3. Present only "Request Changes" with what needs to change.
4. Log the finding in `aidlc-docs/audit/audit-log.md` as `EXTENSION_FINDING`.

If a rule does not apply (e.g., no external dependencies for TEST-05), mark it **N/A**.

---

## Applicability Question

Asked during pre-flight when this extension is loaded:

```
Should testing standards be enforced for this project?

A) Yes — enforce as blocking constraints (recommended for production systems)
B) No — skip all testing rules (suitable for throwaway prototypes)
```

Record the answer in `aidlc-docs/aidlc-state.md` under Extension Configuration.

---

## Design-Time Rules

Enforced during Mob Elaboration and the design stages of Mob Construction.

### TEST-01: Testability by Design

Architecture supports testing at every layer without heroics.

- [ ] Domain logic has zero infrastructure dependencies (pure functions, injectable ports)
- [ ] External dependencies accessed through interfaces/abstractions (repository pattern, gateway pattern)
- [ ] Side effects isolated to adapter/infrastructure layer
- [ ] No hidden dependencies: all collaborators injected, not instantiated internally

### TEST-02: Test Pyramid Strategy

Test distribution is planned, not accidental.

- [ ] Unit tests: domain logic, validation, business rules (fast, no I/O)
- [ ] Integration tests: database queries, API handlers, message consumers (real dependencies or containers)
- [ ] End-to-end tests: critical user journeys only (minimal, slow, expensive)
- [ ] Ratio documented: unit > integration > e2e
- [ ] *Defers to EGS §4.5 for minimum coverage thresholds per layer*

### TEST-03: Acceptance Criteria Traceability

Every user story's acceptance criteria maps to at least one test.

- [ ] Each acceptance criterion in the elaboration plan has a corresponding test case ID
- [ ] Test cases reference the story ID they validate (e.g., `// Validates US-03 AC-2`)
- [ ] Missing test coverage for an acceptance criterion is a blocking finding
- [ ] *Defers to EGS §4.5 for the mandate that all acceptance criteria have tests*

---

## Build-Time Rules

Enforced during Mob Construction implementation stages and Code Elevation.

### TEST-04: Test Independence

Tests are reliable and order-independent.

- [ ] Each test sets up its own state (no reliance on test execution order)
- [ ] Tests clean up after themselves (no shared mutable state between tests)
- [ ] No sleep/delay-based synchronization; use polling or event-based waits
- [ ] Flaky tests are quarantined and tracked, not ignored

### TEST-05: Contract Testing

Service boundaries are validated by contracts, not just integration tests.

- [ ] API contracts (OpenAPI, Protobuf) validated in CI: producer generates, consumer verifies
- [ ] Event contracts validated: producer schema matches consumer expectations
- [ ] Contract tests run independently of full environment (no staging dependency)
- [ ] Breaking contract changes detected before merge

### TEST-06: Test Data Management

Tests use controlled, reproducible data.

- [ ] Test fixtures/factories generate valid domain objects (no raw JSON literals scattered across tests)
- [ ] Sensitive data never used in tests; synthetic data only
- [ ] Database tests use isolated schemas, containers, or in-memory stores
- [ ] Seed data versioned alongside migrations

### TEST-07: Error Path Testing

Failure scenarios are tested, not just happy paths.

- [ ] Each error response code in the API has at least one test
- [ ] Timeout and retry behavior tested (simulated slow/failing dependencies)
- [ ] Validation rejection tested for each input constraint
- [ ] Authorization denial tested for each protected resource

---

## Operational Readiness Rules

Flagged during Mob Elaboration, verified in implementation.

### TEST-08: CI Integration

Tests run automatically and gate deployments.

- [ ] All tests run on every pull request / merge request
- [ ] Test failures block merge to main branch
- [ ] Test execution time tracked; slow tests flagged for optimization
- [ ] Coverage report generated and visible in CI output
- [ ] *Defers to EGS §5.4 for CI/CD pipeline requirements*

### TEST-09: Regression Safety

Changes don't break existing behavior.

- [ ] Bug fixes include a regression test that reproduces the bug before the fix
- [ ] Refactoring changes maintain or improve test coverage (never decrease)
- [ ] Brownfield: existing behavior captured in characterization tests before modification
- [ ] *Defers to EGS §8.5 for failure testing cadence*

---

## Enforcement by Ritual

| Ritual | Primary Rules | Secondary Rules |
|--------|--------------|-----------------|
| Mob Elaboration | TEST-01 through TEST-03 | TEST-08, TEST-09 (flag as requirements) |
| Mob Construction: Design stages | TEST-01 through TEST-03 | TEST-04 through TEST-07 (verify design supports them) |
| Mob Construction: Implementation | TEST-04 through TEST-07 | TEST-08, TEST-09 (verify CI readiness) |
| Code Elevation | All rules | Assess existing test suite against full checklist |

At each phase/stage completion, include a "Testing Compliance" section:
- List each applicable rule as ✅ compliant, ❌ non-compliant, or N/A
- Any ❌ is a blocking finding
