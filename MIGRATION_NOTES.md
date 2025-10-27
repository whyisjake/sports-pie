# Next.js Migration - Feature Branch

## Status: ✅ Ready for Testing

The Next.js migration is complete on the `feature/nextjs-migration` branch and working locally.

## What Changed

### Architecture
- **Before**: Vanilla HTML/CSS/JS static site
- **After**: Next.js 15 App Router with React components

### Key Features Added
1. **Dynamic OG Images**: `/api/og` endpoint generates custom preview images
2. **Server-Side Metadata**: Dynamic meta tags based on shared chart URLs
3. **React Components**: Full component-based architecture with hooks
4. **Edge Runtime**: Fast API responses using Vercel Edge Functions

### File Structure
```
src/app/
├── api/og/route.js              # OG image generation (Edge function)
├── components/
│   └── SportsPieChart.js        # Main React component
├── lib/
│   ├── data.js                  # Team data, colors, constants
│   └── utils.js                 # URL encoding/decoding, utilities
├── globals.css                  # All original styles
├── layout.js                    # Root layout with metadata
└── page.js                      # Home page

old_vanilla_version/             # Backup of original site
├── index.html
└── blog.html
```

## Local Testing Results

✅ **Build**: Production build successful
✅ **Dev Server**: Runs on http://localhost:3000
✅ **Homepage**: Renders correctly with all UI elements
✅ **OG API**: Returns PNG images
   - Default: http://localhost:3000/api/og
   - With data: http://localhost:3000/api/og?d=f:50:KC:100|b:30:LAL:100

## Testing the Feature Branch

### 1. Local Testing
```bash
# Switch to feature branch
git checkout feature/nextjs-migration

# Install dependencies
npm install

# Run dev server
npm run dev

# Open browser to http://localhost:3000
# Test creating charts, sharing, downloading
```

### 2. Test OG Images
```bash
# Test in browser:
# 1. Create a chart with some sports/teams
# 2. Click "Generate Chart"
# 3. Click "Share Link"
# 4. Copy the URL (will have ?d=... parameter)
# 5. Visit that URL in a new tab
# 6. View page source to see dynamic meta tags

# Test the API directly:
curl http://localhost:3000/api/og > test.png
open test.png

# With chart data:
curl "http://localhost:3000/api/og?d=f:50:KC:100|b:30:LAL:100" > test2.png
open test2.png
```

### 3. Test Social Sharing (After Deploy)
Once deployed to a preview URL:
1. Create a chart and get the share URL
2. Test on Twitter Card Validator: https://cards-dev.twitter.com/validator
3. Paste the URL into Discord/Slack to see preview
4. Should show custom image with your sports breakdown

## Known Differences

### What Works the Same
- All chart functionality
- Team autocomplete
- URL encoding/sharing
- Download chart as image
- Custom sports support
- Mobile responsive

### What's New
- Dynamic OG images based on chart data
- React-based UI (smoother interactions)
- Server-side rendering support
- Better performance on initial load

### What's Different
- Chart.js imported as React component
- State managed with React hooks instead of DOM manipulation
- Slightly different HTML structure (React JSX)

## Deployment Notes

### Vercel Deployment
When this branch is deployed to Vercel:
1. Vercel will detect Next.js automatically
2. The `/api/og` route will run on Edge Runtime
3. Static assets will be served from `/public`
4. Should deploy successfully (build passed locally)

### Potential Issues
- **404 errors**: Make sure Vercel is building as Next.js (not static)
- **OG images not working**: Check Edge function logs in Vercel dashboard
- **Missing styles**: Verify CSS is loading from /_next/static/

## Next Steps

1. **Test locally** ✅ (DONE)
2. **Create preview deployment** (deploy this branch to Vercel preview)
3. **Test on preview URL** (verify everything works in production)
4. **Test OG images** (share preview URLs on Twitter/Discord)
5. **Merge to main** (once verified working)

## Rollback Plan

If anything goes wrong:
```bash
# Switch back to main branch (vanilla JS site)
git checkout main

# Your production site will continue working
# Feature branch stays separate for fixing issues
```

## Questions to Answer

Before merging:
- [ ] Does the site load correctly on Vercel preview?
- [ ] Do charts generate and display properly?
- [ ] Does URL sharing work?
- [ ] Do OG images generate with actual chart data?
- [ ] Does Twitter/Discord show custom previews?
- [ ] Is mobile layout working?

---

Generated: 2025-10-27
Branch: feature/nextjs-migration
