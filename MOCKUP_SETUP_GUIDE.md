# Mockup Rendering Feature - Setup & Usage Guide

## Overview

This feature integrates with **DynamicMockups.com API** to allow users to:
1. Upload or reference design images
2. Select mockup templates
3. Render photorealistic product mockups automatically
4. Download and manage rendered mockups

## Backend Setup

### 1. Environment Variables

Add these to your `.env` file in the backend directory:

```env
# DynamicMockups API Configuration
DYNAMIC_MOCKUPS_API_URL=https://app.dynamicmockups.com/api/v1/renders
DYNAMIC_MOCKUPS_API_KEY=your_api_key_here:your_secret_key_here
```

### 2. Get API Key

1. Go to https://app.dynamicmockups.com/register
2. Sign up for a free account (no credit card required)
3. Navigate to Dashboard → API
4. Copy your API Key (format: `key:secret`)
5. Paste it in your `.env` file

### 3. Database Migration

The schema has been updated with two new tables:

- **mockup_templates** - Stores available mockup templates
- **mockup_renders** - Stores render history and results

If using existing database, run:
```bash
npx prisma migrate deploy
# or if creating new database
npx prisma db push
```

### 4. Start Backend

```bash
npm run start:dev
```

## API Endpoints

### Get Mockup Templates
```http
GET /mockups/templates?active=true
```
**Response:**
```json
[
  {
    "template_id": 1,
    "name": "White T-Shirt Front",
    "mockup_uuid": "9ffb48c2-264f-...",
    "thumbnail_url": "...",
    "category": "apparel",
    "is_active": true
  }
]
```

### Get Single Template
```http
GET /mockups/templates/:id
```

### Render Mockup
```http
POST /mockups/render
Authorization: Bearer {token}
Content-Type: application/json

{
  "template_id": 1,
  "design_image_url": "https://your-cdn.com/design.png",
  "product_id": 5,
  "render_config": {
    "color": "#ff0000",
    "smart_object_id": "custom_uuid"
  }
}
```

**Response:**
```json
{
  "render_id": 101,
  "status": "completed",
  "rendered_image_url": "https://cdn.dynamicmockups.com/renders/abc123.png",
  "mockup_templates": {
    "template_id": 1,
    "name": "White T-Shirt Front"
  }
}
```

### Get Render History
```http
GET /mockups/renders?limit=20
Authorization: Bearer {token}
```

### Get Single Render
```http
GET /mockups/renders/:id
Authorization: Bearer {token}
```

### Delete Render
```http
DELETE /mockups/renders/:id
Authorization: Bearer {token}
```

## Frontend Integration

### 1. Import Service

```javascript
import mockupService from '../services/mockupService';
```

### 2. Fetch Templates

```javascript
const [templates, setTemplates] = useState([]);

useEffect(() => {
  mockupService.getTemplates().then(res => {
    setTemplates(res.data);
  });
}, []);
```

### 3. Render Mockup

```javascript
const handleRenderMockup = async () => {
  try {
    const response = await mockupService.renderMockup({
      template_id: selectedTemplate.template_id,
      design_image_url: designUrl,
      product_id: productId,
      render_config: {
        color: selectedColor
      }
    });
    
    console.log('Mockup rendered:', response.data.rendered_image_url);
  } catch (error) {
    console.error('Render failed:', error);
  }
};
```

### 4. Upload Design Image

Design images should be hosted on a CDN or your server. Then reference the URL in the render request.

```javascript
// Upload to your server first
const uploadResponse = await mockupService.uploadDesign(file);
const designImageUrl = uploadResponse.data.url;

// Then use in render
await mockupService.renderMockup({
  template_id: 1,
  design_image_url: designImageUrl
});
```

## Template Management

### Find Available Templates

1. Go to https://app.dynamicmockups.com/create
2. Browse the 100,000+ available templates
3. Select a template to see in the URL:
   - Mockup UUID: `https://app.dynamicmockups.com/create/workspace/mockup_uuid/[MOCKUP_UUID]`
   - Smart Object UUIDs are shown in the editor

