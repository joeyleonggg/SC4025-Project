# Project documentation

This index groups the Ya Kun Together MVP documentation by purpose. Start with the [repository README](../README.md) for installation, demo accounts and commands. The references below describe the implemented prototype and its presentation assets.

## Architecture and data

| Reference | Contents |
| --- | --- |
| [Implemented architecture](architecture/README.md) | Application components, state transitions and service boundaries |
| [Architecture diagram](architecture/architecture.svg) | Visual overview of the browser application and reference data export |
| [Technology stack](../README.md#technology-stack) | Libraries, recorded versions and their roles |
| [Backend scope](../backend/README.md) | Explanation of the simulated backend and absence of a running API |
| [Mock-data reference](../backend/mock-data/README.md) | Generated account, menu, outlet and group snapshots |

The running app reads its fixtures from frontend/src/data.js. The exported backend JSON files are reference snapshots. Orders and demo updates are held in the current browser tab.

## Implemented features

The improvements folder contains detailed descriptions of the current features, calculations, exceptions and acceptance steps. The numbered files group related implementation work. Refer to the [current behaviour summary](../README.md#current-behaviour) for an overview.

| Reference | Contents |
| --- | --- |
| [Individual payments](improvements/01-payment-choice.md) | Personal charges, organiser sending and historical sponsored receipts |
| [Baseline points](improvements/02-group-points.md) | Eight points per dollar actually paid and rounding rules |
| [Menu catalogue](improvements/03-menu-catalogue.md) | Menu items, supplied pictures, prices and estimated supplements |
| [Pickup and advance collection](improvements/04-pickup-times.md) | ASAP, quick choices, later collection times and advance qualification |
| [Deadline extension](improvements/05-deadline-extension.md) | One 15-minute extension and its collection rules |
| [Advance-order points](improvements/06-advance-points.md) | Personal 10 percent bonus and final rounding |
| [Payment recovery](improvements/07-payment-recovery.md) | Saved cards, declined payments and retrying with another card |
| [Payment privacy](improvements/08-payment-privacy.md) | Organiser and participant visibility rules |
| [Invitations](improvements/09-invitations.md) | Named invitations, participant joining and saved-group reuse |
| [Automatic reminders](improvements/10-automatic-reminders.md) | Missing-order and payment reminders near the deadline |
| [Joining notice and consent](improvements/11-joining-consent.md) | Disclosure, optional marketing preference and withdrawal |
| [Retention and leaving](improvements/12-retention.md) | Seven-day inactivity expiry and scoped removal of membership and active data |

## Testing and verification

| Reference | Contents |
| --- | --- |
| [Manual test guide](testing-guide.md) | Demonstration sequence, expected values and error recovery checks |
| [Functional verification](acceptance/report-alignment.md) | Requirement coverage, implementation rules and prototype limitations |
| [Recorded automated results](acceptance/automated-checks.txt) | Retained output from the collection test suite |
| [Collection test source](../frontend/tests/collection-flow.test.mjs) | Executable controlled-state and clock checks |
| [Test commands](../README.md#test-and-demonstrate) | Commands for tests, the production build and mock-data consistency |

The automated results file is a recorded verification run. Use the test commands to check the current checkout.

## Screenshots and report assets

| Reference | Contents |
| --- | --- |
| [Full screenshot catalogue](report/4.5-wireframes.md) | 27 prototype captures with screen explanations and requirement references |
| [Screen overview](report/wireframe-overview.svg) | Overview graphic of selected prototype screens |
| [Original screenshot files](report/screens/) | Individual captures for the report and presentation |

The report's compact wireframes section presents selected screens. The full catalogue provides the additional interface detail. The architecture diagram above is also available for inclusion in the report.
