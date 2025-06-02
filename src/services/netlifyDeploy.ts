
import CryptoJS from 'crypto-js';

interface NetlifyFile {
  [path: string]: string; // SHA1 hash
}

interface DeployResponse {
  id: string;
  site_id: string;
  url: string;
  ssl_url: string;
  required: string[];
  required_functions: string[];
}

export class NetlifyDeployService {
  private apiToken: string;
  private baseUrl = 'https://api.netlify.com/api/v1';

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  private calculateSHA1(content: string): string {
    return CryptoJS.SHA1(content).toString();
  }

  private generatePortfolioFiles(userData: any, template: string): Record<string, string> {
    const files: Record<string, string> = {};

    // Generate HTML content based on template
    const htmlContent = this.generateHTMLContent(userData, template);
    const cssContent = this.generateCSSContent(template);
    const jsContent = this.generateJSContent();

    files['index.html'] = htmlContent;
    files['styles.css'] = cssContent;
    files['script.js'] = jsContent;

    return files;
  }

  private generateHTMLContent(userData: any, template: string): string {
    const name = userData.name || 'Portfolio';
    const role = userData.role || 'Professional';
    const location = userData.location || '';
    const email = userData.email || '';
    const phone = userData.phone || '';
    const skills = Array.isArray(userData.skills) ? userData.skills : [];
    const workExperience = userData.workExperience || [];
    const education = userData.education || [];
    const achievements = userData.achievements || [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${template}">
    <nav class="navbar">
        <div class="nav-container">
            <a href="#home" class="nav-brand">${name}</a>
            <div class="nav-menu">
                <a href="#about" class="nav-link">About</a>
                <a href="#experience" class="nav-link">Experience</a>
                <a href="#skills" class="nav-link">Skills</a>
                <a href="#contact" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <h1 class="hero-title">${name}</h1>
            <p class="hero-subtitle">${role}</p>
            <p class="hero-location">${location}</p>
            <div class="hero-buttons">
                <a href="#contact" class="btn btn-primary">Get In Touch</a>
                <a href="#experience" class="btn btn-outline">View Work</a>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <p>Passionate ${role.toLowerCase()} with expertise in creating innovative solutions. Based in ${location}, I bring a unique blend of technical skills and creative thinking to every project.</p>
            </div>
        </div>
    </section>

    <section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
                ${workExperience.map((exp: any, index: number) => `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3>${exp.position || 'Position'}</h3>
                        <h4>${exp.company || 'Company'}</h4>
                        <p class="timeline-date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</p>
                        <p>${exp.description || ''}</p>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
                ${skills.map((skill: string) => `
                <div class="skill-item">
                    <span>${skill}</span>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${achievements.length > 0 ? `
    <section id="achievements" class="achievements">
        <div class="container">
            <h2 class="section-title">Achievements</h2>
            <div class="achievements-grid">
                ${achievements.map((achievement: string) => `
                <div class="achievement-item">
                    <i class="fas fa-trophy"></i>
                    <p>${achievement}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-info">
                ${email ? `<a href="mailto:${email}" class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${email}</span>
                </a>` : ''}
                ${phone ? `<a href="tel:${phone}" class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${phone}</span>
                </a>` : ''}
                ${location ? `<div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${location}</span>
                </div>` : ''}
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${name}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateCSSContent(template: string): string {
    const baseStyles = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
    scroll-behavior: smooth;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
    transition: all 0.3s ease;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    text-decoration: none;
}

.nav-menu {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #007bff;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease;
}

.hero-subtitle {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
    animation: fadeInUp 1s ease 0.2s both;
}

.hero-location {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease 0.4s both;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    animation: fadeInUp 1s ease 0.6s both;
}

.btn {
    padding: 12px 32px;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary {
    background: white;
    color: #667eea;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.btn-outline {
    border: 2px solid white;
    color: white;
}

.btn-outline:hover {
    background: white;
    color: #667eea;
    transform: translateY(-2px);
}

/* Sections */
section {
    padding: 80px 0;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: #333;
}

/* About Section */
.about {
    background: #f8f9fa;
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    font-size: 1.2rem;
    line-height: 1.8;
    color: #666;
}

/* Experience Section */
.timeline {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #007bff;
    transform: translateX(-50%);
}

.timeline-item {
    position: relative;
    margin-bottom: 3rem;
}

.timeline-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    width: 45%;
    position: relative;
}

.timeline-item:nth-child(odd) .timeline-content {
    margin-left: auto;
}

.timeline-item:nth-child(even) .timeline-content {
    margin-right: auto;
}

.timeline-content h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
}

.timeline-content h4 {
    font-size: 1.1rem;
    font-weight: 500;
    color: #007bff;
    margin-bottom: 0.5rem;
}

.timeline-date {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
}

/* Skills Section */
.skills {
    background: #f8f9fa;
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    max-width: 800px;
    margin: 0 auto;
}

.skill-item {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.skill-item:hover {
    transform: translateY(-5px);
}

/* Achievements Section */
.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
}

.achievement-item {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s ease;
}

.achievement-item:hover {
    transform: translateY(-5px);
}

.achievement-item i {
    font-size: 2rem;
    color: #ffd700;
    margin-bottom: 1rem;
}

/* Contact Section */
.contact {
    background: #333;
    color: white;
}

.contact .section-title {
    color: white;
}

.contact-info {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
}

.contact-item:hover {
    color: #007bff;
}

.contact-item i {
    font-size: 1.2rem;
}

/* Footer */
.footer {
    background: #222;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-menu {
        display: none;
    }
    
    .timeline::before {
        left: 20px;
    }
    
    .timeline-content {
        width: calc(100% - 60px);
        margin-left: 60px !important;
    }
    
    .contact-info {
        flex-direction: column;
        align-items: center;
    }
}
`;

    const templateStyles = {
      developer: `
        .developer .hero {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }
        .developer .nav-link:hover,
        .developer .contact-item:hover {
            color: #2a5298;
        }
        .developer .btn-primary {
            color: #2a5298;
        }
        .developer .btn-outline:hover {
            color: #2a5298;
        }
      `,
      designer: `
        .designer .hero {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }
        .designer .nav-link:hover,
        .designer .contact-item:hover {
            color: #ee5a24;
        }
        .designer .btn-primary {
            color: #ee5a24;
        }
        .designer .btn-outline:hover {
            color: #ee5a24;
        }
      `,
      business: `
        .business .hero {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        .business .nav-link:hover,
        .business .contact-item:hover {
            color: #11998e;
        }
        .business .btn-primary {
            color: #11998e;
        }
        .business .btn-outline:hover {
            color: #11998e;
        }
      `
    };

    return baseStyles + (templateStyles[template as keyof typeof templateStyles] || '');
  }

  private generateJSContent(): string {
    return `
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
`;
  }

  async deploy(userData: any, template: string): Promise<string> {
    try {
      // Generate portfolio files
      const files = this.generatePortfolioFiles(userData, template);
      
      // Calculate SHA1 hashes
      const filesWithHashes: NetlifyFile = {};
      Object.entries(files).forEach(([path, content]) => {
        filesWithHashes[path] = this.calculateSHA1(content);
      });

      // Step 1: Create deployment
      const deployResponse = await fetch(`${this.baseUrl}/sites/${userData.name.toLowerCase().replace(/\s+/g, '-')}/deploys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: filesWithHashes,
        }),
      });