### Sync Templates to Database

You can pre-populate templates in the database:

```bash
curl -X POST http://localhost:3000/mockups/sync-templates \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "White T-Shirt Front",
      "mockup_uuid": "9ffb48c2-264f-42b9-ab86-858c410422cc",
      "category": "apparel",
      "description": "Classic white t-shirt mockup"
    }
  ]'
```

## Smart Objects & Customization

Each template can have multiple smart objects (the areas where designs are placed).

### Example smart_objects JSON:
```json
{
  "smart_objects": [
    {
      "uuid": "cc864498-b8d1-495a-9968-45937edf42b3",
      "name": "Front Design"
    },
    {
      "uuid": "dd964498-b8d1-495a-9968-45937edf42c4",
      "name": "Back Design"
    }
  ]
}
```

### Render with specific smart object:
```javascript
mockupService.renderMockup({
  template_id: 1,
  design_image_url: 'https://...',
  render_config: {
    smart_object_id: 'cc864498-b8d1-495a-9968-45937edf42b3',
    color: '#ffd667'
  }
});
```

## Status Flow

Renders go through these statuses:
1. **pending** → Initial state
2. **processing** → API call in progress
3. **completed** → Successfully rendered (has rendered_image_url)
4. **failed** → API error (check error_message field)

## Example React Component

```jsx
import { useState } from 'react';
import mockupService from '../services/mockupService';

export default function MockupGenerator() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [designUrl, setDesignUrl] = useState('');
  const [rendering, setRendering] = useState(false);
  const [mockupUrl, setMockupUrl] = useState('');

  useEffect(() => {
    mockupService.getTemplates().then(res => setTemplates(res.data));
  }, []);

  const handleRender = async () => {
    if (!selectedTemplate || !designUrl) return;
    
    setRendering(true);
    try {
      const res = await mockupService.renderMockup({
        template_id: selectedTemplate.template_id,
        design_image_url: designUrl
      });
      
      setMockupUrl(res.data.rendered_image_url);
    } finally {
      setRendering(false);
    }
  };

  return (
    <div>
      <select onChange={(e) => {
        const selected = templates.find(t => t.template_id === parseInt(e.target.value));
        setSelectedTemplate(selected);
      }}>
        <option>Select Template</option>
        {templates.map(t => (
          <option key={t.template_id} value={t.template_id}>
            {t.name}
          </option>
        ))}
      </select>

      <input 
        type="text" 
        placeholder="Design Image URL"
        value={designUrl}
        onChange={(e) => setDesignUrl(e.target.value)}
      />

      <button onClick={handleRender} disabled={rendering}>
        {rendering ? 'Rendering...' : 'Generate Mockup'}
      </button>

      {mockupUrl && <img src={mockupUrl} alt="Mockup" />}
    </div>
  );
}
```

## Limitations & Notes

- Design images must be publicly accessible URLs
- Render time is typically < 1 second per mockup
- Free tier: Limited renders per month
- API rate limiting: Check DynamicMockups docs for rate limits
- Maximum image size: Check DynamicMockups API documentation

## Troubleshooting

### "Design image URL is not accessible"
- Ensure the URL is publicly accessible (test in browser)
- Check CORS headers if hosted on different domain
- Use CDN or public hosting for images

### "DynamicMockups API error"
- Verify API key in .env file
- Check API key format: `key:secret`
- Ensure account has sufficient API quota
- Review DynamicMockups status page

### "Mockup UUID not found"
- Verify mockup_uuid is correct from DynamicMockups dashboard
- Check template is still active in DynamicMockups

## Support

- DynamicMockups Docs: https://docs.dynamicmockups.com/
- API Playground: https://playground.dynamicmockups.com/
- Support: https://docs.dynamicmockups.com/getting-started/how-can-i-get-support
