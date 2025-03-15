class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || 'Project Title';
        const description = this.getAttribute('description') || 'Project description goes here';
        const imageUrl = this.getAttribute('image') || 'placeholder.jpg';
        // Remove the leading slash and add the relative path
        const correctedImageUrl = imageUrl.startsWith('/') ? 
            `..${imageUrl}` : 
            `../images/${imageUrl}`;
        const imageAlt = this.getAttribute('image-alt') || 'Project image';
        const link = this.getAttribute('link') || '#';
        const date = this.getAttribute('date') || '';
        const tags = this.getAttribute('tags') ? this.getAttribute('tags').split(',') : [];
        const showLink = this.hasAttribute('show-link');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --card-bg: var(--background-color);
                    --card-text: var(--text-color);
                    --card-accent: var(--primary-color);
                    --card-padding: 1.5rem;
                    --card-radius: 12px;
                    --card-shadow: var(--box-shadow);
                    
                    display: block;
                    background: var(--card-bg);
                    border-radius: var(--card-radius);
                    box-shadow: var(--card-shadow);
                    transition: var(--transition-speed);
                    overflow: hidden;
                    height: 100%;
                }

                :host(:hover) {
                    transform: translateY(-4px);
                    box-shadow: var(--card-shadow), 0 6px 12px rgba(0, 0, 0, 0.1);
                }

                .card-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    border: 1px solid var(--border-color);
                    border-radius: var(--card-radius);
                    background: var(--card-bg);
                    overflow: hidden;
                }

                picture {
                    width: 100%;
                    display: block;
                    position: relative;
                    padding-top: 56.25%; /* 16:9 Aspect Ratio */
                }

                img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: var(--transition-speed);
                }

                img:hover {
                    transform: scale(1.05);
                }

                .content {
                    padding: var(--card-padding);
                    color: var(--card-text);
                    background: var(--card-bg);
                    flex: 1 0 auto;
                    display: flex;
                    flex-direction: column;
                }

                h2 {
                    margin: 0 0 1rem;
                    font-size: 1.5rem;
                    color: var(--card-text);
                    font-family: var(--font-primary);
                }

                .description {
                    margin: 0 0 1.5rem;
                    line-height: 1.6;
                    color: var(--card-text);
                    flex: 1 0 auto;
                }

                .metadata {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                    margin-top: auto;
                }

                .date {
                    font-size: 0.9rem;
                    color: var(--secondary-color);
                }

                .tags {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .tag {
                    padding: 0.25rem 0.75rem;
                    background: var(--primary-color);
                    color: var(--background-color);
                    border-radius: 999px;
                    font-size: 0.8rem;
                    transition: var(--transition-speed);
                }

                .tag:hover {
                    background: var(--secondary-color);
                }

                a {
                    color: var(--primary-color);
                    text-decoration: none;
                    font-weight: 500;
                    transition: var(--transition-speed);
                    margin-top: 1rem;
                }

                a:hover {
                    color: var(--secondary-color);
                    text-decoration: underline;
                }

                @media (max-width: 768px) {
                    :host {
                        --card-padding: 1rem;
                    }

                    h2 {
                        font-size: 1.25rem;
                    }
                }
            </style>
            <div class="card-container">
                <picture>
                    <img src="${correctedImageUrl}" alt="${imageAlt}" loading="lazy">
                </picture>
                <div class="content">
                    <h2>${title}</h2>
                    <p class="description">${description}</p>
                    <div class="metadata">
                        ${date ? `<span class="date">${date}</span>` : ''}
                        ${tags.length ? `
                            <div class="tags">
                                ${tags.map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                    ${showLink ? `<a href="${link}" target="_blank" rel="noopener noreferrer">Learn More →</a>` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('project-card', ProjectCard);