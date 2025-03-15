document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'portfolio_projects';
    const JSONBIN_BIN_ID = '67cf5b7b8960c979a56f2b41';
    const JSONBIN_API_KEY = '$2a$10$v4pQIf8LgGe5z4DanHqU6OE0A1PCK06LIKIBBgJy3iJFj.gh0pIJa';
    
    const form = document.getElementById('projectForm');
    const projectsList = document.getElementById('projectsList');
    const localStorageBtn = document.getElementById('localStorageBtn');
    const cloudStorageBtn = document.getElementById('cloudStorageBtn');
    
    let currentStorage = 'local';
    let editingId = null;

    // Load initial data
    loadProjects();

    // Storage toggle handlers
    localStorageBtn.addEventListener('click', () => {
        currentStorage = 'local';
        localStorageBtn.classList.add('active');
        cloudStorageBtn.classList.remove('active');
        loadProjects();
    });

    cloudStorageBtn.addEventListener('click', () => {
        currentStorage = 'cloud';
        cloudStorageBtn.classList.add('active');
        localStorageBtn.classList.remove('active');
        loadProjects();
    });

    // Form submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const projectData = {
            title: form.title.value,
            description: form.description.value,
            image: form.image.value,
            imageAlt: form.imageAlt.value,
            link: form.link.value,
            date: form.date.value,
            tags: form.tags.value.split(',').map(tag => tag.trim()),
            showLink: form.showLink.checked
        };

        if (editingId) {
            await updateProject(editingId, projectData);
        } else {
            await createProject(projectData);
        }

        form.reset();
        editingId = null;
        document.getElementById('saveBtn').textContent = 'Save Project';
        loadProjects();
    });

    async function loadProjects() {
        let projects = [];
        
        if (currentStorage === 'local') {
            const stored = localStorage.getItem(STORAGE_KEY);
            projects = stored ? JSON.parse(stored).projects : [];
        } else {
            try {
                const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                    headers: { 
                        'X-Master-Key': JSONBIN_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch cloud data');
                }
                const data = await response.json();
                projects = data.record.projects || [];
            } catch (error) {
                console.error('Error loading cloud data:', error);
                alert('Failed to load cloud data. Please try again.');
                projects = [];
            }
        }

        displayProjects(projects);
    }

    function displayProjects(projects) {
        projectsList.innerHTML = projects.map((project, index) => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-actions">
                    <button class="edit-btn" onclick="editProject(${index})">Edit</button>
                    <button class="delete-btn" onclick="handleDelete(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async function createProject(projectData) {
        if (currentStorage === 'local') {
            const stored = localStorage.getItem(STORAGE_KEY);
            const data = stored ? JSON.parse(stored) : { projects: [] };
            data.projects.push(projectData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
            try {
                const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                    headers: { 
                        'X-Master-Key': JSONBIN_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch current data');
                
                const data = await response.json();
                data.record.projects.push(projectData);
                
                const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY
                    },
                    body: JSON.stringify(data.record)
                });
                
                if (!updateResponse.ok) throw new Error('Failed to update cloud data');
            } catch (error) {
                console.error('Error creating project:', error);
                alert('Failed to create project in cloud storage. Please try again.');
            }
        }
        loadProjects(); // Reload the projects list after creating
    }

    async function updateProject(index, projectData) {
        if (currentStorage === 'local') {
            const stored = localStorage.getItem(STORAGE_KEY);
            const data = JSON.parse(stored);
            data.projects[index] = projectData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
            try {
                const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`);
                const data = await response.json();
                data.record.projects[index] = projectData;
                
                await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY
                    },
                    body: JSON.stringify(data.record)
                });
            } catch (error) {
                console.error('Error updating project:', error);
            }
        }
    }

    async function deleteProject(index) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        if (currentStorage === 'local') {
            const stored = localStorage.getItem(STORAGE_KEY);
            const data = JSON.parse(stored);
            data.projects.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            loadProjects();
        } else {
            try {
                // First get the current data
                const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                    headers: { 
                        'X-Master-Key': JSONBIN_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!getResponse.ok) throw new Error('Failed to fetch current data');
                
                const data = await getResponse.json();
                
                // Remove the project at the specified index
                data.record.projects.splice(index, 1);
                
                // Update the bin with the new data
                const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY
                    },
                    body: JSON.stringify(data.record)
                });
                
                if (!updateResponse.ok) throw new Error('Failed to update data after deletion');
                
                // Reload the projects after successful deletion
                loadProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project from cloud storage. Please try again.');
            }
        }
    }

    window.handleDelete = function(index) {
        deleteProject(index);
    };

    window.editProject = function(index) {
        // Get projects based on current storage type
        let projects;
        if (currentStorage === 'local') {
            const stored = localStorage.getItem(STORAGE_KEY);
            projects = stored ? JSON.parse(stored).projects : [];
        } else {
            // For cloud storage, we need to fetch the latest data
            fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: { 
                    'X-Master-Key': JSONBIN_API_KEY,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                const project = data.record.projects[index];
                fillFormWithProject(project);
            })
            .catch(error => {
                console.error('Error fetching project for edit:', error);
                alert('Failed to load project for editing. Please try again.');
            });
            return; // Exit early as we're handling the form fill in the promise
        }

        // For local storage, fill the form directly
        if (projects && projects[index]) {
            fillFormWithProject(projects[index]);
        }
    };

    // Helper function to fill the form with project data
    function fillFormWithProject(project) {
        form.title.value = project.title;
        form.description.value = project.description;
        form.image.value = project.image || '';
        form.imageAlt.value = project.imageAlt || '';
        form.link.value = project.link || '';
        form.date.value = project.date || '';
        form.tags.value = project.tags ? project.tags.join(', ') : '';
        form.showLink.checked = project.showLink || false;

        editingId = index;
        document.getElementById('saveBtn').textContent = 'Update Project';
    }
}); 