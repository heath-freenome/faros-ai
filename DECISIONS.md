# Architecture Choices

- I chose to use Material (@mui/material) because I am familiar with it having used it for the last 6+ years
- I also used the vitest environment since it is typescript native with react support
  - In order to bootstrap the development environment, I used `npm create vite@latest faros-ai -- --template react-ts`
- For the feature flags, I debated using a mature 3rd party product with a free trial period. I took a quick look at [LaunchDarkly](https://launchdarkly.com/feature-flags-react/) and [Unleash](https://docs.getunleash.io/guides/implement-feature-flags-in-react) which both were fully featured and relied on external server support.
  - Ultimately I went with a fast, cheap solution that relied on local storage for the purposes of this project. I didn't want to deal with external server dependencies for this project
    - I asked Claude to build me a React Context based feature flag implementation using local storage
  - If I were building real software, I'd probably use the [OpenFeature](https://openfeature.dev/) API spec in my software since it would allow me to switch vendors or build at feature flag service myself if required by the company

# AI Development Environment and workflow

- I used Claude Code with a Pro license (I'm still waiting for my OSS Max license to be granted to me)
  - I installed the Claude Code plugin for Intellij IDEA, the IDE I did all of my development in
  - This was my first project I've built using Claude Code so I didn't configure it all that much beyond what is in `CLAUDE.md`
- I asked
- Overall Claude did a good job of using Material UI, analyzing the graphQL API to come up with the appropriate `useEmployees` and `useFilterOptions` hooks without my having to strongly dictate how it built things
  - I likely would have done something similar on my own, only I would have first built things as `useEffect`s and later realized they should be hooks, so Claude saved me a step
- For future projects, I would

# 


localStorage.setItem('feature_flags', JSON.stringify({ 'enable-ai-employee-insights': true }))  