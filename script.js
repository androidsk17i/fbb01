function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        document.documentElement.setAttribute('data-theme', 
            this.checked ? 'dark' : 'light'
        );
    });

    // Initial scroll check
    handleScroll();
}

function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function getSelectedValues(selectId) {
    const select = document.getElementById(selectId);
    // For all categories, only take the first selected option
    const selectedOptions = Array.from(select.selectedOptions);
    return selectedOptions.length > 0 ? [selectedOptions[0].value] : [];
}

function generatePrompt() {
    const basePrompt = document.getElementById('basePrompt').value.trim();
    
    // Always randomize when generating prompt
    randomizeAll();
    
    // The rest of the function will be called by randomizeAll()
    // which includes generating the prompt and copying to clipboard
}

function randomizeAll() {
    // Handle multiple select elements
    const selects = document.querySelectorAll('select[multiple]');
    selects.forEach(select => {
        // Clear current selections
        Array.from(select.selectedOptions).forEach(option => option.selected = false);
        
        // Randomly select only ONE option
        const options = Array.from(select.options);
        const randomIndex = Math.floor(Math.random() * options.length);
        options[randomIndex].selected = true;
    });

    // Handle country select
    const countrySelect = document.getElementById('country');
    const countryOptions = Array.from(countrySelect.options).slice(1); // Skip the first "Select Origin" option
    const randomIndex = Math.floor(Math.random() * countryOptions.length);
    countrySelect.value = countryOptions[randomIndex].value;
    
    // Generate and copy prompt automatically
    generatePrompt();
    copyToClipboard(false);
}

function clearAll() {
    const selects = document.querySelectorAll('select[multiple]');
    selects.forEach(select => {
        Array.from(select.selectedOptions).forEach(option => option.selected = false);
    });
    // Clear country select
    document.getElementById('country').value = '';
    document.getElementById('basePrompt').value = '';
    document.getElementById('outputPrompt').textContent = '';
}

function copyToClipboard(showAlert = true) {
    const outputText = document.getElementById('outputPrompt').textContent;
    navigator.clipboard.writeText(outputText).then(() => {
        if (showAlert) {
            showCopyNotification();
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Add this new function to remove duplicates
function removeDuplicateWords(prompt) {
    // Split into words, keeping punctuation
    const words = prompt.split(/\s*,\s*/);
    const seen = new Set();
    const uniqueWords = words.filter(word => {
        // Convert to lowercase for comparison but keep original case
        const lowerWord = word.toLowerCase().trim();
        if (seen.has(lowerWord)) {
            return false;
        }
        seen.add(lowerWord);
        return true;
    });
    return uniqueWords.join(", ");
}

// Add these new functions
function handleScroll() {
    const backToTopButton = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Optional: Update the button text to reflect the new behavior
function updateUI() {
    const generateButton = document.querySelector('.input-section button');
    generateButton.textContent = '🎲 Generate Random Prompt';
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    updateUI();
    window.addEventListener('scroll', handleScroll);
}); 