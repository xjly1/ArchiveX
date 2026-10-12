.
├── .gitignore
├── ArchiveX_Tech.md
├── README.md
├── backend/
│   ├── auth/
│   │   └── server.js
│   ├── db/
│   │   ├── data.sql
│   │   ├── database.js
│   │   └── schema.sql
│   ├── manager/
│   │   └── server.js
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── reviewer/
│   │   └── server.js
│   ├── server.js
│   ├── uploader/
│   │   ├── cleanup.js
│   │   ├── old/
│   │   │   ├── crop.js
│   │   │   ├── ocr/
│   │   │   │   ├── ar/
│   │   │   │   │   ├── ocr.js
│   │   │   │   │   └── problems/
│   │   │   │   │       ├── rotate.js
│   │   │   │   │       └── small_text/
│   │   │   │   │           └── crop.js
│   │   │   │   └── en/
│   │   │   │       └── ocr.js
│   │   │   ├── ocr.js
│   │   │   ├── storage.js
│   │   │   └── upload.js
│   │   ├── process.js
│   │   ├── regular.js
│   │   ├── rotate.js
│   │   ├── save.js
│   │   ├── server.js
│   │   ├── verify.js
│   │   └── workflow.js
│   └── utils/
│       └── interfaceLanguage.js
├── config.json
├── frontend/
│   ├── auth/
│   │   ├── api/
│   │   │   ├── login.js
│   │   │   ├── logout.js
│   │   │   └── me.js
│   │   ├── pages/
│   │   │   └── login.html
│   │   ├── scripts/
│   │   │   └── login.js
│   │   └── styles/
│   │       └── login.css
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── public/
│   │   └── ArchiveX_Logo.png
│   ├── scripts/
│   │   └── app.js
│   ├── uploader/
│   │   ├── api/
│   │   │   ├── language.js
│   │   │   └── upload.js
│   │   ├── pages/
│   │   │   ├── dashboard.html
│   │   │   └── upload.html
│   │   ├── scripts/
│   │   │   ├── app.js
│   │   │   ├── filter.js
│   │   │   ├── input.js
│   │   │   ├── settings.js
│   │   │   └── upload.js
│   │   └── styles/
│   │       ├── dashboard.css
│   │       └── upload.css
│   └── vite.config.js
├── ocr/
│   ├── ar/
│   │   ├── ocr.py
│   │   └── run.ps1
│   └── en/
│       ├── ocr.py
│       └── run.ps1
├── package.json
├── pnpm-lock.yaml
├── processes/
│   ├── 47b682b1-87e5-43ec-8723-004de7db6b81/
│   │   └── original/
│   │       └── en1.jpg
│   └── bd1470f4-6856-48ea-ab81-841d85ddd4f9/
│       └── original/
│           └── en7.jpg
├── processing/
│   ├── crop.py
│   ├── merge.py
│   └── rotate.py
├── scripts/
│   └── check-cuda.js
└── test/
