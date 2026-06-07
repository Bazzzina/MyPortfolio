# Misbah Bazina — Portfolio

A high-performance, dark cyber-themed portfolio website showcasing projects, certificates, and skills as an AI Engineering student.

🔗 [https://bazzzina.github.io/MyPortfolio/](https://bazzzina.github.io/MyPortfolio/)

---

## 📁 File Structure

The project is organized in a professional, modular web structure:

```text
my-portfolio/
├── css/
│   └── style.css            # Stylesheet with full dark-cyber design & layout
├── js/
│   ├── main.js              # Core interaction engine (projects, navigation, animations)
│   └── chatbot.js           # FAQ Robot chat companion logic
├── data/
│   ├── projects.js          # Editable project configuration array
│   └── certificates.js      # Editable certificates configuration array
├── assets/
│   ├── images/              # Store certificate images, profile photo, etc. here
│   └── pdf/                 # Store downloadable documents (like cv.pdf) here
├── index.html               # Main website entry page (semantic & accessible)
└── README.md                # Project documentation
```

---

## 🛠️ Adding / Editing Content

To update the content of your site, you **only** need to edit the data files in the `data/` folder. You do not need to modify any core logic files.

### 1. Adding a Project
Open [data/projects.js](data/projects.js) and append your project object to the `projects` array:
```javascript
{
    name: 'NumericalAnalysis Solver',
    description: 'Solves numerical problems using bisection and other methods...',
    githubUrl: 'https://github.com/Bazzzina/NumericalWeb',
    tags: ['HTML', 'CSS', 'JavaScript']
}
```

### 2. Adding a Certificate
Open [data/certificates.js](data/certificates.js) and append your certificate object to the `certificates` array. You can link a verified URL and an optional image path:
```javascript
{
    badge: 'Machine Learning',
    name: 'Machine Learning Specialization',
    issuer: 'Stanford University & DeepLearning.AI',
    credentialUrl: 'https://www.coursera.org',
    imageUrl: 'assets/images/ml-cert.png' // Leave empty '' if there is no image
}
```

### 3. Setting Up Your CV Download
1. Place your CV in PDF format inside the `assets/pdf/` folder (e.g. save it as `cv.pdf`).
2. Open `index.html`.
3. Locate the "Download CV" button in the hero section:
   ```html
   <a href="#" class="btn btn-primary" id="cv-download-btn" download>Download CV</a>
   ```
4. Change the `href="#"` to point to your PDF file:
   ```html
   <a href="assets/pdf/cv.pdf" class="btn btn-primary" id="cv-download-btn" download="Misbah_Bazina_CV.pdf">Download CV</a>
   ```
   *(Note: The site's script will automatically detect that you've updated the path, bypass the warning alert, and trigger a browser download!)*
