# Faros AI Takehome project

## Prerequisites

Node 24

## Setting up the project

1. First you will want to clone the repository: `git clone https://github.com/heath-freenome/faros-ai.git`
2. Then setup the node environment using: `npm install`
3. If your Faros API server is not running locally on `http://localhost:4000`, modify `.env.local` to update the `VITE_FAROS_API_BASE_URL` environment variable to the correct url
4. Now build the application using: `npm run build`
5. Start the application: `npm run dev` and open your browser to http://localhost:5174/
6. Have fun!

> NOTE: Since I used Material UI components and icons, I picked the closest icons from their palette for the ones used in the Figma design, so icon-wise it is not pixel-perfect. Also the fonts may not be exact matches either.

## Enabling/disabling the feature flag

By default, the AI Employee Insights feature is disabled. To turn on the feature, open the Inspector feature on your browser and go to the console tab.
To enable the feature flag, execute the following line in the console:

```
localStorage.setItem('feature_flags', JSON.stringify({ 'enable-ai-employee-insights': true }))
```

To disable the feature flag execute the following line in the console:

```
localStorage.setItem('feature_flags', JSON.stringify({ 'enable-ai-employee-insights': false }))
```

> NOTE: You may have to enable support for pasting into the console if your browser does not have that feature turned on

After toggling the feature flag, refresh the browser so that the application picks it up.