      if (!deployResponse.ok) {
        // If site doesn't exist, create it first
        const siteResponse = await fetch(`${this.baseUrl}/sites`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userData.name.toLowerCase().replace(/\s+/g, '-'),
          }),
        });

        if (!siteResponse.ok) {
          throw new Error('Failed to create site');
        }

        const site = await siteResponse.json();
        
        // Try deploy again with new site
        const retryDeployResponse = await fetch(`${this.baseUrl}/sites/${site.id}/deploys`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: filesWithHashes,
          }),
        });

        if (!retryDeployResponse.ok) {
          throw new Error('Failed to create deployment');
        }

        const deployData: DeployResponse = await retryDeployResponse.json();
        
        // Step 2: Upload required files
        await this.uploadFiles(deployData.id, deployData.required, files);
        
        return deployData.ssl_url || deployData.url;
      }

      const deployData: DeployResponse = await deployResponse.json();
      
      // Step 2: Upload required files
      await this.uploadFiles(deployData.id, deployData.required, files);
      
      return deployData.ssl_url || deployData.url;
    } catch (error) {
      console.error('Netlify deployment error:', error);
      throw new Error('Failed to deploy to Netlify');
    }
  }

  private async uploadFiles(deployId: string, requiredFiles: string[], files: Record<string, string>): Promise<void> {
    const uploadPromises = requiredFiles.map(async (filePath) => {
      const content = files[filePath];
      if (!content) return;

      const response = await fetch(`${this.baseUrl}/deploys/${deployId}/files/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: content,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${filePath}`);
      }
    });

    await Promise.all(uploadPromises);
  }
}
