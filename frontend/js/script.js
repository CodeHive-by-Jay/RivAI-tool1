// Get all sidebar items and the content area
const sidebarItems = document.querySelectorAll('.sidebar-item');
const contentArea = document.getElementById('content-area');

// Create a loading indicator element
const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loading-indicator';
loadingIndicator.style.cssText = `
    text-align: center;
    font-size: 1rem;
    color: #666;
    margin: 20px 0;
`;

//Debugger for browser console
function handleSidebarClick(event) {
    const targetItem = event.target.closest('.sidebar-item');
    console.log("Clicked item:", targetItem); // Debug log

    if (!targetItem) return;

    // Remove 'active' class from all items
    sidebarItems.forEach(item => item.classList.remove('active'));
    targetItem.classList.add('active');

    // Load content dynamically
    const contentKey = targetItem.getAttribute('data-content');
    console.log("Loading content:", contentKey); // Debug log
    loadContent(contentKey);

    // Save the current section to localStorage
    localStorage.setItem('lastVisitedSection', contentKey);
}



// Function to show loading state
function showLoading() {
    loadingIndicator.textContent = 'Loading...';
    contentArea.innerHTML = ''; // Clear current content
    contentArea.appendChild(loadingIndicator);
}

// Function to load content dynamically from external HTML files
async function loadContent(contentKey) {
    try {
        showLoading(); // Show the loading indicator

        const response = await fetch(`${contentKey}.html`, { cache: "no-cache" });
        if (response.ok) {
            const content = await response.text();
            contentArea.innerHTML = content; // Replace with fetched content
        } else {
            contentArea.textContent = "⚠️ Error loading content. Content not found.";
        }
    } catch (error) {
        contentArea.textContent = "❌ Failed to load content. Please check your connection.";
        console.error("Fetch error:", error);
    }
}

// Function to handle sidebar item clicks
function handleSidebarClick(event) {
    // Remove 'active' class from all items
    sidebarItems.forEach(item => item.classList.remove('active'));

    // Add 'active' class to the clicked item
    const targetItem = event.target.closest('.sidebar-item');
    if (targetItem) {
        targetItem.classList.add('active');
    }

    // Load content dynamically
    const contentKey = targetItem.getAttribute('data-content');
    loadContent(contentKey);

    // Save the current section to localStorage
    localStorage.setItem('lastVisitedSection', contentKey);
}

// Add click event listeners to sidebar items
sidebarItems.forEach(item => {
    item.addEventListener('click', handleSidebarClick);
});

// Function to initialize page on load
function initializePage() {
    const lastVisitedSection = localStorage.getItem('lastVisitedSection');

    if (lastVisitedSection) {
        // Load the last visited section
        const lastItem = document.querySelector(`.sidebar-item[data-content="${lastVisitedSection}"]`);
        if (lastItem) {
            lastItem.classList.add('active');
            loadContent(lastVisitedSection);
        }
    } else {
        // Load the default content (Home) for new visitors
        const defaultItem = document.querySelector('.sidebar-item[data-content="home"]');
        if (defaultItem) {
            defaultItem.classList.add('active');
            loadContent('home');
        }
    }
}

// Run initializePage on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initializePage);
