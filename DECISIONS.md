# Architecture Choices

- I chose to use Material (@mui/material) because I am familiar with it having used it for the last 6+ years
- I also used the vitest environment since it is typescript native with react support
  - In order to bootstrap the development environment, I used `npm create vite@latest faros-ai -- --template react-ts`
- For the feature flags, I debated using a mature 3rd party product with a free trial period. I took a quick look at [LaunchDarkly](https://launchdarkly.com/feature-flags-react/) and [Unleash](https://docs.getunleash.io/guides/implement-feature-flags-in-react) which both were fully featured and relied on external server support.
  - Ultimately I went with a fast, cheap solution that relied on local storage for the purposes of this project. I didn't want to deal with external server dependencies for this project
    - I asked Claude to build me a React Context based feature flag implementation using local storage
  - If I were building real software, I'd probably use the [OpenFeature](https://openfeature.dev/) API spec in my software since it would allow me to switch vendors or build at feature flag service myself if required by the company
- OOTB Claude used local state for storing data in React components
  - I instructed it to use Contexts for the feature flags and consent capabilities
  - I also had it refactor the `EmployeesPage` to use the reducer pattern instead of a large number of individual state elements
- While I have used MobX to design serializable data stores in the past, Claude's choice to use a hook approach to making API calls seemed good enough for now
  - If I were building this with SSR, I likely would have instructed Claude to come up with a mechanism similar to what I have used in the past, or at least asked it what it would suggest,= 
- I made the assumption that the Employee Details Panel would not be fully functional since the requirements didn't mention updating/saving user details
- I made the assumption that the Table column sorting would not function since the requirements didn't mention that
  - Moreover, it wasn't clear to me how I would use the API to change the sorting

# AI Development Environment and workflow

- I used Claude Code with a Pro license (I'm still waiting for my OSS Max license to be granted to me)
  - I installed the Claude Code plugin for Intellij IDEA, the IDE I did all of my development in
  - This was my first project I've built using Claude Code so I didn't configure it all that much beyond what is in `CLAUDE.md`
- Since Claude could not read the Figma designs, I took screen shots of them and asked Claude to build pixel perfect designs using MUI
  - I did this incrementally, building upon the UI designs until the whole UI was complete
  - Since I was using MUI, Claude chose to use the MUI Icons as well. Unfortunately it picked some rather inelegant replacements for the ones in the design
  - I later either manually updated the Icons (especially when I ran out of tokens for periods of time) or instructed Claude to replace them
  - I also spent some time manually fixing up styling, colors, etc. to better improve the pixels perfectness of the UI (while I got real close, it is not perfect)
  - I later asked Claude to generalize the styling into the `theme.ts` as best it could as well as using styled components to minimize using the `sx` prop
    - It did a subpar job, still relying too much on the `sx` prop of many of the MUI components. If I had more time I likely would have added more styled components, using `sx` a minimally as possible
- Overall Claude did a good job of using Material UI, analyzing the graphQL API to come up with the appropriate `useEmployees` and `useFilterOptions` hooks without my having to strongly dictate how it built things
  - I likely would have done something similar on my own, only I would have first built things as `useEffect`s and later realized they should be hooks, so Claude saved me a step
- Initially, Claude barely generated any documentation in the components. I took a few iterations at instructing Claude to add documentation to components, functions, interfaces and props
  - Even then there were a few I just added manually while reviewing the code
- There were several places where Claude stacked a bunch of components into a single file
  - While I was out of tokens, I manually refactored most of these into separate files (I explicitly left the Breadcrumb component alone)
  - Later, when generating new components I explicitly told Claude to make all new components in separate files
- For future projects, I would update the `CLAUDE.md` file to prescribe a documentation and coding style I wanted it to use
  - I would figure out how to configure Claude to generate components into separate files, move types/constants used beyond just a single file in the `types.ts` and `constants.ts` files
  - I would also explore different agents, like [Corridor](https://corridor.dev/) to ensure that my code is more secure
  - I would also research other kinds of agents that exist out there to streamline my coding

# Data and API challenges

- Digging into the API code, I was able to determine that API failures, PII insertion and slowness was built in
  - Claude automatically added error handling to the hooks and provided a decent mechanism for reporting errors for APIs that failed in the UI
  - I was able to discern a pattern for when PII was injected into the insights (sentences ended in `..`) and built filtering to remove it in the hook before returning it to the UI
- Claude automatically used the MUI `Skeleton` feature to build placeholders for displaying data that is being loaded

# Privacy and security

- When using the AI Insights feature, I realized that the PII sentences being inserted into the text had an extra period on them, which I used to filter it out
  - If it wasn't for that "telltale" I'm actually not sure how I would have prevented it from being shown on the UI
  - Instead I would likely have figured out how to update the AI Agent to avoid rendering PII, using keyphrases to remove sentences containing things like (personal, email, phone, address, etc...)
- Beyond PII having the Telemetry API being a GET available to the outside world is a bad idea as it exposes a lot of potentially damaging info
  - Instead, I would likely make that API require an auth token in order to return any sort of data to a user
  - Same goes for POSTing to that API, so that bad actors can't crash the system
- Also, the consent POST API never checked whether the `userId` was a valid one in the system
  - Given that I just hard-coded a user id in my project as a constant for use in the consent API along with tracking telemetry

# What I'd do with more time

- Add 100% unit testing for all components, hooks and helper functions using Vitest and React Testing Library using mocks for APIs and contexts defined outside of the internals of the component
- Ensure authentication existed; Having a production system without authentication is never a good idea
  - Ensure all the APIs only worked with authenticated users
- Integrate with a server-based feature flag system
  - As I said earlier, I'd probably use the [OpenFeature](https://openfeature.dev/) API spec in my software since it would allow me to switch vendors or build at feature flag service myself if required by the company
- Since this project looks like a page out of a much larger application, I would utilize the application framework that exists rather than hard-coding the page structure
  - I would figure out how to integrate the button properly into the Top Nav bar and then add it to the Employee details UI
  - I would also have finished implementing the Employee Details UI implementation so that user information could be edited and saved
- I would also make sure that the telemetry information covered most of the user navigation actions (using the breadcrumb, adding new users, anything in the Top Nav, etc.)

# Testing strategy

- As stated earlier, I would ensure that everything in the code base was unit tested using the appropriate tools for the code stack
  - Those tests would be executed as part of the PR and main branch flow in CI/CD
- I would also build integration tests which covered all the UI behaviors in the app, based on the requirements
  - These tests would used mocks of as many of the possible outcome of the API calls as possible
- The APIs would have their own set of unit tests with mocking of any DB interactions or other external dependencies as needed
  - There would also be integration tests where the API would work against real DBs with a known sets of data as well as mocking of DBs for error conditions
- Finally there would be a nightly set of system tests that represented the entire working system of DBS, APIs and UIs which tested all the non-error flows
  - It would also test those error flows that could be generated via the normal entering of data in the system
  - It would also verify that the telemetry information was being output as expected from the tests
