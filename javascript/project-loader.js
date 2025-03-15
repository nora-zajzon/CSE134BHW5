class ProjectLoader {
    constructor() {
        this.STORAGE_KEY = 'portfolio_projects';
        this.JSONBIN_BIN_ID = '67cf5b7b8960c979a56f2b41';
        this.JSONBIN_API_KEY = '$2a$10$v4pQIf8LgGe5z4DanHqU6OE0A1PCK06LIKIBBgJy3iJFj.gh0pIJa';
        this.projectsContainer = document.querySelector('.projects-grid');
        this.setupEventListeners();
        this.initializeLocalStorage();
    }

    setupEventListeners() {
        document.getElementById('loadLocal').addEventListener('click', () => this.loadLocalData());
        document.getElementById('loadRemote').addEventListener('click', () => this.loadRemoteData());
    }

    initializeLocalStorage() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            fetch('../projects.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                })
                .catch(error => console.error('Error initializing localStorage:', error));
        }
    }

    clearProjects() {
        while (this.projectsContainer.firstChild) {
            this.projectsContainer.removeChild(this.projectsContainer.firstChild);
        }
    }

    renderProjects(projects) {
        this.clearProjects();
        projects.forEach(project => {
            const card = document.createElement('project-card');
            card.setAttribute('title', project.title);
            card.setAttribute('description', project.description);
            card.setAttribute('image', project.image);
            card.setAttribute('image-alt', project.imageAlt);
            card.setAttribute('link', project.link);
            card.setAttribute('date', project.date);
            card.setAttribute('tags', project.tags.join(','));
            if (project.showLink) {
                card.setAttribute('show-link', '');
            }
            this.projectsContainer.appendChild(card);
        });
    }

    async loadLocalData() {
        try {
            const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            if (data && data.projects) {
                this.renderProjects(data.projects);
            } else {
                throw new Error('No projects found in local storage');
            }
        } catch (error) {
            console.error('Error loading local data:', error);
            this.showError('Error loading local data');
        }
    }

    async loadRemoteData() {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${this.JSONBIN_BIN_ID}/latest`, {
                headers: {
                    'X-Master-Key': this.JSONBIN_API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data && data.record && data.record.projects) {
                this.renderProjects(data.record.projects);
            } else {
                throw new Error('Invalid data format from remote server');
            }
        } catch (error) {
            console.error('Error loading remote data:', error);
            this.showError('Error loading remote data');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.projectsContainer.appendChild(errorDiv);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProjectLoader();
}); 