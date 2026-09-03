# Empire State Roofing Co.

Standalone Next.js App Router website using React, TypeScript and Tailwind CSS. Source code, roofing photography, the original full logo, app icons and social preview image are included locally. No ChatGPT Sites runtime or deployment configuration is required.

## Local development

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build use `npm run build`, then `npm start`.

## Quality checks

```sh
npm run lint
npm run build
npm test
```

Browser tests use an installed Google Chrome through Playwright. They check links, assets, mobile/desktop overflow, form validation and the assistant launcher/dismissal with a deterministic test widget. They do not initiate a paid call or accept provider consent terms.

The reusable UI primitives retain valid ARIA roles instead of changing their public element APIs solely for a tag-preference lint rule. Other accessibility checks remain enabled.

## Integration and launch notes

- No environment variables or private API keys are currently required.
- Mike uses the public ElevenLabs agent ID configured in `app/page.tsx` and the provider's externally hosted widget script. This external service needs internet access and any required domain authorization in the agent dashboard.
- The inspection form currently validates locally and displays a demo success state; it **does not deliver or store leads**. Connect a server-side email/CRM endpoint before promoting the site, and only show success after confirmed delivery.
- The phone number and customer reviews are sample content. Confirm real business contact details and replace the clearly marked sample reviews before public promotion.
- The widget uses provider shadow-DOM selectors for presentation and custom launch behavior. Recheck real consent, microphone permission, calling, dismissal and expanded layout after provider updates. Automated tests do not certify a live voice session.
- Private `.env` files, dependencies, build output and browser test artifacts are excluded from Git.

## Future Vercel setup

Import this repository using the Next.js framework preset, the repository root as the root directory, and `npm run build`. No custom Vercel configuration is needed. Configure any future secrets in the deployment environment, not in source control. This repository setup does not itself publish or deploy the site.
