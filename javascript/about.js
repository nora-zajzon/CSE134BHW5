document.addEventListener('DOMContentLoaded', function() {
    const showClassesBtn = document.getElementById('show-classes');
    const classesContent = document.getElementById('classes-content');

    const courses = [
        {
            year: "Second Year",
            classes: [
                "CSE 100 - Advanced Data Structures",
                "CSE 101 - Design and Analysis of Algorithms",
                "CSE 110 - Software Engineering",
                "CSE 134B - Web Client Languages"
            ]
        },
        {
            year: "First Year",
            classes: [
                "CSE 11 - Accelerated Intro to Programming",
                "CSE 12 - Basic Data Structures and Object-Oriented Design",
                "CSE 15L - Software Tools and Techniques Laboratory",
                "CSE 20 - Discrete Mathematics",
                "CSE 21 - Math/Algorithm and Systems Analysis",
                "CSE 30 - Computer Organization and Systems Programming"
            ]
        }
    ];

    let isExpanded = false;

    showClassesBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        showClassesBtn.setAttribute('aria-expanded', isExpanded);
        
        if (isExpanded) {
            // Create and display content
            let html = '<div class="courses-container">';
            courses.forEach(yearGroup => {
                html += `
                    <div class="year-group">
                        <h3>${yearGroup.year}</h3>
                        <ul>
                            ${yearGroup.classes.map(course => `
                                <li>${course}</li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            });
            html += '</div>';
            
            classesContent.innerHTML = html;
            classesContent.style.display = 'block';
            showClassesBtn.textContent = 'Hide Coursework';
        } else {
            // Hide content
            classesContent.style.display = 'none';
            showClassesBtn.textContent = 'View My Coursework';
        }
    });
});